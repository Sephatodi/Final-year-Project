const { sequelize, User, Livestock, HealthRecord, Consultation, Message, Notification, KnowledgeBase, MarketPrice } = require('../models');
const { setupCouchDB } = require('./couchdb');
const logger = require('../utils/logger');

const setupDatabase = async () => {
  try {
    logger.info('Starting database setup...');

    // Sync PostgreSQL
    await sequelize.sync({ 
      alter: process.env.NODE_ENV === 'development' ? { drop: false } : false,
      logging: (msg) => logger.debug(msg)
    });
    logger.info('✅ PostgreSQL tables created/updated');

    // Setup CouchDB
    try {
      await setupCouchDB();
      logger.info('✅ CouchDB setup completed');
    } catch (err) {
      logger.warn('CouchDB setup warning:', err.message);
    }

    // Create initial indexes for PostgreSQL
    await sequelize.query(`
      CREATE INDEX IF NOT EXISTS idx_livestock_user_id ON "Livestocks" ("userId");
      CREATE INDEX IF NOT EXISTS idx_livestock_status ON "Livestocks" ("status");
      CREATE INDEX IF NOT EXISTS idx_healthrecords_livestock_id ON "HealthRecords" ("livestockId");
      CREATE INDEX IF NOT EXISTS idx_consultations_farmer_id ON "Consultations" ("farmerId");
      CREATE INDEX IF NOT EXISTS idx_consultations_vet_id ON "Consultations" ("veterinarianId");
      CREATE INDEX IF NOT EXISTS idx_consultations_status ON "Consultations" ("status");
    `).catch(err => logger.warn('Index creation warning:', err.message));
    
    logger.info('✅ Database indexes verified');

    // Log successful setup
    logger.info('🎉 Database setup completed successfully!');
    logger.info(`📊 PostgreSQL: ${process.env.DB_NAME}@${process.env.DB_HOST}`);
    
  } catch (error) {
    logger.error('❌ Database setup failed:', error);
    throw error;
  }
};

// Run setup if called directly
if (require.main === module) {
  setupDatabase().then(() => {
    console.log('\n✨ Database setup completed!');
    process.exit(0);
  }).catch((err) => {
    console.error('❌ Database setup failed:', err);
    process.exit(1);
  });
}

module.exports = setupDatabase;