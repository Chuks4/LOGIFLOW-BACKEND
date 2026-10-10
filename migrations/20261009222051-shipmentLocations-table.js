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
    await queryInterface.createTable("shipmentLocations", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      longitude: {
        type: Sequelize.DECIMAL(11, 8),
        allowNull: false,
      },
      latitude: {
        type: Sequelize.DECIMAL(10, 8),
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
      speed: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      heading: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      driverId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      timestamp: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      accuracy: {
        type: Sequelize.FLOAT,
        allowNull: false,
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

    await queryInterface.addIndex(
      "shipmentLocations",
      ["shipmentId", "timestamp"],
      {
        name: "shipmentId_timestamp_idx",
      },
    );

    await queryInterface.addIndex(
      "shipmentLocations",
      ["driverId", "timestamp"],
      {
        name: "driverId_timestamp_idx",
      },
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable("shipmentLocations");
    await queryInterface.removeIndex(
      "shipmentLocations",
      "shipmentId_timestamp_idx",
    );
    await queryInterface.removeIndex(
      "shipmentLocations",
      "driverId_timestamp_idx",
    );
  },
};
