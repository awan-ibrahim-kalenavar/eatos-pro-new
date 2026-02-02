const MenuItem = require('../models/MenuItem');
const { validationResult } = require('express-validator');

// Demo data for testing without MongoDB
const demoMenuItems = [
  {
    _id: 'demo1',
    name: 'Caesar Salad',
    description: 'Fresh romaine lettuce, parmesan cheese, croutons, and our signature Caesar dressing',
    category: 'Appetizer',
    price: 12.99,
    ingredients: ['romaine lettuce', 'parmesan cheese', 'croutons', 'caesar dressing', 'anchovies'],
    isAvailable: true,
    preparationTime: 15,
    imageUrl: 'https://images.unsplash.com/photo-1546793665-c746869a6f33?w=80&h=80&fit=crop&crop=center',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: 'demo2',
    name: 'Grilled Salmon',
    description: 'Atlantic salmon grilled to perfection, served with lemon butter sauce and seasonal vegetables',
    category: 'Main Course',
    price: 28.99,
    ingredients: ['atlantic salmon', 'lemon', 'butter', 'seasonal vegetables', 'herbs'],
    isAvailable: true,
    preparationTime: 25,
    imageUrl: 'https://images.unsplash.com/photo-1467003900940-56cd4f9c3b00?w=80&h=80&fit=crop&crop=center',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: 'demo3',
    name: 'Chocolate Lava Cake',
    description: 'Warm chocolate cake with a molten center, served with vanilla ice cream',
    category: 'Dessert',
    price: 8.99,
    ingredients: ['dark chocolate', 'butter', 'eggs', 'sugar', 'vanilla ice cream'],
    isAvailable: true,
    preparationTime: 20,
    imageUrl: 'https://images.unsplash.com/photo-1578988845406-8b5b052e678d?w=80&h=80&fit=crop&crop=center',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: 'demo4',
    name: 'Fresh Orange Juice',
    description: 'Freshly squeezed orange juice, served chilled with ice',
    category: 'Beverage',
    price: 4.99,
    ingredients: ['fresh oranges', 'ice'],
    isAvailable: true,
    preparationTime: 5,
    imageUrl: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=80&h=80&fit=crop&crop=center',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: 'demo5',
    name: 'Margherita Pizza',
    description: 'Classic Italian pizza with fresh mozzarella, tomatoes, and basil',
    category: 'Main Course',
    price: 16.99,
    ingredients: ['pizza dough', 'mozzarella cheese', 'tomatoes', 'basil', 'olive oil'],
    isAvailable: false,
    preparationTime: 30,
    imageUrl: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=80&h=80&fit=crop&crop=center',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: 'demo6',
    name: 'Greek Salad',
    description: 'Mediterranean salad with feta cheese, olives, and fresh vegetables',
    category: 'Appetizer',
    price: 10.99,
    ingredients: ['tomatoes', 'cucumber', 'red onion', 'feta cheese', 'olives', 'olive oil'],
    isAvailable: true,
    preparationTime: 10,
    imageUrl: 'https://images.unsplash.com/photo-1512052628-b1a2d8809dfe?w=80&h=80&fit=crop&crop=center',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: 'demo7',
    name: 'Ribeye Steak',
    description: 'Premium ribeye steak grilled to perfection, served with roasted potatoes',
    category: 'Main Course',
    price: 35.99,
    ingredients: ['ribeye steak', 'sea salt', 'black pepper', 'garlic butter', 'rosemary', 'roasted potatoes'],
    isAvailable: true,
    preparationTime: 35,
    imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a3b7d9?w=80&h=80&fit=crop&crop=center',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: 'demo8',
    name: 'Tiramisu',
    description: 'Classic Italian dessert with coffee-soaked ladyfingers and mascarpone cream',
    category: 'Dessert',
    price: 9.99,
    ingredients: ['ladyfingers', 'espresso', 'mascarpone', 'cocoa powder', 'dark chocolate'],
    isAvailable: true,
    preparationTime: 15,
    imageUrl: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=80&h=80&fit=crop&crop=center',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: 'demo9',
    name: 'Burger Deluxe',
    description: 'Juicy beef patty with lettuce, tomato, cheese, and special sauce',
    category: 'Main Course',
    price: 14.99,
    ingredients: ['beef patty', 'lettuce', 'tomato', 'cheese', 'burger bun', 'special sauce'],
    isAvailable: true,
    preparationTime: 20,
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c94539c2ab?w=80&h=80&fit=crop&crop=center',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: 'demo10',
    name: 'Iced Coffee',
    description: 'Cold brew coffee with milk and ice, perfect for hot days',
    category: 'Beverage',
    price: 3.99,
    ingredients: ['coffee', 'milk', 'ice', 'sugar'],
    isAvailable: true,
    preparationTime: 3,
    imageUrl: 'https://images.unsplash.com/photo-1511927032243-71e8866546ce?w=80&h=80&fit=crop&crop=center',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: 'demo11',
    name: 'French Fries',
    description: 'Crispy golden french fries with sea salt',
    category: 'Appetizer',
    price: 5.99,
    ingredients: ['potatoes', 'sea salt', 'vegetable oil'],
    isAvailable: true,
    preparationTime: 12,
    imageUrl: 'https://images.unsplash.com/photo-1630383560587-9a7480a66b6c?w=80&h=80&fit=crop&crop=center',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: 'demo12',
    name: 'Ice Cream Sundae',
    description: 'Vanilla ice cream with chocolate sauce, nuts, and cherry',
    category: 'Dessert',
    price: 6.99,
    ingredients: ['vanilla ice cream', 'chocolate sauce', 'nuts', 'cherry'],
    isAvailable: true,
    preparationTime: 8,
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c94539c2ab?w=80&h=80&fit=crop&crop=center',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: 'demo13',
    name: 'Pasta Carbonara',
    description: 'Classic Italian pasta with eggs, bacon, parmesan cheese, and black pepper',
    category: 'Main Course',
    price: 18.99,
    ingredients: ['spaghetti', 'eggs', 'bacon', 'parmesan cheese', 'black pepper'],
    isAvailable: true,
    preparationTime: 25,
    imageUrl: 'https://images.unsplash.com/photo-1602821064615-45bf5b67d933?w=80&h=80&fit=crop&crop=center',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: 'demo14',
    name: 'Mojito Cocktail',
    description: 'Refreshing Cuban cocktail with rum, mint, lime, and soda water',
    category: 'Beverage',
    price: 8.99,
    ingredients: ['white rum', 'fresh mint', 'lime juice', 'sugar', 'soda water'],
    isAvailable: true,
    preparationTime: 5,
    imageUrl: 'https://images.unsplash.com/photo-1546171755-1fd32b9c4d86?w=80&h=80&fit=crop&crop=center',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: 'demo15',
    name: 'Chicken Wings',
    description: 'Crispy fried chicken wings with buffalo sauce and blue cheese dip',
    category: 'Appetizer',
    price: 9.99,
    ingredients: ['chicken wings', 'buffalo sauce', 'blue cheese', 'celery', 'carrots'],
    isAvailable: true,
    preparationTime: 20,
    imageUrl: 'https://images.unsplash.com/photo-1562967916-eb82221dfb92?w=80&h=80&fit=crop&crop=center',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: 'demo16',
    name: 'Cheesecake',
    description: 'New York style cheesecake with strawberry topping',
    category: 'Dessert',
    price: 7.99,
    ingredients: ['cream cheese', 'sugar', 'eggs', 'vanilla', 'strawberries'],
    isAvailable: true,
    preparationTime: 15,
    imageUrl: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=80&h=80&fit=crop&crop=center',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Helper function to simulate async operations
const asyncOperation = (data, delay = 100) => {
  return new Promise(resolve => {
    setTimeout(() => resolve(data), delay);
  });
};

// GET /api/menu - Get all menu items with filters
exports.getMenuItems = async (req, res) => {
  try {
    const {
      category,
      availability,
      minPrice,
      maxPrice,
      page = 1,
      limit = 10
    } = req.query;

    // Build filter object
    const filter = {};
    
    if (category) {
      filter.category = category;
    }
    
    if (availability !== undefined) {
      filter.isAvailable = availability === 'true';
    }
    
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    let filteredItems = [...demoMenuItems];

    // Apply filters
    if (filter.category) {
      filteredItems = filteredItems.filter(item => item.category === filter.category);
    }

    if (filter.isAvailable !== undefined) {
      filteredItems = filteredItems.filter(item => item.isAvailable === filter.isAvailable);
    }

    if (filter.price) {
      filteredItems = filteredItems.filter(item => item.price >= filter.price.$gte && item.price <= filter.price.$lte);
    }

    // Apply pagination
    const skip = (page - 1) * limit;
    const paginatedItems = filteredItems.slice(skip, skip + limit);

    const total = filteredItems.length;

    res.json({
      success: true,
      data: paginatedItems,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching menu items',
      error: error.message
    });
  }
};

// GET /api/menu/search - Search menu items
exports.searchMenuItems = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { q, page = 1, limit = 10 } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const searchTerm = q.toLowerCase();
    
    // Search in demo data
    const searchResults = demoMenuItems.filter(item => 
      item.name.toLowerCase().includes(searchTerm) ||
      item.description.toLowerCase().includes(searchTerm) ||
      item.ingredients.some(ingredient => ingredient.toLowerCase().includes(searchTerm))
    );

    // Apply pagination
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    const paginatedResults = searchResults.slice(startIndex, endIndex);

    const result = {
      success: true,
      data: paginatedResults,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: searchResults.length,
        pages: Math.ceil(searchResults.length / limitNum)
      },
      searchQuery: q
    };

    // Simulate database delay
    await asyncOperation(result);
    res.json(result);
  } catch (error) {
    console.error('Error in searchMenuItems:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while searching menu items'
    });
  }
};

// GET /api/menu/:id - Get single menu item
exports.getMenuItemById = async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found'
      });
    }

    res.json({
      success: true,
      data: menuItem
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching menu item',
      error: error.message
    });
  }
};

// POST /api/menu - Create new menu item
exports.createMenuItem = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const menuItem = new MenuItem(req.body);
    await menuItem.save();

    res.status(201).json({
      success: true,
      data: menuItem,
      message: 'Menu item created successfully'
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Menu item with this name already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error creating menu item',
    });
  }
};

// PUT /api/menu/:id - Update menu item
exports.updateMenuItem = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const menuItem = demoMenuItems.find(item => item._id === req.params.id);

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found'
      });
    }

    const {
      name,
      description,
      category,
      price,
      ingredients,
      isAvailable,
      preparationTime,
      imageUrl
    } = req.body;

    // Update menu item
    menuItem.name = name;
    menuItem.description = description;
    menuItem.category = category;
    menuItem.price = parseFloat(price);
    menuItem.ingredients = ingredients ? ingredients.split(',').map(ing => ing.trim()).filter(ing => ing) : [];
    menuItem.isAvailable = isAvailable !== undefined ? isAvailable : true;
    menuItem.preparationTime = preparationTime ? parseInt(preparationTime) : undefined;
    menuItem.imageUrl = imageUrl || undefined;
    menuItem.updatedAt = new Date();

    const result = {
      success: true,
      data: menuItem,
      message: 'Menu item updated successfully'
    };

    // Simulate database delay
    await asyncOperation(result);
    res.json(result);
  } catch (error) {
    console.error('Error in updateMenuItem:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating menu item'
    });
  }
};

// DELETE /api/menu/:id - Delete menu item
exports.deleteMenuItem = async (req, res) => {
  try {
    const itemIndex = demoMenuItems.findIndex(item => item._id === req.params.id);

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found'
      });
    }

    // Remove from demo data
    const deletedItem = demoMenuItems.splice(itemIndex, 1)[0];

    const result = {
      success: true,
      data: deletedItem,
      message: 'Menu item deleted successfully'
    };

    // Simulate database delay
    await asyncOperation(result);
    res.json(result);
  } catch (error) {
    console.error('Error in deleteMenuItem:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting menu item'
    });
  }
};

// Toggle menu item availability
exports.toggleAvailability = async (req, res) => {
  try {
    const menuItem = demoMenuItems.find(item => item._id === req.params.id);

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found'
      });
    }

    // Toggle availability
    menuItem.isAvailable = !menuItem.isAvailable;
    menuItem.updatedAt = new Date();

    const result = {
      success: true,
      data: menuItem,
      message: `Menu item availability updated to ${menuItem.isAvailable ? 'available' : 'unavailable'}`
    };

    // Simulate database delay
    await asyncOperation(result);
    res.json(result);
  } catch (error) {
    console.error('Error in toggleAvailability:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while toggling menu item availability'
    });
  }
};
