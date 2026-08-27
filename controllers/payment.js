const paymentService = require("../services/payments");

const initPayment = async (req, res) => {
  try {
    const { amount, shipmentId, email } = req.body;
    const data = await paymentService.initPayment({
      amount,
      shipmentId,
      email,
    });
    return res.status(200).json({ status: true, data });
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
  initPayment,
};
