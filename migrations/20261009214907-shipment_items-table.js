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
    await queryInterface.createTable("shipment_items", {
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
      itemName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      weight: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      length: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      width: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      height: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      declaredValue: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      category: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      isFragile: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      color: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      specialInstructions: {
        type: Sequelize.TEXT,
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
    await queryInterface.dropTable("shipment_items");
  },
};
