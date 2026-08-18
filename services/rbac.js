const db = require("../models");

const getPermissionsByRoleId = async (roleId) => {
  const permissions = await db.permissions.findAll({
    include: {
      model: db.roles,
      where: { id: roleId },
      required: true,
      as: "roles",
      through: {
        attributes: [],
      },
    },
    attributes: ["resource", "action"],
  });

  return permissions.map((p) => `${p.action}:${permission.resource}}`);
};
const can = async (roleId, resource, action) => {
  // TODO: implement RBAC
  const permissions = await getPermissionsByRoleId(roleId);
  return permissions.includes(`${action}:${resource}`);
};

module.exports = { can, getPermissionsByRoleId };
