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
    await queryInterface.createTable("shipments", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      trackingNumber: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      customerId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      driverId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "users",
          key: "id",
        },
      },
      dispatcherId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "users",
          key: "id",
        },
      },
      pickupAddress: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      deliveryAddress: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      pickupLatitude: {
        type: Sequelize.DECIMAL(10, 8),
        allowNull: false,
      },
      pickupLongitude: {
        type: Sequelize.DECIMAL(11, 8),
        allowNull: false,
      },
      deliveryLatitude: {
        type: Sequelize.DECIMAL(10, 8),
        allowNull: false,
      },
      deliveryLongitude: {
        type: Sequelize.DECIMAL(11, 8),
        allowNull: false,
      },
      weight: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      dimensions: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      shipmentType: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      estimatedCost: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM(
          "Pending",
          "Assigned",
          "Picked Up",
          "In Transit",
          "Delivered",
          "Returned",
          "Cancelled",
          "Confirmed",
        ),
        defaultValue: "Pending",
        allowNull: false,
      },
      note: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      recipientName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      recipientPhone: {
        type: Sequelize.STRING,
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
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable("shipments");
  },
};
