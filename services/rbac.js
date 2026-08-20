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

  return permissions.map((p) => `${p.resource}:${p.action}`);
};
const can = async (roleId, resource, action) => {
  // TODO: implement RBAC
  const permissions = await getPermissionsByRoleId(roleId);
  return permissions.includes(`${resource}:${action}`);
};

module.exports = { can, getPermissionsByRoleId };
