const express = require('express');
const {
  getOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  getOrderStats,
  getTopSellingItems
} = require('../controllers/orderController');
const { body } = require('express-validator');

const router = express.Router();

// Validation middleware for creating orders
const validateOrder = [
  body('items')
    .isArray({ min: 1 })
    .withMessage('Order must contain at least one item'),
  
  body('items.*.menuItem')
    .isMongoId()
    .withMessage('Invalid menu item ID'),
  
  body('items.*.quantity')
    .isInt({ min: 1 })
    .withMessage('Quantity must be at least 1'),
  
  body('customerName')
    .trim()
    .notEmpty()
    .withMessage('Customer name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Customer name must be between 2 and 100 characters'),
  
  body('tableNumber')
    .isInt({ min: 1 })
    .withMessage('Table number must be at least 1')
];

// Validation middleware for status update
const validateStatusUpdate = [
  body('status')
    .isIn(['Pending', 'Preparing', 'Ready', 'Delivered', 'Cancelled'])
    .withMessage('Invalid order status')
];

// Routes
router.get('/', getOrders);
router.get('/stats', getOrderStats);
router.get('/top-items', getTopSellingItems);
router.get('/:id', getOrderById);
router.post('/', validateOrder, createOrder);
router.patch('/:id/status', validateStatusUpdate, updateOrderStatus);

module.exports = router;
