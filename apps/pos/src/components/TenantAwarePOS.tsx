import React, { useEffect, useState, useMemo } from 'react'
import { getCurrentTenant, getTenantConfig, getTenantBranding } from '../utils/tenantUtils'
import AdvancedPOS from './AdvancedPOS'

const TenantAwarePOS = () => {
  const [tenant, setTenant] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Get current tenant from subdomain
  const currentTenantId = useMemo(() => getCurrentTenant(), [])

  useEffect(() => {
    const loadTenantConfig = async () => {
      try {
        setLoading(true)
        
        // For now, create a mock tenant config to avoid 404 errors
        const mockTenantConfig = {
          id: currentTenantId,
          name: currentTenantId === 'demo' ? 'Demo Restaurant' : `${currentTenantId} Restaurant`,
          isActive: () => true,
          settings: {
            branding: {
              primaryColor: '#3B82F6',
              restaurantName: currentTenantId === 'demo' ? 'Demo Restaurant' : `${currentTenantId} Restaurant`,
              logo: '/default-logo.png'
            },
            currency: 'INR'
          }
        }
        
        setTenant(mockTenantConfig)
      } catch (err) {
        console.error('Error loading tenant:', err)
        setError('Failed to load restaurant configuration')
      } finally {
        setLoading(false)
      }
    }

    loadTenantConfig()
  }, [currentTenantId])

  // Get tenant branding
  const branding = useMemo(() => {
    return tenant ? getTenantBranding(tenant) : null
  }, [tenant])

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h1 className="text-2xl font-bold text-blue-800 mb-4">Loading Restaurant...</h1>
          <p className="text-blue-600">Connecting to {currentTenantId}.beloop-pos.vercel.app</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold text-red-800 mb-4">Restaurant Not Found</h1>
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  // Render POS with tenant branding
  return (
    <div style={{ 
      '--primary-color': branding?.primaryColor || '#3B82F6' 
    } as React.CSSProperties}>
      <AdvancedPOS />
    </div>
  )
}

export default TenantAwarePOS
