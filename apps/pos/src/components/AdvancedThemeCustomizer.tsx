import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Palette, 
  Moon, 
  Sun, 
  Settings, 
  Eye, 
  EyeOff, 
  RotateCcw, 
  Download, 
  Upload,
  Sparkles,
  Zap,
  Star,
  Heart,
  Crown
} from 'lucide-react'
import { useThemeStore, ThemeColors } from '../store/themeStore'
import { ChromePicker, SketchPicker } from 'react-color'

interface AdvancedThemeCustomizerProps {
  isOpen: boolean
  onClose: () => void
}

const presetThemes = {
  'Ocean Blue': {
    primary: '#0EA5E9',
    secondary: '#64748B',
    accent: '#06B6D4',
    background: '#F0F9FF',
    surface: '#FFFFFF',
    text: '#0F172A',
    textSecondary: '#475569',
    border: '#E0F2FE',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444'
  },
  'Sunset Orange': {
    primary: '#F97316',
    secondary: '#64748B',
    accent: '#FB923C',
    background: '#FFF7ED',
    surface: '#FFFFFF',
    text: '#1E293B',
    textSecondary: '#64748B',
    border: '#FED7AA',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444'
  },
  'Emerald Green': {
    primary: '#10B981',
    secondary: '#64748B',
    accent: '#34D399',
    background: '#ECFDF5',
    surface: '#FFFFFF',
    text: '#064E3B',
    textSecondary: '#047857',
    border: '#A7F3D0',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444'
  },
  'Royal Purple': {
    primary: '#8B5CF6',
    secondary: '#64748B',
    accent: '#A78BFA',
    background: '#FAF5FF',
    surface: '#FFFFFF',
    text: '#2E1065',
    textSecondary: '#6D28D9',
    border: '#DDD6FE',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444'
  },
  'Midnight Dark': {
    primary: '#6366F1',
    secondary: '#94A3B8',
    accent: '#818CF8',
    background: '#0F172A',
    surface: '#1E293B',
    text: '#F1F5F9',
    textSecondary: '#94A3B8',
    border: '#334155',
    success: '#34D399',
    warning: '#FBBF24',
    error: '#F87171'
  }
}

export const AdvancedThemeCustomizer: React.FC<AdvancedThemeCustomizerProps> = ({
  isOpen,
  onClose
}) => {
  const { settings, updateTheme, resetTheme, setColor } = useThemeStore()
  const [activeTab, setActiveTab] = useState<'presets' | 'custom' | 'advanced'>('presets')
  const [activeColor, setActiveColor] = useState<keyof ThemeColors | null>(null)
  const [showColorPicker, setShowColorPicker] = useState(false)

  const applyPreset = (themeName: string, colors: ThemeColors) => {
    updateTheme({ colors })
  }

  const exportTheme = () => {
    const themeData = {
      name: 'Custom Theme',
      settings,
      exportedAt: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(themeData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'beloop-theme.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const importTheme = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const themeData = JSON.parse(e.target?.result as string)
          updateTheme(themeData.settings)
        } catch (error) {
          console.error('Invalid theme file')
        }
      }
      reader.readAsText(file)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white/20 rounded-xl">
                    <Palette className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Premium Theme Customizer</h2>
                    <p className="text-blue-100">Create your perfect POS experience</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Crown className="w-5 h-5 text-yellow-300" />
                  <span className="text-sm font-semibold">PRO</span>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 dark:border-gray-700">
              {[
                { id: 'presets', label: 'Premium Presets', icon: Sparkles },
                { id: 'custom', label: 'Custom Colors', icon: Palette },
                { id: 'advanced', label: 'Advanced', icon: Settings }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                      : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              <AnimatePresence mode="wait">
                {activeTab === 'presets' && (
                  <motion.div
                    key="presets"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {Object.entries(presetThemes).map(([name, colors]) => (
                        <motion.div
                          key={name}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 p-4 cursor-pointer hover:border-blue-300 dark:hover:border-blue-600 transition-colors"
                          onClick={() => applyPreset(name, colors)}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="font-semibold text-gray-900 dark:text-white">{name}</h3>
                            <Star className="w-4 h-4 text-yellow-500" />
                          </div>
                          <div className="flex space-x-2 mb-3">
                            {Object.values(colors).slice(0, 5).map((color, index) => (
                              <div
                                key={index}
                                className="w-6 h-6 rounded-full border-2 border-white dark:border-gray-700 shadow-sm"
                                style={{ backgroundColor: color }}
                              />
                            ))}
                          </div>
                          <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                            Apply Theme
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeTab === 'custom' && (
                  <motion.div
                    key="custom"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {Object.entries(settings.colors).map(([key, value]) => (
                        <div key={key} className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </label>
                          <div className="relative">
                            <div
                              className="w-full h-12 rounded-lg border-2 border-gray-300 dark:border-gray-600 cursor-pointer hover:border-blue-500 transition-colors"
                              style={{ backgroundColor: value }}
                              onClick={() => {
                                setActiveColor(key as keyof ThemeColors)
                                setShowColorPicker(true)
                              }}
                            />
                            <input
                              type="text"
                              value={value}
                              onChange={(e) => setColor(key as keyof ThemeColors, e.target.value)}
                              className="mt-2 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    {showColorPicker && activeColor && (
                      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-4">
                          <SketchPicker
                            color={settings.colors[activeColor]}
                            onChange={(color) => setColor(activeColor, color.hex)}
                          />
                          <button
                            onClick={() => setShowColorPicker(false)}
                            className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                          >
                            Done
                          </button>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                {activeTab === 'advanced' && (
                  <motion.div
                    key="advanced"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    {/* Theme Mode */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Theme Mode</h3>
                      <div className="flex space-x-4">
                        {[
                          { mode: 'light', icon: Sun, label: 'Light' },
                          { mode: 'dark', icon: Moon, label: 'Dark' },
                          { mode: 'auto', icon: Zap, label: 'Auto' }
                        ].map(({ mode, icon: Icon, label }) => (
                          <button
                            key={mode}
                            onClick={() => updateTheme({ mode: mode as any })}
                            className={`flex items-center space-x-2 px-4 py-2 rounded-lg border-2 transition-colors ${
                              settings.mode === mode
                                ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-600'
                                : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-blue-300'
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                            <span>{label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Border Radius */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Border Radius</h3>
                      <div className="flex space-x-4">
                        {['none', 'sm', 'md', 'lg', 'xl'].map((radius) => (
                          <button
                            key={radius}
                            onClick={() => updateTheme({ borderRadius: radius as any })}
                            className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                              settings.borderRadius === radius
                                ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-600'
                                : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-blue-300'
                            }`}
                            style={{
                              borderRadius: radius === 'none' ? '0' : 
                                        radius === 'sm' ? '0.25rem' :
                                        radius === 'md' ? '0.375rem' :
                                        radius === 'lg' ? '0.5rem' : '0.75rem'
                            }}
                          >
                            {radius.toUpperCase()}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Font Size */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Font Size</h3>
                      <div className="flex space-x-4">
                        {['xs', 'sm', 'base', 'lg', 'xl'].map((size) => (
                          <button
                            key={size}
                            onClick={() => updateTheme({ fontSize: size as any })}
                            className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                              settings.fontSize === size
                                ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-600'
                                : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-blue-300'
                            }`}
                            style={{
                              fontSize: size === 'xs' ? '0.75rem' :
                                       size === 'sm' ? '0.875rem' :
                                       size === 'base' ? '1rem' :
                                       size === 'lg' ? '1.125rem' : '1.25rem'
                            }}
                          >
                            {size.toUpperCase()}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Toggles */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Effects</h3>
                      <div className="space-y-3">
                        {[
                          { key: 'animations', label: 'Animations', icon: Zap },
                          { key: 'shadows', label: 'Shadows', icon: Eye }
                        ].map(({ key, label, icon: Icon }) => (
                          <div key={key} className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Icon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                              <span className="text-gray-700 dark:text-gray-300">{label}</span>
                            </div>
                            <button
                              onClick={() => updateTheme({ [key]: !settings[key as keyof typeof settings] })}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                settings[key as keyof typeof settings] ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                              }`}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                  settings[key as keyof typeof settings] ? 'translate-x-6' : 'translate-x-1'
                                }`}
                              />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 dark:bg-gray-800 p-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={resetTheme}
                    className="flex items-center space-x-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Reset</span>
                  </button>
                  <button
                    onClick={exportTheme}
                    className="flex items-center space-x-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>Export</span>
                  </button>
                  <label className="flex items-center space-x-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer">
                    <Upload className="w-4 h-4" />
                    <span>Import</span>
                    <input
                      type="file"
                      accept=".json"
                      onChange={importTheme}
                      className="hidden"
                    />
                  </label>
                </div>
                <button
                  onClick={onClose}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
