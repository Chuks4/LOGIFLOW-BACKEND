module.exports = (DataTypes, sequelize) => {
  const Permissions = sequelize.define("permissions", {
    id: {
      type: DataTypes.UUID,
      DefaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    action: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    resource: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    desc: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });

  return Permissions;
};
