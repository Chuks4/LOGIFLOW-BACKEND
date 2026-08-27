const db = require("../models")
const baseRepo = require("./baseRespository")

const repo = baseRepo(db.payments)
module.exports = repo