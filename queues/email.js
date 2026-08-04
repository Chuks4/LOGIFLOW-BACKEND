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

module.exports = { enqueWelcomeEmail };
