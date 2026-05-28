const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Payment = sequelize.define('Payment', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  orderId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'order_id',
  },
  amount: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
  },
  paymentMethod: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'payment_method',
  },
  transactionId: {
    type: DataTypes.STRING,
    field: 'transaction_id',
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'unpaid',
  },
  paidAt: {
    type: DataTypes.DATE,
    field: 'paid_at',
  }
}, {
  tableName: 'payments',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false, // payments table only has created_at, no updated_at
});

module.exports = Payment;
