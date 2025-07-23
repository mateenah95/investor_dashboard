'use strict';
const {
  Model
} = require('sequelize');

const User = require('./user'); // Adjust the path as necessary

module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Transaction.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        ticker: {
            type: DataTypes.STRING(10),
            allowNull: false
        },
        type: {
            type: DataTypes.ENUM('stock', 'crypto'),
            allowNull: false
        },
        transaction_type: {
            type: DataTypes.ENUM('buy', 'sell'),
            allowNull: false
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: User,
                key: 'id'
            }
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
      modelName: 'Transaction',
      timestamps: false, // Disable timestamps
    }
  );
  return Transaction;
};