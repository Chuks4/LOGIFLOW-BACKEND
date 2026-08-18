const { body } = require("express-validator");

const validatePermission = [
  body("resource").trim().notEmpty().withMessage("Resource is required"),
  body("action").trim().notEmpty().withMessage("Action is required"),
  body("desc").trim().optional(),
];

const validateRole = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("desc").trim().optional(),
];

module.exports = {
  validatePermission,
  validateRole,
};
