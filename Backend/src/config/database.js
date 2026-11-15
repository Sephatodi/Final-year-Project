// Farm-Aid Backend — database config (local Postgres via docker-compose)
require('dotenv').config({ quiet: true });
const { Sequelize } = require('sequelize');

const dialect = 'postgres';
const pool = { max: 10, min: 0, acquire: 30000, idle: 10000 };

let sequelize;

if (process.env.DATABASE_URL) {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect,
    dialectOptions: {
      ssl: { require: true, rejectUnauthorized: false }
    },
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool
  });
} else {
  sequelize = new Sequelize(
    process.env.DB_NAME || 'farmaid',
    process.env.DB_USER || 'postgres',
    process.env.DB_PASSWORD || 'postgres',
    {
      dialect,
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      logging: process.env.NODE_ENV === 'development' ? console.log : false,
      pool
    }
  );
}

module.exports = { sequelize };