// backend/server.js or backend/src/index.js
const express = require('express');
const cors = require('cors');
const authRoutes = require('./src/routes/authRoutes'); // Adjust path as needed
const userRoutes = require('./src/routes/userRoutes'); // User management routes

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Debug middleware to log all requests
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.url}`);
  next();
});

// Mount auth routes 
app.use('/api/auth', authRoutes);

// Mount user management routes
app.use('/api/users', userRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 Auth endpoints:`);
  console.log(`   POST   http://localhost:${PORT}/api/auth/register`);
  console.log(`   POST   http://localhost:${PORT}/api/auth/login`);
  console.log(`   GET    http://localhost:${PORT}/api/auth/profile`);
  console.log(`   PUT    http://localhost:${PORT}/api/auth/profile`);
  console.log(`   POST   http://localhost:${PORT}/api/auth/change-password`);
  console.log(`   POST   http://localhost:${PORT}/api/auth/logout`);
  console.log(`   DELETE http://localhost:${PORT}/api/auth/account`);
});