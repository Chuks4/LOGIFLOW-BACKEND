const analyticsService = require("../services/analytics");

const getOverview = async (req, res) => {
  try {
    const overview = await analyticsService.getOverview(req.user.id, req.query);
    return res.status(200).json({ status: true, data: overview });
  } catch (error) {
    console.error("Error loading analytics overview", error);
    return res
      .status(500)
      .json({ status: false, message: "Internal server error" });
  }
};

module.exports = { getOverview };
