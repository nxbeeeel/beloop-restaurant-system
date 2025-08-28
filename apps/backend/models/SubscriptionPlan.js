const mongoose = require('mongoose');

const subscriptionPlanSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    enum: ['Basic', 'Premium', 'Enterprise']
  },
  code: {
    type: String,
    required: true,
    unique: true,
    enum: ['basic', 'premium', 'enterprise']
  },
  price: {
    monthly: { type: Number, required: true },
    yearly: { type: Number, required: true }
  },
  features: {
    pos: { type: Boolean, default: true },
    inventory: { type: Boolean, default: false },
    analytics: { type: Boolean, default: false },
    reservations: { type: Boolean, default: false },
    loyalty: { type: Boolean, default: false },
    multiLocation: { type: Boolean, default: false },
    apiAccess: { type: Boolean, default: false },
    whiteLabel: { type: Boolean, default: false }
  },
  limits: {
    users: { type: Number, required: true },
    menuItems: { type: Number, required: true },
    ordersPerMonth: { type: Number, required: true },
    storage: { type: Number, required: true }, // in MB
    apiCalls: { type: Number, required: true }
  },
  trialDays: {
    type: Number,
    default: 14
  },
  isActive: {
    type: Boolean,
    default: true
  },
  description: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('SubscriptionPlan', subscriptionPlanSchema);
