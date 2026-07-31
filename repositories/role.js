const db = require("../models");
const baseRepo = require("./baseRespository");

const roles = baseRepo(db.roles);

module.exports = { ...roles };
