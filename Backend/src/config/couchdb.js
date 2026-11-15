// Farm-Aid — CouchDB sync config
require('dotenv').config({ quiet: true });
const nano = require('nano');

const couchUrl = process.env.COUCHDB_URL || 'http://localhost:5984';
const couchUser = process.env.COUCHDB_USER;
const couchPassword = process.env.COUCHDB_PASSWORD;

let couchConnectionUrl = couchUrl;
if (couchUser && couchPassword) {
  const url = new URL(couchUrl);
  url.username = couchUser;
  url.password = couchPassword;
  couchConnectionUrl = url.toString();
}

const couchServer = nano(couchConnectionUrl);
const syncDbName = process.env.COUCHDB_DB || 'farmaid_sync';

const syncDb = couchServer.db.use(syncDbName);

const setupCouchDB = async () => {
  try {
    const dbs = await couchServer.db.list();
    if (!dbs.includes(syncDbName)) {
      await couchServer.db.create(syncDbName);
      console.log(`✅ CouchDB database "${syncDbName}" created`);
    } else {
      console.log(`✅ CouchDB database "${syncDbName}" exists`);
    }
    return true;
  } catch (error) {
    console.error('❌ CouchDB setup failed:', error.message);
    return false;
  }
};

module.exports = { couchServer, syncDb, syncDbName, setupCouchDB };