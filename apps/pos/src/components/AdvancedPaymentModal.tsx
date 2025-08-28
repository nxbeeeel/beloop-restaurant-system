import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  CreditCard, 
  Smartphone, 
  Wallet, 
  CheckCircle, 
  AlertCircle,
  Lock,
  Shield,
  Zap,
  Star
} from 'lucide-react'
import { useAdvancedPOSStore } from '../store/advancedPOS'
import toast from 'react-hot-toast'

const AdvancedPaymentModal: React.FC = () => {
  const {
    cart,
    orderType,
    selectedTable,
    customer,
    isPaymentModalOpen,
    setPaymentModalOpen,
    clearCart,
    settings
  } = useAdvancedPOSStore()

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('card')
  const [paymentStep, setPaymentStep] = useState('method') // method, details, confirmation
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)

  // Calculate totals
  const subtotal = cart.reduce((sum, item) => sum + (item.menuItem.price * item.quantity), 0)
  const tax = subtotal * 0.18 // 18% GST
  const total = subtotal + tax

  const paymentMethods = [
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: CreditCard,
      description: 'Visa, Mastercard, RuPay',
      color: 'from-blue-500 to-purple-600'
    },
    {
      id: 'upi',
      name: 'UPI Payment',
      icon: Smartphone,
      description: 'Google Pay, PhonePe, Paytm',
      color: 'from-green-500 to-teal-600'
    },
    {
      id: 'cash',
      name: 'Cash Payment',
      icon: Wallet,
      description: 'Pay at counter',
      color: 'from-orange-500 to-red-600'
    }
  ]

  const handlePayment = async () => {
    setIsProcessing(true)
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsProcessing(false)
    setPaymentSuccess(true)
    
    // Auto close after success
    setTimeout(() => {
      setPaymentModalOpen(false)
      clearCart()
      setPaymentStep('method')
      setPaymentSuccess(false)
      toast.success('Payment successful! Order completed.')
    }, 2000)
  }

  const handleClose = () => {
    if (paymentStep === 'method') {
      setPaymentModalOpen(false)
    } else {
      setPaymentStep('method')
    }
  }

  if (!isPaymentModalOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-700 p-6 text-white relative">
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Secure Payment</h2>
                <p className="text-blue-100 text-sm">Complete your order</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Order Summary */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-4">
              <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">Order Summary</h3>
              
                             <div className="space-y-2 mb-4">
                 {cart.map((item, index) => (
                   <div key={index} className="flex justify-between text-sm">
                     <span className="text-gray-600 dark:text-gray-300">
                       {item.quantity}x {item.menuItem.name}
                     </span>
                     <span className="font-medium text-gray-800 dark:text-gray-200">
                       ₹{item.menuItem.price * item.quantity}
                     </span>
                   </div>
                 ))}
               </div>
              
              <div className="border-t border-gray-200 dark:border-gray-600 pt-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-300">Subtotal</span>
                  <span className="text-gray-800 dark:text-gray-200">₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-300">Tax (18%)</span>
                  <span className="text-gray-800 dark:text-gray-200">₹{tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-blue-600 dark:text-blue-400">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Payment Methods */}
            {paymentStep === 'method' && (
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-800 dark:text-gray-200">Choose Payment Method</h3>
                
                {paymentMethods.map((method) => (
                  <motion.button
                    key={method.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setSelectedPaymentMethod(method.id)
                      setPaymentStep('details')
                    }}
                    className={`w-full p-4 rounded-2xl border-2 transition-all duration-200 ${
                      selectedPaymentMethod === method.id
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 bg-gradient-to-r ${method.color} rounded-xl flex items-center justify-center`}>
                        <method.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1 text-left">
                        <h4 className="font-semibold text-gray-800 dark:text-gray-200">{method.name}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{method.description}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Shield className="w-4 h-4 text-green-500" />
                        <span className="text-xs text-green-600 dark:text-green-400">Secure</span>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            )}

            {/* Payment Details */}
            {paymentStep === 'details' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200">Payment Details</h3>
                  <button
                    onClick={() => setPaymentStep('method')}
                    className="text-blue-600 dark:text-blue-400 text-sm hover:underline"
                  >
                    Change Method
                  </button>
                </div>

                {selectedPaymentMethod === 'card' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Card Number
                      </label>
                      <input
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Expiry
                        </label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          CVV
                        </label>
                        <input
                          type="text"
                          placeholder="123"
                          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {selectedPaymentMethod === 'upi' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        UPI ID
                      </label>
                      <input
                        type="text"
                        placeholder="username@upi"
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="text-sm text-green-700 dark:text-green-300">
                          UPI payments are instant and secure
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {selectedPaymentMethod === 'cash' && (
                  <div className="space-y-4">
                    <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl p-4">
                      <div className="flex items-center space-x-2">
                        <AlertCircle className="w-5 h-5 text-orange-500" />
                        <span className="text-sm text-orange-700 dark:text-orange-300">
                          Please pay ₹{total.toFixed(2)} at the counter
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-700 text-white py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Processing...</span>
                    </div>
                  ) : (
                    `Pay ₹${total.toFixed(2)}`
                  )}
                </motion.button>
              </div>
            )}

            {/* Success State */}
            {paymentSuccess && (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center py-8"
              >
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">
                  Payment Successful!
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Your order has been confirmed
                </p>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default AdvancedPaymentModal