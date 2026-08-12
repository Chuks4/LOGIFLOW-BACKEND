module.exports = (DataTypes, sequelize) => {
  const ShipmentStatusHistory = sequelize.define("shipmentStatusHistory", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    shipmentId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "shipments",
        key: "id",
      },
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
      ),
      defaultValue: "Pending",
      allowNull: false,
    },
    updatedBy: {
      type: DataTypes.ENUM(
        "customer",
        "driver",
        "system",
        "superAdmin",
        "dispatcher",
      ),
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
    event: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    notes: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });

  return ShipmentStatusHistory;
};
