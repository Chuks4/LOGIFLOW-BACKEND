const router = require("express").Router();
const userController = require("../controllers/users");
const authAccess = require("../middlewares/authAccess");

router.get("/", authAccess, userController.getCustomers);
router.get("/:id", authAccess, userController.getById);
router.put("/:id", authAccess, userController.update);
router.patch("/:id/status", authAccess, userController.updateStatus);

module.exports = router;
