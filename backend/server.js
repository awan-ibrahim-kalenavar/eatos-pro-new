require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

// Import routes
const menuRoutes = require('./routes/menu');
const orderRoutes = require('./routes/orders');

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API routes
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);

// API documentation endpoint
app.get('/api', (req, res) => {
  res.json({
    message: 'Restaurant Admin Dashboard API',
    version: '1.0.0',
    endpoints: {
      menu: {
        'GET /api/menu': 'Get all menu items with filters',
        'GET /api/menu/search': 'Search menu items',
        'GET /api/menu/:id': 'Get single menu item',
        'POST /api/menu': 'Create new menu item',
        'PUT /api/menu/:id': 'Update menu item',
        'DELETE /api/menu/:id': 'Delete menu item',
        'PATCH /api/menu/:id/availability': 'Toggle availability'
      },
      orders: {
        'GET /api/orders': 'Get all orders with pagination',
        'GET /api/orders/:id': 'Get single order',
        'POST /api/orders': 'Create new order',
        'PATCH /api/orders/:id/status': 'Update order status',
        'GET /api/orders/stats': 'Get order statistics',
        'GET /api/orders/top-items': 'Get top selling items'
      }
    }
  });
});

// 404 handler
app.use(notFound);

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});

module.exports = app;
