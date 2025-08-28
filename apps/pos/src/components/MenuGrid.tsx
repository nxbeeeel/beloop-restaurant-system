import React, { useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Clock, Star, Search, Filter } from 'lucide-react'
import { useAdvancedPOSStore, MENU_ITEMS, CATEGORIES } from '../store/advancedPOS'
import toast from 'react-hot-toast'

const MenuGrid: React.FC = () => {
  const {
    selectedCategory,
    searchQuery,
    addToCart,
    setSelectedCategory,
    setSearchQuery
  } = useAdvancedPOSStore()

  // Filter menu items based on category and search
  const filteredItems = useMemo(() => {
    let items = MENU_ITEMS

    // Filter by category
    if (selectedCategory !== 'All') {
      items = items.filter(item => item.category === selectedCategory)
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      items = items.filter(item =>
        item.name.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query)
      )
    }

    return items
  }, [selectedCategory, searchQuery])

  const handleAddToCart = (item: any) => {
    addToCart(item, 1)
    toast.success(`Added ${item.name} to cart`)
  }

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-white via-gray-50 to-blue-50">
      {/* Header */}
      <div className="p-6 border-b border-white/20 bg-white/50 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">Menu</h2>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search menu items..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {CATEGORIES.map((category) => (
            <motion.button
              key={category}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                selectedCategory === category
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {category}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Menu Grid */}
      <div className="flex-1 overflow-y-auto p-4">
        {filteredItems.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-500">
            <Search className="w-16 h-16 mb-4 opacity-50" />
            <h3 className="text-xl font-semibold mb-2">No items found</h3>
            <p className="text-center">
              {searchQuery ? 'Try adjusting your search terms' : 'No items in this category'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence>
              {filteredItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ 
                    scale: 1.02, 
                    y: -4,
                    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)"
                  }}
                  className="card-premium rounded-2xl p-4 group cursor-pointer"
                >
                  {/* Item Image Placeholder */}
                  <div className="w-full h-32 bg-gradient-to-br from-orange-100 to-red-100 rounded-xl mb-4 flex items-center justify-center">
                    <div className="text-4xl opacity-30">
                      {item.name.charAt(0)}
                    </div>
                  </div>

                  {/* Item Info */}
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <h3 className="font-semibold text-gray-800 text-lg">{item.name}</h3>
                      <div className="flex items-center space-x-1">
                        {item.isVeg && (
                          <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>
                        )}
                        {!item.isVeg && (
                          <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>
                        )}
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 line-clamp-2">
                      {item.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
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
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < (item.popularity || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="text-xl font-bold text-gray-800">
                        ₹{item.price}
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleAddToCart(item)}
                        className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
                      >
                        <Plus className="w-5 h-5" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  )
}

export default MenuGrid
