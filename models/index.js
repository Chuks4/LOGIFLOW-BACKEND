const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize();
const db = {};
db.sequelize = sequelize;
db.Sequelize = Sequelize;

//Models
db.roles = require("./roles")(DataTypes, sequelize);
db.users = require("./users")(DataTypes, sequelize);
db.refreshToken = require("./refreshToken")(DataTypes, sequelize);


// RelationShips
// User and RefreshToken
db.users.hasMany(db.refreshToken, {
  foreignKey: "userId",
  as: "refreshToken",
});
db.refreshToken.belongsTo(db.users, {
  foreignKey: "userId",
  as: "user",
});

// User and Role
db.roles.hasMany(db.users, {
  foreignKey: "roleId",
  as: "users",
});
db.users.belongsTo(db.roles, {
  as: "role",
  foreignKey: "roleId",
});

module.exports = db;
