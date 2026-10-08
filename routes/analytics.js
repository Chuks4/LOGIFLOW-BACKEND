const router = require("express").Router();
const analyticsController = require("../controllers/analytics");
const { authAccess } = require("../middlewares/authAccess");

router.get("/overview", authAccess, analyticsController.getOverview);
router.get(
  "/admin/overview",
  authAccess,
  analyticsController.getAdminDashboardAnalytics,
);
router.get("/dispatcher/overview", authAccess, analyticsController.getDispatcherDashboardAnalytics);

module.exports = router;
