@echo off
setlocal enabledelayedexpansion

:: Kantin Sekolah - Auto Setup Script for Windows
echo ================================================
echo 🏪 Kantin Sekolah - Auto Setup (Windows)
echo ================================================
echo.

:: Check Node.js
echo Checking Node.js installation...
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed!
    echo Please install Node.js 18+ from https://nodejs.org
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
echo ✅ Node.js %NODE_VERSION% found
echo.

:: Check npm
npm -v >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed!
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('npm -v') do set NPM_VERSION=%%i
echo ✅ npm %NPM_VERSION% found
echo.

:: Install dependencies
echo ================================================
echo 📦 Installing dependencies...
echo ================================================
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

echo ✅ Dependencies installed
echo.

:: Create directories
echo ================================================
echo 📁 Creating directories...
echo ================================================

if not exist "public\barcodes" mkdir public\barcodes
if not exist "supabase" mkdir supabase

echo ✅ Directories created
echo.

:: Create .gitkeep
type nul > public\barcodes\.gitkeep

:: Setup environment
echo ================================================
echo 🔐 Setting up environment variables...
echo ================================================

if not exist ".env.local" (
    if exist ".env.example" (
        copy .env.example .env.local >nul
        echo ✅ .env.local created from .env.example
        echo.
        echo ⚠️  IMPORTANT: Edit .env.local with your Supabase credentials
        echo.
    ) else (
        echo ❌ .env.example not found
    )
) else (
    echo ⚠️  .env.local already exists, skipping...
)

echo.

:: Check schema
if exist "supabase\schema.sql" (
    echo ✅ Supabase schema found
) else (
    echo ⚠️  Supabase schema not found at supabase\schema.sql
)

echo.
echo ================================================
echo ✅ Setup Complete!
echo ================================================
echo.
echo Next steps:
echo.
echo 1. Setup Supabase:
echo    - Create account at https://supabase.com
echo    - Create new project
echo    - Run supabase\schema.sql in SQL Editor
echo    - Copy API keys to .env.local
echo.
echo 2. Edit .env.local:
echo    notepad .env.local
echo.
echo 3. Run development server:
echo    npm run dev
echo.
echo 4. Open browser:
echo    http://localhost:3000
echo.
echo 5. Login with:
echo    Username: admin
echo    Password: admin123
echo.
echo ================================================
echo 📚 Documentation:
echo    - README.md         - Full documentation
echo    - QUICKSTART.md     - Quick setup guide
echo    - DEPLOYMENT.md     - Deploy to Vercel
echo ================================================
echo.
echo Happy coding! 🚀
echo.
pause