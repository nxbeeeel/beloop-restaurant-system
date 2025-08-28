import React from 'react'
import { motion } from 'framer-motion'
import { 
  Mic, 
  MicOff, 
  Settings, 
  Users, 
  Clock, 
  MapPin,
  ShoppingBag,
  Bell
} from 'lucide-react'
import { useAdvancedPOSStore } from '../store/advancedPOS'
import toast from 'react-hot-toast'

const Header: React.FC = () => {
  const {
    isListening,
    startListening,
    stopListening,
    orderType,
    selectedTable,
    cart,
    setOrderType,
    setTable
  } = useAdvancedPOSStore()

  const handleVoiceToggle = () => {
    if (isListening) {
      stopListening()
      toast.success('Voice assistant deactivated')
    } else {
      startListening()
    }
  }

  const orderTypes = [
    { id: 'dine-in', label: 'Dine In', icon: Users },
    { id: 'takeaway', label: 'Takeaway', icon: ShoppingBag },
    { id: 'delivery', label: 'Delivery', icon: MapPin }
  ]

  const tables = ['T-01', 'T-02', 'T-03', 'T-04', 'T-05', 'T-06']

  return (
    <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white p-4 shadow-lg">
      <div className="flex items-center justify-between">
        {/* Logo and Title */}
        <div className="flex items-center space-x-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm"
          >
            <span className="text-2xl font-bold">🍽️</span>
          </motion.div>
          <div>
            <h1 className="text-2xl font-bold">Beloop POS</h1>
            <p className="text-sm opacity-90">Restaurant Management System</p>
          </div>
        </div>

        {/* Order Type Selector */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            {orderTypes.map((type) => (
              <motion.button
                key={type.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setOrderType(type.id as any)}
                className={`px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-all ${
                  orderType === type.id
                    ? 'bg-white/20 backdrop-blur-sm border border-white/30'
                    : 'bg-white/10 hover:bg-white/15'
                }`}
              >
                <type.icon className="w-4 h-4" />
                <span>{type.label}</span>
              </motion.button>
            ))}
          </div>

          {/* Table Selector (for dine-in) */}
          {orderType === 'dine-in' && (
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <select
                value={selectedTable || ''}
                onChange={(e) => setTable(e.target.value)}
                className="px-3 py-2 bg-white/10 rounded-lg border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-white/30"
              >
                <option value="">Select Table</option>
                {tables.map((table) => (
                  <option key={table} value={table} className="text-gray-800">
                    {table}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Voice Assistant Toggle */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleVoiceToggle}
            className={`p-3 rounded-xl transition-all ${
              isListening
                ? 'bg-red-500 shadow-lg shadow-red-500/50 animate-pulse'
                : 'bg-white/10 hover:bg-white/20'
            }`}
            title={isListening ? 'Stop Voice Assistant' : 'Start Voice Assistant'}
          >
            {isListening ? (
              <MicOff className="w-5 h-5" />
            ) : (
              <Mic className="w-5 h-5" />
            )}
          </motion.button>

          {/* Cart Indicator */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="relative p-3 bg-white/10 rounded-xl hover:bg-white/20 cursor-pointer"
          >
            <ShoppingBag className="w-5 h-5" />
            {cart.length > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold"
              >
                {cart.length}
              </motion.div>
            )}
          </motion.div>

          {/* Settings */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-3 bg-white/10 rounded-xl hover:bg-white/20"
            title="Settings"
          >
            <Settings className="w-5 h-5" />
          </motion.button>

          {/* Notifications */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-3 bg-white/10 rounded-xl hover:bg-white/20 relative"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
          </motion.button>
        </div>
      </div>

      {/* Status Bar */}
      <div className="mt-4 flex items-center justify-between text-sm opacity-90">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>System Online</span>
          </div>
          <span>•</span>
          <span>Orders: {cart.length}</span>
          <span>•</span>
          <span>Type: {orderType}</span>
          {selectedTable && (
            <>
              <span>•</span>
              <span>Table: {selectedTable}</span>
            </>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <span>{new Date().toLocaleTimeString()}</span>
          <span>•</span>
          <span>{new Date().toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  )
}

export default Header
