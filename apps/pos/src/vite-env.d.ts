/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_RAZORPAY_KEY_ID: string
  readonly VITE_RAZORPAY_KEY_SECRET: string
  readonly VITE_RAZORPAY_WEBHOOK_SECRET: string
  readonly VITE_PAYU_MERCHANT_KEY: string
  readonly VITE_PAYU_SALT: string
  readonly VITE_PAYU_ENV: string
  readonly VITE_UPI_MERCHANT_ID: string
  readonly VITE_UPI_MERCHANT_NAME: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
