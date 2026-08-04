module.exports = (DataTypes, sequelize) => {
  const refreshToken = sequelize.define(
    "refreshToken",
    {
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: "users", key: "id" },
      },
      tokenHash: { type: DataTypes.STRING, allowNull: false, unique: true },
      jti: { type: DataTypes.STRING, allowNull: false },
      expiresAt: { type: DataTypes.DATE, allowNull: false },
      revokedAt: { type: DataTypes.DATE, allowNull: true },
      replacedBy: { type: DataTypes.STRING, allowNull: true }, // new jti when rotated
      createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
      ip: { type: DataTypes.STRING, allowNull: true },
      userAgent: { type: DataTypes.STRING, allowNull: true },
    },
    {
      indexes: [
        {
          unique: true,
          fields: ["tokenHash"],
        },
        {
          fields: ["userId"],
        },
        {
          fields: ["expiresAt"],
        },
      ],
    },
  );

  return refreshToken;
};
