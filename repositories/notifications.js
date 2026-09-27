const db = require("../models");
const baseRepo = require("./baseRespository")

const repo = baseRepo(db.notifications)
module.exports = repo