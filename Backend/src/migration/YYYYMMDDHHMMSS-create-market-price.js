// src/migrations/YYYYMMDDHHMMSS-create-market-price.js
'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('MarketPrices', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true
            },
            livestockType: {
                type: Sequelize.STRING,
                allowNull: false
            },
            breed: {
                type: Sequelize.STRING,
                allowNull: true
            },
            price: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: false
            },
            currency: {
                type: Sequelize.STRING(3),
                defaultValue: 'USD'
            },
            location: {
                type: Sequelize.STRING,
                allowNull: false
            },
            marketName: {
                type: Sequelize.STRING,
                allowNull: true
            },
            latitude: {
                type: Sequelize.FLOAT,
                allowNull: true
            },
            longitude: {
                type: Sequelize.FLOAT,
                allowNull: true
            },
            reportedAt: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW
            },
            notes: {
                type: Sequelize.TEXT,
                allowNull: true
            },
            verificationStatus: {
                type: Sequelize.ENUM('pending', 'verified', 'rejected'),
                defaultValue: 'pending'
            },
            verifiedBy: {
                type: Sequelize.UUID,
                allowNull: true,
                references: {
                    model: 'Users',
                    key: 'id'
                }
            },
            verifiedAt: {
                type: Sequelize.DATE,
                allowNull: true
            },
            source: {
                type: Sequelize.ENUM('user', 'api', 'scraper', 'admin'),
                defaultValue: 'user'
            },
            metadata: {
                type: Sequelize.JSONB,
                defaultValue: {}
            },
            userId: {
                type: Sequelize.UUID,
                allowNull: true,
                references: {
                    model: 'Users',
                    key: 'id'
                },
                onDelete: 'SET NULL'
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false
            }
        });

        // Add indexes
        await queryInterface.addIndex('MarketPrices', ['livestockType']);
        await queryInterface.addIndex('MarketPrices', ['location']);
        await queryInterface.addIndex('MarketPrices', ['reportedAt']);
        await queryInterface.addIndex('MarketPrices', ['userId']);
        await queryInterface.addIndex('MarketPrices', ['verificationStatus']);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('MarketPrices');
        // Drop ENUM types
        await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_MarketPrices_verificationStatus";');
        await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_MarketPrices_source";');
    }
};