// Centralizes server configuration from environment variables.
const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

module.exports = {
  port: parseInt(process.env.PORT, 10) || 3001,
  nodeEnv: process.env.NODE_ENV || 'development',

  jwtSecret: process.env.JWT_SECRET || 'tea-map-secret-key-change-me',
  jwtExpiresIn: '7d',

  corsOrigins: [
    'http://localhost:5173',
    'http://localhost:4173',
    process.env.CLIENT_URL,
  ].filter(Boolean),

  dbPath: path.join(__dirname, '..', 'tea-map.db'),
  clientDist: path.join(__dirname, '..', '..', 'client', 'dist'),
};
