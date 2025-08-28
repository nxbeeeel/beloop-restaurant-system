import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Beloop Restaurant Management System API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Basic API routes
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to Beloop Restaurant Management System API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      api: '/api',
      menu: '/api/menu',
      orders: '/api/orders',
      payments: '/api/payments'
    }
  });
});

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
    category: 'Dessert',
    price: 80,
    description: 'Sweet and syrupy dessert balls',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400',
    available: true,
    preparationTime: 10
  }
];

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

app.get('/api/orders/:id', (req, res) => {
  const order = orders.find(o => o.id === req.params.id);
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
});

app.put('/api/orders/:id/status', (req, res) => {
  const { status } = req.body;
  const order = orders.find(o => o.id === req.params.id);
  
  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Order not found'
    });
  }

  order.status = status;
  order.updatedAt = new Date().toISOString();

  res.json({
    success: true,
    message: 'Order status updated',
    data: order
  });
});

// Payments endpoints
let payments = [];

app.post('/api/payments', (req, res) => {
  const { orderId, amount, method, details } = req.body;
  
  if (!orderId || !amount || !method) {
    return res.status(400).json({
      success: false,
      message: 'Order ID, amount, and payment method are required'
    });
  }

  const payment = {
    id: `PAY${Date.now()}`,
    orderId,
    amount,
    method,
    details: details || {},
    status: 'completed',
    createdAt: new Date().toISOString()
  };

  payments.push(payment);

  // Update order status
  const order = orders.find(o => o.id === orderId);
  if (order) {
    order.status = 'paid';
    order.updatedAt = new Date().toISOString();
  }

  res.json({
    success: true,
    message: 'Payment processed successfully',
    data: payment
  });
});

app.get('/api/payments', (req, res) => {
  res.json({
    success: true,
    data: payments
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

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Beloop Restaurant Management System API running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 API endpoint: http://localhost:${PORT}/api`);
});

export default app;
