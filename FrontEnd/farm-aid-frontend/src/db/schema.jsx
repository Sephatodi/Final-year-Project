// Database schema definitions for reference and validation

export const schemas = {
  livestock: {
    name: 'livestock',
    keyPath: 'id',
    autoIncrement: true,
    indexes: [
      { name: 'farmerId', keyPath: 'farmerId', options: { unique: false } },
      { name: 'baitsTag', keyPath: 'baitsTagNumber', options: { unique: true } },
      { name: 'species', keyPath: 'species', options: { unique: false } },
      { name: 'healthStatus', keyPath: 'healthStatus', options: { unique: false } },
      { name: 'offlineId', keyPath: 'offlineId', options: { unique: true } },
      { name: 'synced', keyPath: 'synced', options: { unique: false } },
      { name: 'updatedAt', keyPath: 'updatedAt', options: { unique: false } },
    ],
    validation: {
      required: ['farmerId', 'baitsTagNumber', 'species', 'gender'],
      types: {
        farmerId: 'string',
        baitsTagNumber: 'string',
        species: ['cattle', 'goat', 'sheep'],
        breed: 'string',
        birthDate: 'date',
        gender: ['male', 'female'],
        weight: 'number',
        healthStatus: ['healthy', 'sick', 'critical', 'recovering'],
        location: 'string',
        notes: 'string',
      },
    },
  },

  healthRecords: {
    name: 'healthRecords',
    keyPath: 'id',
    autoIncrement: true,
    indexes: [
      { name: 'livestockId', keyPath: 'livestockId', options: { unique: false } },
      { name: 'date', keyPath: 'date', options: { unique: false } },
      { name: 'type', keyPath: 'type', options: { unique: false } },
      { name: 'offlineId', keyPath: 'offlineId', options: { unique: true } },
      { name: 'synced', keyPath: 'synced', options: { unique: false } },
    ],
    validation: {
      required: ['livestockId', 'date', 'type'],
      types: {
        livestockId: 'string',
        date: 'date',
        type: ['checkup', 'vaccination', 'treatment', 'surgery', 'deworming'],
        diagnosis: 'string',
        treatment: 'string',
        medications: 'array',
        notes: 'string',
      },
    },
  },

  diseaseReports: {
    name: 'diseaseReports',
    keyPath: 'id',
    autoIncrement: true,
    indexes: [
      { name: 'farmerId', keyPath: 'farmerId', options: { unique: false } },
      { name: 'reportNumber', keyPath: 'reportNumber', options: { unique: true } },
      { name: 'status', keyPath: 'status', options: { unique: false } },
      { name: 'priority', keyPath: 'priority', options: { unique: false } },
      { name: 'createdAt', keyPath: 'createdAt', options: { unique: false } },
      { name: 'synced', keyPath: 'synced', options: { unique: false } },
      { name: 'offlineId', keyPath: 'offlineId', options: { unique: true } },
    ],
    validation: {
      required: ['farmerId', 'location', 'species', 'animalCount', 'symptoms', 'description'],
      types: {
        farmerId: 'string',
        reportNumber: 'string',
        location: 'string',
        species: ['cattle', 'goat', 'sheep', 'mixed'],
        animalCount: 'number',
        symptoms: 'array',
        description: 'string',
        suspectedDisease: 'string',
        status: ['pending', 'submitted', 'acknowledged', 'investigating', 'confirmed', 'false_alarm', 'resolved'],
        priority: ['low', 'medium', 'high', 'critical'],
      },
    },
  },

  consultations: {
    name: 'consultations',
    keyPath: 'id',
    autoIncrement: true,
    indexes: [
      { name: 'farmerId', keyPath: 'farmerId', options: { unique: false } },
      { name: 'expertId', keyPath: 'expertId', options: { unique: false } },
      { name: 'status', keyPath: 'status', options: { unique: false } },
      { name: 'priority', keyPath: 'priority', options: { unique: false } },
      { name: 'updatedAt', keyPath: 'updatedAt', options: { unique: false } },
      { name: 'offlineId', keyPath: 'offlineId', options: { unique: true } },
      { name: 'synced', keyPath: 'synced', options: { unique: false } },
    ],
    validation: {
      required: ['farmerId', 'title', 'description'],
      types: {
        farmerId: 'string',
        expertId: 'string',
        title: 'string',
        description: 'string',
        status: ['pending', 'assigned', 'active', 'resolved', 'closed'],
        priority: ['low', 'normal', 'high', 'urgent'],
      },
    },
  },

  messages: {
    name: 'messages',
    keyPath: 'id',
    autoIncrement: true,
    indexes: [
      { name: 'consultationId', keyPath: 'consultationId', options: { unique: false } },
      { name: 'senderId', keyPath: 'senderId', options: { unique: false } },
      { name: 'timestamp', keyPath: 'timestamp', options: { unique: false } },
      { name: 'status', keyPath: 'status', options: { unique: false } },
      { name: 'offlineId', keyPath: 'offlineId', options: { unique: true } },
      { name: 'synced', keyPath: 'synced', options: { unique: false } },
    ],
    validation: {
      required: ['consultationId', 'senderId', 'content', 'timestamp'],
      types: {
        consultationId: 'string',
        senderId: 'string',
        content: 'string',
        messageType: ['text', 'image', 'voice', 'system'],
        timestamp: 'date',
        status: ['sending', 'sent', 'delivered', 'read'],
      },
    },
  },

  knowledgeBase: {
    name: 'knowledgeBase',
    keyPath: 'id',
    autoIncrement: false,
    indexes: [
      { name: 'diseaseCode', keyPath: 'diseaseCode', options: { unique: true } },
      { name: 'category', keyPath: 'category', options: { unique: false } },
      { name: 'species', keyPath: 'species', options: { unique: false, multiEntry: true } },
      { name: 'notifiable', keyPath: 'notifiable', options: { unique: false } },
      { name: 'popularity', keyPath: 'viewCount', options: { unique: false } },
    ],
    validation: {
      required: ['id', 'titleEn', 'contentEn', 'category'],
      types: {
        id: 'string',
        titleEn: 'string',
        titleTn: 'string',
        contentEn: 'string',
        contentTn: 'string',
        category: ['disease', 'prevention', 'treatment', 'nutrition', 'breeding', 'management'],
        species: 'array',
        notifiable: 'boolean',
        viewCount: 'number',
      },
    },
  },

  syncQueue: {
    name: 'syncQueue',
    keyPath: 'id',
    autoIncrement: true,
    indexes: [
      { name: 'entity', keyPath: 'entity', options: { unique: false } },
      { name: 'action', keyPath: 'action', options: { unique: false } },
      { name: 'timestamp', keyPath: 'timestamp', options: { unique: false } },
      { name: 'status', keyPath: 'status', options: { unique: false } },
      { name: 'attempts', keyPath: 'attempts', options: { unique: false } },
    ],
    validation: {
      required: ['entity', 'action', 'data', 'timestamp'],
      types: {
        entity: ['livestock', 'healthRecords', 'diseaseReports', 'consultations', 'messages'],
        action: ['create', 'update', 'delete'],
        status: ['pending', 'processing', 'completed', 'failed'],
        attempts: 'number',
      },
    },
  },
};

export const validateData = (storeName, data) => {
  const schema = schemas[storeName];
  if (!schema) return { valid: true, errors: [] };

  const errors = [];

  // Check required fields
  if (schema.validation.required) {
    for (const field of schema.validation.required) {
      if (data[field] === undefined || data[field] === null || data[field] === '') {
        errors.push(`Missing required field: ${field}`);
      }
    }
  }

  // Check types
  if (schema.validation.types) {
    for (const [field, type] of Object.entries(schema.validation.types)) {
      if (data[field] !== undefined) {
        if (Array.isArray(type)) {
          if (!type.includes(data[field])) {
            errors.push(`Invalid value for ${field}: must be one of ${type.join(', ')}`);
          }
        } else if (type === 'date') {
          if (isNaN(Date.parse(data[field]))) {
            errors.push(`Invalid date for ${field}`);
          }
        } else if (type === 'number') {
          if (typeof data[field] !== 'number' || isNaN(data[field])) {
            errors.push(`${field} must be a number`);
          }
        } else if (type === 'array') {
          if (!Array.isArray(data[field])) {
            errors.push(`${field} must be an array`);
          }
        } else if (typeof data[field] !== type) {
          errors.push(`${field} must be of type ${type}`);
        }
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};