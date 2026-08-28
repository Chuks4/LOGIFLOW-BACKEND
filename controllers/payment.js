const paymentService = require("../services/payments");
const {
  verifySignature,
  createWebhookEvent,
} = require("../services/webhookEvents");
const { enqueuePaymentWebhook } = require("../queues/payments");

const initPayment = async (req, res) => {
  try {
    const { amount, shipmentId, email } = req.body;
    const data = await paymentService.initPayment({
      amount,
      shipmentId,
      email,
    });
    return res.status(200).json({ status: true, data });
  } catch (error) {
    if (error.status) {
      return res
        .status(error.status)
        .json({ status: false, message: error.message });
    }

    return res
      .status(500)
      .json({ status: false, message: "Internal server error" });
  }
};

const processPaymentWebhooks = async (req, res) => {
  try {
    const body = req.body;
    const reference = body.data.reference;
    const eventType = body.event;
    const signature = req.headers["x-paystack-signature"];
    const { status, rawBody } = verifySignature(body, signature);

    if (!status) {
      return res.send(200);
    }

    const { created, parsedBody } = await createWebhookEvent({
      body: rawBody,
      signature,
      reference,
      eventType,
    });

    if (!created) {
      return res.send(200);
    }

    // Enqueue payment webhook
    await enqueuePaymentWebhook(parsedBody);
    return res.send(200);
  } catch (error) {
    if (error.status) {
      return res
        .status(error.status)
        .json({ status: false, message: error.message });
    }

    return res
      .status(500)
      .json({ status: false, message: "Internal server error" });
  }
};

module.exports = {
  initPayment,
  processPaymentWebhooks,
};
