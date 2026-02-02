const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');
const { validationResult } = require('express-validator');

// Demo data for testing without MongoDB
const demoOrders = [
  {
    _id: 'order1',
    orderNumber: 'ORD-2024-001',
    customerName: 'John Smith',
    tableNumber: 5,
    items: [
      {
        menuItem: {
          _id: 'demo1',
          name: 'Caesar Salad'
        },
        quantity: 2,
        price: 12.99,
        specialInstructions: 'Extra croutons please'
      },
      {
        menuItem: {
          _id: 'demo4',
          name: 'Fresh Orange Juice'
        },
        quantity: 2,
        price: 4.99
      }
    ],
    totalAmount: 35.96,
    status: 'Pending',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    updatedAt: new Date()
  },
  {
    _id: 'order2',
    orderNumber: 'ORD-2024-002',
    customerName: 'Sarah Johnson',
    tableNumber: 3,
    items: [
      {
        menuItem: {
          _id: 'demo2',
          name: 'Grilled Salmon'
        },
        quantity: 1,
        price: 28.99
      },
      {
        menuItem: {
          _id: 'demo3',
          name: 'Chocolate Lava Cake'
        },
        quantity: 1,
        price: 8.99
      }
    ],
    totalAmount: 37.98,
    status: 'Preparing',
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
    updatedAt: new Date()
  },
  {
    _id: 'order3',
    orderNumber: 'ORD-2024-003',
    customerName: 'Mike Davis',
    tableNumber: 7,
    items: [
      {
        menuItem: {
          _id: 'demo6',
          name: 'Greek Salad'
        },
        quantity: 1,
        price: 10.99
      }
    ],
    totalAmount: 10.99,
    status: 'Ready',
    createdAt: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
    updatedAt: new Date()
  },
  {
    _id: 'order4',
    orderNumber: 'ORD-2024-004',
    customerName: 'Emily Wilson',
    tableNumber: 2,
    items: [
      {
        menuItem: {
          _id: 'demo2',
          name: 'Grilled Salmon'
        },
        quantity: 2,
        price: 28.99
      }
    ],
    totalAmount: 57.98,
    status: 'Delivered',
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
    updatedAt: new Date()
  }
];

// Helper function to simulate async operations
const asyncOperation = (data, delay = 100) => {
  return new Promise(resolve => {
    setTimeout(() => resolve(data), delay);
  });
};

// GET /api/orders - Get all orders with pagination and status filter
exports.getOrders = async (req, res) => {
  try {
    const {
      status,
      page = 1,
      limit = 10
    } = req.query;

    // Build filter object
    const filter = {};
    if (status) {
      filter.status = status;
    }

    let orders = [...demoOrders];

    // Apply filters
    if (status) {
      orders = orders.filter(order => order.status === status);
    }

    const skip = (page - 1) * limit;
    const paginatedOrders = orders.slice(skip, skip + limit);

    const total = orders.length;

    const result = {
      success: true,
      data: paginatedOrders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    };

    // Simulate database delay
    await asyncOperation(result);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching orders',
      error: error.message
    });
  }
};

// GET /api/orders/:id - Get single order by ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.menuItem', 'name description price imageUrl');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching order',
      error: error.message
    });
  }
};

// POST /api/orders - Create new order
exports.createOrder = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { items, customerName, tableNumber } = req.body;

    // Validate menu items and calculate total
    let totalAmount = 0;
    const validatedItems = [];

    for (const item of items) {
      const menuItem = await MenuItem.findById(item.menuItem);
      
      if (!menuItem) {
        return res.status(400).json({
          success: false,
          message: `Menu item with ID ${item.menuItem} not found`
        });
      }

      if (!menuItem.isAvailable) {
        return res.status(400).json({
          success: false,
          message: `Menu item ${menuItem.name} is not available`
        });
      }

      const itemTotal = menuItem.price * item.quantity;
      totalAmount += itemTotal;

      validatedItems.push({
        menuItem: item.menuItem,
        quantity: item.quantity,
        price: menuItem.price
      });
    }

    // Create order
    const order = new Order({
      items: validatedItems,
      totalAmount,
      customerName,
      tableNumber
    });

    await order.save();

    // Populate menu item details for response
    await order.populate('items.menuItem', 'name description price imageUrl');

    res.status(201).json({
      success: true,
      data: order,
      message: 'Order created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating order',
      error: error.message
    });
  }
};

// PATCH /api/orders/:id/status - Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { id } = req.params;
    const { status } = req.body;

    // Find order in demo data
    const orderIndex = demoOrders.findIndex(order => order._id === id);
    
    if (orderIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Update order status
    demoOrders[orderIndex].status = status;
    demoOrders[orderIndex].updatedAt = new Date();

    const updatedOrder = demoOrders[orderIndex];

    const result = {
      success: true,
      data: updatedOrder,
      message: `Order status updated to ${status}`
    };

    // Simulate database delay
    await asyncOperation(result);
    res.json(result);
  } catch (error) {
    console.error('Error in updateOrderStatus:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating order status'
    });
  }
};

// GET /api/orders/stats - Get order statistics
exports.getOrderStats = async (req, res) => {
  try {
    const stats = await Order.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$totalAmount' }
        }
      }
    ]);

    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([
      { $match: { status: 'Delivered' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    res.json({
      success: true,
      data: {
        statusStats: stats,
        totalOrders,
        totalRevenue: totalRevenue[0]?.total || 0
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching order statistics',
      error: error.message
    });
  }
};

// GET /api/orders/top-items - Get top selling menu items
exports.getTopSellingItems = async (req, res) => {
  try {
    const topItems = await Order.aggregate([
      { $match: { status: 'Delivered' } },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.menuItem',
          totalSold: { $sum: '$items.quantity' },
          totalRevenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
        }
      },
      {
        $lookup: {
          from: 'menuitems',
          localField: '_id',
          foreignField: '_id',
          as: 'menuItem'
        }
      },
      { $unwind: '$menuItem' },
      {
        $project: {
          name: '$menuItem.name',
          category: '$menuItem.category',
          price: '$menuItem.price',
          totalSold: 1,
          totalRevenue: 1
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 }
    ]);

    res.json({
      success: true,
      data: topItems
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching top selling items',
      error: error.message
    });
  }
};
