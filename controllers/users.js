const userServices = require("../services/user");
const { deleteFile } = require("../utils/util");

const getCustomers = async (req, res) => {
  try {
    const customers = await userServices.getCustomers(req.query);
    res.status(200).json({ status: true, data: customers });
  } catch (error) {
    console.log("Error", error);
    if (error.status) {
      return res
        .status(error.status)
        .json({ status: false, message: error.message });
    } else {
      return res
        .status(500)
        .json({ status: false, message: "Internal server error" });
    }
  }
};

const getById = async (req, res) => {
  try {
    const user = await userServices.getUserById(req.params.id);
    res.status(200).json({ status: true, data: user });
  } catch (error) {
    if (error.status) {
      return res
        .status(error.status)
        .json({ status: false, message: error.message });
    } else {
      return res
        .status(500)
        .json({ status: false, message: "Internal server error" });
    }
  }
};

const update = async (req, res) => {
  try {
    const user = await userServices.updateUser(
      req.params.id,
      req.body,
      req.file,
    );
  } catch (error) {
    if (error.status) {
      return res
        .status(error.status)
        .json({ status: false, message: error.message });
    }
    if (req.file) {
      deleteFile(req.file?.path);
    }
    return res
      .status(500)
      .json({ status: false, message: "Internal server error" });
  }
};

const updateStatus = async (req, res) => {
  try {
    const user = await userServices.updateUserStatus(req.params.id, req.body.status);
    return res.status(200).json({status: true, data: user})
  } catch (error) {
    console.log("Error ", error);
    if (error.status) {
      return res
        .status(error.status)
        .json({ status: false, message: error.message });
    } else {
      return res
        .status(500)
        .json({ status: false, message: "Internal server error" });
    }
  }
};

module.exports = {
  getCustomers,
  getById,
  update,
  updateStatus,
};
