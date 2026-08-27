const { Sequelize, DataTypes } = require("sequelize");
const NODE_ENV = process.env.NODE_ENV || "development";
const dbConfig = require("../config/db.config");
const { logger } = require("../logger/logger");

const sequelize = new Sequelize(
  dbConfig[NODE_ENV].database,
  dbConfig[NODE_ENV].username,
  dbConfig[NODE_ENV].password,
  {
    host: dbConfig[NODE_ENV].host,
    dialect: dbConfig[NODE_ENV].dialect || "postgres",
    logging: false,
    pool: {
      max: dbConfig.pool.max,
      min: dbConfig.pool.min,
      acquire: dbConfig.pool.acquire,
      idle: dbConfig.pool.idle,
    },
  },
);

// Confirms the database connection and logs the result
try {
  sequelize.authenticate();
  logger.info("Database was successfully connected ", {
    NODE_ENV,
  });
  if (typeof dbConfig[NODE_ENV].password !== "string") {
    throw new Error("DB_PASSWORD must be a string!");
  }
} catch (error) {
  logger.error("Error connecting to database ", { error: error.message });
}

const db = {};
db.sequelize = sequelize;
db.Sequelize = Sequelize;

//Models
db.roles = require("./roles")(DataTypes, sequelize);
db.users = require("./users")(DataTypes, sequelize);
db.refreshToken = require("./refreshToken")(DataTypes, sequelize);
db.shipments = require("./shipments")(DataTypes, sequelize);
db.shipment_items = require("./shipment_items")(DataTypes, sequelize);
db.shipmentStatusHistory = require("./shipment_status_history")(
  DataTypes,
  sequelize,
);
db.vehicles = require("./vehicles")(DataTypes, sequelize);
db.tokens = require("./tokens")(DataTypes, sequelize);
db.permissions = require("./permissions")(DataTypes, sequelize);
db.role_permission = require("./role_permissions")(DataTypes, sequelize);
db.payments = require("./payments")(DataTypes, sequelize);

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
  onDelete: "RESTRICT",
});
db.users.belongsTo(db.roles, {
  as: "role",
  foreignKey: "roleId",
  onDelete: "RESTRICT",
});

// User and Shipments
db.users.hasMany(db.shipments, {
  foreignKey: "customerId",
  as: "customerShipments",
});
db.users.hasMany(db.shipments, {
  foreignKey: "driverId",
  as: "driverShipments",
});
db.users.hasMany(db.shipments, {
  foreignKey: "dispatcherId",
  as: "dispatcherShipments",
});
db.shipments.belongsTo(db.users, {
  as: "customer",
  foreignKey: "customerId",
});
db.shipments.belongsTo(db.users, {
  as: "driver",
  foreignKey: "driverId",
});
db.shipments.belongsTo(db.users, {
  as: "dispatcher",
  foreignKey: "dispatcherId",
});

// Shipment and ShipmentItems
db.shipments.hasMany(db.shipment_items, {
  foreignKey: "shipmentId",
  as: "items",
});
db.shipment_items.belongsTo(db.shipments, {
  foreignKey: "shipmentId",
  as: "shipment",
});

// Shipment and ShipmentStatusHistory
db.shipments.hasMany(db.shipmentStatusHistory, {
  foreignKey: "shipmentId",
  as: "shipmentStatusHistory",
});
db.shipmentStatusHistory.belongsTo(db.shipments, {
  foreignKey: "shipmentId",
  as: "shipment",
});

// User and Vehicle
db.users.hasOne(db.vehicles, {
  foreignKey: "driverId",
  as: "vehicle",
});
db.vehicles.belongsTo(db.users, {
  foreignKey: "driverId",
  as: "driver",
});

// User and Tokens
db.users.hasMany(db.tokens, {
  foreignKey: "userId",
  as: "tokens",
});
db.tokens.belongsTo(db.users, {
  foreignKey: "userId",
  as: "user",
});

// Role and Permissions
db.roles.belongsToMany(db.permissions, {
  through: db.role_permission,
  foreignKey: "roleId",
  otherKey: "permissionId",
  as: "permissions",
});
db.permissions.belongsToMany(db.roles, {
  through: db.role_permission,
  foreignKey: "permissionId",
  otherKey: "roleId",
  as: "roles",
});

// User and Payment
db.users.hasMany(db.payments, {
  foreignKey: "userId",
  as: "payments",
});
db.payments.belongsTo(db.users, {
  foreignKey: "userId",
  as: "user",
});

// Shipment and Payment
db.shipments.hasMany(db.payments, {
  foreignKey: "shipmentId",
  as: "payments",
});
db.payments.belongsTo(db.shipments, {
  foreignKey: "shipmentId",
  as: "shipment",
});

// Sync the models with the database
sequelize
  .sync({ force: false })
  .then(() => {
    logger.info("Database synced successfully");
  })
  .catch((error) => {
    logger.error("Error syncing database tables:", { error: error.message });
  });

module.exports = db;
