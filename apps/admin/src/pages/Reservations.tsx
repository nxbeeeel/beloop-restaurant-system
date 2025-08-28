import { useState } from 'react'
import Layout from '@/components/Layout'

interface Reservation {
  id: string
  customerName: string
  customerPhone: string
  date: string
  time: string
  partySize: number
  table?: string
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed'
  specialRequests?: string
  createdAt: string
}

const mockReservations: Reservation[] = [
  {
    id: '1',
    customerName: 'John Doe',
    customerPhone: '+91 98765 43210',
    date: '2024-01-15',
    time: '19:30',
    partySize: 4,
    table: 'T-05',
    status: 'confirmed',
    specialRequests: 'Window seat preferred',
    createdAt: '2 hours ago'
  },
  {
    id: '2',
    customerName: 'Jane Smith',
    customerPhone: '+91 87654 32109',
    date: '2024-01-15',
    time: '20:00',
    partySize: 2,
    status: 'pending',
    specialRequests: 'Anniversary dinner',
    createdAt: '1 hour ago'
  },
  {
    id: '3',
    customerName: 'Mike Johnson',
    customerPhone: '+91 76543 21098',
    date: '2024-01-16',
    time: '12:30',
    partySize: 6,
    table: 'T-12',
    status: 'confirmed',
    createdAt: '30 min ago'
  }
]

const reservationStatuses = ['All', 'Confirmed', 'Pending', 'Cancelled', 'Completed']

export default function Reservations() {
  const [reservations, setReservations] = useState<Reservation[]>(mockReservations)
  const [selectedStatus, setSelectedStatus] = useState('All')
  const [selectedDate, setSelectedDate] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)

  const filteredReservations = reservations.filter(reservation => {
    const matchesSearch = reservation.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reservation.customerPhone.includes(searchTerm)
    const matchesStatus = selectedStatus === 'All' || 
                         reservation.status === selectedStatus.toLowerCase()
    const matchesDate = !selectedDate || reservation.date === selectedDate
    
    return matchesSearch && matchesStatus && matchesDate
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      case 'completed': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const updateReservationStatus = (reservationId: string, newStatus: string) => {
    setReservations(reservations.map(reservation => 
      reservation.id === reservationId ? { ...reservation, status: newStatus as any } : reservation
    ))
  }

  return (
    <Layout>
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Reservations</h1>
            <p className="text-slate-600">Manage table reservations and bookings</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700 transition-colors"
          >
            New Reservation
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Today's Reservations</p>
                <p className="text-2xl font-bold text-slate-900">
                  {reservations.filter(r => r.date === '2024-01-15').length}
                </p>
              </div>
              <span className="text-2xl">📅</span>
            </div>
          </div>
          <div className="bg-white rounded-xl border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Confirmed</p>
                <p className="text-2xl font-bold text-green-600">
                  {reservations.filter(r => r.status === 'confirmed').length}
                </p>
              </div>
              <span className="text-2xl">✅</span>
            </div>
          </div>
          <div className="bg-white rounded-xl border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {reservations.filter(r => r.status === 'pending').length}
                </p>
              </div>
              <span className="text-2xl">⏳</span>
            </div>
          </div>
          <div className="bg-white rounded-xl border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Guests</p>
                <p className="text-2xl font-bold text-slate-900">
                  {reservations.reduce((sum, r) => sum + r.partySize, 0)}
                </p>
              </div>
              <span className="text-2xl">👥</span>
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
                placeholder="Search reservations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                {reservationStatuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchTerm('')
                  setSelectedDate('')
                  setSelectedStatus('All')
                }}
                className="w-full px-3 py-2 text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Reservations Table */}
        <div className="bg-white rounded-xl border overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h3 className="text-lg font-semibold text-slate-900">
              Reservations ({filteredReservations.length})
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Party Size
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Table
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Special Requests
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {filteredReservations.map((reservation) => (
                  <tr key={reservation.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-slate-900">{reservation.customerName}</div>
                        <div className="text-sm text-slate-500">{reservation.customerPhone}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-900">{reservation.date}</div>
                      <div className="text-sm text-slate-500">{reservation.time}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                      {reservation.partySize} guests
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                      {reservation.table || 'Not assigned'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(reservation.status)}`}>
                        {reservation.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-900 max-w-xs truncate">
                      {reservation.specialRequests || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        {reservation.status === 'pending' && (
                          <button
                            onClick={() => updateReservationStatus(reservation.id, 'confirmed')}
                            className="text-green-600 hover:text-green-900"
                          >
                            Confirm
                          </button>
                        )}
                        <button className="text-sky-600 hover:text-sky-900">Edit</button>
                        <button className="text-red-600 hover:text-red-900">Cancel</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Reservation Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">New Reservation</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Customer Name</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                    placeholder="Enter customer name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Time</label>
                    <input
                      type="time"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Party Size</label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                    placeholder="Number of guests"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Special Requests (Optional)</label>
                  <textarea
                    rows={3}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                    placeholder="Any special requests or notes"
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
                  Create Reservation
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}
