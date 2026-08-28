module.exports = (DataTypes, sequelize) => {
  const WebhookEvent = sequelize.define(
    "webhookEvent",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      eventType: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      body: {
        type: DataTypes.JSONB,
        allowNull: false,
      },
      signature: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      reference: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      indexes: [
        {
          unique: true,
          fields: ["reference", "eventType"],
        },
      ],
    },
  );

  return WebhookEvent;
};
