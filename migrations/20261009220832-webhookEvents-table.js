'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface("webhookEvents", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      eventType: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      body: {
        type: Sequelize.JSONB,
        allowNull: false,
      },
      signature: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      reference: {
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
    })

    await queryInterface.addIndex("webhookEvents", ["reference", "eventType"], {
      unique: true,
      name: "webhookEvents_reference_eventType_unique",
    })
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeIndex("webhookEvents", "webhookEvents_reference_eventType_unique")
    await queryInterface.dropTable("webhookEvents")
  }
};
