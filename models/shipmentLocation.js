module.exports = (DataTypes, sequelize) => {
  const ShipmentLocation = sequelize.define(
    "shipmentLocation",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      longitude: {
        type: DataTypes.DECIMAL(11, 8),
        allowNull: false,
      },
      latitude: {
        type: DataTypes.DECIMAL(10, 8),
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
      speed: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      heading: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      driverId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      timestamp: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      accuracy: {
        type: DataTypes.FLOAT,
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
    },
    {
      indexes: [
        {
          fields: ["shipmentId", "timestamp"],
        },
        {
          fields: ["driverId", "timestamp"],
        },
      ],
    },
  );

  return ShipmentLocation;
};
