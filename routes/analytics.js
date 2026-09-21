const router = require("express").Router();
const analyticsController = require("../controllers/analytics");
const { authAccess } = require("../middlewares/authAccess");

router.get("/overview", authAccess, analyticsController.getOverview);

module.exports = router;
