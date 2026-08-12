const body = require("express-validator");

const validateCalculateShipmentCost = [
  body("shipmentType")
    .trim()
    .notEmpty()
    .withMessage("Shipment type is required"),
  body("vehicleType").trim().notEmpty().withMessage("vehicle type is required"),
  body("deliveryLat")
    .trim()
    .notEmpty()
    .withMessage("Delivery latitude is required"),
  body("deliveryLng")
    .trim()
    .notEmpty()
    .withMessage("Delivery longitude is required"),
  body("pickupLat")
    .trim()
    .notEmpty()
    .withMessage("Pickup latitude is required"),
  body("pickupLng")
    .trim()
    .notEmpty()
    .withMessage("Pickup longitude is required"),
];

module.exports = {
  validateCalculateShipmentCost,
};
