const nano = require('nano');
const dotenv = require('dotenv');

dotenv.config({ quiet: true });

const couchUrl = process.env.COUCHDB_URL || 'http://localhost:5984';
const couchUser = process.env.COUCHDB_USER;
const couchPassword = process.env.COUCHDB_PASSWORD;

// Create authenticated URL if credentials are provided
let couchConnectionUrl = couchUrl;
if (couchUser && couchPassword) {
  try {
    const url = new URL(couchUrl);
    url.username = encodeURIComponent(couchUser);
    url.password = encodeURIComponent(couchPassword);
    couchConnectionUrl = url.toString();
  } catch (urlError) {
    console.warn('Invalid COUCHDB_URL, using as is');
  }
}

const couch = nano(couchConnectionUrl);
const syncDb = couch.use(process.env.COUCHDB_DB || 'farmaid_sync');

const setupCouchDB = async () => {
  try {
    // Check if database exists, create if not
    const dbName = process.env.COUCHDB_DB || 'farmaid_sync';
    const dbs = await couch.db.list();
    if (!dbs.includes(dbName)) {
      await couch.db.create(dbName);
      console.log(`CouchDB database '${dbName}' created successfully`);
      
      const db = couch.use(dbName);
      // Create indexes for sync
      await db.createIndex({
        index: {
          fields: ['userId', 'timestamp', 'synced']
        }
      });
    }
    return true;
  } catch (error) {
    console.error('CouchDB setup error:', error.message);
    return false;
  }
};

module.exports = { couch, syncDb, setupCouchDB };