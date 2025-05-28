// Import required dependencies
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// ===== MIDDLEWARE =====

// Security headers
app.use(helmet());

// CORS configuration
app.use(cors());

// Request parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use(morgan('dev'));

// ===== ROUTES =====

// Simple HTML response for root
app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <title>Node.js Simple App</title>
    </head>
    <body>
      <h1>Welcome to JATIN Node.js Simple App</h1>
      
      <div class="card">
        <h2>Server Information</h2>
        <p>Node.js Version: ${process.version}</p>
        <p>Server Time: ${new Date().toLocaleString()}</p>
        <p>Environment: ${process.env.NODE_ENV || 'development'}</p>
      </div>
      
      <div class="card">
        <h2>Available Endpoints</h2>
        <ul class="endpoints">
          <li><span class="method get">GET</span> <code>/</code> - HomePage</li>
          <li><span class="method get">GET</span> <code>/api</code> - API information</li>
          <li><span class="method get">GET</span> <code>/time</code> - Current server time</li>
          <li><span class="method get">GET</span> <code>/health</code> - Server health check</li>
        </ul>
      </div>

      <div class="card">
        <h2>Quick Start</h2>
        <p>Try making a request to one of the API endpoints:</p>
        <code>curl http://localhost:${PORT}/api/time</code>
      </div>
    </body>
    </html>
  `);
});

// API routes
app.get('/api', (req, res) => {
    res.json({
        message: 'API is running',
        version: '1.0.0',
        endpoints: [
            { method: 'GET', path: '/api', description: 'API information' },
            { method: 'GET', path: '/time', description: 'Current server time' },
            { method: 'GET', path: '/health', description: 'Current health' }        ]
    });
});

app.get('/time', (req, res) => {
    res.json({
        time: new Date().toISOString(),
        timestamp: Date.now(),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    });
});


// Health check for deployment environments
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        uptime: process.uptime(),
        timestamp: Date.now()
    });
});

// Handle 404 - Route not found
app.use((req, res) => {
    res.status(404).json({
        error: 'Not Found',
        message: `Cannot find ${req.originalUrl} on this server!`
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Error:', err.message);

    res.status(err.status || 500).json({
        error: err.name || 'Error',
        message: err.message || 'Something went wrong on the server',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

// ===== SERVER =====

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT} │   Environment: ${process.env.NODE_ENV || 'development'}`);
});
