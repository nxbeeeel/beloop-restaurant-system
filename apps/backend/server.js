const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const path = require('path');

// Environment variables
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// High-performance middleware
app.use(compression());
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));

// CORS configuration
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

// Body parsing middleware with increased limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// In-memory cache for high performance
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Cache middleware
const getCache = (key) => {
  const item = cache.get(key);
  if (item && Date.now() - item.timestamp < CACHE_TTL) {
    return item.data;
  }
  cache.delete(key);
  return null;
};

const setCache = (key, data) => {
  cache.set(key, {
    data,
    timestamp: Date.now()
  });
};

// Mock menu data with enhanced performance
const menuItems = [
  {
    id: '1',
    name: 'Butter Chicken',
    category: 'Main Course',
    price: 350,
    description: 'Creamy and rich butter chicken curry',
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400',
    available: true,
    preparationTime: 15,
    isVeg: false,
    popularity: 95,
    calories: 450,
    allergens: ['dairy', 'nuts']
  },
  {
    id: '2',
    name: 'Biryani',
    category: 'Main Course',
    price: 450,
    description: 'Fragrant rice dish with aromatic spices',
    image: 'https://images.unsplash.com/photo-1563379091339-03246963d4a9?w=400',
    available: true,
    preparationTime: 20,
    isVeg: false,
    popularity: 98,
    calories: 650,
    allergens: ['dairy']
  },
  {
    id: '3',
    name: 'Naan',
    category: 'Bread',
    price: 50,
    description: 'Soft and fluffy Indian bread',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400',
    available: true,
    preparationTime: 5,
    isVeg: true,
    popularity: 85,
    calories: 200,
    allergens: ['gluten']
  },
  {
    id: '4',
    name: 'Gulab Jamun',
    category: 'Desserts',
    price: 80,
    description: 'Sweet and syrupy dessert balls',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400',
    available: true,
    preparationTime: 10,
    isVeg: true,
    popularity: 90,
    calories: 300,
    allergens: ['dairy', 'nuts']
  },
  {
    id: '5',
    name: 'Masala Dosa',
    category: 'Appetizers',
    price: 120,
    description: 'Crispy dosa with potato filling',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400',
    available: true,
    preparationTime: 8,
    isVeg: true,
    popularity: 88,
    calories: 280,
    allergens: ['gluten']
  },
  {
    id: '6',
    name: 'Lassi',
    category: 'Beverages',
    price: 60,
    description: 'Sweet yogurt-based drink',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400',
    available: true,
    preparationTime: 3,
    isVeg: true,
    popularity: 82,
    calories: 150,
    allergens: ['dairy']
  },
  {
    id: '7',
    name: 'Paneer Tikka',
    category: 'Appetizers',
    price: 180,
    description: 'Grilled cottage cheese with spices',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400',
    available: true,
    preparationTime: 12,
    isVeg: true,
    popularity: 92,
    calories: 320,
    allergens: ['dairy']
  },
  {
    id: '8',
    name: 'Dal Makhani',
    category: 'Main Course',
    price: 200,
    description: 'Creamy black lentils',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400',
    available: true,
    preparationTime: 18,
    isVeg: true,
    popularity: 87,
    calories: 380,
    allergens: ['dairy']
  }
];

// In-memory storage for orders (in production, use database)
let orders = [];
let orderCounter = 1;

// Health check endpoint
app.get('/health', (req, res) => {
  const health = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    cache: {
      size: cache.size,
      hitRate: 'N/A' // Would calculate in production
    },
    version: '1.0.0'
  };
  
  res.setHeader('Cache-Control', 'no-cache');
  res.json(health);
});

// Menu endpoints with caching
app.get('/api/menu', (req, res) => {
  const { category, search, limit = 50, offset = 0 } = req.query;
  
  // Check cache first
  const cacheKey = `menu:${JSON.stringify(req.query)}`;
  const cached = getCache(cacheKey);
  if (cached) {
    res.setHeader('X-Cache', 'HIT');
    return res.json(cached);
  }
  
  let filteredItems = menuItems;
  
  // Filter by category
  if (category && category !== 'All') {
    filteredItems = filteredItems.filter(item => item.category === category);
  }
  
  // Search functionality
  if (search) {
    const searchLower = search.toLowerCase();
    filteredItems = filteredItems.filter(item =>
      item.name.toLowerCase().includes(searchLower) ||
      item.description.toLowerCase().includes(searchLower)
    );
  }
  
  // Pagination
  const paginatedItems = filteredItems.slice(parseInt(offset), parseInt(offset) + parseInt(limit));
  
  const response = {
    success: true,
    data: paginatedItems,
    pagination: {
      total: filteredItems.length,
      limit: parseInt(limit),
      offset: parseInt(offset),
      hasMore: parseInt(offset) + parseInt(limit) < filteredItems.length
    }
  };
  
  // Cache the response
  setCache(cacheKey, response);
  res.setHeader('X-Cache', 'MISS');
  
  res.json(response);
});

app.get('/api/menu/:id', (req, res) => {
  const { id } = req.params;
  const item = menuItems.find(item => item.id === id);
  
  if (!item) {
    return res.status(404).json({ success: false, message: 'Menu item not found' });
  }
  
  res.json({ success: true, data: item });
});

// Orders endpoints
app.post('/api/orders', (req, res) => {
  const { items, customerInfo, paymentMethod } = req.body;
  
  if (!items || items.length === 0) {
    return res.status(400).json({ success: false, message: 'Order must contain at least one item' });
  }
  
  const order = {
    id: `ORD${Date.now()}${orderCounter++}`,
    items,
    customerInfo: customerInfo || {},
    paymentMethod: paymentMethod || 'cash',
    status: 'pending',
    total: items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  orders.push(order);
  
  // Clear cache
  cache.clear();
  
  res.json({ success: true, message: 'Order created successfully', data: order });
});

app.get('/api/orders', (req, res) => {
  // Check cache first
  const cached = getCache('orders');
  if (cached) {
    res.setHeader('X-Cache', 'HIT');
    return res.json(cached);
  }
  
  const response = { success: true, data: orders };
  
  // Cache for 1 minute
  setCache('orders', response);
  
  res.json(response);
});

// Import tenant routes
const tenantRoutes = require('./routes/tenants');

// Analytics endpoints
app.get('/api/analytics/sales', (req, res) => {
  const today = new Date().toDateString();
  const todayOrders = orders.filter(order => 
    new Date(order.createdAt).toDateString() === today
  );
  
  const totalSales = todayOrders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = todayOrders.length;
  
  const analytics = {
    success: true,
    data: {
      todaySales: totalSales,
      todayOrders: totalOrders,
      averageOrderValue: totalOrders > 0 ? totalSales / totalOrders : 0,
      topItems: getTopItems(todayOrders),
      hourlyBreakdown: getHourlyBreakdown(todayOrders)
    }
  };
  
  res.json(analytics);
});

// Tenant routes
app.use('/api/tenants', tenantRoutes);

// Helper functions
function getTopItems(orders) {
  const itemCounts = {};
  orders.forEach(order => {
    order.items.forEach(item => {
      itemCounts[item.name] = (itemCounts[item.name] || 0) + item.quantity;
    });
  });
  
  return Object.entries(itemCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([name, count]) => ({ name, count }));
}

function getHourlyBreakdown(orders) {
  const hourly = Array(24).fill(0);
  orders.forEach(order => {
    const hour = new Date(order.createdAt).getHours();
    hourly[hour]++;
  });
  return hourly;
}

// Root route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Beloop Restaurant Management System API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      menu: '/api/menu',
      orders: '/api/orders',
      analytics: '/api/analytics/sales'
    },
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method}:${req.originalUrl} not found`
  });
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Shutting down gracefully...');
  process.exit(0);
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 High-Performance Beloop Restaurant Management System API running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 API endpoint: http://localhost:${PORT}/api`);
  console.log(`🍽️  Menu endpoint: http://localhost:${PORT}/api/menu`);
  console.log(`⚡ Performance optimized with Express + In-Memory Caching`);
  console.log(`🔥 Features: Compression, Rate Limiting, CORS, Helmet Security`);
  console.log(`💾 Cache TTL: 5 minutes`);
  console.log(`🚦 Rate Limit: 1000 requests per 15 minutes`);
});
