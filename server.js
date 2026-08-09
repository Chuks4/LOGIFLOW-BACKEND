require("dotenv").config({ path: "./config/.env" });
const app = require("./app");
const http = require("http");
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;
require("./workers/email"); // Start the email worker
const { logger } = require("./logger/logger");
const fs = require("fs");

const directory = "./uploads";
if (!fs.existsSync(directory)) fs.mkdirSync(directory);

server.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});
