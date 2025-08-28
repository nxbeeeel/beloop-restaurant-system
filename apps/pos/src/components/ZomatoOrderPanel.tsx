import React, { memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Clock, 
  MapPin, 
  Phone, 
  User, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Truck,
  Star,
  MessageCircle
} from 'lucide-react'
import { useAdvancedPOSStore } from '../store/advancedPOS'

interface ZomatoOrder {
  id: string
  customerName: string
  phone: string
  address: string
  items: Array<{
    name: string
    quantity: number
    price: number
    specialInstructions?: string
  }>
  total: number
  status: 'pending' | 'accepted' | 'preparing' | 'ready' | 'delivered' | 'cancelled'
  orderTime: string
  estimatedDelivery: string
  rating?: number
  specialInstructions?: string
  paymentMethod: 'online' | 'cod'
  orderType: 'delivery' | 'pickup'
}

const ZomatoOrderPanel: React.FC = memo(() => {
  const { zomatoOrders } = useAdvancedPOSStore()

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100'
      case 'accepted': return 'text-blue-600 bg-blue-100'
      case 'preparing': return 'text-orange-600 bg-orange-100'
      case 'ready': return 'text-green-600 bg-green-100'
      case 'delivered': return 'text-gray-600 bg-gray-100'
      case 'cancelled': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />
      case 'accepted': return <CheckCircle className="w-4 h-4" />
      case 'preparing': return <Truck className="w-4 h-4" />
      case 'ready': return <CheckCircle className="w-4 h-4" />
      case 'delivered': return <CheckCircle className="w-4 h-4" />
      case 'cancelled': return <XCircle className="w-4 h-4" />
      default: return <AlertCircle className="w-4 h-4" />
    }
  }

  const handleStatusUpdate = (orderId: string, newStatus: string) => {
    // This would typically update the order status via API
    console.log(`Updating order ${orderId} to ${newStatus}`)
  }

  if (zomatoOrders.length === 0) {
    return (
      <div className="card-premium rounded-2xl p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
            <Truck className="w-5 h-5 text-orange-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">Online Orders</h3>
        </div>
        
        <div className="text-center py-8 text-gray-500">
          <Truck className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h4 className="text-lg font-medium mb-2">No Online Orders</h4>
          <p className="text-sm">Orders from Zomato, Swiggy, and other platforms will appear here</p>
        </div>
      </div>
    )
  }

  return (
    <div className="card-premium rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
            <Truck className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Online Orders</h3>
            <p className="text-sm text-gray-500">{zomatoOrders.length} active orders</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-green-600 font-medium">Live</span>
        </div>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        <AnimatePresence>
          {zomatoOrders.map((order, index) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Order Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-orange-600">Z</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">Order #{order.id}</div>
                    <div className="text-sm text-gray-500">{order.receivedAt.toLocaleTimeString()}</div>
                  </div>
                </div>
                
                <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(order.status)}`}>
                  {getStatusIcon(order.status)}
                  <span className="capitalize">{order.status}</span>
                </div>
              </div>

              {/* Customer Info */}
              <div className="flex items-center space-x-4 mb-3 text-sm">
                <div className="flex items-center space-x-1 text-gray-600">
                  <User className="w-4 h-4" />
                  <span>{order.customer.name}</span>
                </div>
                <div className="flex items-center space-x-1 text-gray-600">
                  <Phone className="w-4 h-4" />
                  <span>{order.customer.phone}</span>
                </div>
                {order.platform === 'zomato' && (
                  <div className="flex items-center space-x-1 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span className="truncate max-w-32">{order.deliveryAddress}</span>
                  </div>
                )}
              </div>

              {/* Order Items */}
              <div className="space-y-2 mb-3">
                {order.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <span className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs font-medium">
                        {item.quantity}
                      </span>
                      <span className="font-medium">{item.menuItem.name}</span>
                    </div>
                    <span className="text-gray-600">₹{item.menuItem.price}</span>
                  </div>
                ))}
              </div>

              {/* Special Instructions */}
              {order.notes && (
                <div className="mb-3 p-2 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-center space-x-1 text-yellow-800 text-sm">
                    <MessageCircle className="w-4 h-4" />
                    <span className="font-medium">Special Instructions:</span>
                  </div>
                  <p className="text-sm text-yellow-700 mt-1">{order.notes}</p>
                </div>
              )}

              {/* Order Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="flex items-center space-x-4 text-sm">
                  <div className="text-gray-600">
                    <span className="font-medium">Total:</span> ₹{order.total}
                  </div>
                  <div className="text-gray-600">
                    <span className="font-medium">Payment:</span> {order.paymentMethod || 'CASH'}
                  </div>
                  {order.estimatedDeliveryTime && (
                    <div className="text-gray-600">
                      <span className="font-medium">ETA:</span> {order.estimatedDeliveryTime.toLocaleTimeString()}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-2">
                  {order.status === 'received' && (
                    <>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleStatusUpdate(order.id, 'accepted')}
                        className="px-3 py-1 bg-green-500 text-white rounded-lg text-xs font-medium hover:bg-green-600 transition-colors"
                      >
                        Accept
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleStatusUpdate(order.id, 'cancelled')}
                        className="px-3 py-1 bg-red-500 text-white rounded-lg text-xs font-medium hover:bg-red-600 transition-colors"
                      >
                        Decline
                      </motion.button>
                    </>
                  )}
                  
                  {order.status === 'accepted' && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleStatusUpdate(order.id, 'preparing')}
                      className="px-3 py-1 bg-blue-500 text-white rounded-lg text-xs font-medium hover:bg-blue-600 transition-colors"
                    >
                      Start Preparing
                    </motion.button>
                  )}
                  
                  {order.status === 'preparing' && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleStatusUpdate(order.id, 'ready')}
                      className="px-3 py-1 bg-green-500 text-white rounded-lg text-xs font-medium hover:bg-green-600 transition-colors"
                    >
                      Mark Ready
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
})

ZomatoOrderPanel.displayName = 'ZomatoOrderPanel'

export default ZomatoOrderPanel
