const userRepository = require("../repositories/user");
const { Op } = require("sequelize");
const db = require("../models");
const { deleteFile, trimData } = require("../utils/util");

/**
 * Get customers
 * @param {Object} query
 * @returns {Promise<Array<Object>>} - Paginated result
 */
const getCustomers = async (query) => {
  const page = query.page ? parseInt(query.page) : 1;
  const limit = query.limit ? parseInt(query.limit) : 10;
  const search = query.search ? query.keyword : "";
  const offset = (page - 1) * limit;
  const filterByRoles = query.filterByRoles ? query.filterByRoles : "";
  const where = {};

  if (search) {
    where[Op.or] = [
      { firstName: { [Op.iLike]: `%${search}%` } },
      { lastName: { [Op.iLike]: `%${search}%` } },
    ];
  }

  const { rows, count } = await userRepository.findAndCountAll({
    where,
    include: {
      model: db.roles,
      as: "role",
      where: {
        name: filterByRoles ? filterByRoles : { [Op.ne]: "super_admin" },
      },
      required: true,
      attributes: ["name"],
    },
    offset,
    limit,
    order: [["createdAt", "DESC"]],
  });

  return {
    totalItems: count,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
    data: rows,
  };
};

/**
 * Get user by id
 * @param {UUID} id - user id
 * @returns {Promise<Object>} - User object
 */
const getUserById = async (id) => {
  if (!id) {
    const error = new Error("User id is required");
    error.statusCode = 400;
    throw error;
  }
  const user = await userRepository.findById(id);
  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }
  return user;
};

/**
 * Update user by id
 * @param {UUID} id - user id
 * @param {Object} data - user data
 * @param {file} file - file upload
 * @returns {Promise<Object>} - Updated user
 */
const updateUser = async (id, data, file) => {
  const user = await userRepository.findById(id);
  if (!user) {
    if (file) {
      deleteFile(file?.path);
    }
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  const {
    firstName,
    lastName,
    gender,
    dob,
    phoneNumber,
    country,
    state,
    city,
    address,
  } = trimData(data);

  if (dob && !isUserAtLeastEighteen(dob)) {
    const error = new Error("User must be at least 18 years old");
    error.statusCode = 400;
    throw error;
  }

  await userRepository.update(id, {
    url: file ? `api/uploads/${file?.path}` : user?.url,
    firstName: firstName || user?.firstName,
    lastName: lastName || user?.lastName,
    gender: gender || user?.gender,
    dob: dob || user?.dob,
    phoneNumber: phoneNumber || user?.phoneNumber,
    country: country || user?.country,
    state: state || user?.state,
    city: city || user?.city,
    address: address || user?.address,
  });

  return userRepository.findById(id);
};

/**
 * Update user status by id
 * @param {UUID} id - user id
 * @param {String} status - user status
 * @returns {Promise<Object>} - Updated user
 */
const updateUserStatus = async (id, status) => {
  const user = await userRepository.findById(id);
  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  await userRepository.update(id, {
    status,
  });

  return userRepository.findById(id);
};

module.exports = {
  getCustomers,
  getUserById,
  updateUser,
  updateUserStatus,
};
