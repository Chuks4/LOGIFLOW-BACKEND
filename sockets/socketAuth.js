const jwt = require("jsonwebtoken");
const privateKey = process.env.JWT_SECRET_KEY;

const socketAuth = (socket, next) => {
  try {
    const token = socket.handshake.auth?.token;

    if (!token) {
      return next(new Error("Authentication required"));
    }

    const decoded = jwt.verify(token, privateKey);

    socket.user = decoded;

    next();
  } catch (error) {
    console.error("Socket authentication failed:", error.message);

    next(new Error("Invalid or expired token"));
  }
};

module.exports = { socketAuth };
