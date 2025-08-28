// Tenant utilities for multi-tenant SaaS
export const getCurrentTenant = () => {
  const hostname = window.location.hostname
  
  // Extract subdomain
  const subdomain = hostname.split('.')[0]
  
  // Default tenant for main domain
  if (hostname === 'beloop-pos.vercel.app' || hostname === 'localhost') {
    return 'demo'
  }
  
  return subdomain
}

export const getTenantConfig = async (tenantId: string) => {
  // Temporarily return null to avoid 404 errors
  console.log('Tenant config requested for:', tenantId)
  return null
}

export const getTenantBranding = (tenant: any) => {
  return {
    logo: tenant?.settings?.branding?.logo || '/default-logo.png',
    primaryColor: tenant?.settings?.branding?.primaryColor || '#3B82F6',
    restaurantName: tenant?.settings?.branding?.restaurantName || 'Restaurant POS',
    currency: tenant?.settings?.currency || 'INR'
  }
}

export const checkTenantLimits = async (tenantId: string, feature: string, count: number = 1) => {
  try {
    const response = await fetch(`https://beloop-restaurant-system-production.up.railway.app/api/tenants/${tenantId}/limits`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ feature, count })
    })
    const data = await response.json()
    return data.allowed
  } catch (error) {
    console.error('Error checking limits:', error)
    return true // Allow by default if check fails
  }
}

export const createTenantSubdomain = async (restaurantName: string) => {
  try {
    const response = await fetch('https://beloop-restaurant-system-production.up.railway.app/api/tenants', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: restaurantName,
        subdomain: restaurantName.toLowerCase().replace(/\s+/g, '-'),
        planType: 'basic',
        status: 'trial'
      })
    })
    const data = await response.json()
    return data.tenant
  } catch (error) {
    console.error('Error creating tenant:', error)
    return null
  }
}
