import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface ThemeColors {
  primary: string
  secondary: string
  accent: string
  background: string
  surface: string
  text: string
  textSecondary: string
  border: string
  success: string
  warning: string
  error: string
}

export interface ThemeSettings {
  mode: 'light' | 'dark' | 'auto'
  colors: ThemeColors
  borderRadius: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  fontSize: 'xs' | 'sm' | 'base' | 'lg' | 'xl'
  spacing: 'compact' | 'normal' | 'spacious'
  animations: boolean
  shadows: boolean
}

interface ThemeStore {
  settings: ThemeSettings
  updateTheme: (settings: Partial<ThemeSettings>) => void
  resetTheme: () => void
  toggleDarkMode: () => void
  setColor: (key: keyof ThemeColors, value: string) => void
}

const defaultLightTheme: ThemeColors = {
  primary: '#3B82F6',
  secondary: '#64748B',
  accent: '#F59E0B',
  background: '#FFFFFF',
  surface: '#F8FAFC',
  text: '#1E293B',
  textSecondary: '#64748B',
  border: '#E2E8F0',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444'
}

const defaultDarkTheme: ThemeColors = {
  primary: '#60A5FA',
  secondary: '#94A3B8',
  accent: '#FBBF24',
  background: '#0F172A',
  surface: '#1E293B',
  text: '#F1F5F9',
  textSecondary: '#94A3B8',
  border: '#334155',
  success: '#34D399',
  warning: '#FBBF24',
  error: '#F87171'
}

const defaultSettings: ThemeSettings = {
  mode: 'light',
  colors: defaultLightTheme,
  borderRadius: 'lg',
  fontSize: 'base',
  spacing: 'normal',
  animations: true,
  shadows: true
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      settings: defaultSettings,
      
      updateTheme: (newSettings) => {
        set((state) => ({
          settings: { ...state.settings, ...newSettings }
        }))
      },
      
      resetTheme: () => {
        set({ settings: defaultSettings })
      },
      
      toggleDarkMode: () => {
        set((state) => {
          const newMode = state.settings.mode === 'light' ? 'dark' : 'light'
          const newColors = newMode === 'dark' ? defaultDarkTheme : defaultLightTheme
          
          return {
            settings: {
              ...state.settings,
              mode: newMode,
              colors: newColors
            }
          }
        })
      },
      
      setColor: (key, value) => {
        set((state) => ({
          settings: {
            ...state.settings,
            colors: {
              ...state.settings.colors,
              [key]: value
            }
          }
        }))
      }
    }),
    {
      name: 'beloop-theme',
      partialize: (state) => ({ settings: state.settings })
    }
  )
)
