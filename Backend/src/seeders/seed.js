const { sequelize } = require('../config/database');
const { User, KnowledgeBase, MarketPrice } = require('../models');
const bcrypt = require('bcryptjs');
const logger = require('../utils/logger');
const { seedUsers } = require('./usersSeed');

const seedDatabase = async () => {
  try {
    logger.info('Starting database seeding...');

    // Seed comprehensive user database (replaces old admin-only approach)
    logger.info('Seeding users from usersSeed...');
    await seedUsers();

    // Seed knowledge base
    const knowledgeEntries = [
      {
        title: 'Foot and Mouth Disease',
        titleSetswana: 'Bolwetse jwa Loleme le Menong',
        category: 'disease',
        species: ['cattle', 'goat', 'sheep', 'pig'],
        symptoms: ['fever', 'blisters_mouth', 'lameness', 'drooling', 'loss_appetite'],
        symptomsSetswana: ['fifi', 'marotha mo molomong', 'kukulela', 'rotha marotha', 'tlhoka go ja'],
        causes: 'Caused by a virus spread through direct contact with infected animals',
        prevention: 'Regular vaccination, quarantine new animals, maintain hygiene',
        treatment: 'No specific treatment; supportive care and vaccination to prevent spread',
        severity: 'high',
        contagious: true,
        reportable: true
      },
      {
        title: 'Internal Parasites',
        titleSetswana: 'Diboko tsa Teng',
        category: 'pest',
        species: ['cattle', 'goat', 'sheep'],
        symptoms: ['weight_loss', 'diarrhea', 'weakness', 'rough_coat', 'anemia'],
        prevention: 'Regular deworming, pasture rotation, proper sanitation',
        treatment: 'Deworming medication as prescribed by veterinarian',
        severity: 'medium',
        contagious: false,
        reportable: false
      },
      {
        title: 'CBPP (Contagious Bovine Pleuropneumonia)',
        category: 'disease',
        species: ['cattle'],
        symptoms: ['fever', 'coughing', 'difficulty_breathing', 'nasal_discharge'],
        prevention: 'Vaccination, movement control, quarantine',
        treatment: 'Antibiotics, isolation of infected animals',
        severity: 'high',
        contagious: true,
        reportable: true
      }
    ];

    for (const entry of knowledgeEntries) {
      await KnowledgeBase.findOrCreate({
        where: { title: entry.title },
        defaults: entry
      });
    }
    logger.info(`${knowledgeEntries.length} knowledge entries created`);

    // Seed market prices
    const marketPrices = [
      {
        species: 'cattle',
        category: 'live',
        price: 4500,
        location: 'Francistown',
        marketName: 'Francistown Livestock Market',
        date: new Date()
      },
      {
        species: 'goat',
        category: 'live',
        price: 1200,
        location: 'Francistown',
        marketName: 'Francistown Livestock Market',
        date: new Date()
      },
      {
        species: 'sheep',
        category: 'live',
        price: 1500,
        location: 'Gaborone',
        marketName: 'Gaborone Abattoir',
        date: new Date()
      }
    ];

    for (const price of marketPrices) {
      await MarketPrice.create(price);
    }
    logger.info(`${marketPrices.length} market prices created`);

    logger.info('Database seeding completed successfully');
    process.exit(0);
  } catch (error) {
    logger.error('Seeding error:', error);
    process.exit(1);
  }
};

if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;