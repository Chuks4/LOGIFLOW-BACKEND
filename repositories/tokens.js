const db = require("../models");
const baseRepository = require("./baseRespository");

const base = baseRepository(db.tokens);
module.exports = base;
