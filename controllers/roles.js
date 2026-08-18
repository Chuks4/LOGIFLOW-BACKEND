const roleService = require("../services/roles");

const create = async (req, res) => {
  try {
    const role = await roleService.create(req.body);
    return res.status(201).json({ status: true, data: role });
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

const update = async (req, res) => {
  try {
    const role = await roleService.update(req.params.id, req.body);
    return res.status(200).json({ status: true, data: role });
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

const getById = async (req, res) => {
  try {
    const role = await roleService.getById(req.params.id);
    return res.status(200).json({ status: true, data: role });
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
    const roles = await roleService.getAll(req.query);
    return res.status(200).json({ status: true, data: roles });
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

const remove = async (req, res) => {
  try {
    const role = await roleService.remove(req.params.id);
    return res.status(200).json({ status: true, data: role });
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
  update,
  getById,
  getAll,
  remove,
}