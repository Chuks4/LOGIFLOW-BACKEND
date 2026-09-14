const shipmentService = require("../services/shipments");

const create = async (req, res) => {
  try {
    const shipment = await shipmentService.create(req.body, req.user.id);
    return res.status(201).json({ status: true, data: shipment });
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

const getAll = async (req, res) => {
  try {
    const shipments = await shipmentService.getAll(req.query);
    return res.status(200).json({ status: true, data: shipments });
  } catch (error) {
      console.log("Error", error);
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

const getById = async (req, res) => {
  try {
    const shipment = await shipmentService.getById(req.params.id);
    return res.status(200).json({ status: true, data: shipment });
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

const assignDriver = async (req, res) => {
  try {
    const { shipmentId, driverId } = req.params;
    const dispatcherId = req.user.id;
    const shipment = await shipmentService.assignDriverShipment(
      dispatcherId,
      shipmentId,
      driverId,
    );
    return res.status(200).json({ status: true, data: shipment });
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

const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const shipment = await shipmentService.updateStatus(
      userId,
      id,
      req.body.status,
    );
    return res.status(200).json({ status: true, data: shipment });
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
  create,
  getAll,
  getById,
  assignDriver,
  updateStatus,
};
