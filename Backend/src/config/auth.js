const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Mock user for demonstration - in production, fetch from CouchDB
const MOCK_USER = {
    id: 'user_123',
    email: 'admin@farm-aid.com',
    passwordHash: '$2a$10$8Kz6Wv9.vE5E5oV2y5vE5uU/R9.vE5E5oV2y5vE5uU/R9.vE5E5', // Example hash for 'password123'
    role: 'admin'
};

router.post('/register', async (req, res) => {
    const { email, password, role } = req.body;

    try {
        // Generate salt and hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const userId = 'user_' + Math.random().toString(36).substr(2, 9);

        // Create Token
        const token = jwt.sign(
            { email: email, userId: userId, role: role || 'farmer' },
            process.env.JWT_SECRET || 'super_secret_key',
            { expiresIn: '1h' }
        );

        res.status(201).json({
            token,
            expiresIn: 3600,
            userId: userId
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Find user (this is where you'd query your PouchDB/CouchDB)
        if (email !== MOCK_USER.email) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // 2. Check password (mocked for now, usually bcrypt.compare)
        // const isValid = await bcrypt.compare(password, MOCK_USER.passwordHash);
        const isValid = password === 'password123'; // Simple check for testing

        if (!isValid) return res.status(401).json({ message: 'Invalid credentials' });

        // 3. Create Token
        const token = jwt.sign(
            { email: email, userId: MOCK_USER.id, role: MOCK_USER.role },
            process.env.JWT_SECRET || 'super_secret_key',
            { expiresIn: '1h' }
        );

        res.status(200).json({ token, expiresIn: 3600, userId: MOCK_USER.id, role: MOCK_USER.role });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;