const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Order = sequelize.define('Order', {
  _id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    field: 'id',
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'user_id',
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'pending',
  },
  totalPrice: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    field: 'total_amount',
  },
  paymentMethod: {
    type: DataTypes.STRING,
    field: 'payment_method',
  },
  paymentStatus: {
    type: DataTypes.STRING,
    defaultValue: 'unpaid',
    field: 'payment_status',
  },
  shippingMethod: {
    type: DataTypes.STRING,
    field: 'shipping_method',
  },
  shippingPrice: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
    field: 'shipping_fee',
  },
  couponCode: {
    type: DataTypes.STRING,
    field: 'coupon_code',
  },
  discountAmount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
    field: 'discount_amount',
  },
  note: {
    type: DataTypes.TEXT,
  },
  orderDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'order_date',
  },
  paidAt: {
    type: DataTypes.DATE,
    field: 'paid_at',
  },
  shippedAt: {
    type: DataTypes.DATE,
    field: 'shipped_at',
  },
  deliveredAt: {
    type: DataTypes.DATE,
    field: 'delivered_at',
  }
}, {
  tableName: 'orders',
  timestamps: true,
  underscored: true,
});

module.exports = Order;
