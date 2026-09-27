const { Server } = require("socket.io");
const { errorMsg } = require("../utils/util");

const allowedOrigins = process.env.ALLOWED_ORIGINS.split(",").map((origin) =>
  origin.trim(),
);

let socket;

const io = (server) => {
  const serverInstance = new Server(server, {
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
  socket = serverInstance;
  return serverInstance;
};

const getSocketIO = () => {
  if (!socket) errorMsg("Socket not initialized");
  return socket;
};

module.exports = { io, getSocketIO };
