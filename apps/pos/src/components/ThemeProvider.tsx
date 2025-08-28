import React, { useEffect } from 'react'
import { useThemeStore } from '../store/themeStore'

interface ThemeProviderProps {
  children: React.ReactNode
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const { settings } = useThemeStore()

  useEffect(() => {
    const root = document.documentElement
    
    // Apply CSS custom properties
    Object.entries(settings.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value)
    })
    
    // Apply theme mode
    root.classList.remove('light', 'dark')
    root.classList.add(settings.mode)
    
    // Apply border radius
    root.style.setProperty('--border-radius', getBorderRadius(settings.borderRadius))
    
    // Apply font size
    root.style.setProperty('--font-size', getFontSize(settings.fontSize))
    
    // Apply spacing
    root.style.setProperty('--spacing', getSpacing(settings.spacing))
    
    // Apply animations
    if (!settings.animations) {
      root.style.setProperty('--animation-duration', '0s')
    } else {
      root.style.setProperty('--animation-duration', '0.2s')
    }
    
    // Apply shadows
    if (!settings.shadows) {
      root.style.setProperty('--shadow', 'none')
    } else {
      root.style.setProperty('--shadow', '0 4px 6px -1px rgba(0, 0, 0, 0.1)')
    }
    
  }, [settings])

  return <>{children}</>
}

const getBorderRadius = (radius: string) => {
  switch (radius) {
    case 'none': return '0px'
    case 'sm': return '0.25rem'
    case 'md': return '0.375rem'
    case 'lg': return '0.5rem'
    case 'xl': return '0.75rem'
    default: return '0.5rem'
  }
}

const getFontSize = (size: string) => {
  switch (size) {
    case 'xs': return '0.75rem'
    case 'sm': return '0.875rem'
    case 'base': return '1rem'
    case 'lg': return '1.125rem'
    case 'xl': return '1.25rem'
    default: return '1rem'
  }
}

const getSpacing = (spacing: string) => {
  switch (spacing) {
    case 'compact': return '0.75rem'
    case 'normal': return '1rem'
    case 'spacious': return '1.5rem'
    default: return '1rem'
  }
}
