"use strict";
const { v4: uuidv4 } = require("uuid");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    await queryInterface.bulkInsert(
      "roles",
      [
        {
          id: uuidv4(),
          name: "customer",
          desc: "Customer Role",
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: uuidv4(),
          name: "driver",
          desc: "Driver Role",
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: uuidv4(),
          name: "dispatcher",
          desc: "Dispatcher Role",
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: uuidv4(),
          name: "super_admin",
          desc: "Super admin Role",
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {},
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("roles", null, {});
  },
};
