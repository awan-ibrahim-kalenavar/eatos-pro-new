const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Menu item name is required'],
    trim: true,
    index: true
  },
  description: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    enum: ['Appetizer', 'Main Course', 'Dessert', 'Beverage'],
    required: [true, 'Category is required']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  ingredients: [{
    type: String,
    trim: true
  }],
  isAvailable: {
    type: Boolean,
    default: true
  },
  preparationTime: {
    type: Number,
    min: [0, 'Preparation time cannot be negative']
  },
  imageUrl: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Text index for search functionality
menuItemSchema.index({ name: 'text', ingredients: 'text' });

// Virtual for formatted price
menuItemSchema.virtual('formattedPrice').get(function() {
  return `$${this.price.toFixed(2)}`;
});

// Pre-save middleware to ensure ingredients array is unique
menuItemSchema.pre('save', function(next) {
  if (this.ingredients) {
    this.ingredients = [...new Set(this.ingredients)];
  }
  next();
});

module.exports = mongoose.model('MenuItem', menuItemSchema);
