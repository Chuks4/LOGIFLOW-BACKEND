const router = require("express").Router();
const authAccess = require("../middlewares/authAccess");
const permsController = require("../controllers/permissions");
const { validatePermission } = require("../validators/rbac");

router.post("/", validatePermission, authAccess, permsController.create);
router.get("/", authAccess, permsController.update);
router.delete("/:id", authAccess, permsController.remove);
router.get("/:roleId/permissions", authAccess, permsController.geAllByRoleId);

module.exports = router;
