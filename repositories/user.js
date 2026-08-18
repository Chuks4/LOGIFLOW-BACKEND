const db = require("../models");
const baseRepository = require("./baseRespository");

const base = baseRepository(db.users);
const findByEmail = async (email, role = null) => {
  return await base.findOne({
    where: { email },
    include: { model: db.roles, as: "role", attributes: ["id", "name"] },
  });
};

module.exports = {
  ...base,
  findByEmail,
};
