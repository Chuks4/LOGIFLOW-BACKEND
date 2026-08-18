const permService = require("../services/permissions");
const { getPermissionsByRoleId } = require("../services/rbac");

const create = async (req, res) => {
  try {
    const created = await permService.create(req.body);
    return res.status(201).json({ status: true, data: created });
  } catch (error) {
    if (error.status) {
      return res
        .status(error.status)
        .json({ status: false, error: error.message });
    }

    return res
      .status(500)
      .json({ status: false, message: "Internal server error" });
  }
};

const update = async (req, res) => {
  try {
    const updated = await permService.update(req.params.id, req.body);
    return res.status(200).json({ status: true, data: updated });
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
    const removed = await permService.remove(req.params.id);
    return res.status(200).json({ status: true, data: removed });
  } catch (error) {
    if (error.status) {
      return res
        .status(error.status)
        .json({ status: false, error: error.message });
    }

    return res
      .status(500)
      .json({ status: false, message: "Internal server error" });
  }
};

const geAllByRoleId = async (req, res) => {
  try {
    const permissions = await getPermissionsByRoleId(req.params.roleId);
    return res.status(200).json({ status: true, data: permissions });
  } catch (error) {
    if (error.status) {
      return res
        .status(error.status)
        .json({ status: false, error: error.message });
    }

    return res
      .status(500)
      .json({ status: false, message: "Internal server error" });
  }
};

module.exports = {
  create,
  update,
  remove,
  geAllByRoleId,
};
