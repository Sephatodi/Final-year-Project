const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const HealthRecord = sequelize.define('HealthRecord', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  livestockId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  recordType: {
    type: DataTypes.ENUM('vaccination', 'treatment', 'examination', 'symptom', 'diagnosis'),
    allowNull: false
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  symptoms: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  diagnosis: {
    type: DataTypes.STRING,
    allowNull: true
  },
  diagnosisDetails: {
    type: DataTypes.JSONB,
    allowNull: true
  },
  treatment: {
    type: DataTypes.STRING,
    allowNull: true
  },
  medications: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  veterinarianId: {
    type: DataTypes.UUID,
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
  followUpDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  cost: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  outcome: {
    type: DataTypes.ENUM('recovered', 'improving', 'unchanged', 'worsened', 'deceased'),
    allowNull: true
  },
  syncStatus: {
    type: DataTypes.ENUM('synced', 'pending', 'failed'),
    defaultValue: 'synced'
  }
});

module.exports = HealthRecord;