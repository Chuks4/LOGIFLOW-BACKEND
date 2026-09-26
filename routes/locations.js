const router = require("express").Router();
const locationController = require("../controllers/locations");
const { authAccess } = require("../middlewares/authAccess");

router.get("/countries", authAccess, locationController.getCountries);
router.get(
  "/countries/:countryCode/states",
  authAccess,
  locationController.getStates,
);
router.get(
  "/countries/:countryCode/states/:stateCode/cities",
  authAccess,
  locationController.getCities,
);

module.exports = router;
