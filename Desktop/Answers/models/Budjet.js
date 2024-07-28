// models/Budget.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Budget = sequelize.define('Budget', {
  budget_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  start_date: { type: DataTypes.DATE, allowNull: false },
  end_date: { type: DataTypes.DATE, allowNull: false },
});

module.exports = Budget;
