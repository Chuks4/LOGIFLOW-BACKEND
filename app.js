const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth");
const vehicleRouter = require("./routes/vehicles");
const userRouter = require("./routes/users");
const shipmentRouter = require("./routes/shipments");
const geoapifyRouter = require("./routes/geoapify");
const swaggerUi = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
// const cors = require("cors");

// Swagger setup
const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "LogiFlow API",
      version: "1.0.0",
      description:
        "LogiFlow simulates a real-world logistics company where customers can create shipments and track deliveries while dispatchers assign drivers and monitor delivery progress.",
    },
    // servers: [
    //   {
    //     url: "http://localhost:3000",
    //   },
    // ],
  },
  apis: ["../routes/*.js"], // files containing annotations as above
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(express.json());
app.use(cookieParser());
// app.use(cors());

// Routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/vehicles", vehicleRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/shipments", shipmentRouter);
app.use("/api/v1/geoapify", geoapifyRouter);

module.exports = app;
