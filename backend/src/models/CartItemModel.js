const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const CartItem = sequelize.define('CartItem', {
  cartId: {
    type: DataTypes.UUID,
    primaryKey: true,
    field: 'cart_id',
  },
  productId: {
    type: DataTypes.UUID,
    primaryKey: true,
    field: 'product_id',
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  unitPrice: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    field: 'unit_price',
  }
}, {
  tableName: 'cart_items',
  timestamps: false,
});

module.exports = CartItem;
