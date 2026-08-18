const db = require("../models");
const base = require("./baseRespository");

const permsRepo = base(db.permissions);
module.exports = {
  ...permsRepo,
};
