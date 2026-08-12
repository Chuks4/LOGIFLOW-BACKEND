const geoapifyService = require("../services/geoapify");

const calculateShpimentCost = async (req, res) => {
  try {
    const result = await geoapifyService.calculateEstimatedShipmentCost(
      req.body,
    );
    res.status(200).json({ status: true, data: result });
  } catch (error) {
    if (error.status) {
      return res
        .status(error.status)
        .json({ status: false, message: error.message });
    }
    return res
      .status(500)
      .json({ status: false, message: "Internal server error" });
  }
};

module.exports = {
  calculateShpimentCost,
};
