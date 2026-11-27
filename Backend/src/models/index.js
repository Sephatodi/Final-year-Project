/// backend/models/index.js
const { Sequelize, DataTypes } = require('sequelize');
const dotenv = require('dotenv');
const path = require('path');

// Load .env from root directory first, then from Backend directory
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const sequelize = process.env.DATABASE_URL 
  ? new Sequelize(process.env.DATABASE_URL, {
      dialect: 'postgres',
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      },
      logging: process.env.NODE_ENV === 'development' ? console.log : false,
      pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    })
  : new Sequelize(
      process.env.DB_NAME || 'farmaid_db',
      process.env.DB_USER || 'postgres',
      process.env.DB_PASSWORD || 'postgres',
      {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        dialect: 'postgres',
        logging: process.env.NODE_ENV === 'development' ? console.log : false,
        pool: {
          max: 10,
          min: 0,
          acquire: 30000,
          idle: 10000
        }
      }
    );

// User Model
const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('farmer', 'veterinarian', 'admin'),
    defaultValue: 'farmer'
  },
  phone: {
    type: DataTypes.STRING
  },
  farmName: {
    type: DataTypes.STRING
  },
  farmLocation: {
    type: DataTypes.STRING
  },
  license: {
    type: DataTypes.STRING,
    comment: 'Veterinarian license number'
  },
  specialization: {
    type: DataTypes.STRING,
    comment: 'Veterinarian specialization'
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  avatar: {
    type: DataTypes.STRING
  },
  lastLogin: {
    type: DataTypes.DATE
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  timestamps: true,
  tableName: 'users'
});

// Livestock Model
const Livestock = sequelize.define('Livestock', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  tagId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  name: {
    type: DataTypes.STRING
  },
  species: {
    type: DataTypes.ENUM('cattle', 'goat', 'sheep'),
    allowNull: false
  },
  breed: {
    type: DataTypes.STRING
  },
  gender: {
    type: DataTypes.ENUM('male', 'female'),
    allowNull: false
  },
  birthDate: {
    type: DataTypes.DATE
  },
  weight: {
    type: DataTypes.FLOAT
  },
  status: {
    type: DataTypes.ENUM('healthy', 'sick', 'quarantined', 'deceased'),
    defaultValue: 'healthy'
  },
  healthStatus: {
    type: DataTypes.ENUM('healthy', 'sick', 'quarantined', 'deceased'),
    defaultValue: 'healthy'
  },
  location: {
    type: DataTypes.STRING
  },
  photoUrl: {
    type: DataTypes.STRING
  }
}, {
  timestamps: true,
  tableName: 'livestock'
});

// HealthRecord Model
const HealthRecord = sequelize.define('HealthRecord', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  livestockId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'livestock',
      key: 'id'
    }
  },
  recordType: {
    type: DataTypes.ENUM('vaccination', 'symptom_check', 'treatment', 'diagnosis', 'checkup'),
    allowNull: false
  },
  symptoms: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  diagnosis: {
    type: DataTypes.STRING
  },
  diagnosisConfidence: {
    type: DataTypes.FLOAT
  },
  treatment: {
    type: DataTypes.TEXT
  },
  medications: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  temperature: {
    type: DataTypes.FLOAT
  },
  notes: {
    type: DataTypes.TEXT
  },
  images: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  veterinarianId: {
    type: DataTypes.UUID,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  status: {
    type: DataTypes.ENUM('pending', 'in_progress', 'resolved'),
    defaultValue: 'pending'
  }
}, {
  timestamps: true,
  tableName: 'health_records'
});

// Consultation Model
const Consultation = sequelize.define('Consultation', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  farmerId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  veterinarianId: {
    type: DataTypes.UUID,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  livestockId: {
    type: DataTypes.UUID,
    references: {
      model: 'livestock',
      key: 'id'
    }
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  symptoms: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  aiDiagnosis: {
    type: DataTypes.JSONB
  },
  finalDiagnosis: {
    type: DataTypes.STRING
  },
  treatment: {
    type: DataTypes.TEXT
  },
  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high', 'critical'),
    defaultValue: 'medium'
  },
  status: {
    type: DataTypes.ENUM('pending', 'active', 'resolved', 'cancelled'),
    defaultValue: 'pending'
  },
  scheduledTime: {
    type: DataTypes.DATE
  },
  completedAt: {
    type: DataTypes.DATE
  },
  isNotifiable: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  reportSent: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  timestamps: true,
  tableName: 'consultations'
});

// Message Model (for consultations)
const Message = sequelize.define('Message', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  consultationId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'consultations',
      key: 'id'
    }
  },
  senderId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('text', 'image', 'file', 'voice'),
    defaultValue: 'text'
  },
  attachments: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  isRead: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  timestamps: true,
  tableName: 'messages'
});

// Notification Model
const Notification = sequelize.define('Notification', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  type: {
    type: DataTypes.ENUM(
      'consultation_update',
      'disease_alert',
      'vaccination_reminder',
      'new_consultation',
      'farmer_message',
      'treatment_plan',
      'health_alert'
    ),
    allowNull: false
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  severity: {
    type: DataTypes.ENUM('critical', 'high', 'medium', 'low', 'normal'),
    defaultValue: 'normal'
  },
  read: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  archived: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  consultationId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'consultations',
      key: 'id'
    }
  },
  livestockId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'livestock',
      key: 'id'
    }
  },
  relatedUserId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  actionUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  metadata: {
    type: DataTypes.JSONB,
    defaultValue: {}
  }
}, {
  timestamps: true,
  tableName: 'notifications'
});

// DiseaseReport Model
const DiseaseReport = sequelize.define('DiseaseReport', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  consultationId: {
    type: DataTypes.UUID,
    references: {
      model: 'consultations',
      key: 'id'
    }
  },
  reporterId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  disease: {
    type: DataTypes.STRING,
    allowNull: false
  },
  location: {
    type: DataTypes.STRING
  },
  coordinates: {
    type: DataTypes.JSONB
  },
  affectedAnimals: {
    type: DataTypes.INTEGER
  },
  description: {
    type: DataTypes.TEXT
  },
  severity: {
    type: DataTypes.ENUM('low', 'medium', 'high', 'critical'),
    defaultValue: 'medium'
  },
  status: {
    type: DataTypes.ENUM('reported', 'investigating', 'confirmed', 'resolved'),
    defaultValue: 'reported'
  }
}, {
  timestamps: true,
  tableName: 'disease_reports'
});

// SyncQueue Model (for offline sync)
const SyncQueue = sequelize.define('SyncQueue', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  operation: {
    type: DataTypes.ENUM('create', 'update', 'delete'),
    allowNull: false
  },
  entityType: {
    type: DataTypes.STRING,
    allowNull: false
  },
  entityId: {
    type: DataTypes.STRING
  },
  data: {
    type: DataTypes.JSONB,
    allowNull: false
  },
  synced: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  syncedAt: {
    type: DataTypes.DATE
  },
  retryCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  timestamps: true,
  tableName: 'sync_queue'
});

// KnowledgeBase Model
const KnowledgeBase = sequelize.define('KnowledgeBase', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  category: {
    type: DataTypes.STRING
  },
  tags: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  authorId: {
    type: DataTypes.UUID,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  views: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  isPublished: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  timestamps: true,
  tableName: 'knowledge_base'
});

// Set up associations
User.hasMany(Livestock, { foreignKey: 'userId' });
Livestock.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(HealthRecord, { foreignKey: 'veterinarianId', as: 'vetRecords' });
Livestock.hasMany(HealthRecord, { foreignKey: 'livestockId' });
HealthRecord.belongsTo(Livestock, { foreignKey: 'livestockId' });
HealthRecord.belongsTo(User, { foreignKey: 'veterinarianId', as: 'veterinarian' });

User.hasMany(Consultation, { foreignKey: 'farmerId', as: 'farmerConsultations' });
User.hasMany(Consultation, { foreignKey: 'veterinarianId', as: 'vetConsultations' });
Consultation.belongsTo(User, { foreignKey: 'farmerId', as: 'farmer' });
Consultation.belongsTo(User, { foreignKey: 'veterinarianId', as: 'veterinarian' });
Consultation.belongsTo(Livestock, { foreignKey: 'livestockId' });

Consultation.hasMany(Message, { foreignKey: 'consultationId' });
Message.belongsTo(Consultation, { foreignKey: 'consultationId' });
Message.belongsTo(User, { foreignKey: 'senderId', as: 'sender' });

User.hasMany(DiseaseReport, { foreignKey: 'reporterId' });
DiseaseReport.belongsTo(User, { foreignKey: 'reporterId' });
DiseaseReport.belongsTo(Consultation, { foreignKey: 'consultationId' });

User.hasMany(SyncQueue, { foreignKey: 'userId' });
SyncQueue.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Notification, { foreignKey: 'userId' });
Notification.belongsTo(User, { foreignKey: 'userId' });
Notification.belongsTo(Consultation, { foreignKey: 'consultationId' });
Notification.belongsTo(Livestock, { foreignKey: 'livestockId' });
Notification.belongsTo(User, { foreignKey: 'relatedUserId', as: 'relatedUser' });

// ============================================
// Admin / reporting helper statics
// These implement the methods the admin & analytics controllers expect.
// They are intentionally additive and never override Sequelize built-ins.
// ============================================

const { Op } = require('sequelize');

// ---- User helpers ----
User.findById = async function (id) {
  return this.findByPk(id);
};

User.findWithFilters = async function (filters = {}, pagination = {}, sort = {}) {
  const { page = 1, limit = 20 } = pagination;
  const where = {};
  if (filters.role) where.role = filters.role;
  if (filters.status === 'active') where.isActive = true;
  else if (filters.status === 'inactive') where.isActive = false;
  if (filters.search) {
    const term = `%${filters.search}%`;
    where[Op.or] = [{ name: { [Op.iLike]: term } }, { email: { [Op.iLike]: term } }];
  }
  const { rows: users, count: total } = await this.findAndCountAll({
    where,
    limit: parseInt(limit),
    offset: (parseInt(page) - 1) * parseInt(limit),
    order: [Object.keys(sort).length ? Object.entries(sort)[0] : ['createdAt', 'DESC']],
    attributes: { exclude: ['password'] },
  });
  return { users, pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) } };
};

User.getStats = async function () {
  const total = await this.count();
  const farmers = await this.count({ where: { role: 'farmer' } });
  const veterinarians = await this.count({ where: { role: 'veterinarian' } });
  const admins = await this.count({ where: { role: 'admin' } });
  const active = await this.count({ where: { isActive: true } });
  return { total, farmers, veterinarians, admins, active, inactive: total - active };
};

User.getAnalytics = async function () {
  const stats = await this.getStats();
  return { ...stats, newUsersThisMonth: await this.count({ where: { createdAt: { [Op.gte]: new Date(new Date().getFullYear(), new Date().getMonth(), 1) } } }) };
};

User.adminUpdate = async function (id, updates) {
  const user = await this.findByPk(id);
  if (!user) return null;
  const { status, ...rest } = updates || {};
  Object.assign(user, rest);
  if (status) user.isActive = status === 'active';
  await user.save();
  return user;
};

User.softDelete = async function (id) {
  const user = await this.findByPk(id);
  if (!user) return false;
  user.isActive = false;
  await user.save();
  return true;
};

User.bulkUpdateStatus = async function (userIds, status) {
  const [count] = await this.update({ isActive: status === 'active' }, { where: { id: userIds } });
  return count;
};

// ---- Livestock helpers ----
Livestock.getStats = async function () {
  const total = await this.count();
  const bySpecies = {};
  for (const sp of ['cattle', 'goat', 'sheep']) {
    bySpecies[sp] = await this.count({ where: { species: sp } });
  }
  const healthy = await this.count({ where: { status: 'healthy' } });
  return { total, bySpecies, healthy };
};

Livestock.getAnalytics = async function () {
  return this.getStats();
};

// ---- Consultation helpers ----
Consultation.getStats = async function () {
  const total = await this.count();
  const pending = await this.count({ where: { status: 'pending' } });
  const active = await this.count({ where: { status: 'active' } });
  const resolved = await this.count({ where: { status: 'resolved' } });
  return { total, pending, active, resolved };
};

Consultation.getAnalytics = async function () {
  return this.getStats();
};

Consultation.getRevenueAnalytics = async function () {
  const stats = await this.getStats();
  return { ...stats, revenue: 0, currency: 'USD' };
};

Consultation.findWithFilters = async function (filters = {}, pagination = {}) {
  const { page = 1, limit = 20 } = pagination;
  const where = {};
  if (filters.status) where.status = filters.status;
  const { rows, count: total } = await this.findAndCountAll({
    where,
    limit: parseInt(limit),
    offset: (parseInt(page) - 1) * parseInt(limit),
    order: [['createdAt', 'DESC']],
  });
  return { consultations: rows, users: rows, pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) } };
};

Consultation.assignVeterinarian = async function (id, veterinarianId) {
  const c = await this.findByPk(id);
  if (!c) return null;
  c.veterinarianId = veterinarianId;
  c.status = 'active';
  await c.save();
  return c;
};

Consultation.escalate = async function (id, reason) {
  const c = await this.findByPk(id);
  if (!c) return null;
  c.priority = 'critical';
  await c.save();
  return c;
};

Consultation.bulkUpdateStatus = async function (ids, status) {
  const [count] = await this.update({ status }, { where: { id: ids } });
  return count;
};

// ---- KnowledgeBase helpers ----
KnowledgeBase.findById = async function (id) {
  return this.findByPk(id);
};

// AuditLog Sequelize model: defined here so `sequelize.sync()` creates the
// `audit_logs` table that the standalone AuditLog class (raw SQL) queries.
// Column names match the raw SQL (snake_case) used by models/AuditLog.js.
const AuditLogModel = sequelize.define('AuditLog', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  userId: { type: DataTypes.UUID },
  action: { type: DataTypes.STRING(50), allowNull: false },
  resource: { type: DataTypes.STRING(50), allowNull: false },
  resourceId: { type: DataTypes.UUID },
  details: { type: DataTypes.JSONB },
  changes: { type: DataTypes.JSONB },
  oldValues: { type: DataTypes.JSONB },
  ipAddress: { type: DataTypes.STRING },
  userAgent: { type: DataTypes.TEXT },
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
  tableName: 'audit_logs',
});

// MarketPrice model defined on the shared (index) sequelize so that
// `setupDatabase()` -> sequelize.sync() creates the `MarketPrices` table.
const MarketPriceModel = sequelize.define('MarketPrice', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  livestockType: { type: DataTypes.STRING, allowNull: false },
  breed: { type: DataTypes.STRING },
  price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  currency: { type: DataTypes.STRING(3), defaultValue: 'USD' },
  location: { type: DataTypes.STRING, allowNull: false },
  marketName: { type: DataTypes.STRING },
  latitude: { type: DataTypes.FLOAT },
  longitude: { type: DataTypes.FLOAT },
  reportedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  notes: { type: DataTypes.TEXT },
  userId: { type: DataTypes.UUID },
  verificationStatus: { type: DataTypes.ENUM('pending', 'verified', 'rejected'), defaultValue: 'pending' },
  verifiedBy: { type: DataTypes.UUID },
  verifiedAt: { type: DataTypes.DATE },
  source: { type: DataTypes.ENUM('user', 'api', 'scraper', 'admin'), defaultValue: 'user' },
  metadata: { type: DataTypes.JSONB, defaultValue: {} },
}, {
  timestamps: true,
  tableName: 'MarketPrices',
});

KnowledgeBase.findWithFilters = async function (filters = {}, pagination = {}) {
  const page = filters.page || pagination.page || 1;
  const limit = filters.limit || pagination.limit || 20;
  const where = {};
  if (filters.category) where.category = filters.category;
  if (filters.isPublished !== undefined) where.isPublished = filters.isPublished;
  if (filters.search) where.title = { [Op.iLike]: `%${filters.search}%` };
  const { rows, count: total } = await this.findAndCountAll({
    where,
    limit: parseInt(limit),
    offset: (parseInt(page) - 1) * parseInt(limit),
    order: [['createdAt', 'DESC']],
  });
  return { items: rows, pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) } };
};

KnowledgeBase.moderate = async function (id, data) {
  const article = await this.findByPk(id);
  if (!article) return null;
  if (data.status === 'approved') article.isPublished = true;
  if (data.status === 'rejected') article.isPublished = false;
  await article.save();
  return article;
};

KnowledgeBase.createAnnouncement = async function (data) {
  return this.create({
    title: data.title,
    content: data.content,
    category: 'announcement',
    tags: [data.targetAudience || 'all'],
    authorId: data.createdBy || null,
    isPublished: true,
  });
};

KnowledgeBase.getAnnouncements = async function () {
  return this.findAll({ where: { category: 'announcement' }, order: [['createdAt', 'DESC']] });
};

KnowledgeBase.findAnnouncementById = async function (id) {
  return this.findByPk(id);
};

KnowledgeBase.deleteAnnouncement = async function (id) {
  return this.destroy({ where: { id } });
};

// AuditLog keeps its standalone class (raw SQL helpers). MarketPrice uses the
// model defined on the shared sequelize so sequelize.sync() creates its table.
const AuditLog = require('./AuditLog');
const MarketPrice = MarketPriceModel;

module.exports = {
  sequelize,
  User,
  Livestock,
  HealthRecord,
  Consultation,
  Message,
  Notification,
  DiseaseReport,
  SyncQueue,
  KnowledgeBase,
  AuditLog,
  MarketPrice
};