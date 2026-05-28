const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const ShippingAddress = sequelize.define('ShippingAddress', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  orderId: {
    type: DataTypes.UUID,
    allowNull: false,
    unique: true,
    field: 'order_id',
  },
  recipientName: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'recipient_name',
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  province: {
    type: DataTypes.STRING,
  },
  district: {
    type: DataTypes.STRING,
  },
  ward: {
    type: DataTypes.STRING,
  },
  detailAddress: {
    type: DataTypes.STRING,
    field: 'detail_address',
  }
}, {
  tableName: 'shipping_addresses',
  timestamps: false,
});

module.exports = ShippingAddress;
