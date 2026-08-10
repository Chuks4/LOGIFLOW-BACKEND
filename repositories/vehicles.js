const baseRepo = require("./baseRespository");
const db = require("../models");

const repo = baseRepo(db.vehicles);
const findByPlateNumber = async (plateNumber) => {
  return await repo.findOne({ where: { plateNumber } });
};

module.exports = {
  ...repo,
  findByPlateNumber
};
