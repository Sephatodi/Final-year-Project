const PouchDB = require('pouchdb');
const { syncDb } = require('../config/couchdb');

class SyncService {
  constructor(userId) {
    this.userId = userId;
    this.localDb = new PouchDB(`farm_aid_${userId}`);
    this.syncHandler = null;
  }

  async startSync() {
    try {
      this.syncHandler = this.localDb.sync(syncDb, {
        live: true,
        retry: true,
        filter: (doc) => doc.userId === this.userId,
        heartbeat: 10000,
        timeout: false
      });

      this.syncHandler.on('change', (info) => {
        console.log(`Sync change for user ${this.userId}:`, info);
        this.recordSyncActivity(info);
      });

      this.syncHandler.on('paused', (err) => {
        console.log(`Sync paused for user ${this.userId}:`, err);
      });

      this.syncHandler.on('active', () => {
        console.log(`Sync active for user ${this.userId}`);
      });

      this.syncHandler.on('denied', (err) => {
        console.error(`Sync denied for user ${this.userId}:`, err);
      });

      this.syncHandler.on('complete', (info) => {
        console.log(`Sync complete for user ${this.userId}:`, info);
      });

      this.syncHandler.on('error', (err) => {
        console.error(`Sync error for user ${this.userId}:`, err);
      });

      return { success: true, message: 'Sync started' };
    } catch (error) {
      console.error('Start sync error:', error);
      throw error;
    }
  }

  async stopSync() {
    if (this.syncHandler) {
      this.syncHandler.cancel();
      this.syncHandler = null;
    }
    await this.localDb.close();
  }

  async getLocalChanges() {
    try {
      const changes = await this.localDb.changes({
        since: 'now',
        include_docs: true,
        limit: 100
      });
      return changes;
    } catch (error) {
      console.error('Get local changes error:', error);
      throw error;
    }
  }

  async resolveConflicts(docId) {
    try {
      const doc = await this.localDb.get(docId, { conflicts: true });
      
      if (doc._conflicts) {
        for (const rev of doc._conflicts) {
          const conflictingRev = await this.localDb.get(docId, { rev });
          
          // Simple conflict resolution - last write wins based on timestamp
          if (new Date(conflictingRev.updatedAt) > new Date(doc.updatedAt)) {
            doc.data = conflictingRev.data;
            doc.updatedAt = conflictingRev.updatedAt;
          }
        }
        
        // Save resolved document
        delete doc._conflicts;
        await this.localDb.put(doc);
      }
      
      return { success: true, doc };
    } catch (error) {
      console.error('Resolve conflicts error:', error);
      throw error;
    }
  }

  async recordSyncActivity(info) {
    const syncRecord = {
      _id: `sync_${Date.now()}_${this.userId}`,
      type: 'sync_record',
      userId: this.userId,
      timestamp: new Date(),
      direction: info.direction,
      changesCount: info.change?.docs?.length || 0,
      docs: info.change?.docs?.map(d => d._id) || []
    };

    try {
      await syncDb.insert(syncRecord);
    } catch (error) {
      console.error('Record sync activity error:', error);
    }
  }

  async getSyncStatus() {
    try {
      const info = await this.localDb.info();
      const pending = await this.localDb.changes({
        since: info.update_seq,
        limit: 1
      });

      return {
        local: info,
        pending: pending.results.length,
        isSyncing: !!this.syncHandler,
        lastSync: await this.getLastSyncTime()
      };
    } catch (error) {
      console.error('Get sync status error:', error);
      throw error;
    }
  }

  async getLastSyncTime() {
    try {
      const query = {
        selector: {
          type: 'sync_record',
          userId: this.userId
        },
        sort: [{ timestamp: 'desc' }],
        limit: 1
      };

      const result = await syncDb.find(query);
      return result.docs[0]?.timestamp || null;
    } catch (error) {
      console.error('Get last sync time error:', error);
      return null;
    }
  }

  async compact() {
    try {
      await this.localDb.compact();
      return { success: true };
    } catch (error) {
      console.error('Compact error:', error);
      throw error;
    }
  }
}

module.exports = SyncService;