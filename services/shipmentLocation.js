const ShipmentLocationRepo = require("../repositories/shipmentLocation");
const shipmentRepo = require("../repositories/shipments");
const { trimData } = require("../utils/util");
const driverRepo = require("../repositories/user");
const { can } = require("../services/rbac");
const db = require("../models");
const { errorMsg } = require("../utils/util");

const ALLOWED_STATUSES = ["Picked Up", "In Transit", "Assigned"];
const RESOURCE = "shipments";
const ACTION = "track";

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
    errorMsg("Invalid coordinates");
  }

  const shipment = await shipmentRepo.findById(shipmentId);
  if (!shipment) errorMsg("Shipment not found", 404);

  const driver = await driverRepo.findById(driverId);
  if (!driver) errorMsg("Driver not found", 404);

  if (!ALLOWED_STATUSES.includes(shipment.status)) {
    errorMsg("Shipment is not in transit", 400);
  }

  if (shipment.driverId !== driverId)
    errorMsg("Driver is not assigned to this shipment");

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
  if (!shipment) errorMsg("Shipment not found", 404);

  const role = await db.roles.findByPk(roleId);
  if (!role) errorMsg("Role not found", 404);

  if (!ALLOWED_STATUSES.includes(shipment.status)) {
    errorMsg("Shipment is not in transit");
  }

  const allowed = await can(roleId, RESOURCE, ACTION);
  if (!allowed) {
    errorMsg("You are not authorized to perform this action", 403);
  }

  if (shipment.customerId !== id) {
    errorMsg("You are not authorized to view this shipment", 403);
  }

  return true;
};

const canUpdateShipmentLocation = async (user, shipmentId) => {
  const { roleId, id } = user;
  const shipment = await shipmentRepo.findById(shipmentId);
  if (!shipment) errorMsg("Shipment not found", 404);

  const role = await db.roles.findByPk(roleId);
  if (!role) errorMsg("Role not found", 404);

  if (!ALLOWED_STATUSES.includes(shipment.status)) {
    errorMsg("Shipment is not in transit");
  }

  const allowed = await can(roleId, RESOURCE, ACTION);
  if (!allowed) errorMsg("You are not authorized to perform this action", 403);

  if (shipment.driverId !== id)
    errorMsg("You are not authorized to update this shipment", 403);

  return true;
};

module.exports = {
  createShipmentLocation,
  canViewShipmentLocation,
  canUpdateShipmentLocation,
};
