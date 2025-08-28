import { useState } from 'react'
import Layout from '@/components/Layout'

interface InventoryItem {
  id: string
  name: string
  category: string
  unit: string
  currentStock: number
  minStock: number
  maxStock: number
  unitPrice: number
  supplier: string
  lastUpdated: string
  status: 'in-stock' | 'low-stock' | 'out-of-stock'
}

const mockInventory: InventoryItem[] = [
  {
    id: '1',
    name: 'Tomatoes',
    category: 'Vegetables',
    unit: 'kg',
    currentStock: 5,
    minStock: 10,
    maxStock: 50,
    unitPrice: 40,
    supplier: 'Fresh Farm Supplies',
    lastUpdated: '2 hours ago',
    status: 'low-stock'
  },
  {
    id: '2',
    name: 'Chicken Breast',
    category: 'Meat',
    unit: 'kg',
    currentStock: 25,
    minStock: 5,
    maxStock: 100,
    unitPrice: 180,
    supplier: 'Prime Meat Co.',
    lastUpdated: '1 hour ago',
    status: 'in-stock'
  },
  {
    id: '3',
    name: 'Basmati Rice',
    category: 'Grains',
    unit: 'kg',
    currentStock: 0,
    minStock: 20,
    maxStock: 200,
    unitPrice: 120,
    supplier: 'Golden Grains',
    lastUpdated: '30 min ago',
    status: 'out-of-stock'
  },
  {
    id: '4',
    name: 'Cooking Oil',
    category: 'Oils',
    unit: 'liters',
    currentStock: 15,
    minStock: 5,
    maxStock: 50,
    unitPrice: 150,
    supplier: 'Pure Oil Corp',
    lastUpdated: '3 hours ago',
    status: 'in-stock'
  }
]

const categories = ['All', 'Vegetables', 'Meat', 'Grains', 'Oils', 'Spices', 'Dairy']
const statuses = ['All', 'In Stock', 'Low Stock', 'Out of Stock']

export default function Inventory() {
  const [inventory, setInventory] = useState<InventoryItem[]>(mockInventory)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedStatus, setSelectedStatus] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)

  const filteredItems = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory
    const matchesStatus = selectedStatus === 'All' || 
                         item.status === selectedStatus.toLowerCase().replace(' ', '-')
    
    return matchesSearch && matchesCategory && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in-stock': return 'bg-green-100 text-green-800'
      case 'low-stock': return 'bg-yellow-100 text-yellow-800'
      case 'out-of-stock': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStockLevel = (item: InventoryItem) => {
    const percentage = (item.currentStock / item.maxStock) * 100
    if (item.currentStock === 0) return 'out-of-stock'
    if (item.currentStock <= item.minStock) return 'low-stock'
    return 'in-stock'
  }

  const updateStock = (itemId: string, newStock: number) => {
    setInventory(inventory.map(item => {
      if (item.id === itemId) {
        const status = newStock === 0 ? 'out-of-stock' : 
                      newStock <= item.minStock ? 'low-stock' : 'in-stock'
        return { ...item, currentStock: newStock, status, lastUpdated: 'Just now' }
      }
      return item
    }))
  }

  return (
    <Layout>
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Inventory</h1>
            <p className="text-slate-600">Track and manage your restaurant inventory</p>
          </div>
          <div className="flex space-x-3">
            <button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors">
              Purchase Order
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700 transition-colors"
            >
              Add Item
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Items</p>
                <p className="text-2xl font-bold text-slate-900">{inventory.length}</p>
              </div>
              <span className="text-2xl">📦</span>
            </div>
          </div>
          <div className="bg-white rounded-xl border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Low Stock Items</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {inventory.filter(i => i.status === 'low-stock').length}
                </p>
              </div>
              <span className="text-2xl">⚠️</span>
            </div>
          </div>
          <div className="bg-white rounded-xl border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Out of Stock</p>
                <p className="text-2xl font-bold text-red-600">
                  {inventory.filter(i => i.status === 'out-of-stock').length}
                </p>
              </div>
              <span className="text-2xl">🚫</span>
            </div>
          </div>
          <div className="bg-white rounded-xl border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Inventory Value</p>
                <p className="text-2xl font-bold text-slate-900">
                  ₹{inventory.reduce((sum, i) => sum + (i.currentStock * i.unitPrice), 0).toLocaleString()}
                </p>
              </div>
              <span className="text-2xl">💰</span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Search</label>
              <input
                type="text"
                placeholder="Search inventory..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                {statuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchTerm('')
                  setSelectedCategory('All')
                  setSelectedStatus('All')
                }}
                className="w-full px-3 py-2 text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Inventory Table */}
        <div className="bg-white rounded-xl border overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h3 className="text-lg font-semibold text-slate-900">
              Inventory Items ({filteredItems.length})
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Item
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Current Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Unit Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Value
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-slate-900">{item.name}</div>
                        <div className="text-sm text-slate-500">{item.supplier}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                      {item.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-slate-900">
                        {item.currentStock} {item.unit}
                      </div>
                      <div className="text-xs text-slate-500">
                        Min: {item.minStock} | Max: {item.maxStock}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(item.status)}`}>
                        {item.status.replace('-', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                      ₹{item.unitPrice}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                      ₹{(item.currentStock * item.unitPrice).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => updateStock(item.id, Math.max(0, item.currentStock - 1))}
                          className="text-red-600 hover:text-red-900"
                        >
                          -
                        </button>
                        <button
                          onClick={() => updateStock(item.id, item.currentStock + 1)}
                          className="text-green-600 hover:text-green-900"
                        >
                          +
                        </button>
                        <button className="text-sky-600 hover:text-sky-900">Edit</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Item Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Add Inventory Item</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                    placeholder="Enter item name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                  <select className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500">
                    <option>Select category</option>
                    <option>Vegetables</option>
                    <option>Meat</option>
                    <option>Grains</option>
                    <option>Oils</option>
                    <option>Spices</option>
                    <option>Dairy</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Current Stock</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Unit</label>
                    <select className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500">
                      <option>kg</option>
                      <option>liters</option>
                      <option>pieces</option>
                      <option>grams</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Min Stock</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                      placeholder="5"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Unit Price (₹)</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                      placeholder="100"
                    />
                  </div>
                </div>
              </div>
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button className="flex-1 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700">
                  Add Item
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}
