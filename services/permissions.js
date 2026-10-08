const permsRepo = require("../repositories/permissions");
const db = require("../models");
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

  const actionLower = action ? action.trim().toLowerCase() : permission.action;
  const resourceLower = resource
    ? resource.trim().toLowerCase()
    : permission.resource;

  if (!Object.prototype.hasOwnProperty.call(ALLOWED_ACTIONS, actionLower)) {
    errorMsg("Invalid action");
  }

  if (!Object.prototype.hasOwnProperty.call(ALLOWED_RESOURCES, resourceLower)) {
    errorMsg("Invalid resource");
  }

  const name = `${resourceLower}:${actionLower}`;
  const existingPermission = await permsRepo.findOne({
    where: { name, id: { [Op.ne]: id } },
  });
  if (existingPermission) errorMsg("Permission already exists", 409);

  await permission.update({
    desc: desc !== undefined ? desc : permission.desc,
    resource: resourceLower,
    action: actionLower,
    name,
    isActive: isActive !== undefined ? isActive : permission.isActive,
  });

  return await permsRepo.findById(id);
};

const remove = async (id) => {
  const permission = await permsRepo.findOne({
    where: { id },
  });

  if (!permission) errorMsg("Permission not found", 404);

  const transaction = await db.sequelize.transaction();
  try {
    await db.role_permission.destroy({
      where: { permissionId: id },
      transaction,
    });
    await permission.destroy({ transaction });
    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }

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
