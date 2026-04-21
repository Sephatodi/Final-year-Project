const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Notification = sequelize.define('Notification', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false
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
    allowNull: true
  },
  livestockId: {
    type: DataTypes.UUID,
    allowNull: true
  },
  relatedUserId: {
    type: DataTypes.UUID,
    allowNull: true,
    comment: 'ID of the farmer or vet who triggered this notification'
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
  underscored: true
});

module.exports = Notification;
