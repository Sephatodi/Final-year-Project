// Farm-Aid — database setup: sync tables, create CouchDB db, create indexes
const { sequelize } = require('./database');
const { setupCouchDB } = require('./couchdb');
const logger = require('../utils/logger');

const setupDatabase = async () => {
  try {
    logger.info('Starting database setup...');

    // Sync PostgreSQL models (create/alter tables)
    await sequelize.sync({
      alter: process.env.NODE_ENV === 'development',
      logging: (msg) => logger.debug(msg)
    });
    logger.info('PostgreSQL tables created/updated');

    // Setup CouchDB
    try {
      await setupCouchDB();
      logger.info('CouchDB setup completed');
    } catch (err) {
      logger.warn('CouchDB setup warning:', err.message);
    }

    // Create performance indexes
    await sequelize.query(`
      CREATE INDEX IF NOT EXISTS idx_livestock_user_id ON livestock ("userId");
      CREATE INDEX IF NOT EXISTS idx_livestock_baits_tag ON livestock ("baitsTagNumber");
      CREATE INDEX IF NOT EXISTS idx_health_records_livestock_id ON health_records ("livestockId");
      CREATE INDEX IF NOT EXISTS idx_consultations_farmer_id ON consultations ("farmerId");
      CREATE INDEX IF NOT EXISTS idx_consultations_expert_id ON consultations ("expertId");
      CREATE INDEX IF NOT EXISTS idx_consultations_status ON consultations ("status");
      CREATE INDEX IF NOT EXISTS idx_disease_reports_farmer_id ON disease_reports ("farmerId");
      CREATE INDEX IF NOT EXISTS idx_disease_reports_status ON disease_reports ("status");
      CREATE INDEX IF NOT EXISTS idx_sync_queue_user_id ON sync_queue ("userId");
      CREATE INDEX IF NOT EXISTS idx_sync_queue_synced ON sync_queue ("synced");
      CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs ("userId");
      CREATE INDEX IF NOT EXISTS idx_kb_disease_code ON knowledge_base ("diseaseCode");
      CREATE INDEX IF NOT EXISTS idx_kb_notifiable ON knowledge_base ("notifiable");
      CREATE INDEX IF NOT EXISTS idx_disease_zones_active ON disease_zones ("isActive");
      CREATE INDEX IF NOT EXISTS idx_market_prices_commodity ON market_prices ("commodity");
      CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON notifications ("userId", "isRead");
      CREATE INDEX IF NOT EXISTS idx_messages_consultation_id ON messages ("consultationId");
    `).catch(err => logger.warn('Index creation warning:', err.message));

    logger.info('Database indexes verified');
    logger.info('Database setup completed successfully');
  } catch (error) {
    logger.error('Database setup failed:', error);
    throw error;
  }
};

module.exports = setupDatabase;