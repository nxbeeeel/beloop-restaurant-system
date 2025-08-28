const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Mock menu data
const menuItems = [
  {
    id: '1',
    name: 'Butter Chicken',
    category: 'Main Course',
    price: 350,
    description: 'Creamy and rich butter chicken curry',
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400',
    available: true,
    preparationTime: 15
  },
  {
    id: '2',
    name: 'Biryani',
    category: 'Main Course',
    price: 450,
    description: 'Fragrant rice dish with aromatic spices',
    image: 'https://images.unsplash.com/photo-1563379091339-03246963d4a9?w=400',
    available: true,
    preparationTime: 20
  },
  {
    id: '3',
    name: 'Naan',
    category: 'Bread',
    price: 50,
    description: 'Soft and fluffy Indian bread',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400',
    available: true,
    preparationTime: 5
  },
  {
    id: '4',
    name: 'Gulab Jamun',
    category: 'Desserts',
    price: 80,
    description: 'Sweet and syrupy dessert balls',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400',
    available: true,
    preparationTime: 10
  },
  {
    id: '5',
    name: 'Masala Dosa',
    category: 'Appetizers',
    price: 120,
    description: 'Crispy dosa with potato filling',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400',
    available: true,
    preparationTime: 8
  },
  {
    id: '6',
    name: 'Lassi',
    category: 'Beverages',
    price: 60,
    description: 'Sweet yogurt-based drink',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400',
    available: true,
    preparationTime: 3
  }
];

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Beloop Restaurant Management System API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Menu endpoints
app.get('/api/menu', (req, res) => {
  res.json({
    success: true,
    data: menuItems
  });
});

app.get('/api/menu/:id', (req, res) => {
  const item = menuItems.find(item => item.id === req.params.id);
  if (!item) {
    return res.status(404).json({
      success: false,
      message: 'Menu item not found'
    });
  }
  res.json({
    success: true,
    data: item
  });
});

// Orders endpoints
let orders = [];
let orderCounter = 1;

app.post('/api/orders', (req, res) => {
  const { items, customerInfo, paymentMethod } = req.body;
  
  if (!items || items.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Order must contain at least one item'
    });
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

  res.json({
    success: true,
    message: 'Order created successfully',
    data: order
  });
});

app.get('/api/orders', (req, res) => {
  res.json({
    success: true,
    data: orders
  });
});

// Analytics endpoints
app.get('/api/analytics/sales', (req, res) => {
  const today = new Date().toDateString();
  const todayOrders = orders.filter(order => 
    new Date(order.createdAt).toDateString() === today
  );
  
  const totalSales = todayOrders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = todayOrders.length;

  res.json({
    success: true,
    data: {
      todaySales: totalSales,
      todayOrders: totalOrders,
      averageOrderValue: totalOrders > 0 ? totalSales / totalOrders : 0
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Beloop Restaurant Management System API running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 API endpoint: http://localhost:${PORT}/api`);
  console.log(`🍽️  Menu endpoint: http://localhost:${PORT}/api/menu`);
});
