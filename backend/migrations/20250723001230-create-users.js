'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      first_name: {
        type: Sequelize.STRING(32),
        allowNull: false
      },
      last_name: {
        type: Sequelize.STRING(32),
        allowNull: false
      },
      email: {
        type: Sequelize.STRING(64),
        allowNull: false,
        unique: true
      },
      password: {
        type: Sequelize.STRING(128),
        allowNull: false
      },
      dob: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      department: {
        type: Sequelize.STRING(32),
        allowNull: false
      },
      hire_date: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      account_type: {
        type: Sequelize.ENUM('admin', 'user'),
        allowNull: false
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  }
};