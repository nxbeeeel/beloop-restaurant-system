import { useState } from 'react'
import Layout from '@/components/Layout'

interface Order {
  id: string
  orderNumber: string
  customer: string
  table?: string
  type: 'dine-in' | 'takeaway' | 'delivery'
  status: 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled'
  items: Array<{ name: string; quantity: number; price: number }>
  total: number
  paymentStatus: 'pending' | 'paid' | 'refunded'
  paymentMethod: 'cash' | 'card' | 'upi' | 'wallet'
  time: string
  estimatedTime?: string
}

const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'ORD-001',
    customer: 'John Doe',
    table: 'T-05',
    type: 'dine-in',
    status: 'preparing',
    items: [
      { name: 'Butter Chicken', quantity: 1, price: 450 },
      { name: 'Naan', quantity: 2, price: 50 }
    ],
    total: 550,
    paymentStatus: 'paid',
    paymentMethod: 'card',
    time: '10 min ago',
    estimatedTime: '15 min'
  },
  {
    id: '2',
    orderNumber: 'ORD-002',
    customer: 'Jane Smith',
    type: 'takeaway',
    status: 'ready',
    items: [
      { name: 'Biryani', quantity: 2, price: 380 }
    ],
    total: 760,
    paymentStatus: 'paid',
    paymentMethod: 'upi',
    time: '5 min ago',
    estimatedTime: 'Ready'
  },
  {
    id: '3',
    orderNumber: 'ORD-003',
    customer: 'Mike Johnson',
    table: 'T-12',
    type: 'dine-in',
    status: 'pending',
    items: [
      { name: 'Gulab Jamun', quantity: 3, price: 80 }
    ],
    total: 240,
    paymentStatus: 'pending',
    paymentMethod: 'cash',
    time: '2 min ago',
    estimatedTime: '20 min'
  }
]

const orderTypes = ['All', 'Dine-in', 'Takeaway', 'Delivery']
const orderStatuses = ['All', 'Pending', 'Preparing', 'Ready', 'Completed', 'Cancelled']

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>(mockOrders)
  const [selectedType, setSelectedType] = useState('All')
  const [selectedStatus, setSelectedStatus] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = selectedType === 'All' || 
                       order.type === selectedType.toLowerCase().replace('-', '-')
    const matchesStatus = selectedStatus === 'All' || 
                         order.status === selectedStatus.toLowerCase()
    
    return matchesSearch && matchesType && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'preparing': return 'bg-blue-100 text-blue-800'
      case 'ready': return 'bg-green-100 text-green-800'
      case 'completed': return 'bg-gray-100 text-gray-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'dine-in': return 'bg-purple-100 text-purple-800'
      case 'takeaway': return 'bg-green-100 text-green-800'
      case 'delivery': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus as any } : order
    ))
  }

  return (
    <Layout>
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Orders</h1>
            <p className="text-slate-600">Track and manage all orders in real-time</p>
          </div>
          <div className="flex space-x-3">
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
              Kitchen Display
            </button>
            <button className="bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700 transition-colors">
              New Order
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Active Orders</p>
                <p className="text-2xl font-bold text-slate-900">
                  {orders.filter(o => ['pending', 'preparing', 'ready'].includes(o.status)).length}
                </p>
              </div>
              <span className="text-2xl">📋</span>
            </div>
          </div>
          <div className="bg-white rounded-xl border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Preparing</p>
                <p className="text-2xl font-bold text-slate-900">
                  {orders.filter(o => o.status === 'preparing').length}
                </p>
              </div>
              <span className="text-2xl">👨‍🍳</span>
            </div>
          </div>
          <div className="bg-white rounded-xl border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Ready</p>
                <p className="text-2xl font-bold text-slate-900">
                  {orders.filter(o => o.status === 'ready').length}
                </p>
              </div>
              <span className="text-2xl">✅</span>
            </div>
          </div>
          <div className="bg-white rounded-xl border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Today's Revenue</p>
                <p className="text-2xl font-bold text-slate-900">
                  ₹{orders.filter(o => o.status === 'completed').reduce((sum, o) => sum + o.total, 0)}
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
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Type</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                {orderTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
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
                {orderStatuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchTerm('')
                  setSelectedType('All')
                  setSelectedStatus('All')
                }}
                className="w-full px-3 py-2 text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Orders Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredOrders.map((order) => (
            <div key={order.id} className="bg-white rounded-xl border p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">{order.orderNumber}</h3>
                  <p className="text-sm text-slate-600">{order.customer}</p>
                  {order.table && <p className="text-sm text-slate-500">Table: {order.table}</p>}
                </div>
                <div className="text-right">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                  <p className="text-xs text-slate-500 mt-1">{order.time}</p>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>{item.quantity}x {item.name}</span>
                    <span>₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between mb-4 pt-2 border-t">
                <span className="font-semibold">Total: ₹{order.total}</span>
                <div className="flex space-x-2">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(order.type)}`}>
                    {order.type}
                  </span>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    order.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.paymentStatus}
                  </span>
                </div>
              </div>

              {order.estimatedTime && (
                <div className="mb-4">
                  <p className="text-sm text-slate-600">
                    Estimated: <span className="font-medium">{order.estimatedTime}</span>
                  </p>
                </div>
              )}

              <div className="flex space-x-2">
                {order.status === 'pending' && (
                  <button
                    onClick={() => updateOrderStatus(order.id, 'preparing')}
                    className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Start Preparing
                  </button>
                )}
                {order.status === 'preparing' && (
                  <button
                    onClick={() => updateOrderStatus(order.id, 'ready')}
                    className="flex-1 px-3 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Mark Ready
                  </button>
                )}
                {order.status === 'ready' && (
                  <button
                    onClick={() => updateOrderStatus(order.id, 'completed')}
                    className="flex-1 px-3 py-2 text-sm bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                  >
                    Complete
                  </button>
                )}
                <button className="px-3 py-2 text-sm text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  )
}
