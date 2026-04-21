// backend/src/config/fileStorage.js
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const USERS_FILE = path.join(__dirname, '../../data/users.json');

// Ensure data directory exists
const dataDir = path.dirname(USERS_FILE);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize users file if it doesn't exist
if (!fs.existsSync(USERS_FILE)) {
  const defaultUsers = [
    {
      id: 'user_1',
      name: 'Farmer User',
      email: 'farmer@example.com',
      password: '$2a$10$8Kz6Wv9.vE5E5oV2y5vE5uU/R9.vE5E5oV2y5vE5uU/R9.vE5E5', // Test123!
      role: 'farmer',
      phone: '71234567',
      region: 'Central',
      farmName: 'Demo Farm',
      createdAt: new Date().toISOString()
    },
    {
      id: 'user_2',
      name: 'Expert User',
      email: 'expert@example.com',
      password: '$2a$10$8Kz6Wv9.vE5E5oV2y5vE5uU/R9.vE5E5oV2y5vE5uU/R9.vE5E5', // Test123!
      role: 'expert',
      phone: '71234568',
      region: 'Central',
      specialization: 'Veterinary Medicine',
      createdAt: new Date().toISOString()
    },
    {
      id: 'user_3',
      name: 'Admin User',
      email: 'admin@example.com',
      password: '$2a$10$8Kz6Wv9.vE5E5oV2y5vE5uU/R9.vE5E5oV2y5vE5uU/R9.vE5E5', // Test123!
      role: 'admin',
      phone: '71234569',
      createdAt: new Date().toISOString()
    }
  ];
  fs.writeFileSync(USERS_FILE, JSON.stringify(defaultUsers, null, 2));
}

const readUsers = () => {
  const data = fs.readFileSync(USERS_FILE, 'utf8');
  return JSON.parse(data);
};

const writeUsers = (users) => {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
};

const findUserByEmail = (email) => {
  const users = readUsers();
  return users.find(u => u.email === email);
};

const createUser = async (userData) => {
  const users = readUsers();
  const newUser = {
    id: 'user_' + Date.now(),
    ...userData,
    password: await bcrypt.hash(userData.password, 10),
    createdAt: new Date().toISOString()
  };
  users.push(newUser);
  writeUsers(users);
  return newUser;
};

module.exports = { findUserByEmail, createUser, readUsers };