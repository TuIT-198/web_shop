const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const ProductCategory = sequelize.define('ProductCategory', {
  productId: {
    type: DataTypes.UUID,
    primaryKey: true,
    field: 'product_id',
  },
  categoryId: {
    type: DataTypes.UUID,
    primaryKey: true,
    field: 'category_id',
  }
}, {
  tableName: 'product_categories',
  timestamps: false,
});

module.exports = ProductCategory;
