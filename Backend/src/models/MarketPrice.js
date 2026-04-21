// src/models/MarketPrice.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const MarketPrice = sequelize.define('MarketPrice', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    livestockType: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    breed: {
        type: DataTypes.STRING,
        allowNull: true
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            min: 0
        }
    },
    currency: {
        type: DataTypes.STRING(3),
        defaultValue: 'USD',
        validate: {
            isIn: [['USD', 'EUR', 'GBP', 'KES', 'NGN', 'ZAR', 'GHS']]
        }
    },
    location: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    marketName: {
        type: DataTypes.STRING,
        allowNull: true
    },
    latitude: {
        type: DataTypes.FLOAT,
        allowNull: true,
        validate: {
            min: -90,
            max: 90
        }
    },
    longitude: {
        type: DataTypes.FLOAT,
        allowNull: true,
        validate: {
            min: -180,
            max: 180
        }
    },
    reportedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    verificationStatus: {
        type: DataTypes.ENUM('pending', 'verified', 'rejected'),
        defaultValue: 'pending'
    },
    verifiedBy: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    verifiedAt: {
        type: DataTypes.DATE,
        allowNull: true
    },
    source: {
        type: DataTypes.ENUM('user', 'api', 'scraper', 'admin'),
        defaultValue: 'user'
    },
    metadata: {
        type: DataTypes.JSONB,
        defaultValue: {}
    }
}, {
    timestamps: true,
    indexes: [
        {
            fields: ['livestockType']
        },
        {
            fields: ['location']
        },
        {
            fields: ['reportedAt']
        },
        {
            fields: ['userId']
        },
        {
            fields: ['verificationStatus']
        }
    ]
});

module.exports = MarketPrice;