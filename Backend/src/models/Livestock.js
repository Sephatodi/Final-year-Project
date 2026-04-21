const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Livestock = sequelize.define('Livestock', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  tagId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true
  },
  species: {
    type: DataTypes.ENUM('cattle', 'goat', 'sheep', 'chicken', 'pig'),
    allowNull: false
  },
  breed: {
    type: DataTypes.STRING,
    allowNull: true
  },
  gender: {
    type: DataTypes.ENUM('male', 'female'),
    allowNull: false
  },
  birthDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  acquisitionDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  acquisitionMethod: {
    type: DataTypes.ENUM('born', 'purchased', 'gifted', 'inherited'),
    defaultValue: 'born'
  },
  status: {
    type: DataTypes.ENUM('active', 'sold', 'deceased', 'missing'),
    defaultValue: 'active'
  },
  healthStatus: {
    type: DataTypes.ENUM('healthy', 'sick', 'recovering', 'quarantine'),
    defaultValue: 'healthy'
  },
  weight: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  weightUnit: {
    type: DataTypes.ENUM('kg', 'lbs'),
    defaultValue: 'kg'
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  images: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  vaccinationStatus: {
    type: DataTypes.JSONB,
    defaultValue: {
      lastVaccination: null,
      nextDue: null,
      vaccines: []
    }
  },
  breedingHistory: {
    type: DataTypes.JSONB,
    defaultValue: {
      lastBreeding: null,
      expectedDelivery: null,
      offspringCount: 0
    }
  },
  medicalHistory: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  syncStatus: {
    type: DataTypes.ENUM('synced', 'pending', 'failed'),
    defaultValue: 'synced'
  },
  lastModified: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
});

module.exports = Livestock;