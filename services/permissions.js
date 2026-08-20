const permsRepo = require("../repositories/permissions");
const { ALLOWED_ACTIONS, ALLOWED_RESOURCES } = require("../constants/rbac");

/**
 * Create a permission
 * @param {Object} data
 * @param {String} data.name
 * @param {String} data.desc
 * @param {String} data.resource
 * @param {String} data.action
 * @returns {Promise<Object>} Created permission object
 */
const create = async (data) => {
  const { desc, resource, action } = data;
  const permission = await permsRepo.findOne({
    where: { name: `${resource}:${action}` },
  });

  if (permission) {
    const error = new Error("Permission already exists");
    error.status = 409;
    throw error;
  }

  if (!Object.prototype.hasOwnProperty.call(ALLOWED_ACTIONS, action)) {
    const error = new Error("Invalid action");
    error.status = 400;
    throw error;
  }

  if (!Object.prototype.hasOwnProperty.call(ALLOWED_RESOURCES, resource)) {
    const error = new Error("Invalid resource");
    error.status = 400;
    throw error;
  }

  return permsRepo.create({
    name: `${resource}:${action}`,
    desc,
    resource,
    action,
  });
};

const update = async (id, data) => {
  const { desc, resource, action, isActive } = data;
  const permission = await permsRepo.findOne({
    where: { id },
  });

  if (!permission) {
    const error = new Error("Permission not found");
    error.status = 404;
    throw error;
  }

  const actionLower = action.trim().toLowerCase();
  const resourceLower = resource.trim().toLowerCase();

  if (!Object.prototype.hasOwnProperty.call(ALLOWED_ACTIONS, actionLower)) {
    const error = new Error("Invalid action");
    error.status = 400;
    throw error;
  }

  if (!Object.prototype.hasOwnProperty.call(ALLOWED_RESOURCES, resource)) {
    const error = new Error("Invalid resource");
    error.status = 400;
    throw error;
  }

  await permission.update({
    desc: desc || permission.desc,
    resource: resourceLower || permission.resource,
    action: actionLower || permission.action,
    name: `${resourceLower}:${actionLower}` || permission.name,
    isActive: isActive !== undefined ? isActive : permission.isActive,
  });

  return await permsRepo.findById(id);
};

const remove = async (id) => {
  const permission = await permsRepo.findOne({
    where: { id },
  });

  if (!permission) {
    const error = new Error("Permission not found");
    error.status = 404;
    throw error;
  }

  await permission.destroy();
  return id;
};

module.exports = {
  create,
  update,
  remove,
};
