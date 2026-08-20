const rolePerm = require("../services/role_permissions");

const assignPermissions = async (req, res) => {
  try {
    const { id } = req.params;
    const { permissionIds } = req.body;
    const rolePermission = await rolePerm.assignPermissions(id, permissionIds);
    res.status(201).json({ status: true, data: rolePermission });
  } catch (error) {
    console.log("Error", error)
    if (error.status) {
      return res
        .status(error.status)
        .json({ status: false, message: error.message });
    }

    res.status(500).json({ status: false, message: "Internal server error" });
  }
};

const removePermissions = async (req, res) => {
  try {
    const { id } = req.params;
    const { permissionIds } = req.body;
    const rolePermission = await rolePerm.removePermissions(id, permissionIds);
    return res.status(201).json({ status: true, data: rolePermission });
  } catch (error) {
    console.log("Error", error)
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
  assignPermissions,
  removePermissions,
};
