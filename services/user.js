const userRepository = require("../repositories/user");
const { Op } = require("sequelize");
const db = require("../models");
const { deleteFile } = require("utils/util");

const getCustomers = async (query) => {
  const page = query.page ? parseInt(query.page) : 1;
  const limit = query.limit ? parseInt(query.limit) : 10;
  const search = query.search ? query.search : "";
  const offset = (page - 1) * limit;
  const filterByRoles = query.filterByRoles ? query.filterByRoles : "";
  const where = {};

  if (search) {
    where[Op.or] = [
      { firstName: { [Op.like]: `%${search}%` } },
      { lastName: { [Op.like]: `%${search}%` } },
    ];
  }

  const { rows, count } = await userRepository.findAndCountAll({
    where,
    include: {
      model: db.roles,
      where: {
        name: filterByRoles ? filterByRoles : { [Op.ne]: "super-admin" },
      },
      required: true,
      attributes: [],
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
  } = data;

  if (dob && !isUserAtLeastEighteen(dob)) {
    const error = new Error("User must be at least 18 years old");
    error.statusCode = 400;
    throw error;
  }

  const user = await userRepository.update(id, {
    url: file ? `api/uploads/${file?.path}` : user?.url,
    firstName: firstName || user?.firstName,
    lastName: lastName || user?.lastName,
    gender: gender || user?.gender,
    dob: dob || user?.dob,
    phoneNumber: phoneNumber || user?.phoneNumber,
    country: country || user?.country,
    state: state || user?.state,
    city: city || user?.city,
  });

  return userRepository.findById(id);
};

const updateUserStatus = async (id, status) => {
  const user = await userRepository.findById(id);
  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  const user = await userRepository.update(id, {
    status,
  });

  return userRepository.findById(id);
};