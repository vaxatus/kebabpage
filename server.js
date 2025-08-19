import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

console.log('Starting server...');
console.log('Environment:', process.env.NODE_ENV || 'development');
console.log('Port:', PORT);

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from dist directory
app.use(express.static(join(__dirname, 'dist')));

// Health check endpoint
app.get('/health', (req, res) => {
  console.log('Health check requested');
  res.status(200).json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    port: PORT,
    env: process.env.NODE_ENV || 'development'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  console.log('Root endpoint requested');
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

// Catch-all handler for SPA routing
app.get('*', (req, res) => {
  console.log('Catch-all route:', req.path);
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start server
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server is running on port ${PORT}`);
  console.log(`🌐 Visit: http://localhost:${PORT}`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
    process.exit(0);
  });
});
