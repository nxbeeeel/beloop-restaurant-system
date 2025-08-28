import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import toast from 'react-hot-toast'
import apiService, { MenuItem as ApiMenuItem } from '../services/api'

// Enhanced interfaces
export interface MenuItem {
  id: string
  name: string
  price: number
  category: string
  image?: string
  available: boolean
  description?: string
  ingredients?: string[]
  allergens?: string[]
  preparationTime?: number // in minutes
  calories?: number
  isVeg?: boolean
  isVegan?: boolean
  isGlutenFree?: boolean
  popularity?: number // 1-5 rating
  cost?: number // cost price for profit calculation
  variations?: Array<{
    name: string
    priceModifier: number
  }>
}

export interface CartItem {
  menuItem: MenuItem
  quantity: number
  notes?: string
  modifiers?: Array<{ name: string; price: number }>
  selectedVariation?: string
  customizations?: Array<{ name: string; price: number }>
}

export interface Customer {
  id?: string
  name: string
  phone: string
  email?: string
  address?: string
  loyaltyPoints?: number
  preferences?: string[]
  allergies?: string[]
  previousOrders?: number
  totalSpent?: number
  birthday?: Date
  anniversary?: Date
}

export interface ZomatoOrder {
  id: string
  platform: 'zomato' | 'swiggy' | 'ubereats'
  status: 'received' | 'accepted' | 'preparing' | 'ready' | 'dispatched'
  items: CartItem[]
  customer: Customer
  deliveryAddress: string
  estimatedDeliveryTime: Date
  platformFee: number
  deliveryFee: number
  total: number
  receivedAt: Date
}

export interface Order {
  id?: string
  items: CartItem[]
  subtotal: number
  tax: number
  serviceCharge: number
  discount: number
  tip?: number
  loyaltyPointsUsed?: number
  loyaltyPointsEarned?: number
  total: number
  orderType: 'dine-in' | 'takeaway' | 'delivery' | 'zomato' | 'swiggy'
  table?: string
  customer?: Customer
  paymentMethod?: 'cash' | 'card' | 'upi' | 'wallet' | 'split'
  paymentDetails?: {
    cashAmount?: number
    cardAmount?: number
    upiAmount?: number
    change?: number
    transactionId?: string
  }
  status: 'draft' | 'placed' | 'accepted' | 'preparing' | 'ready' | 'completed' | 'cancelled'
  createdAt: Date
  completedAt?: Date
  estimatedTime?: number
  actualTime?: number
  rating?: number
  feedback?: string
  kitchenNotes?: string
  isRush?: boolean
  source?: 'pos' | 'online' | 'zomato' | 'swiggy' | 'phone'
}

export interface InventoryItem {
  id: string
  name: string
  quantity: number
  unit: string
  lowStockThreshold: number
  cost: number
  supplier?: string
  expiryDate?: Date
  isLowStock: boolean
}

export interface AIRecommendation {
  type: 'upsell' | 'cross-sell' | 'discount' | 'combo'
  items: MenuItem[]
  reason: string
  confidence: number
  estimatedRevenue: number
}

interface AdvancedPOSState {
  // Menu and Categories
  menuItems: MenuItem[]
  categories: string[]
  selectedCategory: string
  searchQuery: string
  isLoadingMenu: boolean
  menuError: string | null

  // Cart
  cart: CartItem[]
  cartTotal: number
  cartSubtotal: number
  cartTax: number
  cartDiscount: number
  cartTip: number

  // Order Management
  orders: Order[]
  currentOrder: Order | null
  orderType: 'dine-in' | 'takeaway' | 'delivery'
  selectedTable: string
  customer: Customer | null

  // UI State
  isPaymentModalOpen: boolean
  isCustomerModalOpen: boolean
  isListening: boolean
  showAnalytics: boolean

  // Features
  aiRecommendations: MenuItem[]
  lowStockAlerts: string[]
  zomatoOrders: ZomatoOrder[]
  settings: {
    taxRate: number
    serviceCharge: number
    currency: string
    language: string
    theme: 'light' | 'dark'
    autoSave: boolean
    soundEnabled: boolean
    notificationsEnabled: boolean
  }

  // Actions
  fetchMenuItems: () => Promise<void>
  setSelectedCategory: (category: string) => void
  setSearchQuery: (query: string) => void
  addToCart: (item: MenuItem, quantity?: number, notes?: string) => void
  removeFromCart: (itemId: string) => void
  updateCartItemQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void
  setOrderType: (type: 'dine-in' | 'takeaway' | 'delivery') => void
  setTable: (table: string) => void
  setCustomer: (customer: Customer | null) => void
  createOrder: () => Promise<Order | null>
  startListening: () => void
  stopListening: () => void
  checkLowStock: () => void
  syncWithCloud: () => Promise<void>
  setPaymentModalOpen: (open: boolean) => void
  setCustomerModalOpen: (open: boolean) => void
  setShowAnalytics: (show: boolean) => void
  updateSettings: (settings: Partial<AdvancedPOSState['settings']>) => void
}

export const useAdvancedPOSStore = create<AdvancedPOSState>()(
  persist(
    (set, get) => ({
      // Initial state
      menuItems: [],
      categories: ['All', 'Appetizers', 'Main Course', 'Bread', 'Desserts', 'Beverages'],
      selectedCategory: 'All',
      searchQuery: '',
      isLoadingMenu: false,
      menuError: null,

      cart: [],
      cartTotal: 0,
      cartSubtotal: 0,
      cartTax: 0,
      cartDiscount: 0,
      cartTip: 0,

      orders: [],
      currentOrder: null,
      orderType: 'dine-in',
      selectedTable: '',
      customer: null,

      isPaymentModalOpen: false,
      isCustomerModalOpen: false,
      isListening: false,
      showAnalytics: false,

      aiRecommendations: [],
      lowStockAlerts: [],
      zomatoOrders: [],
      settings: {
        taxRate: 5, // 5% GST
        serviceCharge: 10, // 10% service charge
        currency: '₹',
        language: 'en',
        theme: 'light',
        autoSave: true,
        soundEnabled: true,
        notificationsEnabled: true
      },

      // Actions
      fetchMenuItems: async () => {
        set({ isLoadingMenu: true, menuError: null })
        try {
          const response = await apiService.getMenuItems()
          if (response.success) {
            // Transform API menu items to match our interface
            const transformedItems: MenuItem[] = response.data.map((item: ApiMenuItem) => ({
              id: item.id,
              name: item.name,
              price: item.price,
              category: item.category,
              image: item.image,
              available: item.available,
              description: item.description,
              preparationTime: item.preparationTime,
              isVeg: item.isVeg,
              popularity: item.popularity || 3,
              calories: Math.floor(Math.random() * 500) + 100, // Mock calories
              isVegan: item.isVeg,
              isGlutenFree: Math.random() > 0.7, // Mock gluten-free status
              cost: item.price * 0.4, // Mock cost (40% of selling price)
              ingredients: ['Ingredient 1', 'Ingredient 2'], // Mock ingredients
              allergens: Math.random() > 0.8 ? ['Nuts', 'Dairy'] : [], // Mock allergens
              variations: [
                { name: 'Regular', priceModifier: 0 },
                { name: 'Large', priceModifier: 50 }
              ]
            }))
            set({ menuItems: transformedItems, isLoadingMenu: false })
          } else {
            set({ menuError: 'Failed to fetch menu items', isLoadingMenu: false })
          }
        } catch (error) {
          console.error('Error fetching menu items:', error)
          set({ menuError: 'Network error while fetching menu', isLoadingMenu: false })
          // Fallback to hardcoded menu items if API fails
          set({ menuItems: MENU_ITEMS, isLoadingMenu: false })
        }
      },

      setSelectedCategory: (category) => set({ selectedCategory: category }),

      setSearchQuery: (query) => set({ searchQuery: query }),

      addToCart: (item, quantity = 1, notes = '') => {
        const { cart, settings } = get()
        const existingItem = cart.find(cartItem => cartItem.menuItem.id === item.id)

        if (existingItem) {
          const updatedCart = cart.map(cartItem =>
            cartItem.menuItem.id === item.id
              ? { ...cartItem, quantity: cartItem.quantity + quantity }
              : cartItem
          )
          set({ cart: updatedCart })
        } else {
          const newCartItem: CartItem = {
            menuItem: item,
            quantity,
            notes
          }
          set({ cart: [...cart, newCartItem] })
        }

        // Recalculate totals
        get().updateCartTotals()
        toast.success(`Added ${item.name} to cart`)
      },

      removeFromCart: (itemId) => {
        const { cart } = get()
        const updatedCart = cart.filter(item => item.menuItem.id !== itemId)
        set({ cart: updatedCart })
        get().updateCartTotals()
      },

      updateCartItemQuantity: (itemId, quantity) => {
        const { cart } = get()
        if (quantity <= 0) {
          get().removeFromCart(itemId)
          return
        }

        const updatedCart = cart.map(item =>
          item.menuItem.id === itemId ? { ...item, quantity } : item
        )
        set({ cart: updatedCart })
        get().updateCartTotals()
      },

      clearCart: () => {
        set({ cart: [] })
        get().updateCartTotals()
      },

      updateCartTotals: () => {
        const { cart, settings } = get()
        const subtotal = cart.reduce((sum, item) => sum + (item.menuItem.price * item.quantity), 0)
        const tax = (subtotal * settings.taxRate) / 100
        const serviceCharge = (subtotal * settings.serviceCharge) / 100
        const total = subtotal + tax + serviceCharge + get().cartTip - get().cartDiscount

        set({
          cartSubtotal: subtotal,
          cartTax: tax,
          cartTotal: total
        })
      },

      setOrderType: (type) => set({ orderType: type }),

      setTable: (table) => set({ selectedTable: table }),

      setCustomer: (customer) => set({ customer }),

      createOrder: async () => {
        const { cart, orderType, selectedTable, customer, settings } = get()
        
        if (cart.length === 0) {
          toast.error('Cart is empty')
          return null
        }

        try {
          const orderData = {
            items: cart.map(item => ({
              id: item.menuItem.id,
              name: item.menuItem.name,
              price: item.menuItem.price,
              quantity: item.quantity
            })),
            customerInfo: customer,
            paymentMethod: 'pending'
          }

          const response = await apiService.createOrder(orderData)
          
          if (response.success) {
            const newOrder: Order = {
              id: response.data.id,
              items: cart,
              subtotal: get().cartSubtotal,
              tax: get().cartTax,
              serviceCharge: (get().cartSubtotal * settings.serviceCharge) / 100,
              discount: get().cartDiscount,
              tip: get().cartTip,
              total: get().cartTotal,
              orderType,
              table: selectedTable,
              customer,
              status: 'placed',
              createdAt: new Date(),
              source: 'pos'
            }

            set({ 
              orders: [...get().orders, newOrder],
              currentOrder: newOrder,
              cart: []
            })
            get().updateCartTotals()
            
            toast.success('Order created successfully!')
            return newOrder
          } else {
            toast.error('Failed to create order')
            return null
          }
        } catch (error) {
          console.error('Error creating order:', error)
          toast.error('Network error while creating order')
          return null
        }
      },

      startListening: () => set({ isListening: true }),

      stopListening: () => set({ isListening: false }),

      checkLowStock: () => {
        // Mock low stock alerts
        const alerts = ['Butter Chicken running low', 'Naan bread needs restocking']
        set({ lowStockAlerts: alerts })
      },

      syncWithCloud: async () => {
        try {
          await get().fetchMenuItems()
          toast.success('Synced with cloud successfully')
        } catch (error) {
          toast.error('Failed to sync with cloud')
        }
      },

      setPaymentModalOpen: (open) => set({ isPaymentModalOpen: open }),

      setCustomerModalOpen: (open) => set({ isCustomerModalOpen: open }),

      setShowAnalytics: (show) => set({ showAnalytics: show }),

      updateSettings: (newSettings) => {
        set({ settings: { ...get().settings, ...newSettings } })
        get().updateCartTotals()
      }
    }),
    {
      name: 'advanced-pos-storage',
      partialize: (state) => ({
        cart: state.cart,
        orderType: state.orderType,
        selectedTable: state.selectedTable,
        customer: state.customer,
        settings: state.settings
      })
    }
  )
)

// Computed selectors
export const useFilteredMenuItems = () => {
  const { menuItems, selectedCategory, searchQuery } = useAdvancedPOSStore()
  
  return menuItems.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory
    const matchesSearch = searchQuery === '' || 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase())
    
    return matchesCategory && matchesSearch && item.available
  })
}

// Menu data - fallback data if API fails
export const MENU_ITEMS: MenuItem[] = [
  {
    id: '1',
    name: 'Butter Chicken',
    price: 450,
    category: 'Main Course',
    available: true,
    description: 'Creamy tomato-based curry with tender chicken',
    isVeg: false,
    preparationTime: 15,
    calories: 420,
    popularity: 5
  },
  {
    id: '2',
    name: 'Chicken Biryani',
    price: 380,
    category: 'Main Course',
    available: true,
    description: 'Fragrant rice dish with aromatic spices',
    isVeg: false,
    preparationTime: 25,
    calories: 650,
    popularity: 5
  },
  {
    id: '3',
    name: 'Paneer Butter Masala',
    price: 320,
    category: 'Main Course',
    available: true,
    description: 'Rich and creamy paneer curry',
    isVeg: true,
    preparationTime: 12,
    calories: 380,
    popularity: 4
  },
  {
    id: '4',
    name: 'Dal Tadka',
    price: 180,
    category: 'Main Course',
    available: true,
    description: 'Yellow lentils with aromatic tempering',
    isVeg: true,
    isVegan: true,
    preparationTime: 10,
    calories: 220,
    popularity: 4
  },
  {
    id: '5',
    name: 'Naan',
    price: 50,
    category: 'Bread',
    available: true,
    description: 'Soft leavened flatbread',
    isVeg: true,
    preparationTime: 5,
    calories: 280,
    popularity: 5
  },
  {
    id: '6',
    name: 'Garlic Naan',
    price: 60,
    category: 'Bread',
    available: true,
    description: 'Naan with garlic and herbs',
    isVeg: true,
    preparationTime: 5,
    calories: 300,
    popularity: 4
  },
  {
    id: '7',
    name: 'Roti',
    price: 25,
    category: 'Bread',
    available: true,
    description: 'Whole wheat flatbread',
    isVeg: true,
    isVegan: true,
    preparationTime: 3,
    calories: 150,
    popularity: 3
  },
  {
    id: '8',
    name: 'Samosa',
    price: 80,
    category: 'Appetizers',
    available: true,
    description: 'Crispy pastry with spiced filling',
    isVeg: true,
    preparationTime: 8,
    calories: 180,
    popularity: 4
  },
  {
    id: '9',
    name: 'Chicken Tikka',
    price: 280,
    category: 'Appetizers',
    available: true,
    description: 'Grilled chicken with spices',
    isVeg: false,
    preparationTime: 12,
    calories: 320,
    popularity: 5
  },
  {
    id: '10',
    name: 'Gulab Jamun',
    price: 80,
    category: 'Desserts',
    available: true,
    description: 'Sweet milk solids in sugar syrup',
    isVeg: true,
    preparationTime: 5,
    calories: 350,
    popularity: 4
  },
  {
    id: '11',
    name: 'Lassi',
    price: 60,
    category: 'Beverages',
    available: true,
    description: 'Traditional yogurt drink',
    isVeg: true,
    preparationTime: 2,
    calories: 120,
    popularity: 3
  },
  {
    id: '12',
    name: 'Masala Chai',
    price: 30,
    category: 'Beverages',
    available: true,
    description: 'Spiced tea with milk',
    isVeg: true,
    preparationTime: 3,
    calories: 50,
    popularity: 5
  }
]

export const CATEGORIES = ['All', 'Appetizers', 'Main Course', 'Bread', 'Desserts', 'Beverages']
