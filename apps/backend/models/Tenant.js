const mongoose = require('mongoose');

const tenantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  subdomain: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  domain: {
    type: String,
    trim: true
  },
  planType: {
    type: String,
    enum: ['basic', 'premium', 'enterprise'],
    default: 'basic'
  },
  status: {
    type: String,
    enum: ['active', 'suspended', 'cancelled', 'trial'],
    default: 'trial'
  },
  settings: {
    currency: { type: String, default: 'INR' },
    timezone: { type: String, default: 'Asia/Kolkata' },
    language: { type: String, default: 'en' },
    branding: {
      logo: String,
      primaryColor: { type: String, default: '#3B82F6' },
      restaurantName: String
    },
    features: {
      pos: { type: Boolean, default: true },
      inventory: { type: Boolean, default: false },
      analytics: { type: Boolean, default: false },
      reservations: { type: Boolean, default: false },
      loyalty: { type: Boolean, default: false }
    }
  },
  limits: {
    users: { type: Number, default: 3 },
    menuItems: { type: Number, default: 100 },
    ordersPerMonth: { type: Number, default: 1000 }
  },
  subscription: {
    planId: String,
    startDate: Date,
    endDate: Date,
    autoRenew: { type: Boolean, default: true },
    paymentMethod: String
  },
  contact: {
    ownerName: String,
    email: String,
    phone: String,
    address: String
  },
  trialEndsAt: {
    type: Date,
    default: () => new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // 14 days
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamp on save
tenantSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Check if tenant is active
tenantSchema.methods.isActive = function() {
  return this.status === 'active' || 
         (this.status === 'trial' && this.trialEndsAt > new Date());
};

// Check usage limits
tenantSchema.methods.checkLimits = async function(feature, count = 1) {
  const currentUsage = await this.getCurrentUsage();
  
  switch(feature) {
    case 'users':
      return currentUsage.users + count <= this.limits.users;
    case 'menuItems':
      return currentUsage.menuItems + count <= this.limits.menuItems;
    case 'orders':
      return currentUsage.ordersThisMonth + count <= this.limits.ordersPerMonth;
    default:
      return true;
  }
};

module.exports = mongoose.model('Tenant', tenantSchema);
