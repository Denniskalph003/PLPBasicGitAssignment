// models/Expense.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Expense = sequelize.define('Expense', {
  expense_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  date: { type: DataTypes.DATE, allowNull: false },
  description: { type: DataTypes.TEXT },
});

module.exports = Expense;
