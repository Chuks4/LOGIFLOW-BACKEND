const { Sequelize, DataTypes } = require("sequelize");
const NODE_ENV = process.env.NODE_ENV || "development";
const dbConfig = require("../config/db.config")[NODE_ENV];

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    dialect: dbConfig.dialect || "postgres",
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
  console.log("Database was successfully connected: NODE_ENV = ", NODE_ENV);
  if (typeof dbConfig.password !== "string") {
    throw new Error("DB_PASSWORD must be a string!");
  }
} catch (error) {
  console.log("Error connecting to database ", error);
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
    console.log("Database & tables created!");
  })
  .catch((error) => {
    console.error("Error creating database tables:", error);
  });

module.exports = db;
