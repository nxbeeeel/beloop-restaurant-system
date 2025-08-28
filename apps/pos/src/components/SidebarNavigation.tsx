import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence, PanInfo } from 'framer-motion'
import {
  X,
  ShoppingCart,
  BarChart3,
  Package,
  CreditCard,
  Calendar,
  FileText,
  ChefHat,
  Database,
  Globe,
  Smartphone,
  Settings,
  Users,
  Bell,
  Zap,
  TrendingUp,
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
  Star,
  Clock,
  MapPin,
  Phone,
  Mail,
  User,
  CheckCircle,
  XCircle,
  AlertCircle,
  Truck
} from 'lucide-react'
import { useAdvancedPOSStore } from '../store/advancedPOS'
import toast from 'react-hot-toast'

interface SidebarNavigationProps {
  isOpen: boolean
  onClose: () => void
  activeFeature: string
  onFeatureSelect: (feature: string) => void
}

const SidebarNavigation: React.FC<SidebarNavigationProps> = ({
  isOpen,
  onClose,
  activeFeature,
  onFeatureSelect
}) => {
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const sidebarRef = useRef<HTMLDivElement>(null)

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50

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
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isOpen && isLeftSwipe) {
      // Swipe left to close sidebar
      onClose()
    } else if (!isOpen && isRightSwipe) {
      // Swipe right to open sidebar (this would need to be handled by parent)
      // For now, we'll just show a toast
      toast.success('Swipe detected! Use menu button to open sidebar')
    }
  }

  // Handle drag gestures using Framer Motion
  const handleDragEnd = (event: any, info: PanInfo) => {
    if (info.offset.x < -100) {
      // Dragged left more than 100px, close sidebar
      onClose()
    }
  }

  // Add touch event listeners to the backdrop for swipe-to-open
  useEffect(() => {
    const handleBackdropTouch = (e: TouchEvent) => {
      if (!isOpen) {
        const touch = e.touches[0]
        const startX = touch.clientX
        
        const handleTouchMove = (moveEvent: TouchEvent) => {
          const moveTouch = moveEvent.touches[0]
          const currentX = moveTouch.clientX
          const distance = currentX - startX
          
          if (distance > minSwipeDistance) {
            // Swipe right detected, could trigger open
            // This would need to be handled by parent component
          }
        }
        
        const handleTouchEnd = () => {
          document.removeEventListener('touchmove', handleTouchMove)
          document.removeEventListener('touchend', handleTouchEnd)
        }
        
        document.addEventListener('touchmove', handleTouchMove)
        document.addEventListener('touchend', handleTouchEnd)
      }
    }

    document.addEventListener('touchstart', handleBackdropTouch)
    return () => {
      document.removeEventListener('touchstart', handleBackdropTouch)
    }
  }, [isOpen])

  const {
    isListening,
    startListening,
    stopListening,
    settings,
    cart,
    orders,
    lowStockAlerts,
    zomatoOrders,
    updateSettings
  } = useAdvancedPOSStore()

  const features = [
    {
      id: 'pos',
      name: 'POS & Billing',
      icon: ShoppingCart,
      color: 'from-blue-500 to-purple-600',
      description: 'Point of Sale and billing system'
    },
    {
      id: 'menu',
      name: 'Menu Management',
      icon: Package,
      color: 'from-green-500 to-teal-600',
      description: 'Manage menu items and categories'
    },
    {
      id: 'orders',
      name: 'Orders',
      icon: Receipt,
      color: 'from-orange-500 to-red-600',
      description: 'View and manage all orders'
    },
    {
      id: 'customers',
      name: 'Customers',
      icon: Users,
      color: 'from-purple-500 to-pink-600',
      description: 'Customer database and CRM'
    },
    {
      id: 'analytics',
      name: 'Analytics',
      icon: BarChart3,
      color: 'from-indigo-500 to-blue-600',
      description: 'Sales reports and insights'
    },
    {
      id: 'payments',
      name: 'Payments',
      icon: CreditCard,
      color: 'from-emerald-500 to-green-600',
      description: 'Payment processing and history'
    },
    {
      id: 'inventory',
      name: 'Inventory',
      icon: Database,
      color: 'from-amber-500 to-orange-600',
      description: 'Stock management and alerts'
    },
    {
      id: 'reports',
      name: 'Reports',
      icon: FileText,
      color: 'from-cyan-500 to-blue-600',
      description: 'Generate detailed reports'
    },
    {
      id: 'kitchen',
      name: 'Kitchen Display',
      icon: ChefHat,
      color: 'from-red-500 to-pink-600',
      description: 'Kitchen order management'
    },
    {
      id: 'reservations',
      name: 'Reservations',
      icon: Calendar,
      color: 'from-violet-500 to-purple-600',
      description: 'Table reservations and bookings'
    },
    {
      id: 'online',
      name: 'Online Orders',
      icon: Globe,
      color: 'from-yellow-500 to-orange-600',
      description: 'Zomato, Swiggy integration'
    },
    {
      id: 'mobile',
      name: 'Mobile App',
      icon: Smartphone,
      color: 'from-gray-500 to-gray-600',
      description: 'Mobile app management'
    }
  ]

  const handleGoToAdmin = () => {
    // Navigate to admin dashboard
    window.open('http://localhost:3004', '_blank')
    toast.success('Opening Admin Dashboard...')
  }

  const quickActions = [
    {
      name: 'Quick Sale',
      icon: Zap,
      color: 'bg-green-500',
      action: () => {
        toast.success('Quick sale mode activated')
        onFeatureSelect('pos')
      }
    },
    {
      name: 'Hold Order',
      icon: Clock,
      color: 'bg-yellow-500',
      action: () => {
        toast.success('Order held successfully')
      }
    },
    {
      name: 'Discount',
      icon: Minus,
      color: 'bg-orange-500',
      action: () => {
        toast.success('Discount panel opened')
      }
    },
    {
      name: 'Refund',
      icon: RefreshCw,
      color: 'bg-red-500',
      action: () => {
        toast.success('Refund process started')
      }
    },
    {
      name: 'Print Receipt',
      icon: Receipt,
      color: 'bg-blue-500',
      action: () => {
        toast.success('Printing receipt...')
      }
    },
    {
      name: 'Export Data',
      icon: Download,
      color: 'bg-purple-500',
      action: () => {
        toast.success('Exporting data...')
      }
    },
    {
      name: 'Admin Panel',
      icon: BarChart3,
      color: 'bg-indigo-500',
      action: handleGoToAdmin
    }
  ]

  const handleVoiceToggle = () => {
    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }

  const toggleTheme = () => {
    const newTheme = settings.theme === 'light' ? 'dark' : 'light'
    // Update the document class for dark mode
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    // Update settings in store
    updateSettings({ theme: newTheme })
    toast.success(`${newTheme.charAt(0).toUpperCase() + newTheme.slice(1)} theme activated`)
  }

  const toggleSound = () => {
    // setSettings({ soundEnabled: !settings.soundEnabled })
    toast.success(`Sound ${settings.soundEnabled ? 'disabled' : 'enabled'}`)
  }

  const getNotificationCount = () => {
    return orders.filter((order: any) => order.status === 'pending').length + 
           lowStockAlerts.length + 
           zomatoOrders.filter(order => order.status === 'received').length
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={onClose}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: -400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -400, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 h-full w-96 bg-white/95 backdrop-blur-xl shadow-2xl border-r border-gray-200 z-50 overflow-y-auto"
            ref={sidebarRef}
            drag="x"
            dragConstraints={{ left: -100, right: 0 }}
            dragElastic={0.1}
            onDragEnd={handleDragEnd}
            whileDrag={{ scale: 0.98 }}
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
              {/* Drag Handle */}
              <div className="absolute top-4 right-4 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center cursor-grab active:cursor-grabbing">
                <div className="w-4 h-1 bg-gray-400 rounded-full"></div>
              </div>
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold text-lg">R</span>
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-gray-800">Restaurant POS</h1>
                    <p className="text-xs text-gray-500">Premium Management System</p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Status Indicators */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  {true ? (
                    <div className="flex items-center space-x-1 text-green-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span>Online</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-1 text-red-600">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span>Offline</span>
                    </div>
                  )}
                </div>
                <div className="text-gray-500">
                  {cart.length} items in cart
                </div>
              </div>
            </div>

                         {/* Admin Dashboard - Top Priority */}
             <div className="p-4 border-b border-gray-200">
               <motion.button
                 whileHover={{ scale: 1.02 }}
                 whileTap={{ scale: 0.98 }}
                 onClick={handleGoToAdmin}
                 className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-100 text-gray-700 rounded-xl hover:from-blue-100 hover:to-indigo-200 transition-all shadow-md border border-blue-200"
               >
                 <div className="flex items-center space-x-3">
                   <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                     <BarChart3 className="w-5 h-5 text-white" />
                   </div>
                   <div className="text-left">
                     <div className="font-semibold text-lg text-gray-800">Admin Dashboard</div>
                     <div className="text-xs text-gray-600">Manage restaurant operations</div>
                   </div>
                 </div>
                 <div className="text-sm text-blue-600">
                   🔗
                 </div>
               </motion.button>
             </div>

             {/* Main Navigation */}
             <div className="p-4">
               <h3 className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wide">Main Features</h3>
               <div className="space-y-2">
                 {features.map((feature) => (
                   <motion.button
                     key={feature.id}
                     whileHover={{ scale: 1.02, x: 4 }}
                     whileTap={{ scale: 0.98 }}
                     onClick={() => onFeatureSelect(feature.id)}
                     className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all ${
                       activeFeature === feature.id
                         ? 'bg-gradient-to-r ' + feature.color + ' text-white shadow-lg'
                         : 'text-gray-700 hover:bg-gray-100'
                     }`}
                   >
                     <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                       activeFeature === feature.id ? 'bg-white/20' : 'bg-gray-100'
                     }`}>
                       <feature.icon className="w-4 h-4" />
                     </div>
                     <div className="text-left">
                       <div className="font-medium">{feature.name}</div>
                       <div className={`text-xs ${
                         activeFeature === feature.id ? 'text-white/80' : 'text-gray-500'
                       }`}>
                         {feature.description}
                       </div>
                     </div>
                   </motion.button>
                 ))}
               </div>
             </div>

            {/* Quick Actions */}
            <div className="p-4 border-t border-gray-200">
              <h3 className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wide">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-2">
                {quickActions.map((action) => (
                  <motion.button
                    key={action.name}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={action.action}
                    className="flex flex-col items-center space-y-2 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <div className={`w-8 h-8 ${action.color} rounded-lg flex items-center justify-center`}>
                      <action.icon className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-xs font-medium text-gray-700">{action.name}</span>
                  </motion.button>
                ))}
              </div>
            </div>

                         {/* System Controls */}
             <div className="p-4 border-t border-gray-200">
               <h3 className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wide">System Controls</h3>
               <div className="space-y-2">
                 <motion.button
                   whileHover={{ scale: 1.02 }}
                   whileTap={{ scale: 0.98 }}
                   onClick={handleVoiceToggle}
                   className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
                     isListening
                       ? 'bg-red-500 text-white'
                       : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                   }`}
                 >
                   <div className="flex items-center space-x-3">
                     <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                       isListening ? 'bg-white/20' : 'bg-gray-200'
                     }`}>
                       {isListening ? <X className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
                     </div>
                     <span className="font-medium">
                       {isListening ? 'Stop Voice Assistant' : 'Voice Assistant'}
                     </span>
                   </div>
                   {isListening && (
                     <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                   )}
                 </motion.button>

                 <motion.button
                   whileHover={{ scale: 1.02 }}
                   whileTap={{ scale: 0.98 }}
                   onClick={toggleTheme}
                   className="w-full flex items-center justify-between p-3 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                 >
                   <div className="flex items-center space-x-3">
                     <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center">
                       <Settings className="w-4 h-4" />
                     </div>
                     <span className="font-medium">Theme: {settings.theme}</span>
                   </div>
                   <div className="text-xs text-gray-500">
                     {settings.theme === 'light' ? '☀️' : '🌙'}
                   </div>
                 </motion.button>

                                   <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={toggleSound}
                    className="w-full flex items-center justify-between p-3 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center">
                        <Bell className="w-4 h-4" />
                      </div>
                      <span className="font-medium">Sound: {settings.soundEnabled ? 'On' : 'Off'}</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {settings.soundEnabled ? '🔊' : '🔇'}
                    </div>
                  </motion.button>
               </div>
             </div>

            {/* Notifications */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Notifications</h3>
                {getNotificationCount() > 0 && (
                  <div className="w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    {getNotificationCount()}
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                {orders.filter((order: any) => order.status === 'pending').slice(0, 3).map((order: any) => (
                  <div key={order.id} className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-yellow-800">New Order #{order.id}</span>
                      <span className="text-sm text-yellow-600">₹{order.total.toFixed(2)}</span>
                    </div>
                    <p className="text-xs text-yellow-600">{order.items.length} items</p>
                  </div>
                ))}
                
                {lowStockAlerts.slice(0, 2).map((alert, index) => (
                  <div key={index} className="p-3 bg-red-50 rounded-lg border border-red-200">
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="w-4 h-4 text-red-600" />
                      <span className="text-sm font-medium text-red-800">Low Stock: {alert}</span>
                    </div>
                  </div>
                ))}
                
                {zomatoOrders.filter((order: any) => order.status === 'received').slice(0, 2).map((order: any) => (
                  <div key={order.id} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-blue-800">Online Order #{order.id}</span>
                      <span className="text-sm text-blue-600">₹{order.total.toFixed(2)}</span>
                    </div>
                    <p className="text-xs text-blue-600">{order.items.length} items</p>
                  </div>
                ))}
                
                {getNotificationCount() === 0 && (
                  <p className="text-center text-gray-500 py-4 text-sm">No new notifications</p>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <div className="text-center text-xs text-gray-500">
                <p>Beloop Restaurant POS</p>
                <p>Version 2.0 • Premium Edition</p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default SidebarNavigation
