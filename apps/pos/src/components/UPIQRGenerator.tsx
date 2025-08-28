import React from 'react'
import { motion } from 'framer-motion'
import { X, Download, Copy, QrCode } from 'lucide-react'
import QRCode from 'react-qr-code'
import toast from 'react-hot-toast'

interface UPIQRGeneratorProps {
  merchantId: string
  merchantName: string
  amount: number
  transactionRef: string
  description: string
  onClose: () => void
}

const UPIQRGenerator: React.FC<UPIQRGeneratorProps> = ({
  merchantId,
  merchantName,
  amount,
  transactionRef,
  description,
  onClose
}) => {
  // Generate UPI QR code string
  const generateUPIString = () => {
    const upiParams = new URLSearchParams({
      pa: merchantId, // Payee address (UPI ID)
      pn: merchantName, // Payee name
      am: amount.toString(), // Amount
      tr: transactionRef, // Transaction reference
      tn: description, // Transaction note
      cu: 'INR' // Currency
    })
    
    return `upi://pay?${upiParams.toString()}`
  }

  const upiString = generateUPIString()

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(upiString)
      toast.success('UPI link copied to clipboard!')
    } catch (error) {
      toast.error('Failed to copy UPI link')
    }
  }

  const handleDownload = () => {
    const canvas = document.querySelector('canvas')
    if (canvas) {
      const link = document.createElement('a')
      link.download = `upi-qr-${transactionRef}.png`
      link.href = canvas.toDataURL()
      link.click()
      toast.success('QR code downloaded!')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="bg-white rounded-3xl p-8 shadow-2xl max-w-md w-full"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
            <QrCode className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">UPI Payment</h2>
            <p className="text-sm text-gray-600">Scan QR code to pay</p>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <X className="w-6 h-6" />
        </motion.button>
      </div>

      {/* QR Code */}
      <div className="flex justify-center mb-6">
        <div className="bg-white p-4 rounded-2xl shadow-lg border-2 border-gray-100">
          <QRCode
            value={upiString}
            size={200}
            level="M"

            bgColor="#FFFFFF"
            fgColor="#000000"
          />
        </div>
      </div>

      {/* Payment Details */}
      <div className="space-y-4 mb-6">
        <div className="bg-gray-50 rounded-xl p-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Amount:</span>
              <span className="font-bold text-lg text-gray-800">₹{amount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Merchant:</span>
              <span className="font-medium text-gray-800">{merchantName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">UPI ID:</span>
              <span className="font-medium text-gray-800">{merchantId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Reference:</span>
              <span className="font-medium text-gray-800 text-sm">{transactionRef}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
        <h3 className="font-semibold text-blue-800 mb-2">How to pay:</h3>
        <ol className="text-sm text-blue-700 space-y-1">
          <li>1. Open any UPI app (GPay, PhonePe, Paytm, etc.)</li>
          <li>2. Tap on "Scan QR Code"</li>
          <li>3. Scan this QR code</li>
          <li>4. Verify amount and merchant details</li>
          <li>5. Enter UPI PIN to complete payment</li>
        </ol>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleCopy}
          className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
        >
          <Copy className="w-4 h-4" />
          <span>Copy Link</span>
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleDownload}
          className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>Download QR</span>
        </motion.button>
      </div>

      {/* Footer */}
      <div className="mt-6 text-center">
        <p className="text-xs text-gray-500">
          Payment will be processed securely via UPI
        </p>
      </div>
    </motion.div>
  )
}

export default UPIQRGenerator
