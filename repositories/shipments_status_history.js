const db = require("../models");
const base = require("./baseRespository");
const repo = base(db.shipmentStatusHistory);

module.exports = {
  ...repo,
};
