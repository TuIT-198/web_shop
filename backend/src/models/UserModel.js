const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
  _id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    field: 'id',
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'full_name',
  },
  username: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isAdmin: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false,
    field: 'is_admin',
  },
  phone: {
    type: DataTypes.STRING,
  },
  address: {
    type: DataTypes.STRING,
  },
  avatar: {
    type: DataTypes.TEXT,
  },
  city: {
    type: DataTypes.STRING,
  },
  refreshToken: {
    type: DataTypes.TEXT,
    field: 'refresh_token',
  },
  otpCode: {
    type: DataTypes.STRING,
    field: 'otp_code',
  },
  otpExpiry: {
    type: DataTypes.DATE,
    field: 'otp_expiry',
  }
}, {
  tableName: 'users',
  timestamps: true,
  underscored: true,
});

// Loại bỏ password khi serialize sang JSON
User.prototype.toJSON = function () {
  const values = Object.assign({}, this.get());
  delete values.password;
  return values;
};

module.exports = User;