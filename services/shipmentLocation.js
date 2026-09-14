const ShipmentLocationRepo = require("../repositories/shipmentLocation");
const shipmentRepo = require("../repositories/shipments");
const { trimData } = require("../utils/util");
const driverRepo = require("../repositories/user");
const { can } = require("../services/rbac");

const ALLOWEDSTATUSES = ["Picked Up", "In Transit", "Assigned"];

/**
 * Create a shipment location
 * @param {Object} data
 * @param {String} data.shipmentId
 * @param {String} data.latitude
 * @param {String} data.longitude
 * @param {String} data.timestamp
 * @param {String} data.driverId
 * @param {String} data.speed
 * @param {String} data.heading
 * @param {String} data.accuracy
 * @returns {Promise<Object>} Created shipment location object
 */
const createShipmentLocation = async (data) => {
  const {
    shipmentId,
    latitude,
    longitude,
    timestamp,
    driverId,
    speed,
    heading,
    accuracy,
  } = trimData(data);

  if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
    const error = new Error("Invalid coordinates");
    error.status = 400;
    throw error;
  }

  const shipment = await shipmentRepo.findById(shipmentId);
  if (!shipment) {
    const error = new Error("Shipment not found");
    error.status = 404;
    throw error;
  }

  const driver = await driverRepo.findById(driverId);
  if (!driver) {
    const error = new Error("Driver not found");
    error.status = 404;
    throw error;
  }

  if (!ALLOWEDSTATUSES.includes(shipment.status)) {
    const error = new Error("Shipment is not in transit");
    error.status = 400;
    throw error;
  }

  if (shipment.driverId !== driverId) {
    const error = new Error("Driver is not assigned to this shipment");
    error.status = 400;
    throw error;
  }

  const shipmentLocation = await ShipmentLocationRepo.create({
    shipmentId,
    latitude,
    longitude,
    timestamp,
    driverId,
    speed,
    heading,
    accuracy,
  });

  return shipmentLocation;
};

const canViewShipmentLocation = async (user, shipmentId) => {
  const { roleId, id } = user;
  const shipment = await shipmentRepo.findById(shipmentId);
  if (!shipment) {
    const error = new Error("Shipment not found");
    error.status = 404;
    throw error;
  }

  const role = await roleRepo.findById(roleId);
  if (!role) {
    const error = new Error("Role not found");
    error.status = 404;
    throw error;
  }

  if (!ALLOWEDSTATUSES.includes(shipment.status)) {
    const error = new Error("Shipment is not in transit");
    error.status = 400;
    throw error;
  }

  const resource = "shipment";
  const action = "view";

  const allowed = await can(roleId, resource, action);
  if (!allowed) {
    const error = new Error("You are not authorized to perform this action");
    error.status = 403;
    throw error;
  }

  if (shipment.customerId !== id) {
    const error = new Error("You are not authorized to view this shipment");
    error.status = 403;
    throw error;
  }

  return true;
};

const canUpdateShipmentLocation = async (user, shipmentId) => {
  const { roleId, id } = user;
  const shipment = await shipmentRepo.findById(shipmentId);
  if (!shipment) {
    const error = new Error("Shipment not found");
    error.status = 404;
    throw error;
  }

  const role = await roleRepo.findById(roleId);
  if (!role) {
    const error = new Error("Role not found");
    error.status = 404;
    throw error;
  }

  const resource = "shipment";
  const action = "update";

  if (!ALLOWEDSTATUSES.includes(shipment.status)) {
    const error = new Error("Shipment is not in transit");
    error.status = 400;
    throw error;
  }

  const allowed = await can(roleId, resource, action);
  if (!allowed) {
    return res
      .status(403)
      .json({ message: "You are not authorized to perform this action" });
  }

  if (shipment.driverId !== id) {
    const error = new Error("You are not authorized to update this shipment");
    error.status = 403;
    throw error;
  }

  return true;
};

module.exports = {
  createShipmentLocation,
  canViewShipmentLocation,
  canUpdateShipmentLocation,
};
