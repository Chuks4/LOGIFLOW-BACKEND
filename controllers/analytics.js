const analyticsService = require("../services/analytics");

const getOverview = async (req, res) => {
  try {
    const overview = await analyticsService.getOverview(req.user.id);
    return res.status(200).json({ status: true, data: overview });
  } catch (error) {
    console.error("Error loading analytics overview", error);
    return res
      .status(500)
      .json({ status: false, message: "Internal server error" });
  }
};

const getAdminDashboardAnalytics = async (req, res) => {
  try {
    const overview = await analyticsService.getAdminDashboardAnalytics();
    return res.status(200).json({ status: true, data: overview });
  } catch (error) {
    console.log("Error ", error);
    return res
      .status(500)
      .json({ status: false, message: "Internal server error" });
  }
};

const getDispatcherDashboardAnalytics = async (req, res) => {
  try {
    const overview = await analyticsService.getDispatcherDashboardAnalytics(
      req.user.id,
    );
    return res.status(200).json({ status: true, data: overview });
  } catch (error) {
    console.log("Error ", error);
    return res
      .status(500)
      .json({ status: false, message: "Internal server error" });
  }
};

module.exports = {
  getOverview,
  getAdminDashboardAnalytics,
  getDispatcherDashboardAnalytics,
};
