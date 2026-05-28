const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Coupon = sequelize.define('Coupon', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  code: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  description: {
    type: DataTypes.TEXT,
  },
  discountType: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'discount_type',
    validate: {
      isIn: [['percent', 'fixed']],
    }
  },
  discountValue: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    field: 'discount_value',
  },
  minOrderValue: {
    type: DataTypes.DECIMAL(12, 2),
    defaultValue: 0,
    field: 'min_order_value',
  },
  maxDiscount: {
    type: DataTypes.DECIMAL(12, 2),
    field: 'max_discount',
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'start_date',
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'end_date',
  },
  usageLimit: {
    type: DataTypes.INTEGER,
    field: 'usage_limit',
  },
  usedCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'used_count',
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'is_active',
  }
}, {
  tableName: 'coupons',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false, // coupons only has created_at
});

module.exports = Coupon;
