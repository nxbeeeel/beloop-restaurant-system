import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

export default defineConfig({
  plugins: [
    react({
      // Enable SWC for faster compilation and hot reload
    })
  ],
  server: {
    port: 3002,
    host: true,
    // Enable HTTP/2 for faster loading
    https: false,
    // Enable hot reload optimizations
    hmr: {
      overlay: false
    },
    // Faster filesystem watching
    watch: {
      usePolling: false,
      interval: 100
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  // Advanced dependency optimization
  optimizeDeps: {
    include: [
      'react', 
      'react-dom', 
      'react-router-dom', 
      'zustand', 
      'framer-motion', 
      'lucide-react',
      'react-hot-toast',
      'date-fns',
      'axios'
    ],
    exclude: ['workbox-window'],
    // Enable esbuild for faster pre-bundling
    esbuildOptions: {
      target: 'esnext',
      supported: {
        'top-level-await': true
      }
    }
  },
  // Enable experimental features for performance
  experimental: {
    renderBuiltUrl(filename, { hostType }) {
      if (hostType === 'js') {
        return { js: `/${filename}` }
      }
      return { relative: true }
    }
  },
  build: {
    target: 'esnext',
    minify: 'esbuild',
    sourcemap: false, // Disable in production for smaller bundles
    cssCodeSplit: true,
    // Enable tree-shaking optimizations
    rollupOptions: {
      output: {
        // Advanced chunk splitting for optimal loading
        manualChunks: (id) => {
          // Core React dependencies
          if (id.includes('react') && !id.includes('react-router') && !id.includes('react-hot-toast')) {
            return 'react-core'
          }
          // Router
          if (id.includes('react-router')) {
            return 'router'
          }
          // UI Libraries
          if (id.includes('framer-motion') || id.includes('lucide-react')) {
            return 'ui-lib'
          }
          // Charts
          if (id.includes('recharts')) {
            return 'charts'
          }
          // State management
          if (id.includes('zustand')) {
            return 'state'
          }
          // Utilities
          if (id.includes('date-fns') || id.includes('axios')) {
            return 'utils'
          }
          // Vendor (everything else from node_modules)
          if (id.includes('node_modules')) {
            return 'vendor'
          }
        },
        // Optimize chunk loading
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      },
      // External dependencies for CDN (optional)
      external: [],
      // Advanced tree-shaking
      treeshake: {
        moduleSideEffects: false,
        propertyReadSideEffects: false,
        unknownGlobalSideEffects: false
      }
    },
    // Enable module preloading
    modulePreload: {
      polyfill: true
    },
    // Optimize CSS
    cssMinify: 'esbuild',
    // Enable compression
    reportCompressedSize: false, // Skip compression report for faster builds
    // Chunk size optimizations
    chunkSizeWarningLimit: 1000
  }
})
