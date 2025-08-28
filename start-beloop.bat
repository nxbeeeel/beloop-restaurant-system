@echo off
echo.
echo ========================================
echo 🚀 BELOOP RESTAURANT MANAGEMENT SYSTEM
echo ========================================
echo.

echo 🔧 Starting High-Performance Restaurant Management System...
echo.

REM Kill any existing Node processes
echo 📋 Cleaning up existing processes...
taskkill /f /im node.exe >nul 2>&1
timeout /t 2 >nul

REM Check if ports are available
echo 🔍 Checking port availability...
netstat -an | findstr ":5000" >nul
if %errorlevel% equ 0 (
    echo ❌ Port 5000 is still in use. Force killing processes...
    taskkill /f /im node.exe /f >nul 2>&1
    timeout /t 3 >nul
)

netstat -an | findstr ":3001" >nul
if %errorlevel% equ 0 (
    echo ❌ Port 3001 is still in use. Force killing processes...
    taskkill /f /im node.exe /f >nul 2>&1
    timeout /t 3 >nul
)

netstat -an | findstr ":3002" >nul
if %errorlevel% equ 0 (
    echo ❌ Port 3002 is still in use. Force killing processes...
    taskkill /f /im node.exe /f >nul 2>&1
    timeout /t 3 >nul
)

echo ✅ Ports cleared successfully!

REM Start all services
echo.
echo 🚀 Starting all services...
echo.

REM Start Backend (High-Performance)
echo 📡 Starting Backend API (Port 5000)...
start "Beloop Backend" cmd /k "cd apps\backend && npm run dev"

REM Wait for backend to start
timeout /t 5 >nul

REM Start Admin Dashboard
echo 🎛️  Starting Admin Dashboard (Port 3001)...
start "Beloop Admin" cmd /k "cd apps\admin && npm run dev"

REM Wait for admin to start
timeout /t 3 >nul

REM Start POS System
echo 🍽️  Starting POS System (Port 3002)...
start "Beloop POS" cmd /k "cd apps\pos && npm run dev"

REM Wait for POS to start
timeout /t 3 >nul

echo.
echo ========================================
echo ✅ ALL SERVICES STARTED SUCCESSFULLY!
echo ========================================
echo.
echo 🌐 Access Points:
echo    📊 Backend API:    http://localhost:5000
echo    🎛️  Admin Dashboard: http://localhost:3001
echo    🍽️  POS System:     http://localhost:3002
echo.
echo 🔧 Health Checks:
echo    📡 Backend Health: http://localhost:5000/health
echo    🍽️  Menu API:       http://localhost:5000/api/menu
echo.
echo 💡 Tips:
echo    - Use Ctrl+C in any window to stop that service
echo    - Check browser console for any frontend errors
echo    - Backend logs will show in the Backend window
echo.
echo 🎯 System is ready for production use!
echo.
pause
