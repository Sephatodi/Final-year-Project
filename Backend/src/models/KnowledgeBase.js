const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

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
  titleSetswana: {
    type: DataTypes.STRING,
    allowNull: true
  },
  category: {
    type: DataTypes.ENUM('disease', 'pest', 'treatment', 'vaccination', 'husbandry', 'nutrition'),
    allowNull: false
  },
  species: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  symptoms: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  symptomsSetswana: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  causes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  causesSetswana: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  prevention: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  preventionSetswana: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  treatment: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  treatmentSetswana: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  medications: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  severity: {
    type: DataTypes.ENUM('low', 'medium', 'high', 'critical'),
    defaultValue: 'medium'
  },
  contagious: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  reportable: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  images: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  references: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  tags: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  version: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  },
  lastUpdated: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
});

module.exports = KnowledgeBase;