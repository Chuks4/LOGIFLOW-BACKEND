const { Worker } = require("bullmq");
const emailService = require("../services/email");
const { connection } = require("../queues/connection");
const { logger } = require("../logger/logger");

const emailWorker = new Worker(
  "email",
  async (job) => {
    switch (job.name) {
      case "welcome-email":
        await emailService.sendEmail(job.data);
        logger.info("Welcome email sent", { recipient: job.data.to });
        break;

      case "password-reset-email":
        await emailService.sendEmail(job.data);
        logger.info("Password reset email sent", { recipient: job.data.to });
        break;

      case "verification-email":
        await emailService.sendEmail(job.data);
        logger.info("Email verification email sent", {
          recipient: job.data.to,
        });
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
    }
  },
);

// Fired when a job completes successfully
emailWorker.on("completed", (job) => {
  logger.info("Email job completed", {
    jobId: job.id,
    jobName: job.name,
    recipient: job.data.to,
  });
});

// Fired when a job fails
emailWorker.on("failed", (job, error) => {
  logger.error("Email job failed", {
    jobId: job?.id,
    jobName: job?.name,
    recipient: job?.data?.to,
    error: error.message,
  });
});

// Fired if the worker itself encounters an error
emailWorker.on("error", (error) => {
  logger.error("Email worker error", {
    error: error.message,
    stack: error.stack,
  });
});

// Fired when a job becomes active
emailWorker.on("active", (job) => {
  logger.info("Email job started", {
    jobId: job.id,
    jobName: job.name,
    recipient: job.data.to,
  });
});

module.exports = emailWorker;
