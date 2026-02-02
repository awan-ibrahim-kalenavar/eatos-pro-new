require('dotenv').config();
const mongoose = require('mongoose');
const MenuItem = require('../models/MenuItem');
const Order = require('../models/Order');

// Sample menu items data
const menuItems = [
  {
    name: "Caesar Salad",
    description: "Fresh romaine lettuce with parmesan cheese, croutons, and Caesar dressing",
    category: "Appetizer",
    price: 8.99,
    ingredients: ["romaine lettuce", "parmesan", "croutons", "caesar dressing"],
    isAvailable: true,
    preparationTime: 10,
    imageUrl: "https://example.com/caesar-salad.jpg"
  },
  {
    name: "Garlic Bread",
    description: "Toasted bread with garlic butter and herbs",
    category: "Appetizer",
    price: 4.99,
    ingredients: ["bread", "garlic", "butter", "herbs"],
    isAvailable: true,
    preparationTime: 5,
    imageUrl: "https://example.com/garlic-bread.jpg"
  },
  {
    name: "Tomato Soup",
    description: "Creamy tomato soup with fresh basil",
    category: "Appetizer",
    price: 6.99,
    ingredients: ["tomatoes", "cream", "basil", "onions"],
    isAvailable: true,
    preparationTime: 15,
    imageUrl: "https://example.com/tomato-soup.jpg"
  },
  {
    name: "Grilled Salmon",
    description: "Fresh Atlantic salmon with lemon butter sauce and seasonal vegetables",
    category: "Main Course",
    price: 24.99,
    ingredients: ["salmon", "lemon", "butter", "vegetables"],
    isAvailable: true,
    preparationTime: 25,
    imageUrl: "https://example.com/grilled-salmon.jpg"
  },
  {
    name: "Ribeye Steak",
    description: "12oz ribeye steak cooked to perfection with mashed potatoes",
    category: "Main Course",
    price: 32.99,
    ingredients: ["beef", "potatoes", "herbs", "garlic"],
    isAvailable: true,
    preparationTime: 30,
    imageUrl: "https://example.com/ribeye-steak.jpg"
  },
  {
    name: "Chicken Parmesan",
    description: "Breaded chicken breast with marinara sauce and melted mozzarella",
    category: "Main Course",
    price: 18.99,
    ingredients: ["chicken", "mozzarella", "marinara", "pasta"],
    isAvailable: true,
    preparationTime: 20,
    imageUrl: "https://example.com/chicken-parmesan.jpg"
  },
  {
    name: "Vegetable Stir Fry",
    description: "Mixed vegetables stir-fried with tofu in soy ginger sauce",
    category: "Main Course",
    price: 14.99,
    ingredients: ["vegetables", "tofu", "soy sauce", "ginger"],
    isAvailable: true,
    preparationTime: 15,
    imageUrl: "https://example.com/vegetable-stir-fry.jpg"
  },
  {
    name: "Margherita Pizza",
    description: "Classic pizza with tomato sauce, mozzarella, and fresh basil",
    category: "Main Course",
    price: 16.99,
    ingredients: ["dough", "tomato sauce", "mozzarella", "basil"],
    isAvailable: true,
    preparationTime: 20,
    imageUrl: "https://example.com/margherita-pizza.jpg"
  },
  {
    name: "Chocolate Lava Cake",
    description: "Warm chocolate cake with molten center, served with vanilla ice cream",
    category: "Dessert",
    price: 7.99,
    ingredients: ["chocolate", "flour", "eggs", "ice cream"],
    isAvailable: true,
    preparationTime: 12,
    imageUrl: "https://example.com/chocolate-lava-cake.jpg"
  },
  {
    name: "Tiramisu",
    description: "Classic Italian dessert with coffee-soaked ladyfingers and mascarpone",
    category: "Dessert",
    price: 6.99,
    ingredients: ["ladyfingers", "coffee", "mascarpone", "cocoa"],
    isAvailable: true,
    preparationTime: 5,
    imageUrl: "https://example.com/tiramisu.jpg"
  },
  {
    name: "New York Cheesecake",
    description: "Creamy cheesecake with berry compote",
    category: "Dessert",
    price: 8.99,
    ingredients: ["cream cheese", "sugar", "eggs", "berries"],
    isAvailable: true,
    preparationTime: 5,
    imageUrl: "https://example.com/cheesecake.jpg"
  },
  {
    name: "Coca Cola",
    description: "Classic carbonated soft drink",
    category: "Beverage",
    price: 2.99,
    ingredients: ["carbonated water", "sugar", "caffeine"],
    isAvailable: true,
    preparationTime: 2,
    imageUrl: "https://example.com/coca-cola.jpg"
  },
  {
    name: "Fresh Orange Juice",
    description: "Freshly squeezed orange juice",
    category: "Beverage",
    price: 4.99,
    ingredients: ["oranges"],
    isAvailable: true,
    preparationTime: 3,
    imageUrl: "https://example.com/orange-juice.jpg"
  },
  {
    name: "Cappuccino",
    description: "Espresso with steamed milk foam",
    category: "Beverage",
    price: 3.99,
    ingredients: ["espresso", "milk", "foam"],
    isAvailable: true,
    preparationTime: 5,
    imageUrl: "https://example.com/cappuccino.jpg"
  },
  {
    name: "Iced Tea",
    description: "Refreshing iced tea with lemon",
    category: "Beverage",
    price: 2.99,
    ingredients: ["tea", "lemon", "ice"],
    isAvailable: true,
    preparationTime: 3,
    imageUrl: "https://example.com/iced-tea.jpg"
  }
];

// Sample customer names and table numbers for orders
const customerNames = [
  "John Smith", "Emily Johnson", "Michael Brown", "Sarah Davis",
  "David Wilson", "Jessica Martinez", "Robert Anderson", "Lisa Thomas",
  "William Jackson", "Mary White"
];

const tableNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const orderStatuses = ['Pending', 'Preparing', 'Ready', 'Delivered', 'Cancelled'];

// Seed function
const seedDatabase = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await MenuItem.deleteMany({});
    await Order.deleteMany({});
    console.log('Cleared existing data');

    // Insert menu items
    const createdMenuItems = await MenuItem.insertMany(menuItems);
    console.log(`Inserted ${createdMenuItems.length} menu items`);

    // Create sample orders
    const orders = [];
    for (let i = 0; i < 10; i++) {
      const numItems = Math.floor(Math.random() * 3) + 1; // 1-3 items per order
      const orderItems = [];
      let totalAmount = 0;

      for (let j = 0; j < numItems; j++) {
        const randomMenuItem = createdMenuItems[Math.floor(Math.random() * createdMenuItems.length)];
        const quantity = Math.floor(Math.random() * 3) + 1; // 1-3 quantity
        const itemTotal = randomMenuItem.price * quantity;
        
        orderItems.push({
          menuItem: randomMenuItem._id,
          quantity,
          price: randomMenuItem.price
        });
        
        totalAmount += itemTotal;
      }

      orders.push({
        items: orderItems,
        totalAmount,
        status: orderStatuses[Math.floor(Math.random() * orderStatuses.length)],
        customerName: customerNames[i],
        tableNumber: tableNumbers[i]
      });
    }

    const createdOrders = await Order.insertMany(orders);
    console.log(`Inserted ${createdOrders.length} orders`);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run seed function
seedDatabase();
