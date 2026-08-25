const rolePermRepo = require("../repositories/role_permissions");
const roleRepo = require("../repositories/role");
const db = require("../models");

const assignPermissions = async (roleId, permissionIds) => {
  if (!Array.isArray(permissionIds)) {
    const error = new Error("Permission Ids must be an array");
    error.status = 400;
    throw error;
  }

  const role = await roleRepo.findById(roleId);
  if (!role) {
    const error = new Error("Role not found");
    error.status = 404;
    throw error;
  }


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
    const error = new Error("Permission Ids must be an array");
    error.status = 400;
    throw error;
  }

  const role = await roleRepo.findById(roleId);
  if (!role) {
    const error = new Error("Role not found");
    error.status = 404;
    throw error;
  }

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
