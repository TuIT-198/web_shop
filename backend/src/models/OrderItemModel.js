const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const OrderItem = sequelize.define('OrderItem', {
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
  productId: {
    type: DataTypes.UUID,
    allowNull: false,
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
  },
  discount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  totalPrice: {
    type: DataTypes.DECIMAL(12, 2),
    field: 'total_price',
    set() {
      // Cột này được tự động tính toán bởi PostgreSQL (GENERATED ALWAYS AS)
      // Không cho phép gán giá trị từ Sequelize để tránh lỗi ghi vào DB
    }
  }
}, {
  tableName: 'order_items',
  timestamps: false,
});

module.exports = OrderItem;
