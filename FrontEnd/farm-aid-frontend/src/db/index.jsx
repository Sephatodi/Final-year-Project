import { consultationQueries } from './consultationQueries';
import { diseaseQueries } from './diseaseQueries';
import { clearAllStores, deleteDB, getDB, initDB } from './indexedDB';
import {
  exportData,
  getMigrationStatus,
  importData,
  migrations,
  runMigrations,
} from './migrations';
import { knowledgeQueries } from './knowledgeQueries';
import { livestockQueries } from './livestockQueries';
import { offlineStorage } from './offlineStorage';
import { schemas, validateData } from './schema';
import { syncQueue } from './syncQueue';

export {
  consultationQueries,
  diseaseQueries,
  clearAllStores,
  deleteDB,
  getDB,
  initDB,
  exportData,
  getMigrationStatus,
  importData,
  migrations,
  runMigrations,
  knowledgeQueries,
  livestockQueries,
  offlineStorage,
  schemas,
  validateData,
  syncQueue,
};

// Database facade for easy access
const db = {
  init: initDB,
  get: getDB,
  delete: deleteDB,
  clearAll: clearAllStores,
  schema: schemas,
  validate: validateData,
  migrations,
  runMigrations,
  getMigrationStatus,
  export: exportData,
  import: importData,
  livestock: livestockQueries,
  disease: diseaseQueries,
  consultations: consultationQueries,
  knowledge: knowledgeQueries,
  sync: syncQueue,
  storage: offlineStorage,
};

export default db;
