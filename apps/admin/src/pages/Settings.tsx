import { useState } from 'react'
import Layout from '@/components/Layout'

export default function Settings() {
  const [activeTab, setActiveTab] = useState('organization')
  const [formData, setFormData] = useState({
    // Organization
    restaurantName: 'Beloop Restaurant',
    ownerName: 'John Doe',
    address: '123 Main Street, Kochi, Kerala',
    phone: '+91 98765 43210',
    email: 'beloopstore@gmail.com',
    website: 'www.beloop.com',
    
    // GST & Taxation
    gstNumber: '32ABCDE1234F1Z5',
    gstRate: 5,
    serviceChargeRate: 10,
    serviceChargeEnabled: true,
    
    // General Settings
    currency: 'INR',
    timezone: 'Asia/Kolkata',
    language: 'en',
    dateFormat: 'DD/MM/YYYY',
    
    // POS Settings
    printReceiptAuto: true,
    soundEnabled: true,
    kotEnabled: true,
    tableManagement: true,
    
    // Notifications
    lowStockAlerts: true,
    orderNotifications: true,
    emailNotifications: true,
    smsNotifications: false
  })

  const tabs = [
    { id: 'organization', name: 'Organization', icon: '🏢' },
    { id: 'gst', name: 'GST & Taxation', icon: '📋' },
    { id: 'general', name: 'General', icon: '⚙️' },
    { id: 'pos', name: 'POS Settings', icon: '💳' },
    { id: 'notifications', name: 'Notifications', icon: '🔔' },
    { id: 'integrations', name: 'Integrations', icon: '🔗' }
  ]

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    // Save settings logic here
    alert('Settings saved successfully!')
  }

  return (
    <Layout>
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
            <p className="text-slate-600">Configure your restaurant management system</p>
          </div>
          <button
            onClick={handleSave}
            className="bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700 transition-colors"
          >
            Save Changes
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Tabs */}
          <div className="lg:w-64">
            <div className="bg-white rounded-xl border p-4">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-sky-50 text-sky-700'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <span className="text-lg">{tab.icon}</span>
                    <span>{tab.name}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1">
            <div className="bg-white rounded-xl border p-6">
              {/* Organization Settings */}
              {activeTab === 'organization' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-slate-900">Organization Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Restaurant Name</label>
                      <input
                        type="text"
                        value={formData.restaurantName}
                        onChange={(e) => handleInputChange('restaurantName', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Owner Name</label>
                      <input
                        type="text"
                        value={formData.ownerName}
                        onChange={(e) => handleInputChange('ownerName', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-slate-700 mb-2">Address</label>
                      <textarea
                        rows={3}
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Phone</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Website</label>
                      <input
                        type="url"
                        value={formData.website}
                        onChange={(e) => handleInputChange('website', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* GST & Taxation */}
              {activeTab === 'gst' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-slate-900">GST & Taxation Settings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">GST Number</label>
                      <input
                        type="text"
                        value={formData.gstNumber}
                        onChange={(e) => handleInputChange('gstNumber', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                        placeholder="32ABCDE1234F1Z5"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">GST Rate (%)</label>
                      <input
                        type="number"
                        value={formData.gstRate}
                        onChange={(e) => handleInputChange('gstRate', Number(e.target.value))}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                        min="0"
                        max="28"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Service Charge Rate (%)</label>
                      <input
                        type="number"
                        value={formData.serviceChargeRate}
                        onChange={(e) => handleInputChange('serviceChargeRate', Number(e.target.value))}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                        min="0"
                        max="20"
                      />
                    </div>
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="serviceCharge"
                        checked={formData.serviceChargeEnabled}
                        onChange={(e) => handleInputChange('serviceChargeEnabled', e.target.checked)}
                        className="w-4 h-4 text-sky-600 border-slate-300 rounded focus:ring-sky-500"
                      />
                      <label htmlFor="serviceCharge" className="text-sm font-medium text-slate-700">
                        Enable Service Charge
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* General Settings */}
              {activeTab === 'general' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-slate-900">General Settings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Currency</label>
                      <select
                        value={formData.currency}
                        onChange={(e) => handleInputChange('currency', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                      >
                        <option value="INR">Indian Rupee (INR)</option>
                        <option value="USD">US Dollar (USD)</option>
                        <option value="EUR">Euro (EUR)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Timezone</label>
                      <select
                        value={formData.timezone}
                        onChange={(e) => handleInputChange('timezone', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                      >
                        <option value="Asia/Kolkata">India Standard Time (IST)</option>
                        <option value="UTC">UTC</option>
                        <option value="America/New_York">Eastern Time</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Language</label>
                      <select
                        value={formData.language}
                        onChange={(e) => handleInputChange('language', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                      >
                        <option value="en">English</option>
                        <option value="ml">Malayalam</option>
                        <option value="hi">Hindi</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Date Format</label>
                      <select
                        value={formData.dateFormat}
                        onChange={(e) => handleInputChange('dateFormat', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                      >
                        <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                        <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                        <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* POS Settings */}
              {activeTab === 'pos' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-slate-900">POS Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-slate-700">Auto Print Receipt</label>
                        <p className="text-sm text-slate-500">Automatically print receipt after order completion</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={formData.printReceiptAuto}
                        onChange={(e) => handleInputChange('printReceiptAuto', e.target.checked)}
                        className="w-4 h-4 text-sky-600 border-slate-300 rounded focus:ring-sky-500"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-slate-700">Sound Notifications</label>
                        <p className="text-sm text-slate-500">Play sound for new orders and alerts</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={formData.soundEnabled}
                        onChange={(e) => handleInputChange('soundEnabled', e.target.checked)}
                        className="w-4 h-4 text-sky-600 border-slate-300 rounded focus:ring-sky-500"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-slate-700">KOT (Kitchen Order Ticket)</label>
                        <p className="text-sm text-slate-500">Print KOT for kitchen orders</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={formData.kotEnabled}
                        onChange={(e) => handleInputChange('kotEnabled', e.target.checked)}
                        className="w-4 h-4 text-sky-600 border-slate-300 rounded focus:ring-sky-500"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-slate-700">Table Management</label>
                        <p className="text-sm text-slate-500">Enable table-based order management</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={formData.tableManagement}
                        onChange={(e) => handleInputChange('tableManagement', e.target.checked)}
                        className="w-4 h-4 text-sky-600 border-slate-300 rounded focus:ring-sky-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications */}
              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-slate-900">Notification Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-slate-700">Low Stock Alerts</label>
                        <p className="text-sm text-slate-500">Get notified when inventory is running low</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={formData.lowStockAlerts}
                        onChange={(e) => handleInputChange('lowStockAlerts', e.target.checked)}
                        className="w-4 h-4 text-sky-600 border-slate-300 rounded focus:ring-sky-500"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-slate-700">Order Notifications</label>
                        <p className="text-sm text-slate-500">Real-time notifications for new orders</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={formData.orderNotifications}
                        onChange={(e) => handleInputChange('orderNotifications', e.target.checked)}
                        className="w-4 h-4 text-sky-600 border-slate-300 rounded focus:ring-sky-500"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-slate-700">Email Notifications</label>
                        <p className="text-sm text-slate-500">Send notifications via email</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={formData.emailNotifications}
                        onChange={(e) => handleInputChange('emailNotifications', e.target.checked)}
                        className="w-4 h-4 text-sky-600 border-slate-300 rounded focus:ring-sky-500"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-slate-700">SMS Notifications</label>
                        <p className="text-sm text-slate-500">Send notifications via SMS</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={formData.smsNotifications}
                        onChange={(e) => handleInputChange('smsNotifications', e.target.checked)}
                        className="w-4 h-4 text-sky-600 border-slate-300 rounded focus:ring-sky-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Integrations */}
              {activeTab === 'integrations' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-slate-900">Third-party Integrations</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="border border-slate-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                            <span className="text-red-600 font-bold text-sm">Z</span>
                          </div>
                          <span className="font-medium text-slate-900">Zomato</span>
                        </div>
                        <span className="text-sm text-red-600">Disconnected</span>
                      </div>
                      <p className="text-sm text-slate-500 mb-3">Connect your Zomato account for order management</p>
                      <button className="w-full px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm">
                        Connect Zomato
                      </button>
                    </div>
                    <div className="border border-slate-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                            <span className="text-orange-600 font-bold text-sm">S</span>
                          </div>
                          <span className="font-medium text-slate-900">Swiggy</span>
                        </div>
                        <span className="text-sm text-red-600">Disconnected</span>
                      </div>
                      <p className="text-sm text-slate-500 mb-3">Connect your Swiggy account for order management</p>
                      <button className="w-full px-3 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-sm">
                        Connect Swiggy
                      </button>
                    </div>
                    <div className="border border-slate-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            <span className="text-blue-600 font-bold text-sm">R</span>
                          </div>
                          <span className="font-medium text-slate-900">Razorpay</span>
                        </div>
                        <span className="text-sm text-green-600">Connected</span>
                      </div>
                      <p className="text-sm text-slate-500 mb-3">Payment gateway for online transactions</p>
                      <button className="w-full px-3 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 text-sm">
                        Configure
                      </button>
                    </div>
                    <div className="border border-slate-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                            <span className="text-green-600 font-bold text-sm">W</span>
                          </div>
                          <span className="font-medium text-slate-900">WhatsApp Business</span>
                        </div>
                        <span className="text-sm text-red-600">Disconnected</span>
                      </div>
                      <p className="text-sm text-slate-500 mb-3">Send order updates and marketing messages</p>
                      <button className="w-full px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm">
                        Connect WhatsApp
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
