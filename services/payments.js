const { isEmailValid } = require("../utils/util");
const axios = require("axios");
const paymentRepo = require("../repositories/payments");
const {
  payment_baseUrl,
  secret_key,
  callback_url,
} = require("../config/payment.config");
const userRepo = require("../repositories/user");
const shipmentRepo = require("../repositories/shipments");
const db = require("../models");

const createReference = () => {
  // Generate a unique reference for the payment
  const reference = Date().now();
  const rand = Math.floor(Math.random() * 1000000);
  return `TXN-LOGIFLOW-${reference}-${rand}`;
};

const initPayment = async (data) => {
  const { email, amount, shipmentId } = data;
  try {
    if (!email || !amount) {
      const error = new Error("Email and amount are required");
      error.status = 400;
      throw error;
    }

    if (!isEmailValid(email)) {
      const error = new Error("Invalid email");
      error.status = 400;
      throw error;
    }

    const user = await userRepo.findByEmail(email);
    if (!user) {
      const error = new Error("User not found");
      error.status = 404;
      throw error;
    }

    const shipment = await shipmentRepo.findById(shipmentId);
    if (!shipment) {
      const error = new Error("Shipment not found");
      error.status = 404;
      throw error;
    }

    const reference = createReference();
    const parsedAmount = parseInt(amount) * 100;
    const secretKey = secret_key;
    const currency = "NGN";
    const metadata = {
      customerId: user.id,
      amount: parsedAmount,
      shipmentId: shipment.id,
      reference,
      email,
    };

    if (!secretKey) {
      const error = new Error("Secret key not found");
      error.status = 404;
      throw error;
    }

    // Paystack Payment Initialization API Call
    const { data } = await axios.post(
      `${payment_baseUrl}/
/transaction/initialize`,
      {
        email,
        amount: parsedAmount,
        currency,
        reference,
        metadata,
        callback_url,
      },
      {
        headers: {
          Authorization: `Bearer ${secretKey}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (data.status) {
      await paymentRepo.create({
        reference,
        amount,
        currency,
        metadata: JSON.stringify(metadata),
        shipmentId,
        userId: user.id,
      });
    }

    return {
      status: data.status,
      message: data.message,
      url: data.data.authorization_url,
    };
  } catch (error) {
    throw error;
  }
};

const handlePaymentSuccess = async (data) => {
  return db.sequelize.transaction(async (transaction) => {
    const { metadata, paid_at, channel, currency } = data;
    const { reference, shipmentId, email } = metadata;
    const payment = await paymentRepo.findOne({
      where: { reference },
      transaction,
      lock: transaction.LOCK.UPDATE,
    });
    if (!payment) {
      const error = new Error("Payment not found");
      error.status = 404;
      throw error;
    }

    if (payment.status === "completed") {
      const error = new Error("Payment already processed");
      error.status = 400;
      throw error;
    }

    const shipment = await shipmentRepo.findById(shipmentId, {
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (!shipment) {
      const error = new Error("Shipment not found");
      error.status = 404;
      throw error;
    }

    if (shipment.status === "Confirmed") {
      const error = new Error("Shipment already confirmed");
      error.status = 400;
      throw error;
    }

    await payment.update(
      {
        status: "completed",
        paidAt: paid_at,
        paymentMethod: channel,
        currency,
      },
      { transaction },
    );
    await shipment.update({ status: "Confirmed" }, { transaction });

    // TODO Enqueue email to be sent to the user

    return {
      status: "success",
      message: "Payment processed successfully",
    };
  });
};

const handlePaymentFailure = async (data) => {
  return db.sequelize.transaction(async (transaction) => {
    const { metadata } = data;
    const { reference, shipmentId } = metadata;
    const payment = await paymentRepo.findOne({
      where: { reference },
      transaction,
      lock: transaction.LOCK.UPDATE,
    });
    if (!payment) {
      const error = new Error("Payment not found");
      error.status = 404;
      throw error;
    }

    if (payment.status === "failed") {
      const error = new Error("Payment already processed");
      error.status = 400;
      throw error;
    }

    const shipment = await shipmentRepo.findById(shipmentId, {
      transaction,
      lock: transaction.LOCK.UPDATE,
    });
    if (!shipment) {
      const error = new Error("Shipment not found");
      error.status = 404;
      throw error;
    }

    await payment.update({ status: "failed" }, { transaction });

    // TODO Enqueue email to be sent to the user

    return {
      status: "failed",
      message: "Could not process payment",
    };
  });
};

const handleWebhook = async (data) => {
  try {
    switch (data.event) {
      case "charge.success":
        return handlePaymentSuccess(data.data);
      case "charge.failed":
        return handlePaymentFailure(data.data);

      default:
        return {
          status: false,
          message: "Invalid event type",
        };
    }
  } catch (error) {
    throw error;
  }
};

module.exports = {
  initPayment,
  handleWebhook,
};
