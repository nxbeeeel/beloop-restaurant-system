import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'

// Payment Gateway Types
export interface PaymentGateway {
  id: string
  name: string
  type: 'razorpay' | 'payu' | 'upi' | 'cash' | 'card'
  enabled: boolean
  config: Record<string, any>
}

export interface PaymentRequest {
  amount: number // in paise for Razorpay, rupees for others
  currency: string
  orderId: string
  customerEmail?: string
  customerPhone?: string
  customerName?: string
  description: string
  upiId?: string
  notes?: Record<string, any>
}

export interface PaymentResponse {
  success: boolean
  transactionId?: string
  paymentId?: string
  orderId: string
  amount: number
  gateway: string
  status: 'success' | 'failed' | 'pending'
  errorMessage?: string
  receipt?: string
}

// Payment Gateways Configuration
const PAYMENT_GATEWAYS: PaymentGateway[] = [
  {
    id: 'razorpay',
    name: 'Razorpay',
    type: 'razorpay',
    enabled: true,
    config: {
      keyId: process.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_1234567890',
      keySecret: process.env.VITE_RAZORPAY_KEY_SECRET || 'test_secret_key',
      webhookSecret: process.env.VITE_RAZORPAY_WEBHOOK_SECRET || 'webhook_secret'
    }
  },
  {
    id: 'payu',
    name: 'PayU',
    type: 'payu',
    enabled: true,
    config: {
      merchantKey: process.env.VITE_PAYU_MERCHANT_KEY || 'test_merchant_key',
      salt: process.env.VITE_PAYU_SALT || 'test_salt',
      environment: process.env.VITE_PAYU_ENV || 'test' // test or production
    }
  },
  {
    id: 'upi',
    name: 'UPI',
    type: 'upi',
    enabled: true,
    config: {
      merchantId: process.env.VITE_UPI_MERCHANT_ID || 'test@merchant',
      merchantName: process.env.VITE_UPI_MERCHANT_NAME || 'Beloop Restaurant'
    }
  }
]

class PaymentService {
  private gateways: Map<string, PaymentGateway> = new Map()

  constructor() {
    PAYMENT_GATEWAYS.forEach(gateway => {
      this.gateways.set(gateway.id, gateway)
    })
  }

  // Get available payment methods
  getAvailableGateways(): PaymentGateway[] {
    return Array.from(this.gateways.values()).filter(gateway => gateway.enabled)
  }

  // Razorpay Integration
  async processRazorpayPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      const gateway = this.gateways.get('razorpay')
      if (!gateway) throw new Error('Razorpay gateway not configured')

      // Convert rupees to paise
      const amountInPaise = request.amount * 100

      // Create Razorpay order
      const orderData = {
        amount: amountInPaise,
        currency: request.currency || 'INR',
        receipt: request.orderId,
        notes: request.notes || {}
      }

      // In production, this should call your backend
      const response = await this.createRazorpayOrder(orderData)
      
      if (response.success) {
        return {
          success: true,
          transactionId: response.id,
          paymentId: response.id,
          orderId: request.orderId,
          amount: request.amount,
          gateway: 'razorpay',
          status: 'success',
          receipt: response.receipt
        }
      } else {
        throw new Error('Failed to create Razorpay order')
      }
    } catch (error) {
      console.error('Razorpay payment error:', error)
      return {
        success: false,
        orderId: request.orderId,
        amount: request.amount,
        gateway: 'razorpay',
        status: 'failed',
        errorMessage: error instanceof Error ? error.message : 'Payment failed'
      }
    }
  }

  // PayU Integration
  async processPayUPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      const gateway = this.gateways.get('payu')
      if (!gateway) throw new Error('PayU gateway not configured')

      const txnId = uuidv4()
      const paymentData = {
        key: gateway.config.merchantKey,
        txnid: txnId,
        amount: request.amount.toString(),
        productinfo: request.description,
        firstname: request.customerName || 'Customer',
        email: request.customerEmail || 'customer@example.com',
        phone: request.customerPhone || '9999999999',
        surl: `${window.location.origin}/payment/success`,
        furl: `${window.location.origin}/payment/failure`,
        service_provider: 'payu_paisa'
      }

      // Generate hash
      const hash = await this.generatePayUHash(paymentData, gateway.config.salt)
      ;(paymentData as any).hash = hash

      // In production, this should redirect to PayU
      return this.simulatePayUPayment(paymentData, request)
    } catch (error) {
      console.error('PayU payment error:', error)
      return {
        success: false,
        orderId: request.orderId,
        amount: request.amount,
        gateway: 'payu',
        status: 'failed',
        errorMessage: error instanceof Error ? error.message : 'Payment failed'
      }
    }
  }

  // UPI Integration
  async processUPIPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      const gateway = this.gateways.get('upi')
      if (!gateway) throw new Error('UPI gateway not configured')

      const upiUrl = this.generateUPIUrl({
        merchantId: gateway.config.merchantId,
        merchantName: gateway.config.merchantName,
        amount: request.amount,
        currency: request.currency || 'INR',
        transactionRef: request.orderId,
        description: request.description
      })

      // Generate UPI QR Code
      const qrCodeData = await this.generateUPIQRCode(upiUrl)

      return {
        success: true,
        transactionId: uuidv4(),
        paymentId: request.orderId,
        orderId: request.orderId,
        amount: request.amount,
        gateway: 'upi',
        status: 'pending',
        receipt: qrCodeData
      }
    } catch (error) {
      console.error('UPI payment error:', error)
      return {
        success: false,
        orderId: request.orderId,
        amount: request.amount,
        gateway: 'upi',
        status: 'failed',
        errorMessage: error instanceof Error ? error.message : 'UPI payment failed'
      }
    }
  }

  // Cash Payment
  async processCashPayment(request: PaymentRequest): Promise<PaymentResponse> {
    return {
      success: true,
      transactionId: `CASH_${Date.now()}`,
      paymentId: `CASH_${request.orderId}`,
      orderId: request.orderId,
      amount: request.amount,
      gateway: 'cash',
      status: 'success',
      receipt: `Cash payment received: ₹${request.amount}`
    }
  }

  // Card Payment (Terminal Integration)
  async processCardPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      // This would integrate with a physical card terminal
      // For now, we'll simulate the process
      
      const terminalResponse = await this.simulateCardTerminal(request)
      
      return {
        success: terminalResponse.success,
        transactionId: terminalResponse.transactionId,
        paymentId: terminalResponse.paymentId,
        orderId: request.orderId,
        amount: request.amount,
        gateway: 'card',
        status: terminalResponse.success ? 'success' : 'failed',
        errorMessage: terminalResponse.errorMessage,
        receipt: terminalResponse.receipt
      }
    } catch (error) {
      console.error('Card payment error:', error)
      return {
        success: false,
        orderId: request.orderId,
        amount: request.amount,
        gateway: 'card',
        status: 'failed',
        errorMessage: error instanceof Error ? error.message : 'Card payment failed'
      }
    }
  }

  // Main payment processing function
  async processPayment(
    gateway: string, 
    request: PaymentRequest
  ): Promise<PaymentResponse> {
    switch (gateway) {
      case 'razorpay':
        return this.processRazorpayPayment(request)
      case 'payu':
        return this.processPayUPayment(request)
      case 'upi':
        return this.processUPIPayment(request)
      case 'cash':
        return this.processCashPayment(request)
      case 'card':
        return this.processCardPayment(request)
      default:
        throw new Error(`Unsupported payment gateway: ${gateway}`)
    }
  }

  // Helper functions

  private async createRazorpayOrder(orderData: any) {
    // In production, this should call your backend API
    // For demo purposes, we'll simulate a successful response
    return {
      success: true,
      id: `order_${Date.now()}`,
      amount: orderData.amount,
      currency: orderData.currency,
      receipt: orderData.receipt,
      status: 'created'
    }
  }

  private async generatePayUHash(data: any, salt: string): Promise<string> {
    // This should be done on the backend for security
    // For demo purposes, we'll return a mock hash
    return 'mock_hash_' + Date.now()
  }

  private async simulatePayUPayment(data: any, request: PaymentRequest): Promise<PaymentResponse> {
    // Simulate PayU payment process
    return {
      success: true,
      transactionId: data.txnid,
      paymentId: `payu_${data.txnid}`,
      orderId: request.orderId,
      amount: request.amount,
      gateway: 'payu',
      status: 'success'
    }
  }

  private generateUPIUrl(params: {
    merchantId: string
    merchantName: string
    amount: number
    currency: string
    transactionRef: string
    description: string
  }): string {
    const { merchantId, merchantName, amount, transactionRef, description } = params
    
    return `upi://pay?pa=${merchantId}&pn=${encodeURIComponent(merchantName)}&am=${amount}&cu=INR&tr=${transactionRef}&tn=${encodeURIComponent(description)}`
  }

  private async generateUPIQRCode(upiUrl: string): Promise<string> {
    // Return the UPI URL for QR code generation
    return upiUrl
  }

  private async simulateCardTerminal(request: PaymentRequest) {
    // Simulate card terminal interaction
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          transactionId: `CARD_${Date.now()}`,
          paymentId: `CARD_${request.orderId}`,
          receipt: `Card payment successful: ₹${request.amount}`
        })
      }, 2000) // Simulate terminal processing time
    })
  }

  // Payment validation
  async validatePayment(transactionId: string, gateway: string): Promise<boolean> {
    try {
      switch (gateway) {
        case 'razorpay':
          return this.validateRazorpayPayment(transactionId)
        case 'payu':
          return this.validatePayUPayment(transactionId)
        case 'upi':
          return this.validateUPIPayment(transactionId)
        default:
          return true // Cash and card payments are validated locally
      }
    } catch (error) {
      console.error('Payment validation error:', error)
      return false
    }
  }

  private async validateRazorpayPayment(transactionId: string): Promise<boolean> {
    // In production, verify payment with Razorpay API
    return true
  }

  private async validatePayUPayment(transactionId: string): Promise<boolean> {
    // In production, verify payment with PayU API
    return true
  }

  private async validateUPIPayment(transactionId: string): Promise<boolean> {
    // In production, verify UPI payment status
    return true
  }

  // Receipt generation
  generateReceipt(payment: PaymentResponse, orderDetails: any): string {
    const timestamp = new Date().toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata'
    })

    return `
=================================
         BELOOP RESTAURANT
=================================
Date: ${timestamp}
Order ID: ${payment.orderId}
Payment ID: ${payment.paymentId}
Gateway: ${payment.gateway.toUpperCase()}
=================================
Amount: ₹${payment.amount.toFixed(2)}
Status: ${payment.status.toUpperCase()}
=================================
Thank you for your business!
=================================
    `.trim()
  }
}

// Export singleton instance
export const paymentService = new PaymentService()
export default paymentService
