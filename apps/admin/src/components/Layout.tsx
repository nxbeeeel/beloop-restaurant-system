import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/auth'

interface NavItem {
  name: string
  path: string
  icon: string
  badge?: number
}

const navItems: NavItem[] = [
  { name: 'Dashboard', path: '/', icon: '📊' },
  { name: 'Users', path: '/users', icon: '👥' },
  { name: 'Menu', path: '/menu', icon: '🍽️' },
  { name: 'Orders', path: '/orders', icon: '📋', badge: 5 },
  { name: 'Inventory', path: '/inventory', icon: '📦' },
  { name: 'Customers', path: '/customers', icon: '👤' },
  { name: 'Reservations', path: '/reservations', icon: '📅' },
  { name: 'Reports', path: '/reports', icon: '📈' },
  { name: 'Settings', path: '/settings', icon: '⚙️' },
]

export default function Layout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 lg:static lg:inset-0 lg:flex-shrink-0`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between h-16 px-6 border-b">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-sky-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">B</span>
              </div>
              <span className="text-lg font-semibold text-slate-900">Beloop</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-md text-slate-400 hover:text-slate-600"
            >
              ✕
            </button>
          </div>

          <nav className="flex-1 mt-6 px-3 overflow-y-auto">
            <div className="space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    location.pathname === item.path
                      ? 'bg-sky-50 text-sky-700 border-r-2 border-sky-500'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <span className="mr-3 text-lg">{item.icon}</span>
                  {item.name}
                  {item.badge && (
                    <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-1">
                      {item.badge}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 lg:ml-0">
        {/* Header */}
        <header className="bg-white shadow-sm border-b sticky top-0 z-40">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-md text-slate-400 hover:text-slate-600"
            >
              ☰
            </button>

            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-4">
                <button className="p-2 text-slate-400 hover:text-slate-600">
                  🔔
                </button>
                <button className="p-2 text-slate-400 hover:text-slate-600">
                  ⚙️
                </button>
              </div>

              <div className="flex items-center space-x-3">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-slate-900">{user?.name}</p>
                  <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
                </div>
                <div className="w-8 h-8 bg-sky-100 rounded-full flex items-center justify-center">
                  <span className="text-sky-600 text-sm font-medium">
                    {user?.name?.charAt(0)}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-sm text-slate-500 hover:text-slate-700"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 sm:p-6 min-h-[calc(100vh-4rem)]">
          {children}
        </main>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}
