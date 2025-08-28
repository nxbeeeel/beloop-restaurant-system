#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Building Beloop POS for all platforms...\n');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  red: '\x1b[31m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function executeCommand(command, description) {
  try {
    log(`📦 ${description}...`, 'blue');
    execSync(command, { stdio: 'inherit' });
    log(`✅ ${description} completed!`, 'green');
    return true;
  } catch (error) {
    log(`❌ ${description} failed!`, 'red');
    console.error(error.message);
    return false;
  }
}

async function buildAllPlatforms() {
  const startTime = Date.now();
  
  // Step 1: Install dependencies
  if (!executeCommand('npm install', 'Installing dependencies')) {
    process.exit(1);
  }

  // Step 2: Build web version
  if (!executeCommand('npm run build', 'Building web version')) {
    process.exit(1);
  }

  // Step 3: Build PWA version (already included in web build)
  log('✅ PWA version ready (included in web build)', 'green');

  // Step 4: Build Electron (Windows) version
  log('\n🖥️  Building Desktop Applications...', 'bright');
  if (!executeCommand('npm run electron:dist', 'Building Windows desktop app')) {
    log('⚠️  Windows build failed, but continuing...', 'yellow');
  }

  // Step 5: Setup and build mobile version
  log('\n📱 Setting up Mobile Applications...', 'bright');
  
  // Initialize Capacitor if not already done
  if (!fs.existsSync(path.join(process.cwd(), 'capacitor.config.ts'))) {
    executeCommand('npx cap init', 'Initializing Capacitor');
  }

  // Sync web build with Capacitor
  executeCommand('npx cap sync', 'Syncing with Capacitor');

  // Build Android (if Android SDK is available)
  try {
    executeCommand('npx cap build android', 'Building Android app');
  } catch (error) {
    log('⚠️  Android build skipped (Android SDK not configured)', 'yellow');
  }

  // Step 6: Generate deployment package
  log('\n📦 Creating deployment package...', 'bright');
  
  const distDir = path.join(process.cwd(), 'dist-all-platforms');
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }

  // Copy web build
  if (fs.existsSync('dist')) {
    executeCommand(`xcopy dist ${path.join(distDir, 'web')} /E /I /Y || cp -r dist ${path.join(distDir, 'web')}`, 'Copying web build');
  }

  // Copy Electron build
  if (fs.existsSync('dist-electron')) {
    executeCommand(`xcopy dist-electron ${path.join(distDir, 'desktop')} /E /I /Y || cp -r dist-electron ${path.join(distDir, 'desktop')}`, 'Copying desktop build');
  }

  // Create README for deployment
  const deploymentReadme = `
# Beloop POS - Multi-Platform Distribution

## 📋 Build Information
- Build Date: ${new Date().toISOString()}
- Version: 1.0.0
- Platforms: Web, Desktop (Windows), Mobile (Android/iOS), PWA

## 🌐 Web Application
- Location: \`web/\`
- Deploy to any web server (Apache, Nginx, Netlify, Vercel)
- Supports PWA installation
- URL: Upload to your domain

## 🖥️ Desktop Application
- Location: \`desktop/\`
- Windows installer: \`.exe\` file
- Portable version: Extract and run
- Features: Offline mode, printer integration, hardware support

## 📱 Mobile Application
- Android: \`.apk\` file (sideload) or publish to Play Store
- iOS: Requires Xcode for App Store submission
- Features: Camera, GPS, push notifications

## 🚀 Progressive Web App (PWA)
- Automatically enabled in web version
- Users can "Add to Home Screen"
- Works offline with cached data
- Push notifications supported

## 🔧 Installation Instructions

### Web Deployment:
1. Upload \`web/\` folder contents to your web server
2. Configure HTTPS (required for PWA features)
3. Set up domain/subdomain

### Desktop Installation:
1. Run the \`.exe\` installer (Windows)
2. Follow installation wizard
3. Launch from Start Menu or Desktop

### Mobile Installation:
1. Android: Enable "Unknown Sources" and install \`.apk\`
2. iOS: Use Xcode to build and install
3. Or publish to respective app stores

## 🌟 Features Included:
- ✅ Touch-friendly POS interface
- ✅ Offline mode with sync
- ✅ Multiple payment methods
- ✅ Inventory management
- ✅ Customer management
- ✅ Sales analytics
- ✅ Voice commands
- ✅ Thermal printer support
- ✅ Zomato/Swiggy integration
- ✅ AI-powered recommendations
- ✅ Multi-language (English/Malayalam)
- ✅ GST compliance
- ✅ Loyalty points system

## 📞 Support:
For technical support, contact: support@beloop.com
`;

  fs.writeFileSync(path.join(distDir, 'README.md'), deploymentReadme);

  const endTime = Date.now();
  const buildTime = Math.round((endTime - startTime) / 1000);

  log('\n🎉 Build Summary:', 'bright');
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'blue');
  log(`✅ Web Application: Ready for deployment`, 'green');
  log(`✅ PWA: Enabled (installable)`, 'green');
  log(`${fs.existsSync('dist-electron') ? '✅' : '⚠️'} Desktop App: ${fs.existsSync('dist-electron') ? 'Built successfully' : 'Build failed/skipped'}`, fs.existsSync('dist-electron') ? 'green' : 'yellow');
  log(`⚠️ Mobile Apps: Manual setup required`, 'yellow');
  log(`📁 All builds: ${distDir}`, 'blue');
  log(`⏱️ Total build time: ${buildTime}s`, 'blue');
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'blue');

  log('\n🚀 Next Steps:', 'bright');
  log('1. Deploy web version to your server', 'blue');
  log('2. Distribute desktop installer to staff computers', 'blue');
  log('3. Configure mobile apps for staff devices', 'blue');
  log('4. Set up backend API endpoints', 'blue');
  log('5. Configure payment gateways and integrations', 'blue');

  log('\n✨ Beloop POS is ready for production!', 'green');
}

// Run the build process
buildAllPlatforms().catch(console.error);
