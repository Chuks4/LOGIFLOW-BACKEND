module.exports = (DataTypes, sequelize) => {
  const Shipment = sequelize.define("shipment", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    trackingNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    customerId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    driverId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "users",
        key: "id",
      },
    },
    dispatcherId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "users",
        key: "id",
      },
    },
    pickupAddress: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    deliveryAddress: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    pickupLatitude: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: false,
    },
    pickupLongitude: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: false,
    },
    deliveryLatitude: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: false,
    },
    deliveryLongitude: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: false,
    },
    weight: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    dimensions: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    shipmentType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    estimatedCost: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(
        "Pending",
        "Assigned",
        "Picked Up",
        "In Transit",
        "Delivered",
        "Returned",
        "Cancelled",
        "Confirmed"
      ),
      defaultValue: "Pending",
      allowNull: false,
    },
    note: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    recipientName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    recipientPhone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  });

  return Shipment;
};
