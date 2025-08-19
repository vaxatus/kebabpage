import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Set proper MIME types for static assets
app.use(express.static(join(__dirname, 'dist'), {
  setHeaders: (res, path) => {
    // Cache static assets for 1 year
    if (path.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$/)) {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    }
    // Cache HTML files for 1 hour
    else if (path.match(/\.html$/)) {
      res.setHeader('Cache-Control', 'public, max-age=3600');
    }
  }
}));

// Serve favicon.ico
app.get('/favicon.ico', (req, res) => {
  res.sendFile(join(__dirname, 'dist', 'favicon.ico'));
});

// Handle all routes by serving index.html (for SPA routing)
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Visit: http://localhost:${PORT}`);
});
