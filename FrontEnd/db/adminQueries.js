import { getDB } from './indexedDB';

export const adminQueries = {
  // User Management
  getAllUsers: async () => {
    const db = await getDB();
    const allUsers = await db.getAll('users');
    return allUsers;
  },

  getUserById: async (id) => {
    const db = await getDB();
    return await db.get('users', id);
  },

  createUser: async (userData) => {
    const db = await getDB();
    const newUser = {
      ...userData,
      id: `USER-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isActive: true,
      isApproved: userData.role === 'farmer' ? false : true,
      password: btoa(userData.password) // Simple encryption - use proper hashing in production
    };
    
    await db.add('users', newUser);
    
    // Add to sync queue
    await db.add('syncQueue', {
      entity: 'users',
      action: 'create',
      data: newUser,
      timestamp: new Date().toISOString()
    });
    
    return newUser;
  },

  updateUser: async (id, updates) => {
    const db = await getDB();
    const user = await db.get('users', id);
    const updatedUser = {
      ...user,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    if (updates.password) {
      updatedUser.password = btoa(updates.password);
    }
    
    await db.put('users', updatedUser);
    
    await db.add('syncQueue', {
      entity: 'users',
      action: 'update',
      data: updatedUser,
      timestamp: new Date().toISOString()
    });
    
    return updatedUser;
  },

  deleteUser: async (id) => {
    const db = await getDB();
    await db.delete('users', id);
    
    await db.add('syncQueue', {
      entity: 'users',
      action: 'delete',
      data: { id },
      timestamp: new Date().toISOString()
    });
    
    return true;
  },

  approveUser: async (id) => {
    const db = await getDB();
    const user = await db.get('users', id);
    const updatedUser = {
      ...user,
      isApproved: true,
      approvedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    await db.put('users', updatedUser);
    
    await db.add('syncQueue', {
      entity: 'users',
      action: 'approve',
      data: updatedUser,
      timestamp: new Date().toISOString()
    });
    
    return updatedUser;
  },

  // Expert Management
  getAllExperts: async () => {
    const db = await getDB();
    const allUsers = await db.getAll('users');
    return allUsers.filter(user => user.role === 'expert');
  },

  getPendingExperts: async () => {
    const db = await getDB();
    const allUsers = await db.getAll('users');
    return allUsers.filter(user => user.role === 'expert' && !user.isApproved);
  },

  approveExpert: async (id) => {
    const db = await getDB();
    const expert = await db.get('users', id);
    const updatedExpert = {
      ...expert,
      isApproved: true,
      approvedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    await db.put('users', updatedExpert);
    
    await db.add('syncQueue', {
      entity: 'users',
      action: 'approveExpert',
      data: updatedExpert,
      timestamp: new Date().toISOString()
    });
    
    return updatedExpert;
  },

  updateExpertStatus: async (id, isActive) => {
    const db = await getDB();
    const expert = await db.get('users', id);
    const updatedExpert = {
      ...expert,
      isActive,
      updatedAt: new Date().toISOString()
    };
    
    await db.put('users', updatedExpert);
    return updatedExpert;
  },

  // Content Management (Knowledge Base)
  getAllArticles: async () => {
    const db = await getDB();
    return await db.getAll('knowledgeBase');
  },

  getPendingArticles: async () => {
    const db = await getDB();
    const allArticles = await db.getAll('knowledgeBase');
    return allArticles.filter(article => !article.isApproved);
  },

  createArticle: async (articleData) => {
    const db = await getDB();
    const newArticle = {
      ...articleData,
      id: `ART-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      isApproved: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: 1
    };
    
    await db.add('knowledgeBase', newArticle);
    
    await db.add('syncQueue', {
      entity: 'knowledgeBase',
      action: 'create',
      data: newArticle,
      timestamp: new Date().toISOString()
    });
    
    return newArticle;
  },

  updateArticle: async (id, updates) => {
    const db = await getDB();
    const article = await db.get('knowledgeBase', id);
    const updatedArticle = {
      ...article,
      ...updates,
      isApproved: false, // Requires re-approval
      updatedAt: new Date().toISOString(),
      version: article.version + 1
    };
    
    await db.put('knowledgeBase', updatedArticle);
    
    await db.add('syncQueue', {
      entity: 'knowledgeBase',
      action: 'update',
      data: updatedArticle,
      timestamp: new Date().toISOString()
    });
    
    return updatedArticle;
  },

  deleteArticle: async (id) => {
    const db = await getDB();
    await db.delete('knowledgeBase', id);
    
    await db.add('syncQueue', {
      entity: 'knowledgeBase',
      action: 'delete',
      data: { id },
      timestamp: new Date().toISOString()
    });
    
    return true;
  },

  approveArticle: async (id) => {
    const db = await getDB();
    const article = await db.get('knowledgeBase', id);
    const updatedArticle = {
      ...article,
      isApproved: true,
      approvedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    await db.put('knowledgeBase', updatedArticle);
    
    await db.add('syncQueue', {
      entity: 'knowledgeBase',
      action: 'approve',
      data: updatedArticle,
      timestamp: new Date().toISOString()
    });
    
    return updatedArticle;
  },

  // Disease Reports Management
  getAllDiseaseReports: async () => {
    const db = await getDB();
    return await db.getAll('diseaseReports');
  },

  getPendingReports: async () => {
    const db = await getDB();
    const allReports = await db.getAll('diseaseReports');
    return allReports.filter(report => report.status === 'pending');
  },

  updateReportStatus: async (id, status, notes = '') => {
    const db = await getDB();
    const report = await db.get('diseaseReports', id);
    const updatedReport = {
      ...report,
      status,
      adminNotes: notes,
      reviewedAt: new Date().toISOString(),
      reviewedBy: 'admin',
      updatedAt: new Date().toISOString()
    };
    
    await db.put('diseaseReports', updatedReport);
    
    await db.add('syncQueue', {
      entity: 'diseaseReports',
      action: 'update',
      data: updatedReport,
      timestamp: new Date().toISOString()
    });
    
    return updatedReport;
  },

  // System Statistics
  getSystemStats: async () => {
    const db = await getDB();
    const users = await db.getAll('users');
    const experts = users.filter(u => u.role === 'expert');
    const farmers = users.filter(u => u.role === 'farmer');
    const pendingExperts = experts.filter(e => !e.isApproved);
    const pendingFarmers = farmers.filter(f => !f.isApproved);
    const articles = await db.getAll('knowledgeBase');
    const pendingArticles = articles.filter(a => !a.isApproved);
    const reports = await db.getAll('diseaseReports');
    const pendingReports = reports.filter(r => r.status === 'pending');
    const livestock = await db.getAll('livestock');
    
    return {
      totalUsers: users.length,
      totalExperts: experts.length,
      totalFarmers: farmers.length,
      pendingApprovals: {
        experts: pendingExperts.length,
        farmers: pendingFarmers.length,
        articles: pendingArticles.length,
        reports: pendingReports.length
      },
      totalArticles: articles.length,
      totalReports: reports.length,
      totalLivestock: livestock.length,
      lastUpdated: new Date().toISOString()
    };
  },

  // Password Management
  changeUserPassword: async (userId, newPassword) => {
    const db = await getDB();
    const user = await db.get('users', userId);
    const updatedUser = {
      ...user,
      password: btoa(newPassword),
      passwordChangedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    await db.put('users', updatedUser);
    
    await db.add('syncQueue', {
      entity: 'users',
      action: 'passwordChange',
      data: { userId, changedAt: new Date().toISOString() },
      timestamp: new Date().toISOString()
    });
    
    return updatedUser;
  },

  // System Update Management
  getSystemVersion: async () => {
    const db = await getDB();
    try {
      const version = await db.get('system', 'version');
      return version;
    } catch {
      return { version: '1.0.0', lastUpdate: new Date().toISOString() };
    }
  },

  updateSystemVersion: async (newVersion, releaseNotes) => {
    const db = await getDB();
    const versionInfo = {
      _id: 'version',
      version: newVersion,
      releaseNotes,
      lastUpdate: new Date().toISOString()
    };
    
    await db.put('system', versionInfo);
    
    return versionInfo;
  },

  // Backup and Restore
  createBackup: async () => {
    const db = await getDB();
    const stores = ['users', 'livestock', 'healthRecords', 'diseaseReports', 'knowledgeBase', 'consultations'];
    const backup = {};
    
    for (const store of stores) {
      backup[store] = await db.getAll(store);
    }
    
    backup.createdAt = new Date().toISOString();
    backup.version = '1.0';
    
    // Store backup
    const backupId = `BACKUP-${Date.now()}`;
    await db.add('backups', {
      id: backupId,
      data: backup,
      createdAt: new Date().toISOString()
    });
    
    return backup;
  },

  restoreBackup: async (backupId) => {
    const db = await getDB();
    const backup = await db.get('backups', backupId);
    const stores = ['users', 'livestock', 'healthRecords', 'diseaseReports', 'knowledgeBase', 'consultations'];
    
    for (const store of stores) {
      if (backup.data[store]) {
        // Clear existing data
        const allItems = await db.getAll(store);
        for (const item of allItems) {
          await db.delete(store, item.id);
        }
        
        // Restore backup data
        for (const item of backup.data[store]) {
          await db.add(store, item);
        }
      }
    }
    
    return true;
  }
};
