// API configuration for admin panel
const API_BASE_URL = 'https://beloop-restaurant-system-production.up.railway.app/api'

// API service functions
export const apiService = {
  // Authentication
  login: async (credentials: { email: string; password: string }) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    })
    return response.json()
  },

  // Users
  getUsers: async () => {
    const response = await fetch(`${API_BASE_URL}/users`)
    return response.json()
  },

  createUser: async (userData: any) => {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    })
    return response.json()
  },

  // Menu
  getMenu: async () => {
    const response = await fetch(`${API_BASE_URL}/menu`)
    return response.json()
  },

  createMenuItem: async (itemData: any) => {
    const response = await fetch(`${API_BASE_URL}/menu`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(itemData),
    })
    return response.json()
  },

  // Orders
  getOrders: async () => {
    const response = await fetch(`${API_BASE_URL}/orders`)
    return response.json()
  },

  updateOrderStatus: async (orderId: string, status: string) => {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    })
    return response.json()
  },

  // Analytics
  getAnalytics: async () => {
    const response = await fetch(`${API_BASE_URL}/analytics/sales`)
    return response.json()
  },

  // Health check
  healthCheck: async () => {
    const response = await fetch(`${API_BASE_URL.replace('/api', '')}/health`)
    return response.json()
  }
}

export default apiService
