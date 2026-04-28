const { User } = require('../models');
const bcrypt = require('bcryptjs');
const logger = require('../utils/logger');

/**
 * Comprehensive user seeder for Farm-Aid application
 * Creates test users for all roles: admin, farmer, veterinarian, dvs_officer
 */
const seedUsers = async () => {
  try {
    logger.info('Starting user database seeding...');

    const hashedPasswords = {};
    const passwordToHash = 'Test@123456';

    // Hash the password once
    hashedPasswords.default = await bcrypt.hash(passwordToHash, 10);

    // Test users data
    const testUsers = [
      // ==================== ADMIN USERS ====================
      {
        name: 'System Administrator',
        email: 'admin@farm-aid.com',
        phone: '+26771234567',
        password: hashedPasswords.default,
        role: 'admin',
        isVerified: true,
        lastLogin: new Date(),
        isActive: true,
        farmName: 'System Admin',
        farmLocation: 'Gaborone'
      },
      {
        name: 'John Manager',
        email: 'manager@farm-aid.com',
        phone: '+26772345678',
        password: hashedPasswords.default,
        role: 'admin',
        isVerified: true,
        lastLogin: new Date(),
        isActive: true,
        farmName: 'Operations',
        farmLocation: 'Francistown'
      },

      // ==================== FARMER USERS ====================
      {
        name: 'Thabiso Mokoena',
        email: 'thabiso.farmer@farm-aid.com',
        phone: '+26773456789',
        password: hashedPasswords.default,
        role: 'farmer',
        isVerified: true,
        lastLogin: new Date(),
        isActive: true,
        farmName: 'Mokoena Cattle Farm',
        farmLocation: 'Gaborone'
      },
      {
        name: 'Nkamogelang Petso',
        email: 'nkamogelang.farmer@farm-aid.com',
        phone: '+26774567890',
        password: hashedPasswords.default,
        role: 'farmer',
        isVerified: true,
        lastLogin: new Date(),
        isActive: true,
        farmName: 'Petso Mixed Livestock',
        farmLocation: 'Francistown'
      },
      {
        name: 'Kagiso Mpontsana',
        email: 'kagiso.farmer@farm-aid.com',
        phone: '+26775678901',
        password: hashedPasswords.default,
        role: 'farmer',
        isVerified: true,
        lastLogin: new Date(),
        isActive: true,
        farmName: 'Mpontsana Goat Ranch',
        farmLocation: 'Maun'
      },
      {
        name: 'Boitumelo Ratsaka',
        email: 'boitumelo.farmer@farm-aid.com',
        phone: '+26776789012',
        password: hashedPasswords.default,
        role: 'farmer',
        isVerified: true,
        lastLogin: new Date(),
        isActive: true,
        farmName: 'Ratsaka Integrated Farm',
        farmLocation: 'Kasane'
      },
      {
        name: 'Palesa Lepako',
        email: 'palesa.farmer@farm-aid.com',
        phone: '+26777890123',
        password: hashedPasswords.default,
        role: 'farmer',
        isVerified: false,
        isActive: false,
        farmName: 'Lepako Family Farm',
        farmLocation: 'Gaborone'
      },

      // ==================== VETERINARIAN USERS ====================
      {
        name: 'Dr. Kagiso Morambi',
        email: 'dr.kagiso@farm-aid.com',
        phone: '+26778901234',
        password: hashedPasswords.default,
        role: 'veterinarian',
        isVerified: true,
        lastLogin: new Date(),
        isActive: true,
        farmName: 'Morambi Veterinary Clinic',
        farmLocation: 'Gaborone'
      },
      {
        name: 'Dr. Moloi Tshwane',
        email: 'dr.moloi@farm-aid.com',
        phone: '+26779012345',
        password: hashedPasswords.default,
        role: 'veterinarian',
        isVerified: true,
        lastLogin: new Date(),
        isActive: true,
        farmName: 'Tshwane Veterinary Services',
        farmLocation: 'Francistown'
      },
      {
        name: 'Dr. Keabetswe Modise',
        email: 'dr.keabetswe@farm-aid.com',
        phone: '+26780123456',
        password: hashedPasswords.default,
        role: 'veterinarian',
        isVerified: true,
        lastLogin: new Date(),
        isActive: true,
        farmName: 'Modise Veterinary Clinic',
        farmLocation: 'Maun'
      },

      // ==================== DVS OFFICER USERS ====================
      {
        name: 'Gift Selala',
        email: 'gift.dvs@farm-aid.com',
        phone: '+26781234567',
        password: hashedPasswords.default,
        role: 'admin',
        isVerified: true,
        lastLogin: new Date(),
        isActive: true,
        farmName: 'DVS Gaborone',
        farmLocation: 'Gaborone'
      },
      {
        name: 'Phenyo Kubeka',
        email: 'phenyo.dvs@farm-aid.com',
        phone: '+26782345678',
        password: hashedPasswords.default,
        role: 'admin',
        isVerified: true,
        lastLogin: new Date(),
        isActive: true,
        farmName: 'DVS Francistown',
        farmLocation: 'Francistown'
      },
      {
        name: 'Thabo Lebaka',
        email: 'thabo.dvs@farm-aid.com',
        phone: '+26783456789',
        password: hashedPasswords.default,
        role: 'admin',
        isVerified: true,
        lastLogin: new Date(),
        isActive: true,
        farmName: 'DVS Maun',
        farmLocation: 'Maun'
      },
    ];

    // Create or update users
    let createdCount = 0;
    let updatedCount = 0;

    for (const userData of testUsers) {
      const [user, created] = await User.findOrCreate({
        where: { email: userData.email },
        defaults: userData
      });

      if (created) {
        createdCount++;
        logger.info(`✓ Created user: ${userData.email} (${userData.role})`);
      } else {
        // Update existing user (optional)
        await user.update(userData);
        updatedCount++;
        logger.info(`✓ Updated user: ${userData.email} (${userData.role})`);
      }
    }

    logger.info(`User seeding completed: ${createdCount} created, ${updatedCount} updated`);

    // Summary
    const userStats = {
      admin: await User.count({ where: { role: 'admin' } }),
      farmer: await User.count({ where: { role: 'farmer' } }),
      veterinarian: await User.count({ where: { role: 'veterinarian' } }),
      dvs_officer: await User.count({ where: { role: 'dvs_officer' } })
    };

    logger.info(`User Stats - Admin: ${userStats.admin}, Farmers: ${userStats.farmer}, Vets: ${userStats.veterinarian}, DVS: ${userStats.dvs_officer}`);

    return {
      success: true,
      message: 'User seeding completed successfully',
      stats: userStats,
      summary: { created: createdCount, updated: updatedCount }
    };

  } catch (error) {
    logger.error('Error seeding users:', error);
    throw error;
  }
};

module.exports = { seedUsers };
