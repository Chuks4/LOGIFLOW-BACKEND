const roleRepo = require("../repositories/role");

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
  if (role) {
    const error = new Error("Role already exists");
    error.status = 409;
    throw error;
  }
  return roleRepo.create({ name, desc });
};

/**
 * Update a role
 * @param {uuid} id
 * @param {Object} data
 * @returns {Promise<Object>} Updated role object
 */
const update = async (id, data) => {
  const { name, desc } = data;
  const role = await getById(id);
  role.update({ name, desc });
  return getById(id);
};

/**
 * Get a role by id
 * @param {uuid} id
 * @returns {Promise<Object>} Role object
 */
const getById = async (id) => {
  const role = await roleRepo.findOne({ where: { id } });
  if (!role) {
    const error = new Error("Role not found");
    error.status = 404;
    throw error;
  }
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
  if (status) where.status = status;

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
