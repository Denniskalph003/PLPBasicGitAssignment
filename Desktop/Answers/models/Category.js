// models/Category.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Category = sequelize.define('Category', {
  category_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  category_name: { type: DataTypes.STRING, allowNull: false },
});

module.exports = Category;
