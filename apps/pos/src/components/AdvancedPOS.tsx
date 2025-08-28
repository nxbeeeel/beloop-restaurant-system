import React, { useEffect, useState, useMemo, useCallback, memo, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ShoppingCart, 
  Search, 
  Mic, 
  MicOff, 
  Wifi, 
  WifiOff, 
  Bell,
  TrendingUp,
  Users,
  Clock,
  Star,
  Zap,
  Menu,
  X,
  Settings,
  BarChart3,
  Package,
  CreditCard,
  Calendar,
  FileText,
  ChefHat,
  Database,
  Globe,
  Smartphone
} from 'lucide-react'
import { useAdvancedPOSStore } from '../store/advancedPOS'
import toast, { Toaster } from 'react-hot-toast'

import AdvancedMenuGrid from './AdvancedMenuGrid'
import AdvancedCart from './AdvancedCart'
import AdvancedPaymentModal from './AdvancedPaymentModal'
import CustomerModal from './CustomerModal'
import ZomatoOrderPanel from './ZomatoOrderPanel'
import AnalyticsDashboard from './AnalyticsDashboard'
import VoiceAssistant from './VoiceAssistant'
import SidebarNavigation from './SidebarNavigation'

const AdvancedPOS: React.FC = () => {
  const {
    cart,
    menuItems,
    selectedCategory,
    searchQuery,
    orderType,
    selectedTable,
    customer,
    isPaymentModalOpen,
    isCustomerModalOpen,
    aiRecommendations,
    lowStockAlerts,
    zomatoOrders,
    isListening,
    settings,
    isLoadingMenu,
    menuError,
    fetchMenuItems,
    setSelectedCategory,
    setSearchQuery,
    setOrderType,
    setTable,
    startListening,
    stopListening,
    checkLowStock,
    syncWithCloud,
    setPaymentModalOpen,
    setCustomerModalOpen,
    setShowAnalytics
  } = useAdvancedPOSStore()

  // Filter menu items based on category and search
  const filteredMenuItems = useMemo(() => {
    let items = menuItems

    if (selectedCategory && selectedCategory !== 'All') {
      items = items.filter(item => item.category === selectedCategory)
    }

    if (searchQuery) {
      items = items.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    return items
  }, [menuItems, selectedCategory, searchQuery])

  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [showAnalytics, setShowAnalyticsLocal] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [activeFeature, setActiveFeature] = useState('pos')
  const [showSwipeHint, setShowSwipeHint] = useState(true)
  
  // Swipe functionality
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const swipeAreaRef = useRef<HTMLDivElement>(null)

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50

  // Fetch menu items on component mount
  useEffect(() => {
    fetchMenuItems()
  }, [fetchMenuItems])

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    
    const distance = touchStart - touchEnd
    const isRightSwipe = distance < -minSwipeDistance

    if (!isSidebarOpen && isRightSwipe) {
      // Swipe right to open sidebar
      setIsSidebarOpen(true)
      toast.success('Sidebar opened!')
    } else if (isSidebarOpen && distance > minSwipeDistance) {
      // Swipe left to close sidebar
      setIsSidebarOpen(false)
      toast.success('Sidebar closed!')
    }
  }

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case 'a':
            e.preventDefault()
            setShowAnalyticsLocal(true)
            setActiveFeature('analytics')
            setIsSidebarOpen(true)
            toast.success('Analytics Dashboard opened!')
            break
          case 's':
            e.preventDefault()
            setIsSidebarOpen(!isSidebarOpen)
            break
          case 'm':
            e.preventDefault()
            setActiveFeature('menu')
            setIsSidebarOpen(true)
            break
          case 'o':
            e.preventDefault()
            setActiveFeature('orders')
            setIsSidebarOpen(true)
            break
        }
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [isSidebarOpen])

  const handleFeatureClick = useCallback((feature: string) => {
    setActiveFeature(feature)
    setShowSwipeHint(false)
    
    switch (feature) {
      case 'analytics':
        setShowAnalyticsLocal(true)
        toast.success('Analytics Dashboard opened!')
        break
      case 'orders':
        toast.success('Orders Management opened!')
        break
      case 'menu':
        toast.success('Menu Management opened!')
        break
      case 'customers':
        setCustomerModalOpen(true)
        break
      case 'settings':
        toast.success('Settings opened!')
        break
      case 'sync':
        syncWithCloud()
        break
      case 'voice':
        if (isListening) {
          stopListening()
        } else {
          startListening()
        }
        break
      default:
        break
    }
  }, [isListening, startListening, stopListening, syncWithCloud, setCustomerModalOpen])

  const handleSidebarClose = useCallback(() => {
    setIsSidebarOpen(false)
  }, [])

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0)
  const cartTotal = cart.reduce((total, item) => total + (item.menuItem.price * item.quantity), 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Swipe Area for Sidebar */}
      <motion.div
        ref={swipeAreaRef}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        className="fixed left-0 top-0 w-6 md:w-4 h-full z-30 cursor-ew-resize"
        style={{ touchAction: 'none' }}
        whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
        whileTap={{ backgroundColor: 'rgba(59, 130, 246, 0.2)' }}
      />
      
      {/* Swipe Hint */}
      {!isSidebarOpen && showSwipeHint && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="fixed left-4 top-1/2 transform -translate-y-1/2 z-20"
        >
          <motion.div 
            className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-xl border border-gray-200 max-w-xs"
            whileHover={{ scale: 1.05 }}
          >
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Menu className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Swipe to Open</h3>
                <p className="text-xs text-gray-500">Swipe right from left edge</p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowSwipeHint(false)}
              className="text-xs text-blue-600 hover:text-blue-700 font-medium"
            >
              Got it!
            </motion.button>
          </motion.div>
        </motion.div>
      )}
      
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            fontSize: '14px',
            fontWeight: '500'
          }
        }}
      />
      
      {/* Header */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white/80 backdrop-blur-xl shadow-xl border-b border-white/20 sticky top-0 z-40"
      >
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left Section */}
            <div className="flex items-center space-x-6">
              {/* Sidebar Toggle */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Menu className="w-5 h-5 text-gray-600" />
              </motion.button>

              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="flex items-center space-x-3"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                  B
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">Beloop POS</h1>
                  <p className="text-sm text-gray-500">Advanced Restaurant System</p>
                </div>
              </motion.div>
              
              {/* Order Type Selector */}
              <div className="flex bg-gray-100 rounded-xl p-1">
                {(['dine-in', 'takeaway', 'delivery'] as const).map((type) => (
                  <motion.button
                    key={type}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setOrderType(type)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      orderType === type
                        ? 'bg-blue-500 text-white shadow-md'
                        : 'text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')}
                  </motion.button>
                ))}
              </div>

              {/* Table Selector (for dine-in) */}
              {orderType === 'dine-in' && (
                <motion.select
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  value={selectedTable || ''}
                  onChange={(e) => setTable(e.target.value)}
                  className="bg-white border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Table</option>
                  {Array.from({ length: 15 }, (_, i) => (
                    <option key={i} value={`T-${String(i + 1).padStart(2, '0')}`}>
                      Table {i + 1}
                    </option>
                  ))}
                </motion.select>
              )}
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-4">
              {/* Search */}
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="relative"
              >
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search menu items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                />
              </motion.div>

              {/* Admin Dashboard Quick Access */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  window.open('http://localhost:3004', '_blank')
                  toast.success('Opening Admin Dashboard...')
                }}
                className="p-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all shadow-lg"
                title="Admin Dashboard (Ctrl+A)"
              >
                <BarChart3 className="w-5 h-5" />
              </motion.button>

              {/* Voice Assistant */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  console.log('Microphone button clicked, isListening:', isListening)
                  if (isListening) {
                    stopListening()
                  } else {
                    startListening()
                  }
                }}
                className={`p-3 rounded-xl transition-all ${
                  isListening 
                    ? 'bg-red-500 text-white animate-pulse' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                title="Voice Commands (Ctrl+M)"
              >
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </motion.button>

              {/* Analytics Toggle */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowAnalyticsLocal(!showAnalytics)}
                className="p-3 bg-purple-100 text-purple-600 rounded-xl hover:bg-purple-200 transition-all"
                title="Analytics Dashboard"
              >
                <TrendingUp className="w-5 h-5" />
              </motion.button>

              {/* Notifications */}
              <motion.div 
                whileHover={{ scale: 1.1 }}
                className="relative"
              >
                <Bell className="w-6 h-6 text-gray-600" />
                {(lowStockAlerts.length > 0 || zomatoOrders.filter(o => o.status === 'received').length > 0) && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                  >
                    {lowStockAlerts.length + zomatoOrders.filter(o => o.status === 'received').length}
                  </motion.span>
                )}
              </motion.div>

              {/* Online Status */}
              <div className="flex items-center space-x-2">
                {isOnline ? (
                  <Wifi className="w-5 h-5 text-green-500" />
                ) : (
                  <WifiOff className="w-5 h-5 text-red-500" />
                )}
                <span className={`text-sm font-medium ${isOnline ? 'text-green-600' : 'text-red-600'}`}>
                  {isOnline ? 'Online' : 'Offline'}
                </span>
              </div>

              {/* Current Time */}
              <div className="text-right">
                <div className="text-lg font-semibold text-gray-800">
                  {currentTime.toLocaleTimeString('en-IN', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
                <div className="text-sm text-gray-500">
                  {currentTime.toLocaleDateString('en-IN')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Sidebar Navigation */}
      <SidebarNavigation 
        isOpen={isSidebarOpen}
        onClose={handleSidebarClose}
        activeFeature={activeFeature}
        onFeatureSelect={handleFeatureClick}
      />

      {/* Main Content */}
      <div className="flex flex-1 lg:flex-row flex-col overflow-hidden">
        {/* Left Panel - Menu and Analytics */}
        <div className="flex-1 p-6 lg:min-h-0 mobile-padding">
          <AnimatePresence mode="wait">
            {showAnalytics ? (
              <motion.div
                key="analytics"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <AnalyticsDashboard />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                {/* Categories */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mb-6"
                >
                  <div className="flex space-x-3 overflow-x-auto pb-2 hide-scrollbar">
                    {['All', 'Appetizers', 'Main Course', 'Bread', 'Desserts', 'Beverages'].map((category) => (
                      <motion.button
                        key={category}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-6 py-3 rounded-2xl text-sm font-bold whitespace-nowrap transition-all duration-300 btn-touch ${
                          selectedCategory === category
                            ? 'gradient-primary text-white shadow-premium animate-pulse-glow'
                            : 'glass text-gray-700 hover:glass-strong shadow-premium'
                        }`}
                      >
                        {category}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>

                {/* AI Recommendations */}
                {aiRecommendations.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-4"
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      <Zap className="w-5 h-5 text-yellow-600" />
                      <h3 className="font-semibold text-yellow-800">AI Recommendations</h3>
                    </div>
                    <p className="text-yellow-700 text-sm">
                      Recommended items based on your preferences
                    </p>
                  </motion.div>
                )}

                {/* Menu Grid */}
                {isLoadingMenu ? (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                      <p className="text-gray-500">Loading menu items...</p>
                    </div>
                  </div>
                ) : menuError ? (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-4">
                        <X className="w-12 h-12 text-red-500" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2 text-red-600">Error Loading Menu</h3>
                      <p className="text-gray-500 mb-4">{menuError}</p>
                      <button
                        onClick={fetchMenuItems}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        Retry
                      </button>
                    </div>
                  </div>
                ) : filteredMenuItems.length === 0 ? (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <Search className="w-12 h-12 text-gray-400" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">No items found</h3>
                      <p className="text-gray-500">Try adjusting your search or category filters</p>
                    </div>
                  </div>
                ) : (
                  <AdvancedMenuGrid items={filteredMenuItems} />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Panel - Cart and Orders */}
        <div className="lg:w-96 w-full glass-strong shadow-premium-lg border-l border-white/20 lg:min-h-full">
          <div className="h-full flex flex-col">
            {/* Cart Header */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-800">Current Order</h2>
                <motion.div 
                  whileHover={{ scale: 1.1 }}
                  className="flex items-center space-x-2 bg-blue-500 text-white px-3 py-1 rounded-full"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span className="font-semibold">{cartItemCount}</span>
                </motion.div>
              </div>
              
              {customer && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 flex items-center space-x-2"
                >
                  <Users className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">{customer.name}</span>
                  {customer.loyaltyPoints && (
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                      {customer.loyaltyPoints} pts
                    </span>
                  )}
                </motion.div>
              )}
            </motion.div>

            {/* Cart Content */}
            <div className="flex-1 overflow-hidden">
              <AdvancedCart />
            </div>
          </div>
        </div>
      </div>

      {/* Zomato Orders Panel */}
      <AnimatePresence>
        {zomatoOrders.filter(order => order.status === 'received').length > 0 && (
          <motion.div
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            className="fixed right-6 top-1/2 transform -translate-y-1/2 z-50"
          >
            <ZomatoOrderPanel />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Voice Assistant */}
      <VoiceAssistant />

      {/* Modals */}
      <AnimatePresence>
        {isPaymentModalOpen && <AdvancedPaymentModal />}
        {isCustomerModalOpen && <CustomerModal />}
      </AnimatePresence>

      {/* Low Stock Alerts */}
      <AnimatePresence>
        {lowStockAlerts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 left-6 bg-red-500 text-white p-4 rounded-xl shadow-lg max-w-sm z-50"
          >
            <h4 className="font-semibold mb-2">Low Stock Alert!</h4>
            <p className="text-sm">
              {lowStockAlerts.slice(0, 3).join(', ')}
              {lowStockAlerts.length > 3 && ` and ${lowStockAlerts.length - 3} more items`}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default memo(AdvancedPOS)
