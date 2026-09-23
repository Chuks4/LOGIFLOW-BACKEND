const rolePermRepo = require("../repositories/role_permissions");
const roleRepo = require("../repositories/role");
const db = require("../models");
const { errorMsg } = require("../utils/util");

const assignPermissions = async (roleId, permissionIds) => {
  if (!Array.isArray(permissionIds)) {
    errorMsg("Permission Ids must be an array");
  }

  const role = await roleRepo.findById(roleId);
  if (!role) errorMsg("Role not found", 404);

  for (const permissionId of permissionIds) {
    const existing = await rolePermRepo.findOne({
      where: { roleId, permissionId },
    });

    if (!existing) {
      await rolePermRepo.create({ roleId, permissionId });
    }
  }

  return await roleRepo.findById(roleId, {
    include: {
      model: db.permissions,
      through: { attributes: [] },
      as: "permissions",
      attributes: ["id", "name", "desc", "resource", "action"],
    },
  });
};

const removePermissions = async (roleId, permissionIds) => {
  if (!Array.isArray(permissionIds)) {
    errorMsg("Permission Ids must be an array");
  }

  const role = await roleRepo.findById(roleId);
  if (!role) errorMsg("Role not found", 404);

  for (const permissionId of permissionIds) {
    const existing = await rolePermRepo.findOne({
      where: { roleId, permissionId },
    });

    if (existing) {
      await rolePermRepo.delete({ where: { roleId, permissionId } });
    }
  }

  return await roleRepo.findById(roleId, {
    include: {
      model: db.permissions,
      through: { attributes: [] },
      as: "permissions",
      attributes: ["id", "name", "desc", "resource", "action"],
    },
  });
};

module.exports = {
  assignPermissions,
  removePermissions,
};
