// Premium Offline Storage Service using IndexedDB
interface OfflineOrder {
  id: string
  items: any[]
  total: number
  customerInfo: any
  paymentMethod: string
  status: 'pending' | 'synced'
  createdAt: Date
  syncedAt?: Date
}

interface OfflineMenu {
  id: string
  data: any
  lastUpdated: Date
}

class OfflineStorageService {
  private db: IDBDatabase | null = null
  private readonly DB_NAME = 'BeloopPOSOffline'
  private readonly DB_VERSION = 1

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.DB_NAME, this.DB_VERSION)

      request.onerror = () => {
        console.error('❌ Failed to open IndexedDB:', request.error)
        reject(request.error)
      }

      request.onsuccess = () => {
        this.db = request.result
        console.log('✅ IndexedDB initialized successfully')
        resolve()
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result

        // Create orders store
        if (!db.objectStoreNames.contains('orders')) {
          const ordersStore = db.createObjectStore('orders', { keyPath: 'id' })
          ordersStore.createIndex('status', 'status', { unique: false })
          ordersStore.createIndex('createdAt', 'createdAt', { unique: false })
        }

        // Create menu store
        if (!db.objectStoreNames.contains('menu')) {
          const menuStore = db.createObjectStore('menu', { keyPath: 'id' })
          menuStore.createIndex('lastUpdated', 'lastUpdated', { unique: false })
        }

        // Create settings store
        if (!db.objectStoreNames.contains('settings')) {
          const settingsStore = db.createObjectStore('settings', { keyPath: 'key' })
        }

        console.log('📦 IndexedDB stores created')
      }
    })
  }

  // Orders Management
  async saveOrder(order: OfflineOrder): Promise<void> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['orders'], 'readwrite')
      const store = transaction.objectStore('orders')
      const request = store.put(order)

      request.onsuccess = () => {
        console.log('💾 Order saved offline:', order.id)
        resolve()
      }

      request.onerror = () => {
        console.error('❌ Failed to save order:', request.error)
        reject(request.error)
      }
    })
  }

  async getPendingOrders(): Promise<OfflineOrder[]> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['orders'], 'readonly')
      const store = transaction.objectStore('orders')
      const index = store.index('status')
      const request = index.getAll('pending')

      request.onsuccess = () => {
        const orders = request.result || []
        console.log('📋 Found pending orders:', orders.length)
        resolve(orders)
      }

      request.onerror = () => {
        console.error('❌ Failed to get pending orders:', request.error)
        reject(request.error)
      }
    })
  }

  async markOrderSynced(orderId: string): Promise<void> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['orders'], 'readwrite')
      const store = transaction.objectStore('orders')
      const getRequest = store.get(orderId)

      getRequest.onsuccess = () => {
        const order = getRequest.result
        if (order) {
          order.status = 'synced'
          order.syncedAt = new Date()
          
          const putRequest = store.put(order)
          putRequest.onsuccess = () => {
            console.log('✅ Order marked as synced:', orderId)
            resolve()
          }
          putRequest.onerror = () => reject(putRequest.error)
        } else {
          reject(new Error('Order not found'))
        }
      }

      getRequest.onerror = () => reject(getRequest.error)
    })
  }

  async deleteOrder(orderId: string): Promise<void> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['orders'], 'readwrite')
      const store = transaction.objectStore('orders')
      const request = store.delete(orderId)

      request.onsuccess = () => {
        console.log('🗑️ Order deleted:', orderId)
        resolve()
      }

      request.onerror = () => {
        console.error('❌ Failed to delete order:', request.error)
        reject(request.error)
      }
    })
  }

  // Menu Management
  async saveMenu(menuData: any): Promise<void> {
    if (!this.db) await this.init()

    const menuItem: OfflineMenu = {
      id: 'current-menu',
      data: menuData,
      lastUpdated: new Date()
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['menu'], 'readwrite')
      const store = transaction.objectStore('menu')
      const request = store.put(menuItem)

      request.onsuccess = () => {
        console.log('💾 Menu saved offline')
        resolve()
      }

      request.onerror = () => {
        console.error('❌ Failed to save menu:', request.error)
        reject(request.error)
      }
    })
  }

  async getMenu(): Promise<any | null> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['menu'], 'readonly')
      const store = transaction.objectStore('menu')
      const request = store.get('current-menu')

      request.onsuccess = () => {
        const menu = request.result
        if (menu) {
          console.log('📋 Menu loaded from offline storage')
          resolve(menu.data)
        } else {
          resolve(null)
        }
      }

      request.onerror = () => {
        console.error('❌ Failed to get menu:', request.error)
        reject(request.error)
      }
    })
  }

  // Settings Management
  async saveSetting(key: string, value: any): Promise<void> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['settings'], 'readwrite')
      const store = transaction.objectStore('settings')
      const request = store.put({ key, value })

      request.onsuccess = () => {
        console.log('💾 Setting saved:', key)
        resolve()
      }

      request.onerror = () => {
        console.error('❌ Failed to save setting:', request.error)
        reject(request.error)
      }
    })
  }

  async getSetting(key: string): Promise<any | null> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['settings'], 'readonly')
      const store = transaction.objectStore('settings')
      const request = store.get(key)

      request.onsuccess = () => {
        const setting = request.result
        resolve(setting ? setting.value : null)
      }

      request.onerror = () => {
        console.error('❌ Failed to get setting:', request.error)
        reject(request.error)
      }
    })
  }

  // Utility Methods
  async clearAllData(): Promise<void> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['orders', 'menu', 'settings'], 'readwrite')
      
      const ordersStore = transaction.objectStore('orders')
      const menuStore = transaction.objectStore('menu')
      const settingsStore = transaction.objectStore('settings')

      const ordersRequest = ordersStore.clear()
      const menuRequest = menuStore.clear()
      const settingsRequest = settingsStore.clear()

      let completed = 0
      const checkComplete = () => {
        completed++
        if (completed === 3) {
          console.log('🗑️ All offline data cleared')
          resolve()
        }
      }

      ordersRequest.onsuccess = checkComplete
      menuRequest.onsuccess = checkComplete
      settingsRequest.onsuccess = checkComplete

      ordersRequest.onerror = () => reject(ordersRequest.error)
      menuRequest.onerror = () => reject(menuRequest.error)
      settingsRequest.onerror = () => reject(settingsRequest.error)
    })
  }

  async getStorageInfo(): Promise<{
    ordersCount: number
    menuLastUpdated: Date | null
    totalSize: number
  }> {
    if (!this.db) await this.init()

    const ordersCount = await this.getOrdersCount()
    const menuLastUpdated = await this.getMenuLastUpdated()
    const totalSize = await this.getTotalSize()

    return {
      ordersCount,
      menuLastUpdated,
      totalSize
    }
  }

  private async getOrdersCount(): Promise<number> {
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['orders'], 'readonly')
      const store = transaction.objectStore('orders')
      const request = store.count()

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  private async getMenuLastUpdated(): Promise<Date | null> {
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['menu'], 'readonly')
      const store = transaction.objectStore('menu')
      const request = store.get('current-menu')

      request.onsuccess = () => {
        const menu = request.result
        resolve(menu ? menu.lastUpdated : null)
      }

      request.onerror = () => reject(request.error)
    })
  }

  private async getTotalSize(): Promise<number> {
    // This is a simplified size calculation
    // In a real implementation, you'd calculate actual storage size
    return new Promise((resolve) => {
      const transaction = this.db!.transaction(['orders', 'menu', 'settings'], 'readonly')
      
      let totalSize = 0
      let completed = 0

      const checkComplete = () => {
        completed++
        if (completed === 3) resolve(totalSize)
      }

      // Count orders
      const ordersStore = transaction.objectStore('orders')
      const ordersRequest = ordersStore.getAll()
      ordersRequest.onsuccess = () => {
        totalSize += JSON.stringify(ordersRequest.result).length
        checkComplete()
      }

      // Count menu
      const menuStore = transaction.objectStore('menu')
      const menuRequest = menuStore.getAll()
      menuRequest.onsuccess = () => {
        totalSize += JSON.stringify(menuRequest.result).length
        checkComplete()
      }

      // Count settings
      const settingsStore = transaction.objectStore('settings')
      const settingsRequest = settingsStore.getAll()
      settingsRequest.onsuccess = () => {
        totalSize += JSON.stringify(settingsRequest.result).length
        checkComplete()
      }
    })
  }
}

// Export singleton instance
export const offlineStorage = new OfflineStorageService()
export default offlineStorage
