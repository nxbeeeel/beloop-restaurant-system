import { Routes, Route } from 'react-router-dom'
import TenantAwarePOS from './components/TenantAwarePOS'
import PricingPage from './pages/Pricing'

export default function App() {
  return (
    <Routes>
      {/* Main POS Route - Tenant Aware */}
      <Route path="/" element={<TenantAwarePOS />} />
      
      {/* Pricing Page */}
      <Route path="/pricing" element={<PricingPage />} />
      
      {/* Fallback */}
      <Route path="*" element={<TenantAwarePOS />} />
    </Routes>
  )
}
