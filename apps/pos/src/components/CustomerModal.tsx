import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, User, Phone, Mail, MapPin, Star, Save } from 'lucide-react'
import { useAdvancedPOSStore, Customer } from '../store/advancedPOS'
import toast from 'react-hot-toast'

const CustomerModal: React.FC = () => {
  const { isCustomerModalOpen, setCustomerModalOpen, customer, setCustomer } = useAdvancedPOSStore()
  
  const [formData, setFormData] = useState<Partial<Customer>>({
    name: customer?.name || '',
    phone: customer?.phone || '',
    email: customer?.email || '',
    address: customer?.address || '',
    loyaltyPoints: customer?.loyaltyPoints || 0
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.phone) {
      toast.error('Name and phone number are required')
      return
    }

    const newCustomer: Customer = {
      id: customer?.id || `CUST_${Date.now()}`,
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      address: formData.address,
      loyaltyPoints: formData.loyaltyPoints || 0
    }

    setCustomer(newCustomer)
    toast.success('Customer information saved successfully!')
    setCustomerModalOpen(false)
  }

  const handleClear = () => {
    setCustomer(undefined)
    setFormData({
      name: '',
      phone: '',
      email: '',
      address: '',
      loyaltyPoints: 0
    })
    toast.success('Customer information cleared')
    setCustomerModalOpen(false)
  }

  return (
    <AnimatePresence>
      {isCustomerModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={() => setCustomerModalOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="glass-strong rounded-3xl max-w-md w-full shadow-premium-lg border border-white/30"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800">Customer Information</h2>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setCustomerModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-6 h-6" />
              </motion.button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              {/* Name */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4 inline mr-2" />
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter customer name"
                  required
                />
              </div>

              {/* Phone */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="w-4 h-4 inline mr-2" />
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter phone number"
                  required
                />
              </div>

              {/* Email */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="w-4 h-4 inline mr-2" />
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter email address"
                />
              </div>

              {/* Address */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-2" />
                  Address
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter delivery address"
                  rows={3}
                />
              </div>

              {/* Loyalty Points */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Star className="w-4 h-4 inline mr-2" />
                  Loyalty Points
                </label>
                <input
                  type="number"
                  value={formData.loyaltyPoints}
                  onChange={(e) => setFormData({ ...formData, loyaltyPoints: parseInt(e.target.value) || 0 })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                  min="0"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleClear}
                  className="flex-1 px-4 py-3 border border-red-300 text-red-600 rounded-xl font-semibold hover:bg-red-50"
                >
                  Clear Customer
                </motion.button>
                
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 px-4 py-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 flex items-center justify-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Customer</span>
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default CustomerModal
