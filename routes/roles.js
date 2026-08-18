const router = require("express").Router();
const rolesController = require("../controllers/roles");
const authAccess = require("../middlewares/authAccess");
const { validateRole } = require("../validators/rbac");

router.post("/", authAccess, validateRole, rolesController.create);
router.get("/", authAccess, rolesController.getAll);
router.get("/:id", authAccess, rolesController.getById);
router.put("/:id", authAccess, rolesController.update);
router.delete("/:id", authAccess, rolesController.remove);

module.exports = router;