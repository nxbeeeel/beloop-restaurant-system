import React, { useState, useMemo, useCallback, memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus, 
  CreditCard, 
  Users, 
  Receipt,
  X,
  ChevronDown,
  ChevronUp,
  Percent,
  Gift,
  Star,
  Clock,
  Package,
  QrCode,
  Smartphone,
  Banknote
} from 'lucide-react'
import { useAdvancedPOSStore } from '../store/advancedPOS'
import toast from 'react-hot-toast'
import UPIQRGenerator from './UPIQRGenerator'

const AdvancedCart: React.FC = () => {
  const {
    cart,
    cartTotal,
    cartSubtotal,
    cartTax,
    cartDiscount,
    cartTip,
    customer,
    orderType,
    selectedTable,
    settings,
    removeFromCart,
    updateCartItemQuantity,
    clearCart,
    setCustomerModalOpen,
    setPaymentModalOpen,
    updateSettings
  } = useAdvancedPOSStore()

  const [isCollapsed, setIsCollapsed] = useState(false)
  const [discountAmount, setDiscountAmount] = useState(0)
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage')
  const [isUPIQRModalOpen, setIsUPIQRModalOpen] = useState(false)

  // Calculate totals
  const subtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + (item.menuItem.price * item.quantity), 0)
  }, [cart])

  const tax = useMemo(() => {
    return (subtotal * settings.taxRate) / 100
  }, [subtotal, settings.taxRate])

  const serviceCharge = useMemo(() => {
    return (subtotal * settings.serviceCharge) / 100
  }, [subtotal, settings.serviceCharge])

  const total = useMemo(() => {
    return subtotal + tax + serviceCharge + cartTip - cartDiscount
  }, [subtotal, tax, serviceCharge, cartTip, cartDiscount])

  const handleQuantityChange = useCallback((itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId)
    } else {
      updateCartItemQuantity(itemId, newQuantity)
    }
  }, [removeFromCart, updateCartItemQuantity])

  const handleDiscountChange = useCallback((value: number) => {
    setDiscountAmount(value)
    const discount = discountType === 'percentage' 
      ? (subtotal * value) / 100 
      : value
    updateSettings({ taxRate: settings.taxRate }) // Trigger recalculation
  }, [discountType, subtotal, updateSettings, settings.taxRate])

  const handleTipChange = useCallback((tipAmount: number) => {
    // This would need to be added to the store
    toast.success(`Tip set to ${settings.currency}${tipAmount}`)
  }, [settings.currency])

  const handlePayment = useCallback(() => {
    if (cart.length === 0) {
      toast.error('Cart is empty')
      return
    }
    setPaymentModalOpen(true)
  }, [cart.length, setPaymentModalOpen])

  const handleCustomerSelect = useCallback(() => {
    setCustomerModalOpen(true)
  }, [setCustomerModalOpen])

  const handleUPIQR = useCallback(() => {
    setIsUPIQRModalOpen(true)
  }, [])

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0)

  if (cart.length === 0) {
    return (
      <div className="h-full flex flex-col bg-white/80 backdrop-blur-md">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">Cart</h2>
            <div className="flex items-center space-x-2">
              <ShoppingCart className="w-5 h-5 text-gray-400" />
              <span className="text-sm text-gray-500">0 items</span>
            </div>
          </div>
        </div>

        {/* Empty State */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <ShoppingCart className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-600 mb-2">Cart is Empty</h3>
            <p className="text-gray-500">Add items from the menu to get started</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-white/80 backdrop-blur-md">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">Cart</h2>
          <div className="flex items-center space-x-2">
            <ShoppingCart className="w-5 h-5 text-blue-500" />
            <span className="text-sm font-medium text-gray-700">{cartItemCount} items</span>
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              {isCollapsed ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Customer Info */}
        {customer && (
          <div className="mt-3 flex items-center space-x-2">
            <Users className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">{customer.name}</span>
            {customer.loyaltyPoints && (
              <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                {customer.loyaltyPoints} pts
              </span>
            )}
          </div>
        )}
      </div>

      {/* Cart Items */}
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="flex-1 overflow-y-auto"
          >
            <div className="p-4 space-y-3">
              {cart.map((item) => (
                <motion.div
                  key={item.menuItem.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white rounded-lg p-4 shadow-sm border border-gray-100"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800">{item.menuItem.name}</h4>
                      <p className="text-sm text-gray-500">{item.menuItem.description}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <span className="text-lg font-bold text-blue-600">
                          {settings.currency}{item.menuItem.price}
                        </span>
                        <span className="text-sm text-gray-400">×</span>
                        <span className="text-sm text-gray-600">{item.quantity}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleQuantityChange(item.menuItem.id, item.quantity - 1)}
                        className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
                      >
                        <Minus className="w-4 h-4 text-gray-600" />
                      </button>
                      
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      
                      <button
                        onClick={() => handleQuantityChange(item.menuItem.id, item.quantity + 1)}
                        className="w-8 h-8 bg-blue-100 hover:bg-blue-200 rounded-full flex items-center justify-center transition-colors"
                      >
                        <Plus className="w-4 h-4 text-blue-600" />
                      </button>
                      
                      <button
                        onClick={() => removeFromCart(item.menuItem.id)}
                        className="w-8 h-8 bg-red-100 hover:bg-red-200 rounded-full flex items-center justify-center transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Summary */}
      <div className="border-t border-gray-200 p-6 space-y-4">
        {/* Customer Selection */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Customer</span>
          <button
            onClick={handleCustomerSelect}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
          >
            <Users className="w-4 h-4" />
            <span className="text-sm font-medium">
              {customer ? customer.name : 'Select Customer'}
            </span>
          </button>
        </div>

        {/* Order Type */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Order Type</span>
          <span className="text-sm font-medium capitalize">{orderType}</span>
        </div>

        {/* Table (for dine-in) */}
        {orderType === 'dine-in' && selectedTable && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Table</span>
            <span className="text-sm font-medium">{selectedTable}</span>
          </div>
        )}

        {/* Totals */}
        <div className="space-y-2 pt-4 border-t border-gray-100">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium">{settings.currency}{subtotal.toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Tax ({settings.taxRate}%)</span>
            <span className="font-medium">{settings.currency}{tax.toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Service Charge ({settings.serviceCharge}%)</span>
            <span className="font-medium">{settings.currency}{serviceCharge.toFixed(2)}</span>
          </div>

          {cartDiscount > 0 && (
            <div className="flex justify-between text-sm text-green-600">
              <span>Discount</span>
              <span className="font-medium">-{settings.currency}{cartDiscount.toFixed(2)}</span>
            </div>
          )}

          {cartTip > 0 && (
            <div className="flex justify-between text-sm">
              <span>Tip</span>
              <span className="font-medium">{settings.currency}{cartTip.toFixed(2)}</span>
            </div>
          )}

          <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200">
            <span>Total</span>
            <span className="text-blue-600">{settings.currency}{total.toFixed(2)}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-4">
          <button
            onClick={handlePayment}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
          >
            <CreditCard className="w-5 h-5" />
            <span>Proceed to Payment</span>
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleUPIQR}
              className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-3 rounded-lg transition-colors flex items-center justify-center space-x-1"
            >
              <QrCode className="w-4 h-4" />
              <span className="text-sm">UPI QR</span>
            </button>
            
            <button
              onClick={clearCart}
              className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-3 rounded-lg transition-colors flex items-center justify-center space-x-1"
            >
              <Trash2 className="w-4 h-4" />
              <span className="text-sm">Clear Cart</span>
            </button>
          </div>
        </div>
      </div>

             {/* UPI QR Modal */}
       <AnimatePresence>
         {isUPIQRModalOpen && (
           <UPIQRGenerator
             merchantId="restaurant@upi"
             merchantName="Beloop Restaurant"
             amount={total}
             transactionRef={`TXN${Date.now()}`}
             description={`Payment for ${cartItemCount} items`}
             onClose={() => setIsUPIQRModalOpen(false)}
           />
         )}
       </AnimatePresence>
    </div>
  )
}

export default memo(AdvancedCart)
