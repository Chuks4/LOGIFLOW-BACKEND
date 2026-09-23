const roleRepo = require("../repositories/role");
const { Op } = require("sequelize");
const db = require("../models");
const { errorMsg } = require("../utils/util");

/**
 * Create a role
 * @param {Object} data
 * @param {String} data.name
 * @param {String} data.desc
 * @returns {Promise<Object>} Created role object
 */
const create = async (data) => {
  const { name, desc } = data;
  const role = await roleRepo.findOne({ where: { name } });
  if (role) errorMsg("Role already exists", 409);

  const tolower = name.trim().toLowerCase();
  return roleRepo.create({ name: tolower, desc });
};

/**
 * Update a role
 * @param {uuid} id
 * @param {Object} data
 * @returns {Promise<Object>} Updated role object
 */
const update = async (id, data) => {
  const { name, desc, isActive } = data;
  const role = await getById(id);
  const toLower = name.trim().toLowerCase();
  await role.update({
    name: toLower || role.name,
    desc: desc || role.desc,
    isActive: isActive || role.isActive,
  });
  return getById(id);
};

/**
 * Get a role by id
 * @param {uuid} id
 * @returns {Promise<Object>} Role object
 */
const getById = async (id) => {
  const role = await roleRepo.findOne({ where: { id } });
  if (!role) errorMsg("Role not found", 404);
  return role;
};

/**
 * Gets a paginated roles
 * @param {Object} query
 * @param {Number} query.page
 * @param {Number} query.limit
 * @param {String} query.keyword
 * @returns {Promise<Object>} Paginated roles
 */
const getAll = async (query) => {
  const page = query.page ? parseInt(query.page) : 1;
  const limit = query.limit ? parseInt(query.limit) : 10;
  const offset = (page - 1) * limit;
  const keyword = query.keyword ? query.keyword : "";
  const status = query.status ? query.status : "";
  const where = {};

  if (keyword) where.name = { [Op.iLike]: `%${keyword}%` };
  if (status) where.isActive = status;

  const { count, rows } = await roleRepo.findAndCountAll({
    where,
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

/**
 * Delete a role
 * @param {uuid} id
 * @returns {uuid} Deleted role id
 */
const remove = async (id) => {
  const role = await getById(id);
  const user = await db.users.findOne({ where: { roleId: id } });
  if (user) errorMsg("Role is assigned to a user", 400);
  
  await role.destroy();
  return id;
};

module.exports = {
  create,
  update,
  getById,
  getAll,
  remove,
};
