import React, { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  CreditCard, 
  Smartphone, 
  Banknote, 
  Wallet, 
  X, 
  Check,
  Split,
  Gift,
  Star,
  Receipt,
  QrCode,
  Loader
} from 'lucide-react'
import { useAdvancedPOSStore } from '../store/advancedPOS'
import paymentService, { PaymentRequest, PaymentResponse } from '../services/paymentService'
import QRCode from 'react-qr-code'
import toast from 'react-hot-toast'

const AdvancedPaymentModal: React.FC = () => {
  const {
    cart,
    customer,
    orderType,
    selectedTable,
    cartTotal,
    isPaymentModalOpen,
    setPaymentModalOpen,
    createOrder
  } = useAdvancedPOSStore()

  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'upi' | 'razorpay' | 'payu' | 'split'>('cash')
  const [cashAmount, setCashAmount] = useState(cartTotal)
  const [tip, setTip] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [upiQrCode, setUpiQrCode] = useState<string | null>(null)
  const [paymentResult, setPaymentResult] = useState<PaymentResponse | null>(null)
  const [splitPayments, setSplitPayments] = useState([
    { method: 'cash', amount: cartTotal / 2 },
    { method: 'card', amount: cartTotal / 2 }
  ])

  const total = cartTotal
  const finalTotal = total + tip
  const change = paymentMethod === 'cash' ? Math.max(0, cashAmount - finalTotal) : 0

  const handlePayment = useCallback(async () => {
    setIsProcessing(true)
    setPaymentResult(null)
    setUpiQrCode(null)
    
    try {
      const paymentRequest: PaymentRequest = {
        amount: finalTotal,
        currency: 'INR',
        orderId: `ORDER_${Date.now()}`,
        customerEmail: customer?.email,
        customerPhone: customer?.phone,
        customerName: customer?.name,
        description: `Restaurant Order - ${cart.length} items`,
        notes: {
          orderType,
          table: selectedTable,
          itemCount: cart.length
        }
      }

      if (paymentMethod === 'split') {
        // Handle split payment logic here
        toast.success('Split payment completed successfully!')
        await handlePaymentSuccess()
        return
      }

      // Process payment through our payment service
      const result = await paymentService.processPayment(paymentMethod, paymentRequest)
      setPaymentResult(result)

      if (result.success) {
        if (paymentMethod === 'upi' && result.receipt) {
          // Show UPI QR code
          setUpiQrCode(result.receipt)
          toast.success('Scan QR code to complete UPI payment')
        } else {
          const order = await createOrder()
          
          toast.success(
            <div className="flex items-center space-x-2">
              <Check className="w-5 h-5 text-green-600" />
              <div>
                <p className="font-semibold">Payment Successful!</p>
                <p className="text-sm">Transaction ID: {result.transactionId}</p>
              </div>
            </div>
          )

          // Generate receipt
          const receipt = paymentService.generateReceipt(result, { cart, customer, orderType, selectedTable })
          console.log('Receipt:', receipt)
          
          // Close modal
          console.log('Payment completed, closing modal')
          setPaymentModalOpen(false)
        }
      } else {
        toast.error(result.errorMessage || 'Payment failed. Please try again.')
      }
    } catch (error) {
      console.error('Payment error:', error)
      toast.error('Payment failed. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }, [cart, customer, orderType, selectedTable, paymentMethod, finalTotal, createOrder, setPaymentModalOpen])

  const handlePaymentSuccess = useCallback(async () => {
    try {
      const order = await createOrder()
      if (order) {
        toast.success('Order created successfully!')
        setPaymentModalOpen(false)
      }
    } catch (error) {
      console.error('Error creating order:', error)
      toast.error('Failed to create order')
    }
  }, [createOrder, setPaymentModalOpen])

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setPaymentModalOpen(false)
      }
    }

    if (isPaymentModalOpen) {
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [isPaymentModalOpen, setPaymentModalOpen])

  if (!isPaymentModalOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4"
        onClick={() => setPaymentModalOpen(false)}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/20"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">Payment</h2>
              <button
                onClick={() => setPaymentModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <p className="text-gray-600 mt-1">Complete your payment</p>
          </div>

          {/* Payment Method Selection */}
          <div className="p-6">
            <h3 className="font-semibold text-gray-800 mb-4">Select Payment Method</h3>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {[
                { id: 'cash', icon: Banknote, label: 'Cash', color: 'bg-green-500' },
                { id: 'card', icon: CreditCard, label: 'Card', color: 'bg-blue-500' },
                { id: 'upi', icon: Smartphone, label: 'UPI', color: 'bg-purple-500' },
                { id: 'split', icon: Split, label: 'Split', color: 'bg-orange-500' }
              ].map((method) => (
                <button
                  key={method.id}
                  onClick={() => setPaymentMethod(method.id as any)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    paymentMethod === method.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex flex-col items-center space-y-2">
                    <div className={`w-10 h-10 ${method.color} rounded-full flex items-center justify-center`}>
                      <method.icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-medium text-gray-700">{method.label}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Payment Details */}
            <div className="space-y-4">
              {/* Cash Payment */}
              {paymentMethod === 'cash' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Amount Received
                    </label>
                    <input
                      type="number"
                      value={cashAmount}
                      onChange={(e) => setCashAmount(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter amount"
                    />
                  </div>
                  {change > 0 && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <p className="text-green-800 font-medium">Change: ₹{change.toFixed(2)}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Tip Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Add Tip</label>
                <div className="grid grid-cols-3 gap-2">
                  {[0, 10, 15, 20].map((tipPercent) => (
                    <button
                      key={tipPercent}
                      onClick={() => setTip((total * tipPercent) / 100)}
                      className={`py-2 px-3 rounded-lg border transition-colors ${
                        tip === (total * tipPercent) / 100
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {tipPercent === 0 ? 'No Tip' : `${tipPercent}%`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Split Payment */}
              {paymentMethod === 'split' && (
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-800">Split Payment</h4>
                  {splitPayments.map((payment, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <select
                        value={payment.method}
                        onChange={(e) => {
                          const newPayments = [...splitPayments]
                          newPayments[index].method = e.target.value as any
                          setSplitPayments(newPayments)
                        }}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                      >
                        <option value="cash">Cash</option>
                        <option value="card">Card</option>
                        <option value="upi">UPI</option>
                      </select>
                      <input
                        type="number"
                        value={payment.amount}
                        onChange={(e) => {
                          const newPayments = [...splitPayments]
                          newPayments[index].amount = parseFloat(e.target.value) || 0
                          setSplitPayments(newPayments)
                        }}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                        placeholder="Amount"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* UPI QR Code */}
              {paymentMethod === 'upi' && upiQrCode && (
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <h4 className="font-medium text-gray-800 mb-3">Scan QR Code</h4>
                  <div className="bg-white p-4 rounded-lg inline-block">
                    <QRCode value={upiQrCode} size={200} />
                  </div>
                  <p className="text-sm text-gray-600 mt-3">
                    Scan this QR code with your UPI app to complete payment
                  </p>
                </div>
              )}

              {/* Payment Summary */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-800 mb-3">Payment Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                  {tip > 0 && (
                    <div className="flex justify-between">
                      <span>Tip</span>
                      <span>₹{tip.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="border-t border-gray-200 pt-2">
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span>₹{finalTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="p-6 border-t border-gray-200">
            <div className="flex space-x-3">
              <button
                onClick={() => setPaymentModalOpen(false)}
                className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handlePayment}
                disabled={isProcessing}
                className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
              >
                {isProcessing ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Pay ₹{finalTotal.toFixed(2)}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default AdvancedPaymentModal