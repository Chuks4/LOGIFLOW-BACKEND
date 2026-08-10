const { body } = require("express-validator");

const validateCreateVehicle = [
  body("plateNumber").notEmpty().withMessage("Plate number is required"),
  body("type").notEmpty().withMessage("Please provide vehicle type"),
  body("capacity").notEmpty().withMessage("Please provide vehicle capacity"),
  body("year").notEmpty().withMessage("Please provide vehicle year"),
  body("model").notEmpty().withMessage("Please provide vehicle model"),
];

module.exports = { validateCreateVehicle };
