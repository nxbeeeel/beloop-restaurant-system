import React, { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, MicOff, Volume2 } from 'lucide-react'
import { useAdvancedPOSStore } from '../store/advancedPOS'
import toast from 'react-hot-toast'

const VoiceAssistant: React.FC = () => {
  const { 
    isListening,
    startListening,
    stopListening,
    menuItems,
    cart,
    addToCart,
    clearCart,
    setPaymentModalOpen
  } = useAdvancedPOSStore()

  const [transcript, setTranscript] = useState('')
  const [isSupported, setIsSupported] = useState(false)
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    // Check if speech recognition is supported
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    setIsSupported(!!SpeechRecognition)

    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = true
      recognitionRef.current.interimResults = true
      recognitionRef.current.lang = 'en-US'

      recognitionRef.current.onstart = () => {
        console.log('Voice recognition started')
        toast.success('Voice assistant activated!')
      }

      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = ''
        let interimTranscript = ''

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript
          if (event.results[i].isFinal) {
            finalTranscript += transcript
          } else {
            interimTranscript += transcript
          }
        }

        setTranscript(finalTranscript || interimTranscript)

        // Process final transcript
        if (finalTranscript) {
          processVoiceCommand(finalTranscript.toLowerCase())
        }
      }

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error)
        toast.error('Voice recognition error')
        stopListening()
      }

      recognitionRef.current.onend = () => {
        console.log('Voice recognition ended')
        stopListening()
      }
    }
  }, [stopListening])

  const processVoiceCommand = (command: string) => {
    console.log('Processing voice command:', command)

    // Add item to cart
    if (command.includes('add') || command.includes('order')) {
      const itemName = command.replace(/add|order/gi, '').trim()
      const menuItem = menuItems.find(item => 
        item.name.toLowerCase().includes(itemName) ||
        itemName.includes(item.name.toLowerCase())
      )
      
      if (menuItem) {
        addToCart(menuItem)
        toast.success(`Added ${menuItem.name} to cart`)
      } else {
        toast.error(`Item "${itemName}" not found`)
      }
    }

    // Clear cart
    else if (command.includes('clear') || command.includes('empty')) {
      clearCart()
      toast.success('Cart cleared')
    }

    // Checkout
    else if (command.includes('checkout') || command.includes('pay') || command.includes('bill')) {
      if (cart.length > 0) {
        setPaymentModalOpen(true)
        toast.success('Opening payment modal')
      } else {
        toast.error('Cart is empty')
      }
    }

    // Show menu
    else if (command.includes('menu') || command.includes('show items')) {
      toast.success('Menu items are displayed')
    }

    // Help
    else if (command.includes('help') || command.includes('commands')) {
      toast.success('Say: "Add [item]", "Clear cart", "Checkout", "Show menu"')
    }

    // Unknown command
    else {
      toast.error(`Unknown command: "${command}"`)
    }

    setTranscript('')
  }

  const toggleListening = () => {
    if (!isSupported) {
      toast.error('Speech recognition not supported in this browser')
      return
    }

    if (isListening) {
      stopListening()
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    } else {
      startListening()
      if (recognitionRef.current) {
        recognitionRef.current.start()
      }
    }
  }

  if (!isSupported) {
    return null
  }

  return (
    <>
      {/* Voice Assistant Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleListening}
        className={`fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg z-50 flex items-center justify-center transition-all duration-300 ${
          isListening 
            ? 'bg-red-500 text-white animate-pulse' 
            : 'bg-blue-500 text-white hover:bg-blue-600'
        }`}
      >
        {isListening ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
      </motion.button>

      {/* Voice Assistant Panel */}
      <AnimatePresence>
        {isListening && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="fixed bottom-24 right-6 bg-white/95 backdrop-blur-xl border border-gray-200 p-4 rounded-2xl shadow-2xl max-w-sm z-50"
          >
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-red-400 rounded-full flex items-center justify-center animate-pulse">
                <Volume2 className="w-4 h-4 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">Voice Assistant</h4>
                <p className="text-sm text-gray-600">Listening...</p>
              </div>
            </div>
            
            {/* Transcript Display */}
            {transcript && (
              <div className="mb-3 p-2 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800 font-medium">You said:</p>
                <p className="text-sm text-blue-600">{transcript}</p>
              </div>
            )}
            
            {/* Voice Commands Help */}
            <div className="text-xs text-gray-500 space-y-1">
              <p className="font-medium">Try saying:</p>
              <p>• "Add butter chicken"</p>
              <p>• "Clear cart"</p>
              <p>• "Checkout"</p>
              <p>• "Show menu"</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default VoiceAssistant
