import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Users, 
  BarChart3, 
  Package, 
  CreditCard, 
  Database, 
  TrendingUp, 
  Zap, 
  Calendar,
  Clock,
  Star,
  Plus,
  Minus,
  Edit,
  Trash2,
  Search,
  Filter,
  Download,
  Upload,
  Printer,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  XCircle,
  DollarSign,
  ShoppingCart,
  Receipt,
  MapPin,
  Phone,
  Mail,
  User,
  Settings,
  Bell,
  Eye,
  EyeOff,
  Save,
  X
} from 'lucide-react'
import { useAdvancedPOSStore } from '../store/advancedPOS'
import toast from 'react-hot-toast'

interface FeaturePanelsProps {
  activeFeature: string
}

const FeaturePanels: React.FC<FeaturePanelsProps> = ({ activeFeature }) => {
  const { 
    cart, 
    orders, 
    settings
  } = useAdvancedPOSStore()

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null)
  const [showCustomerForm, setShowCustomerForm] = useState(false)

  // Customer Management Panel
  const CustomerPanel = () => {
    const [customerForm, setCustomerForm] = useState({
      name: '',
      phone: '',
      email: '',
      address: '',
      loyaltyPoints: 0
    })

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      if (!customerForm.name || !customerForm.phone) {
        toast.error('Name and phone are required')
        return
      }
      
      const newCustomer = {
        id: Date.now().toString(),
        ...customerForm,
        createdAt: new Date().toISOString()
      }
      
      // addCustomer(newCustomer)
      setCustomerForm({ name: '', phone: '', email: '', address: '', loyaltyPoints: 0 })
      setShowCustomerForm(false)
      toast.success('Customer added successfully')
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">Customer Management</h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCustomerForm(true)}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Customer</span>
          </motion.button>
        </div>

        {/* Search and Filter */}
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search customers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button className="px-4 py-2 border border-gray-300 rounded-xl flex items-center space-x-2">
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </button>
        </div>

        {/* Customer List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[]
            .filter((customer: any) => 
              customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              customer.phone.includes(searchQuery) ||
              customer.email?.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map((customer: any) => (
              <motion.div
                key={customer.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card-premium rounded-2xl p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedCustomer(customer as any)}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                    >
                      <Edit className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        // deleteCustomer(customer.id!)
                        toast.success('Customer deleted')
                      }}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold text-gray-800">{customer.name}</h3>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>{customer.phone}</span>
                  </div>
                  {customer.email && (
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Mail className="w-4 h-4" />
                      <span>{customer.email}</span>
                    </div>
                  )}
                  {customer.address && (
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span className="truncate">{customer.address}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2 text-sm text-yellow-600">
                    <Star className="w-4 h-4" />
                    <span>{customer.loyaltyPoints} loyalty points</span>
                  </div>
                </div>
              </motion.div>
            ))}
        </div>

        {/* Add Customer Modal */}
        <AnimatePresence>
          {showCustomerForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl p-6 w-full max-w-md"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Add New Customer</h3>
                  <button onClick={() => setShowCustomerForm(false)}>
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                    <input
                      type="text"
                      value={customerForm.name}
                      onChange={(e) => setCustomerForm({ ...customerForm, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                    <input
                      type="tel"
                      value={customerForm.phone}
                      onChange={(e) => setCustomerForm({ ...customerForm, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={customerForm.email}
                      onChange={(e) => setCustomerForm({ ...customerForm, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <textarea
                      value={customerForm.address}
                      onChange={(e) => setCustomerForm({ ...customerForm, address: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      rows={3}
                    />
                  </div>

                  <div className="flex items-center space-x-4 pt-4">
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium"
                    >
                      Add Customer
                    </motion.button>
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowCustomerForm(false)}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium"
                    >
                      Cancel
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }

  // Inventory Management Panel
  const InventoryPanel = () => {
    const inventoryItems = [
      { id: 1, name: 'Chicken', quantity: 50, unit: 'kg', minStock: 10, price: 200 },
      { id: 2, name: 'Rice', quantity: 100, unit: 'kg', minStock: 20, price: 60 },
      { id: 3, name: 'Tomatoes', quantity: 25, unit: 'kg', minStock: 5, price: 40 },
      { id: 4, name: 'Onions', quantity: 30, unit: 'kg', minStock: 8, price: 30 },
      { id: 5, name: 'Cooking Oil', quantity: 20, unit: 'L', minStock: 5, price: 120 }
    ]

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">Inventory Management</h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-xl font-medium flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Item</span>
          </motion.button>
        </div>

        {/* Inventory Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="card-premium rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Items</p>
                <p className="text-2xl font-bold text-gray-800">{inventoryItems.length}</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <Package className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="card-premium rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Low Stock</p>
                <p className="text-2xl font-bold text-orange-600">
                  {inventoryItems.filter(item => item.quantity <= item.minStock).length}
                </p>
              </div>
              <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
              </div>
            </div>
          </div>
          <div className="card-premium rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Out of Stock</p>
                <p className="text-2xl font-bold text-red-600">
                  {inventoryItems.filter(item => item.quantity === 0).length}
                </p>
              </div>
              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                <XCircle className="w-5 h-5 text-red-600" />
              </div>
            </div>
          </div>
          <div className="card-premium rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Value</p>
                <p className="text-2xl font-bold text-green-600">
                  ₹{inventoryItems.reduce((sum, item) => sum + (item.quantity * item.price), 0).toLocaleString()}
                </p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Inventory Table */}
        <div className="card-premium rounded-2xl p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-800">Item</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-800">Quantity</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-800">Unit</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-800">Min Stock</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-800">Price</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-800">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-800">Actions</th>
                </tr>
              </thead>
              <tbody>
                {inventoryItems.map((item) => (
                  <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-800">{item.name}</td>
                    <td className="py-3 px-4 text-gray-600">{item.quantity}</td>
                    <td className="py-3 px-4 text-gray-600">{item.unit}</td>
                    <td className="py-3 px-4 text-gray-600">{item.minStock}</td>
                    <td className="py-3 px-4 text-gray-600">₹{item.price}</td>
                    <td className="py-3 px-4">
                      {item.quantity === 0 ? (
                        <span className="px-2 py-1 bg-red-100 text-red-600 rounded-full text-xs">Out of Stock</span>
                      ) : item.quantity <= item.minStock ? (
                        <span className="px-2 py-1 bg-orange-100 text-orange-600 rounded-full text-xs">Low Stock</span>
                      ) : (
                        <span className="px-2 py-1 bg-green-100 text-green-600 rounded-full text-xs">In Stock</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <button className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-green-600 hover:bg-green-50 rounded">
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }

  // Reports Panel
  const ReportsPanel = () => {
    const reports = [
      { name: 'Sales Report', icon: TrendingUp, color: 'from-blue-500 to-blue-600' },
      { name: 'Inventory Report', icon: Package, color: 'from-green-500 to-green-600' },
      { name: 'Customer Report', icon: Users, color: 'from-purple-500 to-purple-600' },
      { name: 'Payment Report', icon: CreditCard, color: 'from-orange-500 to-orange-600' },
      { name: 'Kitchen Report', icon: Zap, color: 'from-red-500 to-red-600' },
      { name: 'Analytics Report', icon: BarChart3, color: 'from-indigo-500 to-indigo-600' }
    ]

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">Reports & Analytics</h2>
          <div className="flex items-center space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl font-medium flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Export All</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium flex items-center space-x-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </motion.button>
          </div>
        </div>

        {/* Report Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((report) => (
            <motion.div
              key={report.name}
              whileHover={{ scale: 1.02, y: -5 }}
              className="card-premium rounded-2xl p-6 cursor-pointer"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-r ${report.color} rounded-xl flex items-center justify-center`}>
                  <report.icon className="w-6 h-6 text-white" />
                </div>
                <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                  <Download className="w-4 h-4" />
                </button>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{report.name}</h3>
              <p className="text-sm text-gray-600 mb-4">Generate detailed report for {report.name.toLowerCase()}</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full px-4 py-2 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-lg font-medium"
              >
                Generate Report
              </motion.button>
            </motion.div>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="card-premium rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Today's Sales</p>
                <p className="text-2xl font-bold text-green-600">₹45,250</p>
                <p className="text-xs text-green-600">+12% from yesterday</p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </div>
          <div className="card-premium rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Orders Today</p>
                <p className="text-2xl font-bold text-blue-600">128</p>
                <p className="text-xs text-blue-600">+8% from yesterday</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <Receipt className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="card-premium rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Order Value</p>
                <p className="text-2xl font-bold text-purple-600">₹354</p>
                <p className="text-xs text-purple-600">+5% from yesterday</p>
              </div>
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-purple-600" />
              </div>
            </div>
          </div>
          <div className="card-premium rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Customers</p>
                <p className="text-2xl font-bold text-orange-600">94</p>
                <p className="text-xs text-orange-600">+15% from yesterday</p>
              </div>
              <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                <Users className="w-5 h-5 text-orange-600" />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Kitchen Display Panel
  const KitchenPanel = () => {
    const kitchenOrders = orders.filter((order: any) => 
      ['preparing', 'ready'].includes(order.status)
    )

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">Kitchen Display System</h2>
          <div className="flex items-center space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl font-medium flex items-center space-x-2"
            >
              <Printer className="w-4 h-4" />
              <span>Print All</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl font-medium flex items-center space-x-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </motion.button>
          </div>
        </div>

        {/* Kitchen Orders */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Preparing Orders */}
          <div className="card-premium rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Preparing Orders</h3>
              <span className="px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-sm font-medium">
                {kitchenOrders.filter((order: any) => order.status === 'preparing').length}
              </span>
            </div>
            <div className="space-y-4">
              {kitchenOrders
                .filter((order: any) => order.status === 'preparing')
                .map((order: any) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="border border-orange-200 rounded-xl p-4 bg-orange-50"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-800">Order #{order.id}</h4>
                      <span className="text-sm text-orange-600 font-medium">Preparing</span>
                    </div>
                    <div className="space-y-1">
                      {order.items.map((item: any, index: number) => (
                        <div key={index} className="flex items-center justify-between text-sm">
                          <span className="text-gray-700">{item.quantity}x {item.menuItem.name}</span>
                          <span className="text-gray-500">{item.menuItem.preparationTime}m</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 pt-3 border-t border-orange-200">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Started at: {new Date().toLocaleTimeString()}</span>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-3 py-1 bg-green-500 text-white rounded-lg text-sm font-medium"
                        >
                          Mark Ready
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
            </div>
          </div>

          {/* Ready Orders */}
          <div className="card-premium rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Ready Orders</h3>
              <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-sm font-medium">
                {kitchenOrders.filter((order: any) => order.status === 'ready').length}
              </span>
            </div>
            <div className="space-y-4">
              {kitchenOrders
                .filter((order: any) => order.status === 'ready')
                .map((order: any) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="border border-green-200 rounded-xl p-4 bg-green-50"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-800">Order #{order.id}</h4>
                      <span className="text-sm text-green-600 font-medium">Ready</span>
                    </div>
                    <div className="space-y-1">
                      {order.items.map((item: any, index: number) => (
                        <div key={index} className="flex items-center justify-between text-sm">
                          <span className="text-gray-700">{item.quantity}x {item.menuItem.name}</span>
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 pt-3 border-t border-green-200">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Ready at: {new Date().toLocaleTimeString()}</span>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-3 py-1 bg-blue-500 text-white rounded-lg text-sm font-medium"
                        >
                          Serve
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Reservations Panel
  const ReservationsPanel = () => {
    const reservations = [
      { id: 1, name: 'John Doe', phone: '+91 98765 43210', date: '2024-01-15', time: '19:00', guests: 4, table: 'Table 5', status: 'confirmed' },
      { id: 2, name: 'Jane Smith', phone: '+91 98765 43211', date: '2024-01-15', time: '20:00', guests: 2, table: 'Table 3', status: 'pending' },
      { id: 3, name: 'Mike Johnson', phone: '+91 98765 43212', date: '2024-01-15', time: '21:00', guests: 6, table: 'Table 8', status: 'confirmed' }
    ]

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">Reservations</h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl font-medium flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>New Reservation</span>
          </motion.button>
        </div>

        {/* Today's Reservations */}
        <div className="card-premium rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Today's Reservations</h3>
          <div className="space-y-4">
            {reservations.map((reservation) => (
              <motion.div
                key={reservation.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-800">{reservation.name}</h4>
                    <p className="text-sm text-gray-600">{reservation.phone}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-800">{reservation.time}</p>
                    <p className="text-sm text-gray-600">{reservation.date}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>{reservation.guests} guests</span>
                    <span>{reservation.table}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      reservation.status === 'confirmed' 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-yellow-100 text-yellow-600'
                    }`}>
                      {reservation.status}
                    </span>
                    <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Render the appropriate panel based on active feature
  const renderPanel = () => {
    switch (activeFeature) {
      case 'customers':
        return <CustomerPanel />
      case 'inventory':
        return <InventoryPanel />
      case 'reports':
        return <ReportsPanel />
      case 'kitchen':
        return <KitchenPanel />
      case 'reservations':
        return <ReservationsPanel />
      default:
        return (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Feature Coming Soon</h3>
              <p className="text-gray-600">This feature is under development</p>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="p-6">
      {renderPanel()}
    </div>
  )
}

export default FeaturePanels
