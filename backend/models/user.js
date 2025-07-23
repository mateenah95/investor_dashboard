'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init(
    {
      id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
      },
      first_name: {
          type: DataTypes.STRING(32),
          allowNull: false
      },
      last_name: {
          type: DataTypes.STRING(32),
          allowNull: false
      },
      email: {
          type: DataTypes.STRING(64),
          allowNull: false,
          unique: true
      },
      password: {
          type: DataTypes.STRING(128),
          allowNull: false
      },
      dob: {
          type: DataTypes.DATEONLY,
          allowNull: false
      },
      department: {
          type: DataTypes.STRING(32),
          allowNull: false
      },
      hire_date: {
          type: DataTypes.DATEONLY,
          allowNull: false,
      },
      account_type: {
          type: DataTypes.ENUM('admin', 'user'),
          allowNull: false
      },
      created_at: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW
      },
      updated_at: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW
      }
    }, 
    {
      sequelize,
      modelName: 'User',
      timestamps: false, // Disable timestamps
    }
  );
  return User;
};