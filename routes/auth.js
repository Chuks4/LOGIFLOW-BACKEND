const router = require("express").Router();
const authController = require("../controllers/auth");
const {
  validateLogin,
  validateRegister,
  validateEmailVerification,
  validateForgotPassword,
  validateResetPassword,
} = require("../validators/auth");

router.post("/login", validateLogin, authController.login);
router.post("/refresh", authController.refreshToken);
router.post("/logout", authController.logout);
router.post("/register", validateRegister, authController.register);
router.post("/forgot-password",validateForgotPassword,authController.forgotPassword,);
router.post("/reset-password",validateResetPassword,authController.resetPassword);
router.post("/verify-email",validateEmailVerification,authController.verifyEmail);

module.exports = router;
