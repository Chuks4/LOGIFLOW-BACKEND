const permsRepo = require("../repositories/permissions");
const { ALLOWED_ACTIONS, ALLOWED_RESOURCES } = require("../constants/rbac");
const { Op } = require("sequelize");
const { errorMsg } = require("../utils/util");

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

  if (permission) errorMsg("Permission already exists", 409);

  if (!Object.prototype.hasOwnProperty.call(ALLOWED_ACTIONS, action)) {
    errorMsg("Invalid action");
  }

  if (!Object.prototype.hasOwnProperty.call(ALLOWED_RESOURCES, resource)) {
    errorMsg("Invalid resource");
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

  if (!permission) errorMsg("Permission not found");

  const actionLower = action.trim().toLowerCase();
  const resourceLower = resource.trim().toLowerCase();

  if (!Object.prototype.hasOwnProperty.call(ALLOWED_ACTIONS, actionLower)) {
    errorMsg("Invalid action");
  }

  if (!Object.prototype.hasOwnProperty.call(ALLOWED_RESOURCES, resource)) {
    errorMsg("Invalid resource");
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

  if (!permission) errorMsg("Permission not found", 404);

  await permission.destroy();
  return id;
};

const getAll = async (params) => {
  const page = params.page ? parseInt(params.page) : 1;
  const limit = params.limit ? parseInt(params.limit) : 10;
  const offset = (page - 1) * limit;
  const status = params.status ? params.status : "all";
  const query = status === "all" ? {} : { isActive: status };
  const keyword = params.keyword ? params.keyword : "";

  if (keyword) {
    query[Op.or] = [
      { name: { $like: `%${keyword}%` } },
      { desc: { $like: `%${keyword}%` } },
    ];
  }

  const { count, rows } = await permsRepo.findAndCountAll({
    where: query,
    offset,
    limit,
    order: [["createdAt", "DESC"]],
  });

  return {
    totalPages: Math.ceil(count / limit),
    totalItems: count,
    data: rows,
  };
};

module.exports = {
  create,
  update,
  remove,
  getAll,
};
