const {} = require("express-validator");
const { body } = require("express-validator");

const validateLogin = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email is not valid"),

  body("password").trim().notEmpty().withMessage("Password is required"),
];

module.exports = { validateLogin };
