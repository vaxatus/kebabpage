import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, readdirSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Get port from environment variable with fallback
const PORT = process.env.PORT || 3000;
const RAILWAY_STATIC_URL = process.env.RAILWAY_STATIC_URL;
const PUBLIC_URL = process.env.PUBLIC_URL || RAILWAY_STATIC_URL;

console.log('🚀 Starting server...');
console.log('📊 Environment:', process.env.NODE_ENV || 'development');
console.log('🔌 Port from env:', process.env.PORT);
console.log('🔌 Final Port:', PORT);
console.log('🌐 Railway URL:', RAILWAY_STATIC_URL);
console.log('🌍 Public URL:', PUBLIC_URL);
console.log('📁 Current directory:', __dirname);
console.log('🔧 Process ID:', process.pid);

// Check if dist folder exists
const distPath = join(__dirname, 'dist');
console.log('📦 Dist folder exists:', existsSync(distPath));
if (existsSync(distPath)) {
  console.log('📂 Dist folder contents:', readdirSync(distPath));
}

const app = express();

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Add request logging
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});

// Serve static files from dist directory
app.use(express.static(join(__dirname, 'dist')));

// Health check endpoint
app.get('/health', (req, res) => {
  console.log('🏥 Health check requested');
  res.status(200).json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    port: PORT,
    envPort: process.env.PORT,
    env: process.env.NODE_ENV || 'development',
    pid: process.pid,
    uptime: process.uptime()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  console.log('🏠 Root endpoint requested');
  const indexPath = join(__dirname, 'dist', 'index.html');
  console.log('📄 Trying to serve:', indexPath);

  if (existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    console.error('❌ index.html not found at:', indexPath);
    res.status(404).send(`
      <h1>Build Error</h1>
      <p>The React app build files are missing.</p>
      <p>Expected index.html at: ${indexPath}</p>
      <p>Current directory: ${__dirname}</p>
      <p>Dist exists: ${existsSync(distPath)}</p>
      <p><a href="/health">Check health endpoint</a></p>
    `);
  }
});

// Catch-all handler for SPA routing
app.get('*', (req, res) => {
  console.log('🔄 Catch-all route:', req.path);
  const indexPath = join(__dirname, 'dist', 'index.html');

  if (existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    console.error('❌ index.html not found for route:', req.path);
    res.status(404).send(`
      <h1>Build Error</h1>
      <p>The React app build files are missing for route: ${req.path}</p>
      <p><a href="/health">Check health endpoint</a></p>
    `);
  }
});

// Error handling
app.use((err, req, res, next) => {
  console.error('❌ Error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start server
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server is running on port ${PORT}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🚂 Railway URL: ${process.env.RAILWAY_STATIC_URL || 'Not set'}`);
  console.log(`🏥 Health check: /health`);
  console.log(`🔌 Listening on: 0.0.0.0:${PORT}`);

  // Railway-specific logging
  if (process.env.RAILWAY_STATIC_URL) {
    console.log(`🌍 Live at: ${process.env.RAILWAY_STATIC_URL}`);
  }
});

// Error handling for server startup
server.on('error', (err) => {
  console.error('❌ Server startup error:', err);
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use`);
  }
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('✅ Process terminated');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('✅ Process terminated');
    process.exit(0);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});
