const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth");
const vehicleRouter = require("./routes/vehicles");
const userRouter = require("./routes/users");
const shipmentRouter = require("./routes/shipments");
// const cors = require("cors");

app.use(express.json());
app.use(cookieParser());
// app.use(cors());

// Routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/vehicles", vehicleRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/shipments", shipmentRouter);

module.exports = app;
