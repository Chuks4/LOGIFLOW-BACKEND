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
    await queryInterface.createTable("payments", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      shipmentId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "shipments",
          key: "id",
        },
      },
      amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      reference: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      paymentMethod: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM("pending", "completed", "failed", "refunded"),
        defaultValue: "pending",
        allowNull: false,
      },
      paidAt: {
        type: Sequelize.DATE,
      },
      metadata: {
        type: Sequelize.JSON,
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

    await queryInterface.addIndex("payments", ["userId"], {
      name: "payment_userId_idx",
    });

    await queryInterface.addIndex("payments", ["shipmentId"], {
      name: "payment_shipmentId_idx",
    });

    await queryInterface.addIndex("payments", ["reference"], {
      name: "payment_reference_idx",
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable("payments");
    await queryInterface.removeIndex("payments", "payment_userId_idx");
    await queryInterface.removeIndex("payments", "payment_shipmentId_idx");
    await queryInterface.removeIndex("payments", "payment_reference_idx");
  },
};
