import { useState } from 'react'
import Layout from '@/components/Layout'

interface Customer {
  id: string
  name: string
  email: string
  phone: string
  totalOrders: number
  totalSpent: number
  lastVisit: string
  loyaltyPoints: number
  status: 'active' | 'inactive'
  tags: string[]
  birthday?: string
}

const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+91 98765 43210',
    totalOrders: 45,
    totalSpent: 12500,
    lastVisit: '2 days ago',
    loyaltyPoints: 1250,
    status: 'active',
    tags: ['VIP', 'Regular'],
    birthday: '1985-05-15'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '+91 87654 32109',
    totalOrders: 23,
    totalSpent: 8900,
    lastVisit: '1 week ago',
    loyaltyPoints: 890,
    status: 'active',
    tags: ['Birthday Special'],
    birthday: '1992-08-22'
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike@example.com',
    phone: '+91 76543 21098',
    totalOrders: 8,
    totalSpent: 2100,
    lastVisit: '3 weeks ago',
    loyaltyPoints: 210,
    status: 'inactive',
    tags: ['New Customer']
  },
  {
    id: '4',
    name: 'Sarah Wilson',
    email: 'sarah@example.com',
    phone: '+91 65432 10987',
    totalOrders: 67,
    totalSpent: 18700,
    lastVisit: '1 day ago',
    loyaltyPoints: 1870,
    status: 'active',
    tags: ['VIP', 'Frequent Diner']
  }
]

const customerTags = ['All', 'VIP', 'Regular', 'New Customer', 'Birthday Special', 'Frequent Diner']
const customerStatuses = ['All', 'Active', 'Inactive']

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers)
  const [selectedTag, setSelectedTag] = useState('All')
  const [selectedStatus, setSelectedStatus] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.phone.includes(searchTerm)
    const matchesTag = selectedTag === 'All' || customer.tags.includes(selectedTag)
    const matchesStatus = selectedStatus === 'All' || 
                         customer.status === selectedStatus.toLowerCase()
    
    return matchesSearch && matchesTag && matchesStatus
  })

  const getStatusColor = (status: string) => {
    return status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
  }

  const getTagColor = (tag: string) => {
    switch (tag) {
      case 'VIP': return 'bg-purple-100 text-purple-800'
      case 'Regular': return 'bg-blue-100 text-blue-800'
      case 'New Customer': return 'bg-green-100 text-green-800'
      case 'Birthday Special': return 'bg-pink-100 text-pink-800'
      case 'Frequent Diner': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCustomerTier = (totalSpent: number) => {
    if (totalSpent >= 15000) return { tier: 'Platinum', color: 'text-purple-600' }
    if (totalSpent >= 10000) return { tier: 'Gold', color: 'text-yellow-600' }
    if (totalSpent >= 5000) return { tier: 'Silver', color: 'text-gray-500' }
    return { tier: 'Bronze', color: 'text-orange-600' }
  }

  return (
    <Layout>
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Customers</h1>
            <p className="text-slate-600">Manage your customer relationships and loyalty program</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700 transition-colors"
          >
            Add Customer
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Customers</p>
                <p className="text-2xl font-bold text-slate-900">{customers.length}</p>
              </div>
              <span className="text-2xl">👥</span>
            </div>
          </div>
          <div className="bg-white rounded-xl border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Active Customers</p>
                <p className="text-2xl font-bold text-green-600">
                  {customers.filter(c => c.status === 'active').length}
                </p>
              </div>
              <span className="text-2xl">✅</span>
            </div>
          </div>
          <div className="bg-white rounded-xl border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">VIP Customers</p>
                <p className="text-2xl font-bold text-purple-600">
                  {customers.filter(c => c.tags.includes('VIP')).length}
                </p>
              </div>
              <span className="text-2xl">⭐</span>
            </div>
          </div>
          <div className="bg-white rounded-xl border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Avg. Spending</p>
                <p className="text-2xl font-bold text-slate-900">
                  ₹{Math.round(customers.reduce((sum, c) => sum + c.totalSpent, 0) / customers.length)}
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
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Tag</label>
              <select
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                {customerTags.map(tag => (
                  <option key={tag} value={tag}>{tag}</option>
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
                {customerStatuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchTerm('')
                  setSelectedTag('All')
                  setSelectedStatus('All')
                }}
                className="w-full px-3 py-2 text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Customers Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredCustomers.map((customer) => {
            const tier = getCustomerTier(customer.totalSpent)
            return (
              <div key={customer.id} className="bg-white rounded-xl border p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-sky-100 rounded-full flex items-center justify-center">
                      <span className="text-sky-600 font-medium text-lg">
                        {customer.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">{customer.name}</h3>
                      <p className="text-sm text-slate-600">{customer.email}</p>
                      <p className="text-sm text-slate-500">{customer.phone}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(customer.status)}`}>
                      {customer.status}
                    </span>
                    <p className={`text-sm font-medium ${tier.color} mt-1`}>{tier.tier}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <p className="text-sm text-slate-500">Orders</p>
                    <p className="text-lg font-semibold text-slate-900">{customer.totalOrders}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-slate-500">Spent</p>
                    <p className="text-lg font-semibold text-slate-900">₹{customer.totalSpent.toLocaleString()}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-slate-500">Points</p>
                    <p className="text-lg font-semibold text-slate-900">{customer.loyaltyPoints}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-slate-500 mb-2">Tags</p>
                  <div className="flex flex-wrap gap-1">
                    {customer.tags.map((tag, index) => (
                      <span
                        key={index}
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getTagColor(tag)}`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-500">Last visit: {customer.lastVisit}</p>
                  <div className="flex space-x-2">
                    <button className="text-sky-600 hover:text-sky-900 text-sm">View Profile</button>
                    <button className="text-green-600 hover:text-green-900 text-sm">Send Offer</button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Add Customer Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Add New Customer</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                    placeholder="Enter email address"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Birthday (Optional)</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Tags</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                    placeholder="Enter tags (comma separated)"
                  />
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
                  Add Customer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}
