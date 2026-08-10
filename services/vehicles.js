const vehicleRepo = require("../repositories/vehicles");
const { Op } = require("sequelize");
const db = require("../models");
const userRepo = require("../repositories/user");
const user = require("../repositories/user");

/**
 * Creates new vehicle
 * @param {Object} data
 * @param {String} data.plateNumber
 * @returns {Promise<Object>} New Vehicle Object
 */
const create = async (data) => {
  const { plateNumber } = data;
  const vehicle = await vehicleRepo.findByPlateNumber(plateNumber);
  if (vehicle) {
    const error = new Error("Vehicle with plate number already exists");
    error.status = 409;
    throw error;
  }

  return await vehicleRepo.create({ ...data, status: "Available" });
};

/**
 * Get all vehicles
 * @param {Object} query
 * @returns {Promise<Object>} Paginated Vehicles
 */
const getAll = async (query) => {
  const page = query.page ? parseInt(query.page) : 1;
  const limit = query.limit ? parseInt(query.limit) : 10;
  const offset = (page - 1) * limit;
  const keyword = query.keyword ? query.keyword : "";
  const status = query.status ? query.status : "";
  const where = {};

  if (keyword) {
    where[Op.or] = [
      { type: { [Op.iLike]: `%${keyword}%` } },
      { plateNumber: { [Op.iLike]: `%${keyword}%` } },
    ];
  }

  if (status) {
    where.status = status;
  }

  const { rows, count } = await vehicleRepo.findAndCountAll({
    where,
    include: [
      {
        model: db.users,
        as: "driver",
        attributes: ["id", "firstName", "lastName"],
      },
    ],
    limit,
    offset,
    order: [["createdAt", "DESC"]],
  });

  return {
    totalItems: count,
    totalPages: Math.ceil(count / limit),
    data: rows,
  };
};

/**
 * Get Vehicle by id
 * @param {UUID} id
 * @returns {Promise<Object>} Vehicle Object
 */
const getById = async (id) => {
  const vehicle = await vehicleRepo.findByPk(id);
  if (!vehicle) {
    const error = new Error("Vehicle not found");
    error.status = 404;
    throw error;
  }

  return vehicle;
};

/**
 * Update vehicle by id
 * @param {UUID} id
 * @param {Object} data
 * @returns {Promise<Object>} Updated Vehicle Object
 */
const update = async (id, data) => {
  const vehicle = await vehicleRepo.findByPk(id);
  if (!vehicle) {
    const error = new Error("Vehicle not found");
    error.status = 404;
    throw error;
  }

  await vehicleRepo.update(data, { where: { id } });
  return vehicleRepo.findByPk(id);
};

const assignDriver = async (id, driverId) => {
  const vehicle = await vehicleRepo.findByPk(id);
  const driver = await userRepo.findByPk(driverId, {
    include: { model: db.roles, as: "role", attributes: ["name"] },
  });

  if (!vehicle) {
    const error = new Error("Vehicle not found");
    error.status = 404;
    throw error;
  }

  if (vehicle.status !== "Available") {
    const error = new Error("Vehicle is not available");
    error.status = 400;
    throw error;
  }

  if (!user || user.role?.name !== "Driver") {
    const error = new Error("User is not a driver");
    error.status = 400;
    throw error;
  }

  await vehicleRepo.update({ driverId }, { where: { id } });
  return vehicleRepo.findByPk(id);
};

/**
 * Delete Vehicle by id
 * @param {UUID} id
 * @returns {UUID} Deleted vehicle id
 */
const deleteById = async (id) => {
  const vehicle = await vehicleRepo.findByPk(id);
  if (!vehicle) {
    const error = new Error("Vehicle not found");
    error.status = 404;
    throw error;
  }

  await vehicleRepo.destroy({ where: { id } });
  return id;
};

module.exports = {
  create,
  getAll,
  getById,
  update,
  assignDriver,
  deleteById,
};
