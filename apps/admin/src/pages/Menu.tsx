import { useState } from 'react'
import Layout from '@/components/Layout'

interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  category: string
  status: 'available' | 'unavailable'
  image?: string
}

const mockMenuItems: MenuItem[] = [
  {
    id: '1',
    name: 'Butter Chicken',
    description: 'Creamy tomato-based curry with tender chicken',
    price: 450,
    category: 'Main Course',
    status: 'available'
  },
  {
    id: '2',
    name: 'Biryani',
    description: 'Fragrant rice dish with aromatic spices',
    price: 380,
    category: 'Main Course',
    status: 'available'
  },
  {
    id: '3',
    name: 'Naan',
    description: 'Soft leavened flatbread',
    price: 50,
    category: 'Bread',
    status: 'available'
  },
  {
    id: '4',
    name: 'Gulab Jamun',
    description: 'Sweet milk solids in sugar syrup',
    price: 80,
    category: 'Dessert',
    status: 'unavailable'
  }
]

const categories = ['All', 'Appetizers', 'Main Course', 'Bread', 'Dessert', 'Beverages']

export default function Menu() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(mockMenuItems)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)

  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getStatusColor = (status: string) => {
    return status === 'available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
  }

  return (
    <Layout>
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Menu Management</h1>
            <p className="text-slate-600">Manage your restaurant menu items and categories</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700 transition-colors"
          >
            Add Menu Item
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Search</label>
              <input
                type="text"
                placeholder="Search menu items..."
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
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchTerm('')
                  setSelectedCategory('All')
                }}
                className="w-full px-3 py-2 text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Menu Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div key={item.id} className="bg-white rounded-xl border overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 bg-slate-100 flex items-center justify-center">
                <span className="text-4xl">🍽️</span>
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold text-slate-900">{item.name}</h3>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(item.status)}`}>
                    {item.status}
                  </span>
                </div>
                <p className="text-sm text-slate-600 mb-3">{item.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-slate-900">₹{item.price}</span>
                  <span className="text-sm text-slate-500">{item.category}</span>
                </div>
                <div className="flex space-x-2 mt-4">
                  <button className="flex-1 px-3 py-2 text-sm text-sky-600 border border-sky-600 rounded-lg hover:bg-sky-50">
                    Edit
                  </button>
                  <button className="flex-1 px-3 py-2 text-sm text-red-600 border border-red-600 rounded-lg hover:bg-red-50">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Menu Item Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Add Menu Item</h3>
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
                  <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                  <textarea
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                    rows={3}
                    placeholder="Enter item description"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Price (₹)</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                    placeholder="Enter price"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                  <select className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500">
                    <option>Select category</option>
                    <option>Appetizers</option>
                    <option>Main Course</option>
                    <option>Bread</option>
                    <option>Dessert</option>
                    <option>Beverages</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                  <select className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500">
                    <option>Available</option>
                    <option>Unavailable</option>
                  </select>
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
