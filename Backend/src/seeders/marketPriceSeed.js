// src/seeders/marketPriceSeed.js
const { MarketPrice, User } = require('../models');

const marketPriceData = [
    {
        livestockType: 'cattle',
        breed: 'Angus',
        price: 2500.00,
        currency: 'USD',
        location: 'Nairobi',
        marketName: 'Nairobi Livestock Market',
        latitude: -1.286389,
        longitude: 36.817223,
        verificationStatus: 'verified'
    },
    {
        livestockType: 'cattle',
        breed: 'Hereford',
        price: 2300.00,
        currency: 'USD',
        location: 'Nakuru',
        marketName: 'Nakuru County Market',
        latitude: -0.303099,
        longitude: 36.080026,
        verificationStatus: 'verified'
    },
    {
        livestockType: 'sheep',
        breed: 'Dorper',
        price: 350.00,
        currency: 'USD',
        location: 'Nairobi',
        marketName: 'Nairobi Livestock Market',
        latitude: -1.286389,
        longitude: 36.817223,
        verificationStatus: 'verified'
    },
    {
        livestockType: 'goat',
        breed: 'Boer',
        price: 280.00,
        currency: 'USD',
        location: 'Mombasa',
        marketName: 'Mombasa Livestock Auction',
        latitude: -4.043477,
        longitude: 39.668206,
        verificationStatus: 'verified'
    },
    {
        livestockType: 'pig',
        breed: 'Large White',
        price: 450.00,
        currency: 'USD',
        location: 'Kisumu',
        marketName: 'Kisumu Market',
        latitude: -0.102212,
        longitude: 34.761715,
        verificationStatus: 'pending'
    },
    {
        livestockType: 'chicken',
        breed: 'Broiler',
        price: 15.00,
        currency: 'USD',
        location: 'Nairobi',
        marketName: 'Kariobangi Market',
        latitude: -1.286389,
        longitude: 36.817223,
        verificationStatus: 'verified'
    },
    {
        livestockType: 'cattle',
        breed: 'Friesian',
        price: 3200.00,
        currency: 'USD',
        location: 'Eldoret',
        marketName: 'Eldoret Farmers Market',
        latitude: 0.514277,
        longitude: 35.269779,
        verificationStatus: 'verified'
    },
    {
        livestockType: 'sheep',
        breed: 'Merino',
        price: 380.00,
        currency: 'USD',
        location: 'Naivasha',
        marketName: 'Naivasha Livestock Auction',
        latitude: -0.717105,
        longitude: 36.435797,
        verificationStatus: 'verified'
    }
];

async function seedMarketPrices() {
    try {
        // Get a user to associate with these prices (preferably an admin)
        const admin = await User.findOne({ where: { role: 'admin' } });
        const farmer = await User.findOne({ where: { role: 'farmer' } });

        if (!admin && !farmer) {
            console.log('No users found. Please seed users first.');
            return;
        }

        const userId = admin?.id || farmer?.id;

        // Add userId to each price
        const pricesWithUser = marketPriceData.map(price => ({
            ...price,
            userId,
            reportedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) // Random dates in last 30 days
        }));

        // Clear existing data (optional - be careful!)
        // await MarketPrice.destroy({ where: {}, truncate: true });

        // Insert seed data
        await MarketPrice.bulkCreate(pricesWithUser);

        console.log(`✅ Seeded ${pricesWithUser.length} market prices successfully!`);
    } catch (error) {
        console.error('❌ Error seeding market prices:', error);
    }
}

module.exports = seedMarketPrices;

// If running directly
if (require.main === module) {
    const { sequelize } = require('../models');
    seedMarketPrices()
        .then(() => process.exit(0))
        .catch((error) => {
            console.error(error);
            process.exit(1);
        });
}