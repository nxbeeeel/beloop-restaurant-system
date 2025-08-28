import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Wifi, 
  WifiOff, 
  Cloud, 
  CloudOff, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle,
  Database,
  Download,
  Upload
} from 'lucide-react'
import { offlineStorage } from '../services/offlineStorage'

interface OfflineStatusProps {
  className?: string
}

interface SyncStatus {
  isOnline: boolean
  pendingOrders: number
  lastSync: Date | null
  isSyncing: boolean
}

export const OfflineStatus: React.FC<OfflineStatusProps> = ({ className = '' }) => {
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    isOnline: navigator.onLine,
    pendingOrders: 0,
    lastSync: null,
    isSyncing: false
  })
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    // Initialize offline storage
    offlineStorage.init()

    // Check online status
    const handleOnline = () => {
      setSyncStatus(prev => ({ ...prev, isOnline: true }))
      syncPendingOrders()
    }

    const handleOffline = () => {
      setSyncStatus(prev => ({ ...prev, isOnline: false }))
    }

    // Listen for online/offline events
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Check pending orders periodically
    const checkPendingOrders = async () => {
      try {
        const pendingOrders = await offlineStorage.getPendingOrders()
        setSyncStatus(prev => ({ 
          ...prev, 
          pendingOrders: pendingOrders.length 
        }))
      } catch (error) {
        console.error('Failed to check pending orders:', error)
      }
    }

    // Initial check
    checkPendingOrders()

    // Check every 30 seconds
    const interval = setInterval(checkPendingOrders, 30000)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      clearInterval(interval)
    }
  }, [])

  const syncPendingOrders = async () => {
    if (!syncStatus.isOnline || syncStatus.isSyncing) return

    setSyncStatus(prev => ({ ...prev, isSyncing: true }))

    try {
      const pendingOrders = await offlineStorage.getPendingOrders()
      
      for (const order of pendingOrders) {
        try {
          // Attempt to sync order to server
          const response = await fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(order)
          })

          if (response.ok) {
            await offlineStorage.markOrderSynced(order.id)
            console.log('✅ Order synced:', order.id)
          }
        } catch (error) {
          console.error('❌ Failed to sync order:', order.id, error)
        }
      }

      // Update status
      const updatedPendingOrders = await offlineStorage.getPendingOrders()
      setSyncStatus(prev => ({ 
        ...prev, 
        pendingOrders: updatedPendingOrders.length,
        lastSync: new Date(),
        isSyncing: false
      }))

    } catch (error) {
      console.error('❌ Sync failed:', error)
      setSyncStatus(prev => ({ ...prev, isSyncing: false }))
    }
  }

  const getStatusColor = () => {
    if (!syncStatus.isOnline) return 'text-red-500'
    if (syncStatus.pendingOrders > 0) return 'text-yellow-500'
    return 'text-green-500'
  }

  const getStatusIcon = () => {
    if (!syncStatus.isOnline) return WifiOff
    if (syncStatus.pendingOrders > 0) return CloudOff
    return Wifi
  }

  const StatusIcon = getStatusIcon()

  return (
    <div className={`relative ${className}`}>
      {/* Main Status Indicator */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowDetails(!showDetails)}
        className={`
          flex items-center space-x-2 px-3 py-2 rounded-lg border-2 transition-colors
          ${syncStatus.isOnline 
            ? 'border-green-200 bg-green-50 hover:border-green-300' 
            : 'border-red-200 bg-red-50 hover:border-red-300'
          }
        `}
      >
        <StatusIcon className={`w-4 h-4 ${getStatusColor()}`} />
        <span className={`text-sm font-medium ${getStatusColor()}`}>
          {syncStatus.isOnline ? 'Online' : 'Offline'}
        </span>
        
        {syncStatus.pendingOrders > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full font-bold"
          >
            {syncStatus.pendingOrders}
          </motion.div>
        )}
      </motion.button>

      {/* Detailed Status Panel */}
      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute top-full right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 p-4 z-50"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Connection Status
              </h3>
              <button
                onClick={() => setShowDetails(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                ×
              </button>
            </div>

            {/* Status Grid */}
            <div className="space-y-3">
              {/* Online Status */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {syncStatus.isOnline ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-500" />
                  )}
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Internet Connection
                  </span>
                </div>
                <span className={`text-sm font-medium ${
                  syncStatus.isOnline ? 'text-green-600' : 'text-red-600'
                }`}>
                  {syncStatus.isOnline ? 'Connected' : 'Disconnected'}
                </span>
              </div>

              {/* Pending Orders */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Database className="w-4 h-4 text-blue-500" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Pending Orders
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {syncStatus.pendingOrders}
                </span>
              </div>

              {/* Last Sync */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Cloud className="w-4 h-4 text-purple-500" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Last Sync
                  </span>
                </div>
                <span className="text-sm text-gray-900 dark:text-white">
                  {syncStatus.lastSync 
                    ? syncStatus.lastSync.toLocaleTimeString()
                    : 'Never'
                  }
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
              {/* Sync Button */}
              <button
                onClick={syncPendingOrders}
                disabled={!syncStatus.isOnline || syncStatus.isSyncing || syncStatus.pendingOrders === 0}
                className={`
                  w-full flex items-center justify-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                  ${syncStatus.isOnline && syncStatus.pendingOrders > 0 && !syncStatus.isSyncing
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }
                `}
              >
                {syncStatus.isSyncing ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4" />
                )}
                <span>
                  {syncStatus.isSyncing 
                    ? 'Syncing...' 
                    : `Sync ${syncStatus.pendingOrders} Orders`
                  }
                </span>
              </button>

              {/* Offline Info */}
              {!syncStatus.isOnline && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5" />
                    <div className="text-sm text-yellow-800 dark:text-yellow-200">
                      <p className="font-medium">Offline Mode Active</p>
                      <p className="text-xs mt-1">
                        Orders will be saved locally and synced when connection is restored.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Storage Info */}
              <button
                onClick={async () => {
                  try {
                    const info = await offlineStorage.getStorageInfo()
                    console.log('Storage Info:', info)
                    alert(`Storage Info:\nOrders: ${info.ordersCount}\nSize: ${(info.totalSize / 1024).toFixed(2)} KB`)
                  } catch (error) {
                    console.error('Failed to get storage info:', error)
                  }
                }}
                className="w-full text-left text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                View Storage Details
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
