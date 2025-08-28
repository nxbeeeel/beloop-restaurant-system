import Layout from '@/components/Layout'

interface StatCard {
  title: string
  value: string
  change: string
  changeType: 'positive' | 'negative'
  icon: string
}

interface RecentOrder {
  id: string
  customer: string
  items: number
  total: number
  status: 'pending' | 'preparing' | 'ready' | 'completed'
  time: string
}

const stats: StatCard[] = [
  {
    title: 'Today\'s Sales',
    value: '₹45,230',
    change: '+12.5%',
    changeType: 'positive',
    icon: '💰'
  },
  {
    title: 'Orders Today',
    value: '127',
    change: '+8.2%',
    changeType: 'positive',
    icon: '📋'
  },
  {
    title: 'Active Tables',
    value: '18',
    change: '-2.1%',
    changeType: 'negative',
    icon: '🪑'
  },
  {
    title: 'Customer Rating',
    value: '4.8',
    change: '+0.3',
    changeType: 'positive',
    icon: '⭐'
  }
]

const recentOrders: RecentOrder[] = [
  {
    id: '#ORD-001',
    customer: 'John Doe',
    items: 3,
    total: 1250,
    status: 'pending',
    time: '2 min ago'
  },
  {
    id: '#ORD-002',
    customer: 'Jane Smith',
    items: 2,
    total: 890,
    status: 'preparing',
    time: '5 min ago'
  },
  {
    id: '#ORD-003',
    customer: 'Mike Johnson',
    items: 4,
    total: 2100,
    status: 'ready',
    time: '8 min ago'
  },
  {
    id: '#ORD-004',
    customer: 'Sarah Wilson',
    items: 1,
    total: 450,
    status: 'completed',
    time: '12 min ago'
  }
]

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending': return 'bg-yellow-100 text-yellow-800'
    case 'preparing': return 'bg-blue-100 text-blue-800'
    case 'ready': return 'bg-green-100 text-green-800'
    case 'completed': return 'bg-gray-100 text-gray-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

export default function Dashboard() {
  return (
    <Layout>
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-600">Welcome back! Here's what's happening today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
                </div>
                <div className="text-3xl">{stat.icon}</div>
              </div>
              <div className="mt-4 flex items-center">
                <span className={`text-sm font-medium ${
                  stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change}
                </span>
                <span className="text-sm text-slate-500 ml-1">from yesterday</span>
              </div>
            </div>
          ))}
        </div>

        {/* Charts and Recent Orders */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sales Chart */}
          <div className="bg-white rounded-xl border p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Sales Overview</h3>
            <div className="h-64 bg-slate-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl mb-2">📈</div>
                <p className="text-slate-600">Sales chart will be displayed here</p>
                <p className="text-sm text-slate-500">Integration with Chart.js coming soon</p>
              </div>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-xl border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">Recent Orders</h3>
              <button className="text-sm text-sky-600 hover:text-sky-700">View all</button>
            </div>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-sky-100 rounded-lg flex items-center justify-center">
                      <span className="text-sky-600 font-medium">#{order.id.slice(-3)}</span>
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{order.customer}</p>
                      <p className="text-sm text-slate-500">{order.items} items • ₹{order.total}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                    <p className="text-xs text-slate-500 mt-1">{order.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl border p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="flex flex-col items-center p-4 bg-sky-50 rounded-lg hover:bg-sky-100 transition-colors">
              <span className="text-2xl mb-2">➕</span>
              <span className="text-sm font-medium text-slate-900">New Order</span>
            </button>
            <button className="flex flex-col items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
              <span className="text-2xl mb-2">👤</span>
              <span className="text-sm font-medium text-slate-900">Add Customer</span>
            </button>
            <button className="flex flex-col items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
              <span className="text-2xl mb-2">🍽️</span>
              <span className="text-sm font-medium text-slate-900">Add Menu Item</span>
            </button>
            <button className="flex flex-col items-center p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors">
              <span className="text-2xl mb-2">📅</span>
              <span className="text-sm font-medium text-slate-900">New Reservation</span>
            </button>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="bg-white rounded-xl border p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-sm">✓</span>
              </div>
              <div>
                <p className="text-sm text-slate-900">Order #ORD-004 completed</p>
                <p className="text-xs text-slate-500">2 minutes ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-sm">👤</span>
              </div>
              <div>
                <p className="text-sm text-slate-900">New customer registered: Sarah Wilson</p>
                <p className="text-xs text-slate-500">5 minutes ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <span className="text-yellow-600 text-sm">⚠️</span>
              </div>
              <div>
                <p className="text-sm text-slate-900">Low stock alert: Tomatoes (5 units left)</p>
                <p className="text-xs text-slate-500">10 minutes ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 text-sm">🍽️</span>
              </div>
              <div>
                <p className="text-sm text-slate-900">New menu item added: Butter Chicken</p>
                <p className="text-xs text-slate-500">15 minutes ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
