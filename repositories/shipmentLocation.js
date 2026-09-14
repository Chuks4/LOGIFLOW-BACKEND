const db = require("../models");
const baseRepo = require("./baseRespository");

const repo = baseRepo(db.shipmentLocations);
module.exports = repo;
