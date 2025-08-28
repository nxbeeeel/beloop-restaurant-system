import React, { memo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Clock, Star, Heart, Zap } from 'lucide-react'
import { useAdvancedPOSStore, MenuItem } from '../store/advancedPOS'
import toast from 'react-hot-toast'

interface AdvancedMenuGridProps {
  items: MenuItem[]
}

const AdvancedMenuGrid: React.FC<AdvancedMenuGridProps> = memo(({ items }) => {
  const { addToCart } = useAdvancedPOSStore()

  const handleAddToCart = useCallback((item: MenuItem) => {
    addToCart(item, 1)
    toast.success(`Added ${item.name} to cart`)
  }, [addToCart])

  if (items.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-gray-500">
        <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-4">
          <Zap className="w-12 h-12 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold mb-2">No items found</h3>
        <p className="text-center text-gray-400">
          Try adjusting your search or category filters
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
      <AnimatePresence>
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            layout
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{ 
              delay: index * 0.05,
              duration: 0.3,
              ease: "easeOut"
            }}
            whileHover={{ 
              scale: 1.02, 
              y: -4,
              transition: { duration: 0.2 }
            }}
            className="group relative"
          >
            <div className="card-premium rounded-2xl p-3 sm:p-4 lg:p-6 h-full flex flex-col shadow-premium hover:shadow-premium-lg transition-all duration-300 border border-white/20">
              {/* Item Image Placeholder */}
              <div className="relative mb-3 sm:mb-4">
                <div className="w-full h-24 sm:h-32 lg:h-48 bg-gradient-to-br from-orange-100 via-red-100 to-pink-100 rounded-xl lg:rounded-2xl flex items-center justify-center overflow-hidden">
                  <div className="text-2xl sm:text-4xl lg:text-6xl opacity-20 font-bold text-gray-600">
                    {item.name.charAt(0)}
                  </div>
                </div>
                
                {/* Popularity Badge */}
                {item.popularity && item.popularity >= 4 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-2 left-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center space-x-1"
                  >
                    <Star className="w-3 h-3 fill-current" />
                    <span className="hidden sm:inline">Popular</span>
                  </motion.div>
                )}

                {/* Veg/Non-Veg Badge */}
                <div className="absolute top-2 right-2">
                  <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center ${
                    item.isVeg ? 'bg-green-500' : 'bg-red-500'
                  }`}>
                    <div className="w-3 h-3 sm:w-4 sm:h-4 bg-white rounded-full flex items-center justify-center">
                      <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${
                        item.isVeg ? 'bg-green-500' : 'bg-red-500'
                      }`}></div>
                    </div>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleAddToCart(item)}
                  className="absolute bottom-2 right-2 w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:shadow-xl"
                >
                  <Plus className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                </motion.button>
              </div>

              {/* Item Info */}
              <div className="flex-1 flex flex-col">
                <h3 className="font-bold text-gray-800 text-sm sm:text-base lg:text-lg mb-1 sm:mb-2 line-clamp-2">
                  {item.name}
                </h3>
                
                {item.description && (
                  <p className="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-3 line-clamp-2">
                    {item.description}
                  </p>
                )}

                <div className="flex items-center justify-between mt-auto">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-lg sm:text-xl lg:text-2xl text-blue-600">
                      ₹{item.price}
                    </span>
                    {item.preparationTime && (
                      <div className="flex items-center space-x-1 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        <span>{item.preparationTime}m</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
})

AdvancedMenuGrid.displayName = 'AdvancedMenuGrid'

export default AdvancedMenuGrid
