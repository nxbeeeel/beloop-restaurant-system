const mongoose = require('mongoose');

const billingSchema = new mongoose.Schema({
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tenant',
    required: true
  },
  subscriptionId: {
    type: String,
    required: true
  },
  planCode: {
    type: String,
    required: true,
    enum: ['basic', 'premium', 'enterprise']
  },
  billingCycle: {
    type: String,
    required: true,
    enum: ['monthly', 'yearly']
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'INR'
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded', 'cancelled'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['razorpay', 'payu', 'stripe', 'bank_transfer'],
    required: true
  },
  paymentDetails: {
    transactionId: String,
    gatewayResponse: Object,
    paidAt: Date
  },
  billingPeriod: {
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true }
  },
  nextBillingDate: {
    type: Date,
    required: true
  },
  autoRenew: {
    type: Boolean,
    default: true
  },
  invoice: {
    number: String,
    url: String,
    generatedAt: Date
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

billingSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Billing', billingSchema);
