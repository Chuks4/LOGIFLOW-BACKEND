module.exports = (DataTypes, sequelize) => {
  const Payment = sequelize.define(
    "payment",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      shipmentId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "shipments",
          key: "id",
        },
      },
      amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      reference: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      paymentMethod: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("pending", "completed", "failed", "refunded"),
        defaultValue: "pending",
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
      paidAt: {
        type: DataTypes.DATE,
      },
    },
    {
      indexes: [
        {
          fields: ["userId"],
        },
        {
          fields: ["shipmentId"],
        },
      ],
    },
  );

  return Payment
};
