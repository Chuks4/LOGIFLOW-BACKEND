const vehicleController = require("../controllers/vehicle");
const router = require("express").Router();
const { validateCreateVehicle } = require("../validators/vehicles");
const authAccess = require("../middlewares/authAccess");

router.post("/", authAccess, validateCreateVehicle, vehicleController.create);
router.get("/", authAccess, vehicleController.getAll);
router.get("/:id", authAccess, vehicleController.getById);
router.put("/:id", authAccess, vehicleController.update);
router.put("/:id/driver", authAccess, vehicleController.assignDriver);
router.delete("/:id", authAccess, vehicleController.deleteById);

module.exports = router;
