const API_BASE_URL = 'http://localhost:5000/api'

export interface MenuItem {
  id: string
  name: string
  price: number
  category: string
  description: string
  image?: string
  available: boolean
  preparationTime?: number
  isVeg?: boolean
  popularity?: number
}

export interface Order {
  id: string
  items: Array<{
    id: string
    name: string
    price: number
    quantity: number
  }>
  total: number
  status: string
  createdAt: string
}

export interface Payment {
  id: string
  orderId: string
  amount: number
  method: string
  status: string
  createdAt: string
}

export interface SalesAnalytics {
  todaySales: number
  todayOrders: number
  averageOrderValue: number
}

class ApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  }

  // Menu endpoints
  async getMenuItems(): Promise<{ success: boolean; data: MenuItem[] }> {
    return this.request<{ success: boolean; data: MenuItem[] }>('/menu')
  }

  async getMenuItem(id: string): Promise<{ success: boolean; data: MenuItem }> {
    return this.request<{ success: boolean; data: MenuItem }>(`/menu/${id}`)
  }

  // Order endpoints
  async createOrder(orderData: {
    items: Array<{ id: string; name: string; price: number; quantity: number }>
    customerInfo?: any
    paymentMethod?: string
  }): Promise<{ success: boolean; message: string; data: Order }> {
    return this.request<{ success: boolean; message: string; data: Order }>('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    })
  }

  async getOrders(): Promise<{ success: boolean; data: Order[] }> {
    return this.request<{ success: boolean; data: Order[] }>('/orders')
  }

  async getOrder(id: string): Promise<{ success: boolean; data: Order }> {
    return this.request<{ success: boolean; data: Order }>(`/orders/${id}`)
  }

  async updateOrderStatus(id: string, status: string): Promise<{ success: boolean; message: string; data: Order }> {
    return this.request<{ success: boolean; message: string; data: Order }>(`/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    })
  }

  // Payment endpoints
  async processPayment(paymentData: {
    orderId: string
    amount: number
    method: string
    details?: any
  }): Promise<{ success: boolean; message: string; data: Payment }> {
    return this.request<{ success: boolean; message: string; data: Payment }>('/payments', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    })
  }

  async getPayments(): Promise<{ success: boolean; data: Payment[] }> {
    return this.request<{ success: boolean; data: Payment[] }>('/payments')
  }

  // Analytics endpoints
  async getSalesAnalytics(): Promise<{ success: boolean; data: SalesAnalytics }> {
    return this.request<{ success: boolean; data: SalesAnalytics }>('/analytics/sales')
  }

  // Health check
  async healthCheck(): Promise<{ success: boolean; message: string; timestamp: string; version: string }> {
    return this.request<{ success: boolean; message: string; timestamp: string; version: string }>('/health')
  }
}

export const apiService = new ApiService()
export default apiService
