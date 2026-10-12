const router = require("express").Router();
const analyticsController = require("../controllers/analytics");
const { authAccess } = require("../middlewares/authAccess");
const { hasAccessTo } = require("../middlewares/authorize");

router.get(
  "/overview",
  hasAccessTo("dashboard", "read"),
  authAccess,
  analyticsController.getOverview,
);
router.get(
  "/admin/overview",
  authAccess,
  hasAccessTo("dashboard", "read"),
  analyticsController.getAdminDashboardAnalytics,
);
router.get(
  "/dispatcher/overview",
  authAccess,
  hasAccessTo("dashboard", "read"),
  analyticsController.getDispatcherDashboardAnalytics,
);

module.exports = router;
