import React, { useState } from 'react'
import { Check, Star, Zap, Shield, Users, BarChart3, Settings } from 'lucide-react'

const PricingPage = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly')

  const plans = [
    {
      name: 'Basic',
      code: 'basic',
      icon: Zap,
      price: {
        monthly: 999,
        yearly: 9999
      },
      description: 'Perfect for small restaurants and cafes',
      features: [
        'POS System with Billing',
        'Up to 3 Users',
        '100 Menu Items',
        '1,000 Orders/Month',
        'Basic Support',
        'Mobile App Access'
      ],
      limits: {
        users: 3,
        menuItems: 100,
        ordersPerMonth: 1000
      },
      popular: false
    },
    {
      name: 'Premium',
      code: 'premium',
      icon: Star,
      price: {
        monthly: 1999,
        yearly: 19999
      },
      description: 'Ideal for growing restaurants',
      features: [
        'Everything in Basic',
        'Up to 10 Users',
        '500 Menu Items',
        '5,000 Orders/Month',
        'Inventory Management',
        'Analytics Dashboard',
        'Reservation System',
        'Priority Support',
        'API Access'
      ],
      limits: {
        users: 10,
        menuItems: 500,
        ordersPerMonth: 5000
      },
      popular: true
    },
    {
      name: 'Enterprise',
      code: 'enterprise',
      icon: Shield,
      price: {
        monthly: 4999,
        yearly: 49999
      },
      description: 'For large restaurant chains',
      features: [
        'Everything in Premium',
        'Unlimited Users',
        'Unlimited Menu Items',
        'Unlimited Orders',
        'Multi-Location Support',
        'White Label Solution',
        'Custom Integrations',
        'Dedicated Support',
        'SLA Guarantee'
      ],
      limits: {
        users: -1, // unlimited
        menuItems: -1,
        ordersPerMonth: -1
      },
      popular: false
    }
  ]

  const handleSubscribe = async (planCode: string) => {
    try {
      // Create subscription
      const response = await fetch('/api/subscriptions/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planCode,
          billingCycle,
          tenantId: localStorage.getItem('tenantId')
        }),
      })

      const data = await response.json()

      if (data.success) {
        // Redirect to payment
        window.location.href = data.paymentUrl
      }
    } catch (error) {
      console.error('Subscription error:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Start with a 14-day free trial. No credit card required.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            <span className={`text-sm ${billingCycle === 'monthly' ? 'text-blue-600' : 'text-gray-500'}`}>
              Monthly
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600 transition-colors"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-sm ${billingCycle === 'yearly' ? 'text-blue-600' : 'text-gray-500'}`}>
              Yearly
              <span className="ml-1 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                Save 20%
              </span>
            </span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan) => {
            const Icon = plan.icon
            const price = billingCycle === 'monthly' ? plan.price.monthly : plan.price.yearly
            const originalPrice = billingCycle === 'monthly' ? plan.price.monthly : plan.price.monthly * 12

            return (
              <div
                key={plan.code}
                className={`relative bg-white rounded-2xl shadow-xl p-8 border-2 transition-all hover:shadow-2xl ${
                  plan.popular
                    ? 'border-blue-500 scale-105'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-blue-100 rounded-full">
                      <Icon className="w-8 h-8 text-blue-600" />
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-6">{plan.description}</p>

                  <div className="mb-8">
                    <div className="flex items-baseline justify-center">
                      <span className="text-4xl font-bold text-gray-900">₹</span>
                      <span className="text-5xl font-bold text-gray-900">{price.toLocaleString()}</span>
                      <span className="text-gray-500 ml-2">
                        /{billingCycle === 'monthly' ? 'month' : 'year'}
                      </span>
                    </div>
                    {billingCycle === 'yearly' && (
                      <p className="text-sm text-gray-500 mt-2">
                        <span className="line-through">₹{originalPrice.toLocaleString()}</span>
                        {' '}billed annually
                      </p>
                    )}
                  </div>

                  <ul className="space-y-4 mb-8 text-left">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handleSubscribe(plan.code)}
                    className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
                      plan.popular
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    {plan.code === 'basic' ? 'Start Free Trial' : 'Choose Plan'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Frequently Asked Questions
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Can I change my plan later?
              </h3>
              <p className="text-gray-600">
                Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                What payment methods do you accept?
              </h3>
              <p className="text-gray-600">
                We accept all major credit cards, UPI, net banking, and digital wallets through Razorpay.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Is there a setup fee?
              </h3>
              <p className="text-gray-600">
                No setup fees. You only pay for your chosen plan. Start with our 14-day free trial.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Can I cancel anytime?
              </h3>
              <p className="text-gray-600">
                Yes, you can cancel your subscription at any time. No long-term contracts required.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PricingPage
