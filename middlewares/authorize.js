const { can } = require("../services/rbac");
const ALLOWED_METHODS = ["get", "post", "put", "patch", "delete"];
const hasAccessTo = (resource, action) => {
  return async (req, res, next) => {
    const method = req.method.toLowerCase();
    if (!ALLOWED_METHODS.includes(method)) {
      return res
        .status(403)
        .json({ message: "You are not authorized to perform this action" });
    }

    const roleId = req.user.roleId;
    if (!roleId) {
      return res
        .status(403)
        .json({ message: "You are not authorized to perform this action" });
    }

    const allowed = await can(roleId, resource, action);
    if (!allowed) {
      return res
        .status(403)
        .json({ message: "You are not authorized to perform this action" });
    }
    next();
  };
};

module.exports = { hasAccessTo };
