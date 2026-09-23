const vehicleRepo = require("../repositories/vehicles");
const { Op } = require("sequelize");
const db = require("../models");
const userRepo = require("../repositories/user");
const { errorMsg } = require("../utils/util");

/**
 * Creates new vehicle
 * @param {Object} data
 * @param {String} data.plateNumber
 * @returns {Promise<Object>} New Vehicle Object
 */
const create = async (data) => {
  const { plateNumber } = data;
  const vehicle = await vehicleRepo.findByPlateNumber(plateNumber);
  if (vehicle) errorMsg("Vehicle with plate number already exists", 409);

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
    distinct: true,
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
  const vehicle = await vehicleRepo.findById(id, {
    include: {
      model: db.users,
      as: "driver",
      attributes: ["id", "firstName", "lastName"],
    },
  });

  if (!vehicle) errorMsg("Vehicle not found", 404);
  return vehicle;
};

/**
 * Update vehicle by id
 * @param {UUID} id
 * @param {Object} data
 * @returns {Promise<Object>} Updated Vehicle Object
 */
const update = async (id, data) => {
  const vehicle = await getById(id);
  if (!vehicle) errorMsg("Vehicle not found", 404);

  await vehicle.update({ ...data });
  return await getById(id);
};

const assignDriver = async (id, driverId) => {
  const vehicle = await vehicleRepo.findById(id);
  const driver = await userRepo.findById(driverId, {
    include: { model: db.roles, as: "role", attributes: ["name"] },
  });

  if (!vehicle) errorMsg("Vehicle not found", 404);

  if (!driver) errorMsg("Driver not found", 404);

  if (vehicle.status !== "Available") errorMsg("Vehicle is not available");

  if (driver.role?.name !== "driver") errorMsg("User is not a driver");

  await vehicle.update({ driverId });
  return await getById(id);
};

/**
 * Delete Vehicle by id
 * @param {UUID} id
 * @returns {UUID} Deleted vehicle id
 */
const deleteById = async (id) => {
  const vehicle = await vehicleRepo.findById(id);
  if (!vehicle) errorMsg("Vehicle not found", 404);

  await vehicleRepo.delete({ where: { id } });
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
