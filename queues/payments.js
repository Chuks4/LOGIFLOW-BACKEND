const { connection } = require("./connection");
const { Queue } = require("bullmq");

const paymentQueue = new Queue("payments", { connection });

const enqueuePaymentWebhook = async (paymentData) => {
  return await paymentQueue.add("payment-webhook", paymentData, {
    attempts: 1,
  });
};

module.exports = {
  enqueuePaymentWebhook,
};
