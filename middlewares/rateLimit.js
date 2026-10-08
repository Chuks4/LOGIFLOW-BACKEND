const rateLimit = require("express-rate-limit");

const rateLimiter = ({
  time = 15 * 60 * 1000,
  max = 100,
  message = "Too many requests, please try again later",
}) =>
  rateLimiter({
    windowMs: time,
    max,
    message,
    standardHeaders: true,
    legacyHeaders: false, // Disable the 'X-RateLimit-*' headers
  });

module.exports = rateLimiter;
