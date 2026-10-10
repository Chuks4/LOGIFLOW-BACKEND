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
    await queryInterface.createTable("refreshTokens", {
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
      token: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      expiresAt: {
        type: Sequelize.DATE,
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

    await queryInterface.addIndex("refreshTokens", ["token"], {
      unique: true,
      name: "refreshTokens_token_unique_idx",
    });

    await queryInterface.addIndex("refreshTokens", ["userId"], {
      name: "refreshTokens_userId_idx",
    });

    await queryInterface.addIndex("refreshTokens", ["expiresAt"], {
      name: "refreshTokens_expiresAt_idx",
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable("refreshTokens");
    await queryInterface.removeIndex(
      "refreshTokens",
      "refreshTokens_token_unique_idx",
    );
    await queryInterface.removeIndex(
      "refreshTokens",
      "refreshTokens_userId_idx",
    );
    await queryInterface.removeIndex(
      "refreshTokens",
      "refreshTokens_expiresAt_idx",
    );
  },
};
