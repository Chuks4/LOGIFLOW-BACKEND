const db = require("../models");
const baseRespository = require("./baseRespository");

const roles = baseRespository(db.roles);

module.exports = roles
