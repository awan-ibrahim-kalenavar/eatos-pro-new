const express = require('express');
const {
  getMenuItems,
  searchMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  toggleAvailability
} = require('../controllers/menuController');
const { body } = require('express-validator');

const router = express.Router();

// Validation middleware
const validateMenuItem = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must not exceed 500 characters'),
  
  body('category')
    .isIn(['Appetizer', 'Main Course', 'Dessert', 'Beverage'])
    .withMessage('Invalid category'),
  
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  
  body('ingredients')
    .optional()
    .isArray()
    .withMessage('Ingredients must be an array'),
  
  body('ingredients.*')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Each ingredient must be a non-empty string'),
  
  body('preparationTime')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Preparation time must be a non-negative integer'),
  
  body('imageUrl')
    .optional()
    .isURL()
    .withMessage('Image URL must be a valid URL')
];

// Routes
router.get('/', getMenuItems);
router.get('/search', searchMenuItems);
router.get('/:id', getMenuItemById);
router.post('/', validateMenuItem, createMenuItem);
router.put('/:id', validateMenuItem, updateMenuItem);
router.delete('/:id', deleteMenuItem);
router.patch('/:id/availability', toggleAvailability);

module.exports = router;
