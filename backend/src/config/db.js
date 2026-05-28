const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();

const sequelize = new Sequelize(process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/ecommerce_db', {
  dialect: 'postgres',
  logging: false,
});

module.exports = sequelize;
