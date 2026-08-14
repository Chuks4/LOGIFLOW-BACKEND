const { Op } = require("sequelize");
const shipmentRepository = require("../repositories/shipments");
const { generateTrackingNumber } = require("../utils/util");
const userRepository = require("../repositories/user");
const shipItemsRepository = require("../repositories/shipments_items");
const shipmentStatusHistoryRepo = require("../repositories/shipments_status_history");
const db = require("../models");

const STATUS_HISTORY_MAPPING = {
  Pending: {
    event: "Shipment created",
    note: "Shipment has been created and is pending pickup",
  },
  Assigned: {
    event: "Shipment assigned",
    note: "Shipment has been assigned to a driver",
  },
  "Picked Up": {
    event: "Shipment picked up",
    note: "Shipment has been picked up by the driver",
  },
  "In Transit": {
    event: "Shipment in transit",
    note: "Shipment is in transit",
  },
  Delivered: {
    event: "Shipment delivered",
    note: "Shipment has been delivered",
  },
  Cancelled: {
    event: "Shipment cancelled",
    note: "Shipment has been cancelled",
  },
  Returned: {
    event: "Shipment returned",
    note: "Shipment has been returned",
  },
};

const ALLOWED_TRANSITIONS = {
  Pending: ["Assigned", "Cancelled"],
  Assigned: ["Picked Up", "Cancelled"],
  "Picked Up": ["In Transit", "Cancelled", "Returned"],
  "In Transit": ["Delivered", "Cancelled", "Returned"],
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

  const { event, note } = STATUS_HISTORY_MAPPING[status];
  const record = await shipmentStatusHistoryRepo.findOne({
    where: { shipmentId, status },
    transaction,
  });

  if (record) {
    return await record.update({ event, note }, { transaction });
  } else {
    return await shipmentStatusHistoryRepo.create(
      {
        shipmentId,
        status,
        event,
        note,
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
    await recordStatusHistory(shipmentId, status, { updatedBy, transaction });
    return await shipItemsRepository.findById(shipmentId, { transaction });
  });
};

const assignDriverShipment = async (dispatcherId, shipmentId, driverId) => {
  return await db.sequelize.transaction(async (transaction) => {
    const driver = await userRepository.findById(driverId);
    if (!driver) {
      const error = new Error("Driver not found");
      error.status = 404;
      throw error;
    }

    const dispatcher = await userRepository.findById(dispatcherId, {
      include: { model: db.roles, as: "role", attributes: ["name"] },
    });
    if (!dispatcher) {
      const error = new Error("Dispatcher not found");
      error.status = 404;
      throw error;
    }

    const updatedBy = dispatcher.role?.name;
    const shipment = await shipmentRepository.findById(shipmentId);
    if (!shipment) {
      const error = new Error("Shipment not found");
      error.status = 404;
      throw error;
    }

    await shipment.update({ driverId, dispatcherId, status: "Assigned" });
    await recordStatusHistory(shipmentId, "Assigned", {
      updatedBy,
      transaction,
    });
    return await shipmentRepository.findById(shipmentId, { transaction });
  });
};

const create = async (data) => {
  return await db.sequelize.transaction(async (transaction) => {
    const {
      customerId,
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
    const shipment = shipmentRepository.create(
      { ...data, trackingNumber },
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
          model: db.shipments_items,
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

  const where = {}

  if (keyword) {
    where[Op.or] = [
      { trackingNumber: { [Op.like]: `%${keyword}%` } },
      { recipientName: { [Op.like]: `%${keyword}%` } },
    ];
  }

  if (dispatcherId) {
    where.dispatcherId = dispatcherId;
  } else if (driverId) {
    where.driverId = driverId;
  } else {
    where.customerId = customerId;
  }

  if (status) {
    where.status = status;
  }

  const { rows, count } = await shipmentRepository.findAndCountAll({
    where: { ...where },
    include: { model: db.shipments_items, as: "items", required: true },
    offset,
    limit,
    order: [["createdAt", "DESC"]],
  });

  return {
    totalItems: count,
    data: rows,
    totalPages: Math.ceil(count / limit),
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
        as: "items",
        required: true,
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
};
