require("dotenv").config({ path: "./config/.env" });
const app = require("./app");
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const PORT = process.env.PORT || 3000;
require("./workers/email"); // Start the email worker
require("./workers/payment"); // Start the payment worker
const { logger } = require("./logger/logger");
const fs = require("fs");
const db = require("./models");
const { socketAuth } = require("./middlewares/socketAuth");
const {
  createShipmentLocation,
  canViewShipmentLocation,
  canUpdateShipmentLocation,
} = require("./services/shipmentLocation");

const directory = "./uploads";
if (!fs.existsSync(directory)) fs.mkdirSync(directory);

const shutdown = async () => {
  await db.sequelize.close();
  process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

const allowedOrigins = process.env.ALLOWED_ORIGINS.split(",").map((origin) =>
  origin.trim(),
);

const io = new Server(server, {
  cors: {
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Authenticate socket connections using JWT
io.use(socketAuth);

// Socket.io connection handling
io.on("connection", (socket) => {
  console.log(`User ${socket.user.id} connected: ${socket.id}`);

  // Join shipment room
  socket.on("join-shipment", async ({ shipmentId }) => {
    try {
      // Ensures that the user owns the shipment and has access to view it
      await canViewShipmentLocation(socket.user, shipmentId);

      socket.join(`shipment:${shipmentId}`);
      socket.emit("shipment:joined", {
        shipmentId,
      });

      console.log(`User ${socket.user.id} joined shipment:${shipmentId}`);
    } catch (error) {
      socket.emit("tracking-error", {
        message: error.message,
      });
    }
  });

  // Driver sends GPS location
  socket.on("send-location", async (data) => {
    try {
      // Ensures that the user was assigned the shipment and is a driver
      await canUpdateShipmentLocation(socket.user, data.shipmentId);

      const location = await createShipmentLocation({
        shipmentId: data.shipmentId,
        driverId: socket.user.id,
        latitude: data.latitude,
        longitude: data.longitude,
        accuracy: data.accuracy,
        speed: data.speed,
        heading: data.heading,
        timestamp: data.timestamp,
      });

      io.to(`shipment:${data.shipmentId}`).emit("receive-location", {
        shipmentId: data.shipmentId,
        driverId: socket.user.id,
        location,
      });
    } catch (error) {
      socket.emit("tracking-error", {
        message: error.message,
      });
    }
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

server.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});
