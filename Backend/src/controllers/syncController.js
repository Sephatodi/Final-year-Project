const { Livestock, HealthRecord, Consultation, User } = require('../models');
const { Op } = require('sequelize');
const sequelize = require('sequelize');

// Get CouchDB connection (with error handling)
let syncDb;
try {
  const { syncDb: couchSyncDb } = require('../config/couchdb');
  syncDb = couchSyncDb;
} catch (error) {
  console.error('CouchDB connection error:', error.message);
  // Create a mock for development if CouchDB is not available
  syncDb = {
    insert: async (doc) => ({ ok: true, id: doc._id, rev: '1-mock' }),
    get: async (id) => ({ _id: id, _rev: '1-mock' }),
    find: async (query) => ({ docs: [] }),
    info: async () => ({ doc_count: 0, update_seq: 0 })
  };
}

const pushChanges = async (req, res) => {
  try {
    const { changes, userId, deviceId } = req.body;

    if (!changes || !Array.isArray(changes)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid changes format'
      });
    }

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    const results = {
      synced: [],
      conflicts: [],
      errors: []
    };

    for (const change of changes) {
      try {
        // Add metadata
        const changeWithMeta = {
          ...change,
          userId,
          deviceId: deviceId || 'unknown',
          syncedAt: new Date().toISOString(),
          type: 'sync_record'
        };

        // Try to save to CouchDB
        const response = await syncDb.insert(changeWithMeta);

        // Update local database sync status
        if (change.model === 'Livestock') {
          await Livestock.update(
            { syncStatus: 'synced', lastSync: new Date() },
            { where: { id: change.id, userId } }
          );
        } else if (change.model === 'HealthRecord') {
          await HealthRecord.update(
            { syncStatus: 'synced', lastSync: new Date() },
            { where: { id: change.id, userId } }
          );
        } else if (change.model === 'Consultation') {
          await Consultation.update(
            { syncStatus: 'synced', lastSync: new Date() },
            {
              where: {
                id: change.id,
                [Op.or]: [{ farmerId: userId }, { veterinarianId: userId }]
              }
            }
          );
        }

        results.synced.push({
          id: change.id,
          rev: response.rev
        });
      } catch (error) {
        if (error.statusCode === 409) {
          // Conflict - document was modified elsewhere
          try {
            const existing = await syncDb.get(change._id);
            results.conflicts.push({
              id: change.id,
              client: change,
              server: existing
            });
          } catch (getError) {
            results.errors.push({
              id: change.id,
              error: 'Conflict but unable to fetch server version'
            });
          }
        } else {
          results.errors.push({
            id: change.id,
            error: error.message
          });
        }
      }
    }

    // Update user's last sync time
    try {
      await User.update(
        { lastSync: new Date() },
        { where: { id: userId } }
      );
    } catch (userError) {
      console.error('Error updating user lastSync:', userError);
    }

    res.json({
      success: true,
      data: results
    });
  } catch (error) {
    console.error('Push changes error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

const pullChanges = async (req, res) => {
  try {
    const { since = '0', userId, model, limit = 100 } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    // Build query for CouchDB
    const query = {
      selector: {
        userId: userId,
        _id: { $gt: since }
      },
      sort: [{ _id: 'asc' }],
      limit: parseInt(limit)
    };

    if (model) {
      query.selector.model = model;
    }

    const result = await syncDb.find(query);

    res.json({
      success: true,
      data: {
        changes: result.docs || [],
        lastSeq: result.docs && result.docs.length > 0
          ? result.docs[result.docs.length - 1]._id
          : since
      }
    });
  } catch (error) {
    console.error('Pull changes error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

const getSyncStatus = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    // Get counts of pending syncs
    const livestockPending = await Livestock.count({
      where: {
        userId,
        syncStatus: 'pending'
      }
    });

    const healthPending = await HealthRecord.count({
      where: {
        userId,
        syncStatus: 'pending'
      }
    });

    const consultationPending = await Consultation.count({
      where: {
        [Op.or]: [
          { farmerId: userId, syncStatus: 'pending' },
          { veterinarianId: userId, syncStatus: 'pending' }
        ]
      }
    });

    // Get last sync time
    const user = await User.findByPk(userId, {
      attributes: ['lastSync']
    });

    // Get CouchDB info
    let dbInfo = { docCount: 0, updateSeq: 0 };
    try {
      dbInfo = await syncDb.info();
    } catch (dbError) {
      console.error('Error getting CouchDB info:', dbError);
    }

    const totalPending = livestockPending + healthPending + consultationPending;

    res.json({
      success: true,
      data: {
        pending: {
          livestock: livestockPending,
          healthRecords: healthPending,
          consultations: consultationPending,
          total: totalPending
        },
        lastSync: user?.lastSync || null,
        serverTime: new Date(),
        dbInfo: {
          docCount: dbInfo.doc_count || 0,
          updateSeq: dbInfo.update_seq || 0
        },
        isSynced: totalPending === 0
      }
    });
  } catch (error) {
    console.error('Get sync status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

const resolveConflicts = async (req, res) => {
  try {
    const { conflicts, resolution = 'server' } = req.body;

    if (!conflicts || !Array.isArray(conflicts)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid conflicts format'
      });
    }

    const results = [];

    for (const conflict of conflicts) {
      try {
        let resolvedDoc;

        if (resolution === 'client-wins') {
          resolvedDoc = conflict.client;
        } else if (resolution === 'server-wins') {
          resolvedDoc = conflict.server;
        } else {
          // Custom merge - use client data but keep server metadata
          resolvedDoc = {
            ...conflict.server,
            ...conflict.client,
            _rev: conflict.server._rev,
            resolvedAt: new Date().toISOString(),
            resolutionStrategy: 'merge'
          };
        }

        // Ensure required fields
        if (!resolvedDoc._id) {
          resolvedDoc._id = conflict.client._id || conflict.server._id;
        }

        // Save resolved document
        const response = await syncDb.insert(resolvedDoc);

        // Update local database
        if (resolvedDoc.model === 'Livestock') {
          await Livestock.update(
            {
              ...resolvedDoc,
              syncStatus: 'synced',
              lastSync: new Date()
            },
            { where: { id: resolvedDoc.id } }
          );
        } else if (resolvedDoc.model === 'HealthRecord') {
          await HealthRecord.update(
            {
              ...resolvedDoc,
              syncStatus: 'synced',
              lastSync: new Date()
            },
            { where: { id: resolvedDoc.id } }
          );
        } else if (resolvedDoc.model === 'Consultation') {
          await Consultation.update(
            {
              ...resolvedDoc,
              syncStatus: 'synced',
              lastSync: new Date()
            },
            { where: { id: resolvedDoc.id } }
          );
        }

        results.push({
          id: resolvedDoc.id,
          resolved: true,
          rev: response.rev
        });
      } catch (error) {
        results.push({
          id: conflict.id || 'unknown',
          resolved: false,
          error: error.message
        });
      }
    }

    res.json({
      success: true,
      data: results
    });
  } catch (error) {
    console.error('Resolve conflicts error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

const getSyncHistory = async (req, res) => {
  try {
    const { userId, limit = 50 } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    // Query CouchDB for sync history
    const query = {
      selector: {
        userId: userId,
        type: 'sync_record'
      },
      sort: [{ syncedAt: 'desc' }],
      limit: parseInt(limit)
    };

    const result = await syncDb.find(query);

    res.json({
      success: true,
      data: result.docs || []
    });
  } catch (error) {
    console.error('Get sync history error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

const getPendingChanges = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    // Get all pending changes from local DB
    const [livestock, healthRecords, consultations] = await Promise.all([
      Livestock.findAll({
        where: {
          userId,
          syncStatus: 'pending'
        }
      }),
      HealthRecord.findAll({
        where: {
          userId,
          syncStatus: 'pending'
        }
      }),
      Consultation.findAll({
        where: {
          [Op.or]: [
            { farmerId: userId, syncStatus: 'pending' },
            { veterinarianId: userId, syncStatus: 'pending' }
          ]
        }
      })
    ]);

    // Format changes for sync
    const changes = [
      ...livestock.map(item => ({
        ...item.toJSON(),
        model: 'Livestock',
        changeType: 'update'
      })),
      ...healthRecords.map(item => ({
        ...item.toJSON(),
        model: 'HealthRecord',
        changeType: 'update'
      })),
      ...consultations.map(item => ({
        ...item.toJSON(),
        model: 'Consultation',
        changeType: 'update'
      }))
    ];

    res.json({
      success: true,
      data: {
        total: changes.length,
        changes
      }
    });
  } catch (error) {
    console.error('Get pending changes error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

const markSynced = async (req, res) => {
  try {
    const { items, userId } = req.body;

    if (!items || !Array.isArray(items)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid items format'
      });
    }

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    const updates = [];

    for (const item of items) {
      try {
        if (item.model === 'Livestock') {
          await Livestock.update(
            { syncStatus: 'synced', lastSync: new Date() },
            { where: { id: item.id, userId } }
          );
        } else if (item.model === 'HealthRecord') {
          await HealthRecord.update(
            { syncStatus: 'synced', lastSync: new Date() },
            { where: { id: item.id, userId } }
          );
        } else if (item.model === 'Consultation') {
          await Consultation.update(
            { syncStatus: 'synced', lastSync: new Date() },
            {
              where: {
                id: item.id,
                [Op.or]: [{ farmerId: userId }, { veterinarianId: userId }]
              }
            }
          );
        }
        updates.push(item.id);
      } catch (updateError) {
        console.error(`Error marking item ${item.id} as synced:`, updateError);
      }
    }

    // Update user's last sync time
    await User.update(
      { lastSync: new Date() },
      { where: { id: userId } }
    );

    res.json({
      success: true,
      data: {
        marked: updates.length,
        ids: updates
      }
    });
  } catch (error) {
    console.error('Mark synced error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

const getSyncStats = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    // Get sync statistics from CouchDB
    const query = {
      selector: {
        userId: userId,
        type: 'sync_record'
      },
      limit: 1000
    };

    let syncRecords = { docs: [] };
    try {
      syncRecords = await syncDb.find(query);
    } catch (dbError) {
      console.error('Error fetching sync records:', dbError);
    }

    // Calculate statistics
    const stats = {
      totalSyncs: syncRecords.docs.length,
      byDate: {},
      totalChanges: 0,
      averageChanges: 0
    };

    let totalChanges = 0;
    syncRecords.docs.forEach(record => {
      const date = record.syncedAt
        ? new Date(record.syncedAt).toISOString().split('T')[0]
        : 'unknown';
      stats.byDate[date] = (stats.byDate[date] || 0) + 1;

      if (record.changesCount) {
        totalChanges += record.changesCount;
      }
    });

    stats.averageChanges = stats.totalSyncs > 0
      ? Math.round(totalChanges / stats.totalSyncs)
      : 0;

    // Get local pending counts
    const livestockPending = await Livestock.count({
      where: { userId, syncStatus: 'pending' }
    });

    const healthPending = await HealthRecord.count({
      where: { userId, syncStatus: 'pending' }
    });

    const consultationPending = await Consultation.count({
      where: {
        [Op.or]: [
          { farmerId: userId, syncStatus: 'pending' },
          { veterinarianId: userId, syncStatus: 'pending' }
        ]
      }
    });

    stats.pendingLocal = {
      livestock: livestockPending,
      healthRecords: healthPending,
      consultations: consultationPending,
      total: livestockPending + healthPending + consultationPending
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Get sync stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

module.exports = {
  pushChanges,
  pullChanges,
  getSyncStatus,
  resolveConflicts,
  getSyncHistory,
  getPendingChanges,
  markSynced,
  getSyncStats
};