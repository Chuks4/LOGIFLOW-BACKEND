const { Worker } = require("bullmq");
const paymentService = require("../services/payments");
const { connection } = require("../queues/connection");
const { logger } = require("../logger/logger");

const paymentWorker = new Worker(
  "payments",
  async (job) => {
    switch (job.name) {
      case "payment-webhook":
        await paymentService.handleWebhook(job.data);
        logger.info("Webhook processed by worker", { recipient: job.data.to });
        break;
    }
  },
  {
    connection,
    concurrency: 5,
    removeOnComplete: {
      age: 2592000, // Remove completed jobs after 30 days
      count: 100, // Keep up to 100 completed jobs
      limit: 50, // Limit the number of jobs to remove at once
    },
    removeOnFail: {
      age: 2592000, // Remove failed jobs after 30 days
      count: 200, // Keep up to 100 failed jobs
      limit: 50, // Limit the number of jobs to remove at once
    },
  },
);

// Fired when a job completes successfully
paymentWorker.on("completed", (job) => {
  logger.info("Payment Webhook job completed", {
    jobId: job.id,
    jobName: job.name,
  });
});

// Fired when a job fails
paymentWorker.on("failed", (job, error) => {
  logger.error("Payment Webhook job failed", {
    jobId: job?.id,
    jobName: job?.name,
    recipient: job?.data?.to,
    error: error.message,
  });
});

// Fired if the worker itself encounters an error
paymentWorker.on("error", (error) => {
  logger.error("Payment Webhook error", {
    error: error.message,
    stack: error.stack,
  });
});

// Fired when a job becomes active
paymentWorker.on("active", (job) => {
  logger.info("Payment Webhook job started", {
    jobId: job.id,
    jobName: job.name,
  });
});

module.exports = paymentWorker;
