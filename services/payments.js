const { Op } = require("sequelize");
const { isEmailValid, errorMsg } = require("../utils/util");
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
const { recordStatusHistory } = require("./shipments");
const { enqueuePaymentUpdateMail } = require("../queues/email");
const {
  paymentStatusMail,
} = require("../utils/emailTemplates/paymentStatusMail");

const createReference = () => {
  // Generate a unique reference for the payment
  const reference = Date.now();
  const rand = Math.floor(Math.random() * 1000000);
  return `TXN-LOGIFLOW-${reference}-${rand}`;
};

const initPayment = async (data) => {
  const { email, amount, shipmentId } = data;
  try {
    if (!email || !amount) errorMsg("Email and amount are required");

    if (!isEmailValid(email)) errorMsg("Invalid email");

    const user = await userRepo.findByEmail(email);
    if (!user) errorMsg("User not found", 404);

    const shipment = await shipmentRepo.findById(shipmentId);
    if (!shipment) errorMsg("Shipment not found", 404);

    const reference = createReference();
    const parsedAmount = parseInt(amount) * 100;
    const secretKey = secret_key;
    const currency = "NGN";
    const metadata = {
      customerId: user.id,
      amount,
      shipmentId: shipment.id,
      reference,
      email,
    };

    if (!secretKey) errorMsg("Secret key not found", 404);

    // Paystack Payment Initialization API Call
    const { data } = await axios.post(
      `${payment_baseUrl}/transaction/initialize`,
      {
        email,
        amount: parsedAmount,
        currency,
        reference,
        metadata,
        // callback_url,
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
        paymentMethod: "card",
      });
    }

    return {
      status: data.status,
      message: data.message,
      url: data.data.authorization_url,
      access_code: data.data.access_code,
    };
  } catch (error) {
    throw error;
  }
};

const handlePaymentSuccess = async (data) => {
  return db.sequelize.transaction(async (transaction) => {
    const { metadata, paid_at, channel, currency, amount, reference, status } =
      data;
    const { shipmentId, email } = metadata;
    const payment = await paymentRepo.findOne({
      where: { reference },
      transaction,
      lock: transaction.LOCK.UPDATE,
    });
    if (!payment) errorMsg("Payment not found", 404);

    if (payment.status === "completed") errorMsg("Payment already processed");

    const shipment = await shipmentRepo.findById(shipmentId, {
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (!shipment) errorMsg("Shipment not found", 404);

    await payment.update(
      {
        status: "completed",
        paidAt: new Date(paid_at),
        paymentMethod: channel,
        currency,
      },
      { transaction },
    );
    await shipment.update({ status: "Confirmed" }, { transaction });
    await recordStatusHistory(shipment.id, "Confirmed", {
      transaction,
      updatedBy: "system",
    });

    // TODO Enqueue email to be sent to the user
    const mailOption = {
      to: email,
      subject: "Payment Status Update",
      html: paymentStatusMail({
        amount,
        date: paid_at,
        reference,
        status: status === "success" ? true : false,
        shipmentId,
        currency,
      }),
    };
    enqueuePaymentUpdateMail(mailOption);

    return {
      status: "success",
      message: "Payment processed successfully",
    };
  });
};

const handlePaymentFailure = async (data) => {
  return db.sequelize.transaction(async (transaction) => {
    const { metadata, paid_at, channel, currency, amount, reference, status } =
      data;
    const { shipmentId, email } = metadata;
    const payment = await paymentRepo.findOne({
      where: { reference },
      transaction,
      lock: transaction.LOCK.UPDATE,
    });
    if (!payment) errorMsg("Payment not found", 404);

    if (payment.status === "failed") errorMsg("Payment already processed");

    const shipment = await shipmentRepo.findById(shipmentId, {
      transaction,
      lock: transaction.LOCK.UPDATE,
    });
    if (!shipment) errorMsg("Shipment not found", 404);

    await payment.update(
      {
        status: "failed",
        paidAt: paid_at,
        paymentMethod: channel,
        currency,
      },
      { transaction },
    );

    // TODO Enqueue email to be sent to the user
    const mailOption = {
      to: email,
      subject: "Payment Status Update",
      html: paymentStatusMail({
        amount,
        date: paid_at,
        reference,
        status: status === "success" ? true : false,
        shipmentId,
        currency,
      }),
    };
    enqueuePaymentUpdateMail(mailOption);

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

const userPaymentsHistory = async (query, userId) => {
  const page = query.page ? parseInt(query.page) : 1;
  const limit = query.limit ? parseInt(query.limit) : 10;
  const offset = (page - 1) * limit;
  const keyword = query.keyword ? query.keyword : "";
  const status = query.status ? query.status : "";
  const where = {};

  if (keyword) {
    where.reference = {
      [Op.iLike]: `%${keyword}%`,
    };
  }

  if (status) {
    where.status = status;
  }

  const { rows, count } = await paymentRepo.findAndCountAll({
    where: {
      ...where,
      userId,
    },
    attributes: [
      "id",
      "reference",
      "amount",
      "status",
      "createdAt",
      "paymentMethod",
    ],
    include: {
      model: db.shipments,
      as: "shipment",
      attributes: ["trackingNumber"],
      required: true,
    },
    distinct: true,
    limit,
    offset,
    order: [["createdAt", "DESC"]],
  });

  return {
    totalItems: count,
    totalPages: Math.ceil(count / limit),
    data: rows.map((payment) => ({
      id: payment.id,
      reference: payment.reference || "",
      amount: payment.amount,
      status: payment.status,
      timestamp: payment.createdAt,
      paymentMethod: payment.paymentMethod,
      shipment: payment.shipment?.trackingNumber || "",
    })),
  };
};

const getById = async (id, userId) => {
  if (!id) errorMsg("Payment id is required");

  const payment = await paymentRepo.findOne({
    where: { id, userId },
    attributes: [
      "id",
      "reference",
      "amount",
      "status",
      "createdAt",
      "paymentMethod",
    ],
    include: {
      model: db.shipments,
      as: "shipment",
      attributes: ["trackingNumber"],
    },
  });

  if (!payment) errorMsg("Payment not found", 404);

  return {
    id: payment.id,
    reference: payment.reference || "",
    amount: payment.amount,
    status: payment.status,
    timestamp: payment.createdAt,
    paymentMethod: payment.paymentMethod,
    shipment: payment.shipment?.trackingNumber || "",
  };
};

module.exports = {
  initPayment,
  handleWebhook,
  userPaymentsHistory,
  getById,
};
