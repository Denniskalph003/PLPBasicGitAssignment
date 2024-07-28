// models/PaymentMethod.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PaymentMethod = sequelize.define('PaymentMethod', {
  payment_method_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  payment_method_name: { type: DataTypes.STRING, allowNull: false },
});

module.exports = PaymentMethod;
