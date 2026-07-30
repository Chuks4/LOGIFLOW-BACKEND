const db = require("../models");
const baseRepository = require("./baseRepository");

const base = baseRepository(db.users);
const findByEmail = async (email) => {
  return await base.findOne({ where: { email } });
};

module.exports = {
  ...base,
  findByEmail,
};
