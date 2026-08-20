const db = require("../models");
const base = require("./baseRespository");

const rolesPermRepo = base(db.role_permission);
module.exports = rolesPermRepo;
