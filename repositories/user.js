const db = require("../models");
const baseRepository = require("./baseRespository");

const base = baseRepository(db.users);
base.findByEmail = async (email) => {
  return await base.findOne({
    where: { email },
    include: { model: db.roles, as: "role", attributes: ["id", "name"] },
  });
};

module.exports = base
