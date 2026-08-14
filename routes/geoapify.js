const router = require("express").Router();
const authAccess = require("../middlewares/authAccess");
const geoapifyController = require("../controllers/geoapify");
const { validateCalculateShipmentCost } = require("../validators/geoapify");

router.get(
  "/",
  authAccess,
  validateCalculateShipmentCost,
  geoapifyController.calculateShpimentCost,
);

module.exports = router;