const { Redis } = require("ioredis");

const redis_url =
  process.env.NODE_ENV === "production"
    ? process.env.REDIS_URL_PROD
    : process.env.REDIS_URL_DEV;

const connection = new Redis(redis_url, {
  maxRetriesPerRequest: null, // Disable max retries per request
  enableReadyCheck: false, // Disable ready check
});

connection.on("connect", () => {
  console.log("Redis connected");
});

module.exports = { connection };
