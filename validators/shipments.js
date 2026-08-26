const { body } = require("express-validator");

const validateCreateShipment = [
  body("pickupAddress")
    .trim()
    .notEmpty()
    .withMessage("Pickup address is required"),
  body("deliveryAddress")
    .trim()
    .notEmpty()
    .withMessage("Delivery address is required"),
  body("pickupLatitude")
    .trim()
    .notEmpty()
    .withMessage("Pickup latitude is required"),
  body("pickupLongitude")
    .trim()
    .notEmpty()
    .withMessage("Pickup longitude is required"),
  body("deliveryLatitude")
    .trim()
    .notEmpty()
    .withMessage("Delivery latitude is required"),
  body("deliveryLongitude")
    .trim()
    .notEmpty()
    .withMessage("Delivery longitude is required"),
  body("weight")
    .trim()
    .optional()
    .toInt()
    .isInt({ min: 0 })
    .withMessage("Weight must be a non-negative integer"),
  body("dimensions")
    .trim()
    .optional()
    .toInt()
    .isInt({ min: 0 })
    .withMessage("Dimensions must be a non-negative integer"),
  body("shipmentType")
    .trim()
    .notEmpty()
    .withMessage("Shipment type is required")
    .isIn(["standard", "express", "fragile"])
    .withMessage("Invalid shipment type"),
  body("estimatedCost")
    .notEmpty()
    .withMessage("Estimated cost is required")
    .toInt()
    .isInt({ min: 1 })
    .withMessage("Estimated cost must be a positive integer"),
  body("note")
    .trim()
    .optional()
    .isString()
    .withMessage("Note must be a string"),
  body("recipientName")
    .trim()
    .notEmpty()
    .withMessage("Recipient name is required"),
  body("recipientPhone")
    .trim()
    .notEmpty()
    .withMessage("Recipient phone is required"),
  body("items")
    .isArray()
    .withMessage("Items must be an array")
    .custom((value) => {
      if (value.length === 0) {
        throw new Error("At least one item must be provided");
      }
      return true;
    }),
  body("items.*.itemName")
    .trim()
    .notEmpty()
    .withMessage("Item name is required"),
  body("items.*.quantity")
    .trim()
    .notEmpty()
    .withMessage("Item quantity is required")
    .toInt()
    .isInt({ min: 1 })
    .withMessage("Item quantity must be a positive integer"),
  body("items.*.weight")
    .optional()
    .trim()
    .toInt()
    .isInt({ min: 0 })
    .withMessage("Item weight must be a positive integer"),
  body("items.*.length")
    .optional()
    .trim()
    .toInt()
    .isInt({ min: 0 })
    .withMessage("Item length must be a positive integer"),
  body("items.*.width")
    .optional()
    .trim()
    .toInt()
    .isInt({ min: 0 })
    .withMessage("Item width must be a positive integer"),
  body("items.*.height")
    .optional()
    .trim()
    .toInt()
    .isInt({ min: 0 })
    .withMessage("Item height must be a positive integer"),
  body("items.*.declaredValue")
    .optional()
    .trim()
    .toInt()
    .isInt({ min: 0 })
    .withMessage("Item declaredValue must be non-negative integer"),
  body("items.*.category")
    .optional()
    .isString()
    .trim()
    .withMessage("Item category must be a string"),
  body("items.*.isFragile")
    .notEmpty()
    .withMessage("Item isFragile is required")
    .isBoolean()
    .withMessage("Item isFragile must be a boolean")
    .toBoolean(),
  body("items.*.color")
    .optional()
    .isString()
    .trim()
    .withMessage("Item color must be a string"),
  body("specialInstructions")
    .optional()
    .isString()
    .trim()
    .withMessage("Special instructions must be a string"),
];

module.exports = {
  validateCreateShipment,
};
