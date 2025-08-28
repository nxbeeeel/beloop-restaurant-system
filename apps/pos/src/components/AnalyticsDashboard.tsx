import React, { memo } from 'react'
import { motion } from 'framer-motion'
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShoppingBag, 
  Users, 
  Clock,
  Star,
  Zap,
  Activity,
  BarChart3
} from 'lucide-react'
import { useAdvancedPOSStore } from '../store/advancedPOS'

const AnalyticsDashboard: React.FC = memo(() => {
  const { cart, orders } = useAdvancedPOSStore()

  // Calculate analytics
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
  const totalValue = cart.reduce((sum, item) => sum + (item.menuItem.price * item.quantity), 0)
    const averageOrderValue = orders.length > 0
    ? orders.reduce((sum: number, order: any) => sum + order.total, 0) / orders.length
    : 0

  const stats = [
    {
      title: 'Cart Items',
      value: totalItems,
      change: '+12%',
      trend: 'up',
      icon: ShoppingBag,
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Cart Value',
      value: `₹${totalValue.toFixed(2)}`,
      change: '+8%',
      trend: 'up',
      icon: DollarSign,
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Avg Order',
      value: `₹${averageOrderValue.toFixed(2)}`,
      change: '+5%',
      trend: 'up',
      icon: TrendingUp,
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Orders Today',
      value: orders.length,
      change: '+15%',
      trend: 'up',
      icon: Activity,
      color: 'from-orange-500 to-orange-600'
    }
  ]

  const quickActions = [
    { name: 'Quick Sale', icon: Zap, color: 'bg-blue-500' },
    { name: 'Discount', icon: Star, color: 'bg-yellow-500' },
    { name: 'Hold Order', icon: Clock, color: 'bg-gray-500' },
    { name: 'Reports', icon: BarChart3, color: 'bg-purple-500' }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">Analytics Dashboard</h2>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>Live</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card-premium rounded-2xl p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <div className={`flex items-center space-x-1 text-xs ${
                stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.trend === 'up' ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                <span>{stat.change}</span>
              </div>
            </div>
            
            <div className="text-2xl font-bold text-gray-800 mb-1">
              {stat.value}
            </div>
            <div className="text-sm text-gray-500">
              {stat.title}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="card-premium rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {quickActions.map((action, index) => (
            <motion.button
              key={action.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex flex-col items-center space-y-2 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className={`w-12 h-12 rounded-xl ${action.color} flex items-center justify-center`}>
                <action.icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-700">{action.name}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card-premium rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {orders.slice(0, 5).map((order: any, index: number) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <ShoppingBag className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-800">Order #{order.id}</div>
                  <div className="text-sm text-gray-500">{order.items.length} items</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-gray-800">₹{order.total.toFixed(2)}</div>
                <div className="text-sm text-gray-500">{order.status}</div>
              </div>
            </motion.div>
          ))}
          
          {orders.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Activity className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No recent orders</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
})

AnalyticsDashboard.displayName = 'AnalyticsDashboard'

export default AnalyticsDashboard
