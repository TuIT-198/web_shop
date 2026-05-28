const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Product = sequelize.define('Product', {
  _id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    field: 'id',
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  image: {
    type: DataTypes.TEXT,
    field: 'main_image',
  },
  imagesJson: {
    type: DataTypes.JSONB,
    defaultValue: [],
    field: 'images_json',
  },
  price: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
  },
  countInStock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: 'stock_quantity',
  },
  rating: {
    type: DataTypes.DECIMAL(3, 2),
    defaultValue: 5.0,
  },
  description: {
    type: DataTypes.TEXT,
  },
  discount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  selled: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'sold',
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'is_active',
  }
}, {
  tableName: 'products',
  timestamps: true,
  underscored: true,
});

module.exports = Product;
