const db = require("../models");
const base = require("./baseRespository");

const rolesRepo = base(db.roles);
module.exports =rolesRepo
