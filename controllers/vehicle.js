const vehicleService = require("../services/vehicles");

const create = async (req, res) => {
  try {
    const vehicle = await vehicleService.create(req.body);
    res.status(201).json({ status: true, data: vehicle });
  } catch (error) {
    if (error.status) {
      return res
        .status(error.status)
        .json({ status: false, message: error.message });
    } else {
      return res.status(500).json({ message: "Internal server error" });
    }
  }
};

const getAll = async (req, res) => {
  try {
    const vehicles = await vehicleService.getAll(req.query);
    res.status(200).json({ status: true, data: vehicles });
  } catch (error) {
    if (error.status) {
      return res
        .status(error.status)
        .json({ status: false, message: error.message });
    } else {
      return res.status(500).json({ message: "Internal server error" });
    }
  }
};

const getById = async (req, res) => {
  try {
    const vehicle = await vehicleService.getById(req.params.id);
    res.status(200).json({ status: true, data: vehicle });
  } catch (error) {
    if (error.status) {
      return res
        .status(error.status)
        .json({ status: false, message: error.message });
    } else {
      return res.status(500).json({ message: "Internal server error" });
    }
  }
};

const update = async (req, res) => {
  try {
    const vehicle = await vehicleService.update(req.params.id, req.body);
    res.status(200).json({ status: true, data: vehicle });
  } catch (error) {
    if (error.status) {
      return res
        .status(error.status)
        .json({ status: false, message: error.message });
    } else {
      return res.status(500).json({ message: "Internal server error" });
    }
  }
};

const assignDriver = async (req, res) => {
  try {
    const vehicle = await vehicleService.assignDriver(req.params.id, req.body);
    res.status(200).json({ status: true, data: vehicle });
  } catch (error) {
    if (error.status) {
      return res
        .status(error.status)
        .json({ status: false, message: error.message });
    } else {
      return res.status(500).json({ message: "Internal server error" });
    }
  }
};

const deleteById = async (req, res) => {
  try {
    const vehicle = await vehicleService.deleteById(req.params.id);
    res.status(200).json({ status: true, data: vehicle });
  } catch (error) {
    if (error.status) {
      return res
        .status(error.status)
        .json({ status: false, message: error.message });
    } else {
      return res.status(500).json({ message: "Internal server error" });
    }
  }
};

module.exports = {
  create,
  getAll,
  getById,
  update,
  assignDriver,
  deleteById,
};
