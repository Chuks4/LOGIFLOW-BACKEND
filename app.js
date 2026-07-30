const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth");
// const cors = require("cors");

app.use(express.json());
app.use(cookieParser());
// app.use(cors());

// Routes
app.use("/api/v1/auth", authRouter);

module.exports = app;
