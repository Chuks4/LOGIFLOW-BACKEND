const db = require("../models");
const base = require("./baseRespository");
const repo = base(db.shipment_items);

module.exports = repo
