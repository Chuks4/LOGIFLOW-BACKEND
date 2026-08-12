const router = require("express").Router();
const shipmentController = require("../controllers/shipments");
const authAccess = require("../middleware/authAccess");
const { validateCreateShipment } = require("../validators/shipments");

router.get("/", authAccess, shipmentController.getAll);
router.get("/:id", authAccess, shipmentController.getById);
router.post("/", authAccess, validateCreateShipment, shipmentController.create);
router.put("/:id", authAccess, shipmentController.updateStatus);
router.put("/:id/assign-driver", authAccess, shipmentController.assignDriver);

module.exports = router;