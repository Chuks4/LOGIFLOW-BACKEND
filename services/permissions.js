const permsRepo = require("../repositories/permissions");
const { ALLOWED_ACTIONS } = require("../constants/rbac");

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
    error.code = 409;
    throw error;
  }

  if (!Object.prototype.hasOwnProperty.call(ALLOWED_ACTIONS, action)) {
    const error = new Error("Invalid action");
    error.code = 400;
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
  const { desc, resource, action } = data;
  const permission = await permsRepo.findOne({
    where: { id },
  });

  if (!permission) {
    const error = new Error("Permission not found");
    error.code = 404;
    throw error;
  }

  if (!Object.prototype.hasOwnProperty.call(ALLOWED_ACTIONS, action)) {
    const error = new Error("Invalid action");
    error.code = 400;
    throw error;
  }

  await permission.update({
    desc: desc || permission.desc,
    resource: resource || permission.resource,
    action: action || permission.action,
    name: `${resource}:${action}`,
  });

  return await permsRepo.findOne({
    where: { id },
  });
};

const remove = async (id) => {
  const permission = await permsRepo.findOne({
    where: { id },
  });

  if (!permission) {
    const error = new Error("Permission not found");
    error.code = 404;
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
