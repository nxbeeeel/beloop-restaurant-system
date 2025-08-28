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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <AnimatePresence>
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            layout
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{ 
              delay: index * 0.1,
              duration: 0.3,
              ease: "easeOut"
            }}
            whileHover={{ 
              scale: 1.02, 
              y: -8,
              transition: { duration: 0.2 }
            }}
            className="group relative"
          >
            <div className="card-premium rounded-3xl p-6 h-full flex flex-col shadow-premium hover:shadow-premium-lg transition-all duration-300 border border-white/20">
              {/* Item Image Placeholder */}
              <div className="relative mb-4">
                <div className="w-full h-48 bg-gradient-to-br from-orange-100 via-red-100 to-pink-100 rounded-2xl flex items-center justify-center overflow-hidden">
                  <div className="text-6xl opacity-20 font-bold text-gray-600">
                    {item.name.charAt(0)}
                  </div>
                </div>
                
                {/* Popularity Badge */}
                {item.popularity && item.popularity >= 4 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-3 left-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1"
                  >
                    <Star className="w-3 h-3 fill-current" />
                    <span>Popular</span>
                  </motion.div>
                )}

                {/* Veg/Non-Veg Badge */}
                <div className="absolute top-3 right-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    item.isVeg ? 'bg-green-500' : 'bg-red-500'
                  }`}>
                    <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center">
                      <div className={`w-2 h-2 rounded-full ${
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
                  className="absolute bottom-3 right-3 w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:shadow-xl"
                >
                  <Plus className="w-6 h-6" />
                </motion.button>
              </div>

              {/* Item Info */}
              <div className="flex-1 flex flex-col">
                <div className="mb-2">
                  <h3 className="text-lg font-bold text-gray-800 mb-1 line-clamp-1">
                    {item.name}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                    {item.description}
                  </p>
                </div>

                {/* Item Details */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    {item.preparationTime && (
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{item.preparationTime}m</span>
                      </div>
                    )}
                    {item.calories && (
                      <span>{item.calories} cal</span>
                    )}
                  </div>
                  
                  {/* Rating */}
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${
                          i < (item.popularity || 0) 
                            ? 'text-yellow-400 fill-current' 
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Price and Action */}
                <div className="mt-auto flex items-center justify-between">
                  <div className="text-2xl font-bold text-gray-800">
                    ₹{item.price}
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleAddToCart(item)}
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    Add
                  </motion.button>
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
