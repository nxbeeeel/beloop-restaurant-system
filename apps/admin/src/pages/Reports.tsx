import { useState } from 'react'
import Layout from '@/components/Layout'

interface ReportData {
  period: string
  sales: number
  orders: number
  customers: number
  avgOrderValue: number
}

const mockReportData: ReportData[] = [
  { period: 'Today', sales: 45230, orders: 127, customers: 89, avgOrderValue: 356 },
  { period: 'Yesterday', sales: 38900, orders: 105, customers: 76, avgOrderValue: 370 },
  { period: 'This Week', sales: 312000, orders: 845, customers: 456, avgOrderValue: 369 },
  { period: 'Last Week', sales: 289000, orders: 798, customers: 423, avgOrderValue: 362 },
  { period: 'This Month', sales: 1250000, orders: 3420, customers: 1890, avgOrderValue: 365 },
  { period: 'Last Month', sales: 1180000, orders: 3201, customers: 1756, avgOrderValue: 368 }
]

const topMenuItems = [
  { name: 'Butter Chicken', orders: 245, revenue: 110250 },
  { name: 'Biryani', orders: 189, revenue: 71820 },
  { name: 'Naan', orders: 156, revenue: 7800 },
  { name: 'Dal Tadka', orders: 134, revenue: 40200 },
  { name: 'Gulab Jamun', orders: 98, revenue: 7840 }
]

const paymentMethods = [
  { method: 'UPI', percentage: 45, amount: 562500 },
  { method: 'Card', percentage: 30, amount: 375000 },
  { method: 'Cash', percentage: 20, amount: 250000 },
  { method: 'Wallet', percentage: 5, amount: 62500 }
]

export default function Reports() {
  const [selectedPeriod, setSelectedPeriod] = useState('This Month')
  const [reportType, setReportType] = useState('overview')

  const currentData = mockReportData.find(d => d.period === selectedPeriod) || mockReportData[4]

  return (
    <Layout>
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Reports & Analytics</h1>
            <p className="text-slate-600">Track your restaurant's performance and insights</p>
          </div>
          <div className="flex space-x-3">
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
              Export PDF
            </button>
            <button className="bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700 transition-colors">
              Export CSV
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Time Period</label>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                {mockReportData.map(data => (
                  <option key={data.period} value={data.period}>{data.period}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Report Type</label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value="overview">Sales Overview</option>
                <option value="menu">Menu Performance</option>
                <option value="customer">Customer Analytics</option>
                <option value="inventory">Inventory Report</option>
              </select>
            </div>
            <div className="flex items-end">
              <button className="w-full px-3 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors">
                Custom Date Range
              </button>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Sales</p>
                <p className="text-2xl font-bold text-slate-900">₹{currentData.sales.toLocaleString()}</p>
              </div>
              <span className="text-2xl">💰</span>
            </div>
            <div className="mt-4">
              <span className="text-sm text-green-600 font-medium">+12.5%</span>
              <span className="text-sm text-slate-500 ml-1">vs previous period</span>
            </div>
          </div>
          <div className="bg-white rounded-xl border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Orders</p>
                <p className="text-2xl font-bold text-slate-900">{currentData.orders}</p>
              </div>
              <span className="text-2xl">📋</span>
            </div>
            <div className="mt-4">
              <span className="text-sm text-green-600 font-medium">+8.2%</span>
              <span className="text-sm text-slate-500 ml-1">vs previous period</span>
            </div>
          </div>
          <div className="bg-white rounded-xl border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Unique Customers</p>
                <p className="text-2xl font-bold text-slate-900">{currentData.customers}</p>
              </div>
              <span className="text-2xl">👥</span>
            </div>
            <div className="mt-4">
              <span className="text-sm text-green-600 font-medium">+15.3%</span>
              <span className="text-sm text-slate-500 ml-1">vs previous period</span>
            </div>
          </div>
          <div className="bg-white rounded-xl border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Avg Order Value</p>
                <p className="text-2xl font-bold text-slate-900">₹{currentData.avgOrderValue}</p>
              </div>
              <span className="text-2xl">📈</span>
            </div>
            <div className="mt-4">
              <span className="text-sm text-green-600 font-medium">+3.8%</span>
              <span className="text-sm text-slate-500 ml-1">vs previous period</span>
            </div>
          </div>
        </div>

        {/* Charts and Detailed Reports */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sales Trend Chart */}
          <div className="bg-white rounded-xl border p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Sales Trend</h3>
            <div className="h-64 bg-slate-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl mb-2">📊</div>
                <p className="text-slate-600">Sales trend chart</p>
                <p className="text-sm text-slate-500">Chart.js integration coming soon</p>
              </div>
            </div>
          </div>

          {/* Top Menu Items */}
          <div className="bg-white rounded-xl border p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Top Menu Items</h3>
            <div className="space-y-4">
              {topMenuItems.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-sky-100 rounded-full flex items-center justify-center">
                      <span className="text-sky-600 font-medium text-sm">{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{item.name}</p>
                      <p className="text-sm text-slate-500">{item.orders} orders</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-slate-900">₹{item.revenue.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Payment Methods & GST Report */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Payment Methods */}
          <div className="bg-white rounded-xl border p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Payment Methods</h3>
            <div className="space-y-4">
              {paymentMethods.map((payment, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-sky-500 rounded-full"></div>
                    <span className="font-medium text-slate-900">{payment.method}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-slate-900">{payment.percentage}%</p>
                    <p className="text-sm text-slate-500">₹{payment.amount.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* GST Report */}
          <div className="bg-white rounded-xl border p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">GST Summary</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-slate-600">Total Sales (Excl. GST)</span>
                <span className="font-medium text-slate-900">₹11,90,476</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">GST @ 5%</span>
                <span className="font-medium text-slate-900">₹59,524</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="font-medium text-slate-900">Total Sales (Incl. GST)</span>
                <span className="font-bold text-slate-900">₹12,50,000</span>
              </div>
              <div className="mt-4">
                <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  Download GST Report
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Table */}
        <div className="bg-white rounded-xl border p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Detailed Analytics</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Period</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Sales</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Orders</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Customers</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">AOV</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {mockReportData.map((data, index) => (
                  <tr key={index} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-sm font-medium text-slate-900">{data.period}</td>
                    <td className="px-4 py-3 text-sm text-slate-900">₹{data.sales.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm text-slate-900">{data.orders}</td>
                    <td className="px-4 py-3 text-sm text-slate-900">{data.customers}</td>
                    <td className="px-4 py-3 text-sm text-slate-900">₹{data.avgOrderValue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  )
}
