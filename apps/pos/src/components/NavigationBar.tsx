import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Settings, 
  Users, 
  BarChart3, 
  Package, 
  CreditCard, 
  Bell, 
  HelpCircle, 
  Zap,
  Wifi,
  WifiOff,
  Sun,
  Moon,
  Volume2,
  VolumeX,
  Smartphone,
  Monitor,
  Printer,
  Database,
  Shield,
  Globe,
  Calendar,
  Clock,
  Star,
  TrendingUp,
  ShoppingCart,
  Receipt,
  Calculator,
  Search,
  Filter,
  Grid,
  List,
  RefreshCw,
  Download,
  Upload,
  Save,
  Trash2,
  Edit,
  Plus,
  Minus,
  X
} from 'lucide-react'
import { useAdvancedPOSStore } from '../store/advancedPOS'
import toast from 'react-hot-toast'

interface NavigationBarProps {
  onFeatureSelect: (feature: string) => void
  activeFeature: string
}

const NavigationBar: React.FC<NavigationBarProps> = ({ onFeatureSelect, activeFeature }) => {
  const { 
    isListening, 
    startListening, 
    stopListening,
    settings,
    orders,
    cart
  } = useAdvancedPOSStore()

  const [showSettings, setShowSettings] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showHelp, setShowHelp] = useState(false)

  const features = [
    { id: 'pos', name: 'POS', icon: ShoppingCart, color: 'from-blue-500 to-blue-600' },
    { id: 'menu', name: 'Menu', icon: Package, color: 'from-green-500 to-green-600' },
    { id: 'orders', name: 'Orders', icon: Receipt, color: 'from-purple-500 to-purple-600' },
    { id: 'customers', name: 'Customers', icon: Users, color: 'from-orange-500 to-orange-600' },
    { id: 'analytics', name: 'Analytics', icon: BarChart3, color: 'from-indigo-500 to-indigo-600' },
    { id: 'payments', name: 'Payments', icon: CreditCard, color: 'from-pink-500 to-pink-600' },
    { id: 'inventory', name: 'Inventory', icon: Database, color: 'from-red-500 to-red-600' },
    { id: 'reports', name: 'Reports', icon: TrendingUp, color: 'from-yellow-500 to-yellow-600' },
    { id: 'kitchen', name: 'Kitchen', icon: Zap, color: 'from-teal-500 to-teal-600' },
    { id: 'reservations', name: 'Reservations', icon: Calendar, color: 'from-cyan-500 to-cyan-600' }
  ]

  const quickActions = [
    { name: 'Quick Sale', icon: Zap, action: () => onFeatureSelect('quick-sale') },
    { name: 'Hold Order', icon: Clock, action: () => onFeatureSelect('hold-order') },
    { name: 'Discount', icon: Minus, action: () => onFeatureSelect('discount') },
    { name: 'Refund', icon: RefreshCw, action: () => onFeatureSelect('refund') },
    { name: 'Print Receipt', icon: Printer, action: () => onFeatureSelect('print') },
    { name: 'Export Data', icon: Download, action: () => onFeatureSelect('export') }
  ]

  const handleVoiceToggle = () => {
    if (isListening) {
      stopListening()
      toast.success('Voice assistant stopped')
    } else {
      startListening()
      toast.success('Voice assistant started')
    }
  }

  const toggleTheme = () => {
    // Theme toggle functionality
    toast.success(`Switched to ${settings.theme === 'light' ? 'dark' : 'light'} theme`)
  }

  const toggleSound = () => {
    // Sound toggle functionality
    toast.success(`Sound ${settings.soundEnabled ? 'disabled' : 'enabled'}`)
  }

  const getNotificationCount = () => {
    return orders.filter((order: any) => order.status === 'placed').length
  }

  return (
    <div className="bg-white/90 backdrop-blur-xl border-b border-gray-200 sticky top-0 z-50">
      {/* Main Navigation */}
      <div className="flex items-center justify-between px-6 py-3">
        {/* Left Section - Logo and Features */}
        <div className="flex items-center space-x-6">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">R</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Restaurant POS</h1>
              <p className="text-xs text-gray-500">Premium Management System</p>
            </div>
          </div>

          {/* Feature Navigation */}
          <div className="flex items-center space-x-2">
            {features.map((feature) => (
              <motion.button
                key={feature.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onFeatureSelect(feature.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                  activeFeature === feature.id
                    ? 'bg-gradient-to-r ' + feature.color + ' text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <feature.icon className="w-4 h-4" />
                <span>{feature.name}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Right Section - Controls and Status */}
        <div className="flex items-center space-x-4">
          {/* Quick Actions */}
          <div className="flex items-center space-x-2">
            {quickActions.map((action) => (
              <motion.button
                key={action.name}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={action.action}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                title={action.name}
              >
                <action.icon className="w-5 h-5" />
              </motion.button>
            ))}
          </div>

          {/* Voice Assistant */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleVoiceToggle}
            className={`p-2 rounded-lg transition-all duration-200 ${
              isListening 
                ? 'bg-red-500 text-white shadow-lg' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            title={isListening ? 'Stop Voice Assistant' : 'Start Voice Assistant'}
          >
            {isListening ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </motion.button>

          {/* Theme Toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleTheme}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title={`Switch to ${settings.theme === 'light' ? 'dark' : 'light'} theme`}
          >
            {settings.theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </motion.button>

          {/* Sound Toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleSound}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title={`${settings.soundEnabled ? 'Disable' : 'Enable'} sound`}
          >
            {settings.soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </motion.button>

          {/* Online Status */}
          <div className="flex items-center space-x-2">
            {true ? (
              <div className="flex items-center space-x-1 text-green-600">
                <Wifi className="w-4 h-4" />
                <span className="text-sm font-medium">Online</span>
              </div>
            ) : (
              <div className="flex items-center space-x-1 text-red-600">
                <WifiOff className="w-4 h-4" />
                <span className="text-sm font-medium">Offline</span>
              </div>
            )}
          </div>

          {/* Notifications */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors relative"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {getNotificationCount() > 0 && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                  {getNotificationCount()}
                </div>
              )}
            </motion.button>

            {/* Notifications Dropdown */}
            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 p-4 z-50"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-800">Notifications</h3>
                    <button onClick={() => setShowNotifications(false)}>
                      <X className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {orders.filter((order: any) => order.status === 'placed').map((order: any) => (
                      <div key={order.id} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-gray-800">New Order #{order.id}</span>
                          <span className="text-sm text-gray-500">{order.total.toFixed(2)}</span>
                        </div>
                        <p className="text-sm text-gray-600">{order.items.length} items</p>
                      </div>
                    ))}
                    {getNotificationCount() === 0 && (
                      <p className="text-center text-gray-500 py-4">No new notifications</p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Help */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowHelp(!showHelp)}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="Help & Support"
          >
            <HelpCircle className="w-5 h-5" />
          </motion.button>

          {/* Settings */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="Settings"
          >
            <Settings className="w-5 h-5" />
          </motion.button>
        </div>
      </div>

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-gray-200 bg-gray-50"
          >
            <div className="px-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* General Settings */}
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">General</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Auto-save</span>
                      <input
                        type="checkbox"
                        checked={settings.autoSave}
                        onChange={(e) => {/* Handle auto save */}}
                        className="w-4 h-4 text-blue-600"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Notifications</span>
                      <input
                        type="checkbox"
                        checked={settings.notificationsEnabled}
                        onChange={(e) => {/* Handle notifications */}}
                        className="w-4 h-4 text-blue-600"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Sound Effects</span>
                      <input
                        type="checkbox"
                        checked={settings.soundEnabled}
                        onChange={(e) => {/* Handle sound */}}
                        className="w-4 h-4 text-blue-600"
                      />
                    </div>
                  </div>
                </div>

                {/* Display Settings */}
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">Display</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Theme</span>
                      <select
                        value={settings.theme}
                        onChange={(e) => {/* Handle theme */}}
                        className="text-sm border border-gray-300 rounded-lg px-2 py-1"
                      >
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                        <option value="auto">Auto</option>
                      </select>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Font Size</span>
                      <select
                        value="medium"
                        onChange={(e) => {/* Handle font size */}}
                        className="text-sm border border-gray-300 rounded-lg px-2 py-1"
                      >
                        <option value="small">Small</option>
                        <option value="medium">Medium</option>
                        <option value="large">Large</option>
                      </select>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Compact Mode</span>
                      <input
                        type="checkbox"
                        checked={false}
                        onChange={(e) => {/* Handle compact mode */}}
                        className="w-4 h-4 text-blue-600"
                      />
                    </div>
                  </div>
                </div>

                {/* System Settings */}
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">System</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Auto Backup</span>
                      <input
                        type="checkbox"
                        checked={false}
                        onChange={(e) => {/* Handle auto backup */}}
                        className="w-4 h-4 text-blue-600"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Sync to Cloud</span>
                      <input
                        type="checkbox"
                        checked={false}
                        onChange={(e) => {/* Handle cloud sync */}}
                        className="w-4 h-4 text-blue-600"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Debug Mode</span>
                      <input
                        type="checkbox"
                        checked={false}
                        onChange={(e) => {/* Handle debug mode */}}
                        className="w-4 h-4 text-blue-600"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Help Panel */}
      <AnimatePresence>
        {showHelp && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-gray-200 bg-blue-50"
          >
            <div className="px-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">Quick Help</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>• Press <kbd className="px-2 py-1 bg-gray-200 rounded">Ctrl + S</kbd> to save</p>
                    <p>• Press <kbd className="px-2 py-1 bg-gray-200 rounded">Ctrl + Z</kbd> to undo</p>
                    <p>• Press <kbd className="px-2 py-1 bg-gray-200 rounded">F1</kbd> for help</p>
                    <p>• Use voice commands: "Add [item]", "Clear cart", "Checkout"</p>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">Support</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>📧 Email: support@restaurant.com</p>
                    <p>📞 Phone: +91 98765 43210</p>
                    <p>💬 Chat: Available 24/7</p>
                    <p>📖 Documentation: docs.restaurant.com</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default NavigationBar
