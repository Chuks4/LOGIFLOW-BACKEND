const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth");
const vehicleRouter = require("./routes/vehicles");
const userRouter = require("./routes/users");
const shipmentRouter = require("./routes/shipments");
const geoapifyRouter = require("./routes/geoapify");
const permissionRouter = require("./routes/permissions");
const roleRouter = require("./routes/roles");

const swaggerUi = require("swagger-ui-express");
const swaggerJsdocs = require("swagger-jsdoc");
const cors = require("cors");

const allowedOrigins = ["http://localhost:5000"];
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || !allowedOrigins.includes(origin))
      return callback(null, true);
    callback(new Error("Not allowed by CORS"));
  },
  methods: "GET,PUT,PATCH,POST,DELETE",
  allowedHeaders: "Content-Type, Authorization",
  credentials: true,
};

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "LogiFlow API",
      version: "1.0.0",
      description:
        "LogiFlow simulates a real-world logistics company where customers can create shipments and track deliveries while dispatchers assign drivers and monitor delivery progress.",
    },
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        BearerAuth: [],
      },
    ],
    tags: [
      {
        name: "Auth",
        description: "Authentication related APIs",
      },
      {
        name: "Onboarding",
        description: "User onboarding related APIs",
      },
      {
        name: "Roles",
        description: "Role related APIs",
      },
      {
        name: "Permissions",
        description: "Permission related APIs",
      },
      {
        name: "Vehicles",
        description: "Vehicle related APIs",
      },
      {
        name: "Shipments",
        description: "Shipment related APIs",
      },
      {
        name: "Geoapify",
        description: "Geoapify related APIs",
      },
      {
        name: "Users",
        description: "Users related APIs",
      },
    ],
  },

  apis: ["./routes/*.js"],
  // server: [{ url: "http://localhost:8000/api/v1/docs" }],
};

const swaggerDocs = swaggerJsdocs(swaggerOptions);
app.use(cors(corsOptions));
app.use("/api/v1/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(express.json());
app.use(cookieParser());

// Routes
app.use("api/v1/uploads", express.static("./uploads"));
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/vehicles", vehicleRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/shipments", shipmentRouter);
app.use("/api/v1/geoapify", geoapifyRouter);
app.use("/api/v1/permissions", permissionRouter);
app.use("/api/v1/roles", roleRouter);

module.exports = app;
