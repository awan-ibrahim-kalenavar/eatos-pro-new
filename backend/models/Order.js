const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  menuItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MenuItem',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1']
  },
  price: {
    type: Number,
    required: true,
    min: [0, 'Price cannot be negative']
  }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true
  },
  items: [orderItemSchema],
  totalAmount: {
    type: Number,
    required: true,
    min: [0, 'Total amount cannot be negative']
  },
  status: {
    type: String,
    enum: ['Pending', 'Preparing', 'Ready', 'Delivered', 'Cancelled'],
    default: 'Pending'
  },
  customerName: {
    type: String,
    required: [true, 'Customer name is required'],
    trim: true
  },
  tableNumber: {
    type: Number,
    required: [true, 'Table number is required'],
    min: [1, 'Table number must be at least 1']
  }
}, {
  timestamps: true
});

// Index for efficient queries
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });

// Pre-save middleware to generate order number
orderSchema.pre('save', async function(next) {
  if (this.isNew && !this.orderNumber) {
    const count = await this.constructor.countDocuments();
    this.orderNumber = `ORD${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

// Virtual for formatted total amount
orderSchema.virtual('formattedTotal').get(function() {
  return `$${this.totalAmount.toFixed(2)}`;
});

// Instance method to update status
orderSchema.methods.updateStatus = function(newStatus) {
  const validTransitions = {
    'Pending': ['Preparing', 'Cancelled'],
    'Preparing': ['Ready', 'Cancelled'],
    'Ready': ['Delivered'],
    'Delivered': [],
    'Cancelled': []
  };

  if (!validTransitions[this.status].includes(newStatus)) {
    throw new Error(`Cannot transition from ${this.status} to ${newStatus}`);
  }

  this.status = newStatus;
  return this.save();
};

module.exports = mongoose.model('Order', orderSchema);
