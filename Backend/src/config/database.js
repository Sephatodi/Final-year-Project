// src/config/database.js
const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
const nano = require('nano'); 

dotenv.config({ quiet: true });

// ===========================================
// PostgreSQL Setup with Sequelize
// ===========================================
const sequelizeOptions = {
  dialect: 'postgres',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};

// Prefer DATABASE_URL (Railway / Neon) over individual DB_* variables
const connectionString = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_cz60hFdAqpgU@ep-lively-feather-anwhkvck-pooler.c-6.us-east-1.aws.neon.tech/FarmAid?sslmode=require&channel_binding=require';

const sequelize = connectionString
  ? new Sequelize(connectionString, {
      ...sequelizeOptions,
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      }
    })
  : new Sequelize(
      process.env.DB_NAME || 'farmAid',
      process.env.DB_USER || 'postgres',
      process.env.DB_PASSWORD || '1234@',
      {
        ...sequelizeOptions,
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432
      }
    );

// ===========================================
// CouchDB Setup
// ===========================================
const couchUrl = process.env.COUCHDB_URL || 'http://localhost:5984';
const couchUser = process.env.COUCHDB_USER;
const couchPassword = process.env.COUCHDB_PASSWORD;

// Create authenticated URL if credentials are provided
let couchConnectionUrl = couchUrl;
if (couchUser && couchPassword) {
  const url = new URL(couchUrl);
  url.username = couchUser;
  url.password = couchPassword;
  couchConnectionUrl = url.toString();
}

const couchServer = nano(couchConnectionUrl);

// ===========================================
// PostgreSQL Health Check
// ===========================================
const checkPostgresHealth = async () => {
  try {
    await sequelize.authenticate();
    return {
      status: 'healthy',
      dialect: 'postgres',
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      dialect: 'postgres',
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
};

// ===========================================
// Database Connection Test
// ===========================================
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ PostgreSQL connection established successfully.');
    
    // Test CouchDB connection
    try {
      await couchServer.db.list();
      console.log('✅ CouchDB connection established successfully.');
    } catch (couchError) {
      console.log('❌ CouchDB connection failed:', couchError.message);
    }
    
    return true;
  } catch (error) {
    console.error('❌ Unable to connect to PostgreSQL:', error);
    return false;
  }
};

// ===========================================
// Graceful Shutdown
// ===========================================
const shutdownDatabases = async () => {
  console.log('Closing database connections...');
  try {
    await sequelize.close();
    console.log('✅ PostgreSQL connection closed');
  } catch (error) {
    console.error('Error closing PostgreSQL connection:', error);
  }
  // CouchDB nano doesn't have a close method, connections are HTTP-based
  console.log('✅ CouchDB connections handled');
};

// For backward compatibility
const pgPool = sequelize; // This makes sequelize available as pgPool

module.exports = { 
  sequelize, 
  pgPool, // Add this for server.js compatibility
  testConnection, 
  checkPostgresHealth,
  couchServer,
  shutdownDatabases 
};