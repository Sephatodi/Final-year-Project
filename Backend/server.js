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

const { sequelize } = require('./src/models');
const setupDatabase = require('./src/config/setupDatabase');

// Route imports
const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/userRoutes');
const consultationRoutes = require('./src/routes/consultationRoutes');
const livestockRoutes = require('./src/routes/livestockRoutes');
const healthRoutes = require('./src/routes/healthRoutes');
const knowledgeRoutes = require('./src/routes/knowledgeRoutes');
const marketRoutes = require('./src/routes/marketRoutes');
const syncRoutes = require('./src/routes/syncRoutes');
const notificationRoutes = require('./src/routes/notificationRoutes');

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
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
  'https://final-year-project-blond-two.vercel.app',
  process.env.FRONTEND_URL,
  /\.vercel\.app$/,
  /\.onrender\.com$/
].filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    const isAllowed = allowedOrigins.some(allowed => {
      if (allowed instanceof RegExp) {
        return allowed.test(origin);
      }
      return allowed === origin;
    });

    if (isAllowed || origin.startsWith('http://localhost')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

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
app.use('/api/users', userRoutes);
app.use('/api/consultations', consultationRoutes);
app.use('/api/livestock', livestockRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/knowledge', knowledgeRoutes);
app.use('/api/market', marketRoutes);
app.use('/api/sync', syncRoutes);
app.use('/api/notifications', notificationRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler (must come after all other middleware and routes)
app.use((err, req, res, next) => {
  console.error('Server error:', err.stack || err);

  // Extract status code and message
  const status = err.statusCode || err.status || 500;
  const message = err.message || 'Internal server error';
  const code = err.code || 'INTERNAL_ERROR';

  res.status(status).json({
    error: message,
    code,
    ...(process.env.NODE_ENV === 'development' && { details: err.stack })
  });
});

// Database sync and server start
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ PostgreSQL connected');

    await setupDatabase();
    console.log('✅ Database setup complete');

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