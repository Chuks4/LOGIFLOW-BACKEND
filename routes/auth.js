const router = require("express").Router();
const authController = require("../controllers/auth");
const { validateLogin } = require("../validators/auth");

router.post("/login", validateLogin, authController.login);
router.post("/refresh", authController.refreshToken);
router.post("/logout", authController.logout);

module.exports = router;
