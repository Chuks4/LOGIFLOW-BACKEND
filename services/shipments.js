const { Op } = require("sequelize");
const shipmentRepository = require("../repositories/shipments");
const { generateTrackingNumber } = require("../utils/util");
const userRepository = require("../repositories/user");
const shipItemsRepository = require("../repositories/shipments_items");
const shipmentStatusHistoryRepo = require("../repositories/shipments_status_history");
const db = require("../models");
const { enqueueShipmentUpdateEmail } = require("../queues/email");
const shipmentUpdateMail = require("../utils/emailTemplates/shipmentUpdateMail");

const STATUS_HISTORY_MAPPING = {
  Pending: {
    event: "Shipment Created",
    notes: "Shipment has been created and is pending pickup",
  },
  Confirmed: {
    event: "Shipment Confirmed",
    notes: "Shipment has been confirmed and is ready to be assigned",
  },
  Assigned: {
    event: "Shipment Assigned",
    notes: "Shipment has been assigned to a driver",
  },
  "Picked Up": {
    event: "Shipment Picked up",
    notes: "Shipment has been picked up by the driver",
  },
  "In Transit": {
    event: "Shipment in Transit",
    notes: "Shipment is in transit",
  },
  Delivered: {
    event: "Shipment delivered",
    notes: "Shipment has been delivered",
  },
  Cancelled: {
    event: "Shipment cancelled",
    notes: "Shipment has been cancelled",
  },
  Returned: {
    event: "Shipment returned",
    notes: "Shipment has been returned",
  },
};

const ALLOWED_TRANSITIONS = {
  Pending: ["Confirmed", "Cancelled"],
  Confirmed: ["Assigned", "Cancelled"],
  Assigned: ["Picked Up"],
  "Picked Up": ["In Transit", "Returned"],
  "In Transit": ["Delivered", "Returned"],
  Delivered: [],
  Cancelled: [],
  Returned: [],
};

const recordStatusHistory = async (shipmentId, status, options = {}) => {
  const { updatedBy, transaction } = options;
  const shipment = await shipmentRepository.findById(shipmentId, {
    transaction,
  });

  if (!shipment) {
    const error = new Error("Shipment not found");
    error.status = 404;
    throw error;
  }

  const { event, notes } = STATUS_HISTORY_MAPPING[status];
  const record = await shipmentStatusHistoryRepo.findOne({
    where: { shipmentId, status },
    transaction,
  });

  if (record) {
    return await record.update({ event, notes }, { transaction });
  } else {
    return await shipmentStatusHistoryRepo.create(
      {
        shipmentId,
        status,
        event,
        notes,
        updatedBy,
      },
      { transaction },
    );
  }
};

const updateStatus = async (userId, shipmentId, status) => {
  return await db.sequelize.transaction(async (transaction) => {
    const shipment = await shipmentRepository.findById(shipmentId);
    if (!shipment) {
      const error = new Error("Shipment not found");
      error.status = 404;
      throw error;
    }

    const user = await userRepository.findById(userId, {
      include: { model: db.roles, as: "role", attributes: ["name"] },
      transaction,
    });
    if (!user) {
      const error = new Error("User not found");
      error.status = 404;
      throw error;
    }

    if (!STATUS_HISTORY_MAPPING[status]) {
      const error = new Error("Invalid status");
    }

    if (!ALLOWED_TRANSITIONS[shipment.status].includes(status)) {
      const error = new Error("Invalid status transition");
      error.status = 400;
      throw error;
    }

    const updatedBy = user.role?.name;
    await shipment.update({ status }, { transaction });
    const history = await recordStatusHistory(shipmentId, status, {
      updatedBy,
      transaction,
    });

    const customer = await userRepository.findById(shipment.customerId, {
      transaction,
    });
    if (customer?.email) {
      await enqueueShipmentUpdateEmail({
        to: customer.email,
        subject: `Shipment ${shipment.trackingNumber} update`,
        html: shipmentUpdateMail({
          trackingNumber: shipment.trackingNumber,
          status,
          event: history.event,
          notes: history.notes,
          updatedAt: new Date().toISOString(),
          shipmentId: shipment.id,
        }),
      });
    }
    return await shipItemsRepository.findById(shipmentId, { transaction });
  });
};

const assignDriverShipment = async (dispatcherId, shipmentId, driverId) => {
  return await db.sequelize.transaction(async (transaction) => {
    const driver = await userRepository.findById(driverId, { transaction });
    if (!driver) {
      const error = new Error("Driver not found");
      error.status = 404;
      throw error;
    }

    const dispatcher = await userRepository.findById(dispatcherId, {
      include: { model: db.roles, as: "role", attributes: ["name"] },
      transaction,
    });
    if (!dispatcher) {
      const error = new Error("Dispatcher not found");
      error.status = 404;
      throw error;
    }

    const updatedBy = dispatcher.role?.name;
    const shipment = await shipmentRepository.findById(shipmentId, {
      transaction,
    });
    if (!shipment) {
      const error = new Error("Shipment not found");
      error.status = 404;
      throw error;
    }

    await shipment.update(
      { driverId, dispatcherId, status: "Assigned" },
      { transaction },
    );
    const history = await recordStatusHistory(shipmentId, "Assigned", {
      updatedBy,
      transaction,
    });
    const customer = await userRepository.findById(shipment.customerId, {
      transaction,
    });
    if (customer?.email) {
      await enqueueShipmentUpdateEmail({
        to: customer.email,
        subject: `Shipment ${shipment.trackingNumber} update`,
        html: shipmentUpdateMail({
          trackingNumber: shipment.trackingNumber,
          status: "Assigned",
          event: history.event,
          notes: history.notes,
          updatedAt: new Date().toISOString(),
          shipmentId: shipment.id,
        }),
      });
    }
    return await shipmentRepository.findById(shipmentId, { transaction });
  });
};

const create = async (data, customerId) => {
  return await db.sequelize.transaction(async (transaction) => {
    const {
      pickupAddress,
      deliveryAddress,
      pickupLatitude,
      pickupLongitude,
      deliveryLatitude,
      deliveryLongitude,
      items = [],
    } = data;

    const customer = await userRepository.findById(customerId, { transaction });
    if (!customer) {
      const error = new Error("Customer not found");
      error.status = 404;
      throw error;
    }

    if (!Array.isArray(items)) {
      const error = new Error("Items must be an array");
      error.status = 400;
      throw error;
    }

    if (items.length === 0) {
      const error = new Error("At least one item must be provided");
      error.status = 400;
      throw error;
    }

    if (
      pickupLatitude < -90 ||
      pickupLatitude > 90 ||
      pickupLongitude < -180 ||
      pickupLongitude > 180 ||
      deliveryLatitude < -90 ||
      deliveryLatitude > 90 ||
      deliveryLongitude < -180 ||
      deliveryLongitude > 180
    ) {
      const error = new Error("Invalid coordinates");
      error.status = 400;
      throw error;
    }

    if (pickupAddress === deliveryAddress) {
      const error = new Error(
        "Pickup and delivery addresses cannot be the same",
      );
      error.status = 400;
      throw error;
    }

    const trackingNumber = generateTrackingNumber();
    const shipment = await shipmentRepository.create(
      { ...data, trackingNumber, customerId },
      { transaction },
    );
    await recordStatusHistory(shipment.id, "Pending", {
      updatedBy: "system",
      transaction,
    });

    //   Create a shipment_item entry for every item
    for (const item of items) {
      const data = {
        shipmentId: shipment.id,
        itemName: item.itemName,
        quantity: item.quantity || 1,
        weight: item.weight || 1,
        length: item.length || 1,
        width: item.width || 1,
        height: item.height || 1,
        declaredValue: item.declaredValue || 0,
        category: item.category || null,
        isFragile: item.isFragile || false,
        color: item.color || null,
        specialInstructions: item.specialInstructions || null,
      };

      await shipItemsRepository.create(data, { transaction });
    }

    return await shipmentRepository.findById(shipment.id, {
      include: [
        {
          model: db.shipment_items,
          as: "items",
          required: true,
        },
      ],
      transaction,
    });
  });
};

const getAll = async (query) => {
  const page = query.page ? parseInt(query.page) : 1;
  const limit = query.limit ? parseInt(query.limit) : 10;
  const offset = (page - 1) * limit;
  const keyword = query.keyword ? query.keyword : "";
  const status = query.status ? query.status : "";
  const customerId = query.customerId ? query.customerId : "";
  const driverId = query.driverId ? query.driverId : "";
  const dispatcherId = query.dispatcherId ? query.dispatcherId : "";

  const where = {};

  if (keyword) {
    where[Op.or] = [
      { trackingNumber: { [Op.iLike]: `%${keyword}%` } },
      { recipientName: { [Op.iLike]: `%${keyword}%` } },
    ];
  }

  if (dispatcherId) {
    where.dispatcherId = dispatcherId;
  } else if (driverId) {
    where.driverId = driverId;
  } else if (customerId) {
    where.customerId = customerId;
  }

  if (status) {
    where.status = status;
  }

  const { rows, count } = await shipmentRepository.findAndCountAll({
    where: { ...where },
    include: { model: db.shipment_items, as: "items", required: true },
    offset,
    limit,
    order: [["createdAt", "DESC"]],
  });

  return {
    totalItems: count,
    totalPages: Math.ceil(count / limit),
    data: rows,
  };
};

const getById = async (shipmentId) => {
  if (!shipmentId) {
    const error = new Error("Shipment id is required");
    error.status = 400;
    throw error;
  }

  const shipment = await shipmentRepository.findById(shipmentId, {
    include: [
      {
        model: db.shipmentStatusHistory,
        as: "shipmentStatusHistory",
        required: true,
        attributes: ["id", "createdAt", "event", "notes", "status"],
      },
    ],
  });

  if (!shipment) {
    const error = new Error("Shipment not found");
    error.status = 404;
    throw error;
  }

  return shipment;
};

module.exports = {
  assignDriverShipment,
  create,
  getAll,
  getById,
  updateStatus,
  recordStatusHistory,
};
