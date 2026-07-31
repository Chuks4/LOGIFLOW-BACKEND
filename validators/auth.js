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

const validateRegister = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email is not valid"),

  body("password").trim().notEmpty().withMessage("Password is required"),
  body("firstName").trim().notEmpty().withMessage("First name is required"),
  body("lastName").trim().notEmpty().withMessage("Last name is required"),
  body("dob")
    .trim()
    .notEmpty()
    .withMessage("Date of birth is required")
    .isISO15924()
    .withMessage("Date of birth is not valid"),
  body("gender").trim().notEmpty().withMessage("Gender is required"),
  body("phoneNumber").trim().notEmpty().withMessage("Phone number is required"),
  body("country").trim().notEmpty().withMessage("Country is required"),
  body("city").trim().notEmpty().withMessage("City is required"),
  body("address").trim().notEmpty().withMessage("Address is required"),
];

module.exports = { validateLogin, validateRegister };
