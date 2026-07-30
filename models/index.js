const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize();
const db = {};
db.sequelize = sequelize;
db.Sequelize = Sequelize;

//Models
db.users = require("./users")(DataTypes, sequelize);
db.refreshToken = require("./refreshToken")(DataTypes, sequelize);

// RelationShips
db.users.hasMany(db.refreshToken, {
  foreignKey: "userId",
  as: "refreshToken",
});
db.refreshToken.belongsTo(db.users, {
  foreignKey: "userId",
  as: "user",
});

module.exports = db;
