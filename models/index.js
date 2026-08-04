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
