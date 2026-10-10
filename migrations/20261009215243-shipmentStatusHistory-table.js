"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable("shipmentStatusHistories", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      shipmentId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "shipments",
          key: "id",
        },
      },
      status: {
        type: Sequelize.ENUM(
          "Pending",
          "Confirmed",
          "Assigned",
          "Picked Up",
          "In Transit",
          "Delivered",
          "Returned",
          "Cancelled",
        ),
        defaultValue: "Pending",
        allowNull: false,
      },
      updatedBy: {
        type: Sequelize.ENUM(
          "customer",
          "driver",
          "system",
          "superAdmin",
          "dispatcher",
        ),
        allowNull: false,
      },
      event: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      notes: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable("shipmentStatusHistories");
  },
};
