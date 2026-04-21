#!/usr/bin/env node
require('dotenv').config({ path: './.env' });

const path = require('path');
const { sequelize } = require('./src/models/index');
const bcrypt = require('bcryptjs');

// Import User model after sequence is initialized
const { User } = require('./src/models/index');

const PASSWORD = 'Test@123456';

const testUsers = [
  // Admin users
  { name: 'System Administrator', email: 'admin@farm-aid.com', phone: '+26771234567', role: 'admin', farmName: 'System Admin', farmLocation: 'Gaborone' },
  { name: 'John Manager', email: 'manager@farm-aid.com', phone: '+26772345678', role: 'admin', farmName: 'Operations', farmLocation: 'Francistown' },
  
  // Farmer users
  { name: 'Thabiso Mokoena', email: 'thabiso.farmer@farm-aid.com', phone: '+26773456789', role: 'farmer', farmName: 'Mokoena Cattle Farm', farmLocation: 'Gaborone' },
  { name: 'Nkamogelang Petso', email: 'nkamogelang.farmer@farm-aid.com', phone: '+26774567890', role: 'farmer', farmName: 'Petso Mixed Livestock', farmLocation: 'Francistown' },
  { name: 'Kagiso Mpontsana', email: 'kagiso.farmer@farm-aid.com', phone: '+26775678901', role: 'farmer', farmName: 'Mpontsana Goat Ranch', farmLocation: 'Maun' },
  { name: 'Boitumelo Ratsaka', email: 'boitumelo.farmer@farm-aid.com', phone: '+26776789012', role: 'farmer', farmName: 'Ratsaka Integrated Farm', farmLocation: 'Kasane' },
  { name: 'Palesa Lepako', email: 'palesa.farmer@farm-aid.com', phone: '+26777890123', role: 'farmer', farmName: 'Lepako Family Farm', farmLocation: 'Gaborone', isVerified: false },
  
  // Veterinarian users
  { name: 'Dr. Kagiso Morambi', email: 'dr.kagiso@farm-aid.com', phone: '+26778901234', role: 'veterinarian', farmName: 'Morambi Veterinary Clinic', farmLocation: 'Gaborone' },
  { name: 'Dr. Moloi Tshwane', email: 'dr.moloi@farm-aid.com', phone: '+26779012345', role: 'veterinarian', farmName: 'Tshwane Veterinary Services', farmLocation: 'Francistown' },
  { name: 'Dr. Keabetswe Modise', email: 'dr.keabetswe@farm-aid.com', phone: '+26780123456', role: 'veterinarian', farmName: 'Modise Veterinary Clinic', farmLocation: 'Maun' },
  
  // DVS officers (using admin role)
  { name: 'Gift Selala', email: 'gift.dvs@farm-aid.com', phone: '+26781234567', role: 'admin', farmName: 'DVS Gaborone', farmLocation: 'Gaborone' },
  { name: 'Phenyo Kubeka', email: 'phenyo.dvs@farm-aid.com', phone: '+26782345678', role: 'admin', farmName: 'DVS Francistown', farmLocation: 'Francistown' },
  { name: 'Thabo Lebaka', email: 'thabo.dvs@farm-aid.com', phone: '+26783456789', role: 'admin', farmName: 'DVS Maun', farmLocation: 'Maun' },
];

async function seedDatabase() {
  try {
    console.log('🌱 Starting user seeding...');
    
    // Test database connection
    await sequelize.authenticate();
    console.log('✅ Database connected');
    
    // Sync models
    await sequelize.sync({ alter: false });
    console.log('✅ Database tables ready');
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(PASSWORD, 10);
    console.log('✅ Password hashed');
    
    let created = 0;
    let updated = 0;
    
    // Seed users
    for (const userData of testUsers) {
      const [user, isNew] = await User.findOrCreate({
        where: { email: userData.email },
        defaults: {
          ...userData,
          password: hashedPassword,
          isVerified: userData.isVerified !== false,
          lastLogin: new Date(),
          isActive: true
        }
      });
      
      if (isNew) {
        console.log(`✓ Created: ${userData.email}`);
        created++;
      } else {
        console.log(`~ Updated: ${userData.email}`);
        updated++;
      }
    }
    
    // Print stats
    const stats = await sequelize.query(`
      SELECT role, COUNT(*) as count FROM "users" GROUP BY role;
    `);
    
    console.log('\n📊 User Statistics:');
    stats[0].forEach(row => {
      console.log(`   ${row.role}: ${row.count}`);
    });
    
    console.log(`\n✅ Seeding complete: ${created} created, ${updated} updated`);
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

seedDatabase();
