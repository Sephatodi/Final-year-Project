/**
 * initDb.js - Initialize PostgreSQL database for Farm AID
 * Run this script once before starting the server
 */

const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: 'postgres' // Connect to default postgres database to create new DB
});

const createDatabase = async () => {
  const dbName = process.env.DB_NAME || 'farmAid';
  
  try {
    console.log(`🔌 Connecting to PostgreSQL server...`);
    const client = await pool.connect();
    
    try {
      // Check if database exists
      const result = await client.query(
        `SELECT 1 FROM pg_database WHERE datname = $1`,
        [dbName]
      );
      
      if (result.rows.length > 0) {
        console.log(`✅ Database "${dbName}" already exists`);
      } else {
        // Create database
        console.log(`📦 Creating database "${dbName}"...`);
        await client.query(`CREATE DATABASE "${dbName}"`);
        console.log(`✅ Database "${dbName}" created successfully`);
      }
    } finally {
      client.release();
    }
    
    await pool.end();
    console.log(`\n✨ Database initialization complete!`);
    console.log(`📝 You can now run: npm run dev`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error initializing database:', error.message);
    process.exit(1);
  }
};

createDatabase();
