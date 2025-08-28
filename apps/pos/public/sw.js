// Premium Offline Service Worker
const CACHE_NAME = 'beloop-pos-v1.0.0'
const STATIC_CACHE = 'beloop-static-v1.0.0'
const DYNAMIC_CACHE = 'beloop-dynamic-v1.0.0'

// Files to cache immediately
const STATIC_FILES = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/offline.html'
]

// Install event - cache static files
self.addEventListener('install', (event) => {
  console.log('🔄 Service Worker installing...')
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('📦 Caching static files')
        return cache.addAll(STATIC_FILES)
      })
      .then(() => {
        console.log('✅ Static files cached successfully')
        return self.skipWaiting()
      })
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('🚀 Service Worker activating...')
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('🗑️ Deleting old cache:', cacheName)
              return caches.delete(cacheName)
            }
          })
        )
      })
      .then(() => {
        console.log('✅ Service Worker activated')
        return self.clients.claim()
      })
  )
})

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return
  }

  // Handle API requests
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(handleApiRequest(request))
    return
  }

  // Handle static assets
  if (request.destination === 'script' || 
      request.destination === 'style' || 
      request.destination === 'image' ||
      request.destination === 'font') {
    event.respondWith(handleStaticRequest(request))
    return
  }

  // Handle navigation requests
  if (request.mode === 'navigate') {
    event.respondWith(handleNavigationRequest(request))
    return
  }
})

// Handle API requests with offline fallback
async function handleApiRequest(request) {
  try {
    // Try network first
    const networkResponse = await fetch(request)
    
    // Cache successful responses
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE)
      cache.put(request, networkResponse.clone())
    }
    
    return networkResponse
  } catch (error) {
    console.log('🌐 Network failed, trying cache:', request.url)
    
    // Try cache
    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      console.log('✅ Serving from cache:', request.url)
      return cachedResponse
    }
    
    // Return offline response for specific endpoints
    if (request.url.includes('/api/menu')) {
      return new Response(JSON.stringify({
        success: true,
        data: getOfflineMenuData()
      }), {
        headers: { 'Content-Type': 'application/json' }
      })
    }
    
    if (request.url.includes('/api/orders')) {
      return new Response(JSON.stringify({
        success: true,
        data: getOfflineOrdersData()
      }), {
        headers: { 'Content-Type': 'application/json' }
      })
    }
    
    // Generic offline response
    return new Response(JSON.stringify({
      success: false,
      message: 'Offline mode - data not available',
      offline: true
    }), {
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

// Handle static asset requests
async function handleStaticRequest(request) {
  try {
    // Try cache first for static assets
    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      return cachedResponse
    }
    
    // Try network
    const networkResponse = await fetch(request)
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE)
      cache.put(request, networkResponse.clone())
    }
    
    return networkResponse
  } catch (error) {
    console.log('❌ Static asset not found:', request.url)
    return new Response('Asset not available offline', { status: 404 })
  }
}

// Handle navigation requests
async function handleNavigationRequest(request) {
  try {
    // Try network first
    const networkResponse = await fetch(request)
    return networkResponse
  } catch (error) {
    // Return offline page
    const offlineResponse = await caches.match('/offline.html')
    if (offlineResponse) {
      return offlineResponse
    }
    
    return new Response(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Beloop POS - Offline</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              text-align: center; 
              padding: 50px; 
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              min-height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .container {
              background: rgba(255,255,255,0.1);
              padding: 40px;
              border-radius: 20px;
              backdrop-filter: blur(10px);
            }
            h1 { font-size: 2.5rem; margin-bottom: 20px; }
            p { font-size: 1.2rem; margin-bottom: 30px; }
            .status { 
              background: rgba(255,255,255,0.2); 
              padding: 20px; 
              border-radius: 10px; 
              margin: 20px 0;
            }
            .retry-btn {
              background: #4CAF50;
              color: white;
              border: none;
              padding: 15px 30px;
              border-radius: 10px;
              font-size: 1.1rem;
              cursor: pointer;
              transition: background 0.3s;
            }
            .retry-btn:hover { background: #45a049; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>🔄 Offline Mode</h1>
            <p>Beloop POS is currently offline</p>
            <div class="status">
              <strong>Status:</strong> No internet connection<br>
              <strong>Mode:</strong> Offline operations available
            </div>
            <p>You can still:</p>
            <ul style="text-align: left; display: inline-block;">
              <li>View cached menu items</li>
              <li>Create offline orders</li>
              <li>Access basic POS features</li>
            </ul>
            <br><br>
            <button class="retry-btn" onclick="window.location.reload()">
              🔄 Retry Connection
            </button>
          </div>
        </body>
      </html>
    `, {
      headers: { 'Content-Type': 'text/html' }
    })
  }
}

// Offline data fallbacks
function getOfflineMenuData() {
  return [
    {
      id: 'offline-1',
      name: 'Chicken Biryani',
      description: 'Fragrant basmati rice with tender chicken',
      price: 250,
      category: 'Main Course',
      image: '/images/biryani.jpg',
      available: true,
      preparationTime: 20
    },
    {
      id: 'offline-2',
      name: 'Butter Chicken',
      description: 'Creamy tomato-based curry with tender chicken',
      price: 180,
      category: 'Main Course',
      image: '/images/butter-chicken.jpg',
      available: true,
      preparationTime: 15
    },
    {
      id: 'offline-3',
      name: 'Naan Bread',
      description: 'Soft and fluffy Indian bread',
      price: 30,
      category: 'Bread',
      image: '/images/naan.jpg',
      available: true,
      preparationTime: 5
    }
  ]
}

function getOfflineOrdersData() {
  return []
}

// Background sync for offline orders
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-orders') {
    console.log('🔄 Syncing offline orders...')
    event.waitUntil(syncOfflineOrders())
  }
})

async function syncOfflineOrders() {
  try {
    // Get offline orders from IndexedDB
    const offlineOrders = await getOfflineOrders()
    
    for (const order of offlineOrders) {
      try {
        const response = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(order)
        })
        
        if (response.ok) {
          // Remove from offline storage
          await removeOfflineOrder(order.id)
          console.log('✅ Synced order:', order.id)
        }
      } catch (error) {
        console.log('❌ Failed to sync order:', order.id, error)
      }
    }
  } catch (error) {
    console.log('❌ Sync failed:', error)
  }
}

// IndexedDB helpers (simplified)
async function getOfflineOrders() {
  // This would be implemented with IndexedDB
  return []
}

async function removeOfflineOrder(orderId) {
  // This would be implemented with IndexedDB
  console.log('Removing offline order:', orderId)
}

console.log('🚀 Beloop POS Service Worker loaded')
