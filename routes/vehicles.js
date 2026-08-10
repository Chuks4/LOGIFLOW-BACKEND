const vehicleController = require("../controllers/vehicle");
const router = require("express").Router();
const { validateCreateVehicle } = require("../validators/vehicles");

router.post("/", validateCreateVehicle, vehicleController.create);
router.get("/", vehicleController.getAll);
router.get("/:id", vehicleController.getById);
router.put("/:id", vehicleController.update);
router.put("/:id/driver", vehicleController.assignDriver);
router.delete("/:id", vehicleController.deleteById);

module.exports = router;
