const db = require("../models");
const base = require("./baseRespository");

const repo = base(db.shipments);
module.exports = repo
