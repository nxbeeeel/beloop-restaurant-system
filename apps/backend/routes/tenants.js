const express = require('express');
const router = express.Router();
const Tenant = require('../models/Tenant');
const SubscriptionPlan = require('../models/SubscriptionPlan');
const Billing = require('../models/Billing');

// Get tenant by subdomain
router.get('/:subdomain', async (req, res) => {
  try {
    const tenant = await Tenant.findOne({ subdomain: req.params.subdomain });
    
    if (!tenant) {
      return res.status(404).json({ 
        success: false, 
        message: 'Restaurant not found' 
      });
    }

    res.json({ 
      success: true, 
      tenant: {
        id: tenant._id,
        name: tenant.name,
        subdomain: tenant.subdomain,
        planType: tenant.planType,
        status: tenant.status,
        settings: tenant.settings,
        limits: tenant.limits,
        trialEndsAt: tenant.trialEndsAt,
        isActive: tenant.isActive()
      }
    });
  } catch (error) {
    console.error('Error fetching tenant:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

// Create new tenant
router.post('/', async (req, res) => {
  try {
    const { name, subdomain, planType = 'basic', contact } = req.body;

    // Check if subdomain already exists
    const existingTenant = await Tenant.findOne({ subdomain });
    if (existingTenant) {
      return res.status(400).json({ 
        success: false, 
        message: 'Subdomain already exists' 
      });
    }

    // Create new tenant
    const tenant = new Tenant({
      name,
      subdomain,
      planType,
      status: 'trial',
      contact,
      trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // 14 days
    });

    await tenant.save();

    res.status(201).json({ 
      success: true, 
      tenant: {
        id: tenant._id,
        name: tenant.name,
        subdomain: tenant.subdomain,
        planType: tenant.planType,
        status: tenant.status,
        settings: tenant.settings,
        limits: tenant.limits,
        trialEndsAt: tenant.trialEndsAt
      }
    });
  } catch (error) {
    console.error('Error creating tenant:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

// Check tenant limits
router.post('/:tenantId/limits', async (req, res) => {
  try {
    const { feature, count = 1 } = req.body;
    const tenant = await Tenant.findById(req.params.tenantId);

    if (!tenant) {
      return res.status(404).json({ 
        success: false, 
        message: 'Tenant not found' 
      });
    }

    const allowed = await tenant.checkLimits(feature, count);

    res.json({ 
      success: true, 
      allowed,
      feature,
      count,
      limits: tenant.limits
    });
  } catch (error) {
    console.error('Error checking limits:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

// Get subscription plans
router.get('/plans', async (req, res) => {
  try {
    const plans = await SubscriptionPlan.find({ isActive: true });
    res.json({ 
      success: true, 
      plans: plans.map(plan => ({
        id: plan._id,
        name: plan.name,
        code: plan.code,
        price: plan.price,
        features: plan.features,
        limits: plan.limits,
        trialDays: plan.trialDays,
        description: plan.description
      }))
    });
  } catch (error) {
    console.error('Error fetching plans:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

// Create subscription
router.post('/:tenantId/subscriptions', async (req, res) => {
  try {
    const { planCode, billingCycle } = req.body;
    const tenant = await Tenant.findById(req.params.tenantId);

    if (!tenant) {
      return res.status(404).json({ 
        success: false, 
        message: 'Tenant not found' 
      });
    }

    const plan = await SubscriptionPlan.findOne({ code: planCode, isActive: true });
    if (!plan) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid plan' 
      });
    }

    // Create billing record
    const amount = billingCycle === 'yearly' ? plan.price.yearly : plan.price.monthly;
    const billing = new Billing({
      tenantId: tenant._id,
      subscriptionId: `sub_${Date.now()}`,
      planCode,
      billingCycle,
      amount,
      currency: 'INR',
      status: 'pending',
      paymentMethod: 'razorpay',
      billingPeriod: {
        startDate: new Date(),
        endDate: billingCycle === 'yearly' 
          ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
          : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      },
      nextBillingDate: billingCycle === 'yearly' 
        ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
        : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    });

    await billing.save();

    // Update tenant
    tenant.planType = planCode;
    tenant.status = 'active';
    tenant.limits = plan.limits;
    tenant.settings.features = plan.features;
    await tenant.save();

    res.json({ 
      success: true, 
      subscription: {
        id: billing._id,
        amount,
        billingCycle,
        status: billing.status,
        nextBillingDate: billing.nextBillingDate
      }
    });
  } catch (error) {
    console.error('Error creating subscription:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

module.exports = router;
