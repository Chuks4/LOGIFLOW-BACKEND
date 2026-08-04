require("dotenv").config({ path: "./config/.env" });
const app = require("./app");
const http = require("http");
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;
require("./workers/email"); // Start the email worker
const { logger } = require("./logger/logger");

server.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});
