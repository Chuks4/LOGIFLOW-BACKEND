const { Worker } = require("bullmq");
const emailService = require("../services/email");
const { connection } = require("../queues/connection");

const emailWorker = new Worker(
  "email",
  async (job) => {
    switch (job.name) {
      case "welcome-email":
        await emailService.sendEmail(job.data);
        break;
    }
  },
  { connection, concurrency: 5 },
);
module.exports = emailWorker;
