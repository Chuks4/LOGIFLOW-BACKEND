const db = require("../models");
const baseRepo = require("./baseRespository");

const refresh = baseRepo(db.refreshToken);

module.exports = refresh;
