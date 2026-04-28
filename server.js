// backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const path = require('path');
const http = require('http');
const WebSocket = require('ws');

const { sequelize } = require('./Backend/src/config/database');
const { testConnection } = require('./Backend/src/config/database');

// Route imports
const authRoutes = require('./Backend/src/routes/authRoutes');
const consultationRoutes = require('./Backend/src/routes/consultationRoutes');
const livestockRoutes = require('./Backend/src/routes/livestockRoutes');
const healthRoutes = require('./Backend/src/routes/healthRoutes');
const syncRoutes = require('./Backend/src/routes/syncRoutes');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Store WebSocket connections
const clients = new Map();

// WebSocket connection handling
wss.on('connection', (ws, req) => {
  const userId = req.headers['user-id'];
  if (userId) {
    clients.set(userId, ws);
    console.log(`Client ${userId} connected`);
  }
  
  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data);
      
      // Handle different message types
      switch (message.type) {
        case 'message':
          // Broadcast to consultation participants
          if (message.data.consultationId) {
            // In production, look up participants and send to their connections
            broadcastToConsultation(message.data.consultationId, message);
          }
          break;
        case 'typing':
          // Forward typing indicators
          if (message.data.toUserId && clients.has(message.data.toUserId)) {
            clients.get(message.data.toUserId).send(JSON.stringify(message));
          }
          break;
      }
    } catch (error) {
      console.error('WebSocket message error:', error);
    }
  });
  
  ws.on('close', () => {
    // Remove connection
    for (const [id, client] of clients.entries()) {
      if (client === ws) {
        clients.delete(id);
        break;
      }
    }
    console.log('Client disconnected');
  });
});

// Broadcast to all participants in a consultation
const broadcastToConsultation = async (consultationId, message) => {
  // In production, fetch consultation participants from database
  // and send to their WebSocket connections
  for (const [userId, client] of clients) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  }
};

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('dev'));

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/consultations', consultationRoutes);
app.use('/api/livestock', livestockRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/sync', syncRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err.stack);
  res.status(500).json({ 
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// Database sync and server start
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ PostgreSQL connected');
    
    // Sync database models
    await sequelize.sync({ alter: process.env.NODE_ENV === 'development' });
    console.log('✅ Database tables synchronized');
    
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔌 WebSocket server ready`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = { app, server, wss };