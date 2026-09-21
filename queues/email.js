const { connection } = require("./connection");
const { Queue } = require("bullmq");

const emailQueue = new Queue("email", { connection });
const enqueWelcomeEmail = async (emailData) => {
  await emailQueue.add("welcome-email", emailData, {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 5000,
    },
  });
};

const enquePasswordResetEmail = async (emailData) => {
  await emailQueue.add("password-reset-email", emailData, {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 5000,
    },
  });
};

const enqueEmailVerificationEmail = async (emailData) => {
  await emailQueue.add("verification-email", emailData, {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 5000,
    },
  });
};

const enqueuePaymentUpdateMail = async (emailData) => {
  await emailQueue.add("payment-update", emailData, {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 5000,
    },
  });
};

const enqueueShipmentUpdateEmail = async (emailData) => {
  await emailQueue.add("shipment-update-email", emailData, {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 5000,
    },
  });
};

module.exports = {
  enqueWelcomeEmail,
  enquePasswordResetEmail,
  enqueEmailVerificationEmail,
  enqueuePaymentUpdateMail,
  enqueueShipmentUpdateEmail,
};
