// setup-docker-dbs.js
const { Sequelize } = require('sequelize');
const nano = require('nano');

// PostgreSQL connection
const sequelize = new Sequelize('farm_aid', 'postgres', 'postgres', {
    host: 'localhost',
    port: 5432,
    dialect: 'postgres',
    logging: console.log
});

// CouchDB connection
const couch = nano('http://admin:password@localhost:5984');
const farmAidDb = couch.db.use('farm_aid');

async function setupDatabases() {
    console.log('🚀 Setting up Docker databases...\n');

    // ===== POSTGRESQL SETUP =====
    console.log('📦 Setting up PostgreSQL...');
    try {
        // Test connection
        await sequelize.authenticate();
        console.log('✅ PostgreSQL connected');

        // Define User model (temporarily here for setup)
        const User = sequelize.define('User', {
            id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
            name: { type: Sequelize.STRING, allowNull: false },
            email: { type: Sequelize.STRING, allowNull: false, unique: true },
            password: { type: Sequelize.STRING, allowNull: false },
            role: { type: Sequelize.ENUM('farmer', 'veterinarian', 'admin'), defaultValue: 'farmer' },
            isActive: { type: Sequelize.BOOLEAN, defaultValue: true }
        });

        // Define Livestock model
        const Livestock = sequelize.define('Livestock', {
            id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
            type: { type: Sequelize.STRING, allowNull: false },
            breed: { type: Sequelize.STRING },
            name: { type: Sequelize.STRING },
            tagNumber: { type: Sequelize.STRING, unique: true },
            birthDate: { type: Sequelize.DATE },
            gender: { type: Sequelize.STRING },
            healthStatus: { type: Sequelize.STRING, defaultValue: 'healthy' }
        });

        // Sync all tables
        await sequelize.sync({ force: true });
        console.log('✅ PostgreSQL tables created');

        // Create a test user
        const testUser = await User.create({
            name: 'Test Farmer',
            email: 'test@farmer.com',
            password: '$2a$10$YourHashedPasswordHere', // You'll need to hash properly
            role: 'farmer'
        });
        console.log('✅ Test user created');

    } catch (error) {
        console.error('❌ PostgreSQL error:', error.message);
    }

    // ===== COUCHDB SETUP =====
    console.log('\n📦 Setting up CouchDB...');
    try {
        // Check if database exists
        const dbs = await couch.db.list();
        if (!dbs.includes('farm_aid')) {
            await couch.db.create('farm_aid');
            console.log('✅ CouchDB database created');
        } else {
            console.log('✅ CouchDB database already exists');
        }

        // Create some sample documents
        const sampleKnowledge = {
            _id: 'knowledge_sample_1',
            type: 'knowledge_base',
            title: 'Common Cattle Diseases',
            category: 'health',
            content: 'Information about common cattle diseases...',
            tags: ['cattle', 'health', 'diseases'],
            createdAt: new Date().toISOString()
        };

        try {
            await farmAidDb.insert(sampleKnowledge);
            console.log('✅ Sample knowledge document created');
        } catch (err) {
            console.log('ℹ️ Sample document might already exist');
        }

        // Create design document for queries
        const designDoc = {
            _id: '_design/queries',
            views: {
                'by-type': {
                    map: function(doc) {
                        if (doc.type) {
                            emit(doc.type, null);
                        }
                    }.toString()
                },
                'by-category': {
                    map: function(doc) {
                        if (doc.category) {
                            emit(doc.category, null);
                        }
                    }.toString()
                }
            }
        };

        try {
            await farmAidDb.insert(designDoc);
            console.log('✅ Design document created');
        } catch (err) {
            console.log('ℹ️ Design document might already exist');
        }

    } catch (error) {
        console.error('❌ CouchDB error:', error.message);
    }

    console.log('\n✨ Database setup complete!');
    process.exit(0);
}

setupDatabases();