import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, MicOff } from 'lucide-react'
import { useAdvancedPOSStore } from '../store/advancedPOS'

const VoiceAssistant: React.FC = () => {
  const { 
    isListening, 
    voiceCommand
  } = useAdvancedPOSStore()

  // Voice command processing is now handled in the store

  // Voice command is now processed automatically in the store
  // No need for duplicate processing here

  return (
    <AnimatePresence>
      {isListening && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="fixed bottom-6 right-6 bg-red-500 text-white p-4 rounded-2xl shadow-2xl max-w-sm z-50"
        >
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-red-400 rounded-full flex items-center justify-center animate-pulse">
              <Mic className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-semibold">Voice Assistant Active</h4>
              <p className="text-sm opacity-90">Listening...</p>
            </div>
          </div>
          
          {voiceCommand && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 p-2 bg-red-400 rounded-lg"
            >
              <p className="text-sm">"{voiceCommand}"</p>
            </motion.div>
          )}
          
          <div className="mt-3 text-xs opacity-75">
            Say commands like "Add butter chicken", "Clear cart", or "Checkout"
          </div>
          
          {/* Debug info */}
          <div className="mt-2 text-xs opacity-50">
            Speech recognition: {('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) ? 'Supported' : 'Not supported'}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default VoiceAssistant
