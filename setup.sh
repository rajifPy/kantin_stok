#!/bin/bash

# Kantin Sekolah - Auto Setup Script
# This script will help you set up the project automatically

echo "================================================"
echo "🏪 Kantin Sekolah - Auto Setup"
echo "================================================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Node.js is installed
echo "Checking Node.js installation..."
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed!${NC}"
    echo "Please install Node.js 18+ from https://nodejs.org"
    exit 1
fi

NODE_VERSION=$(node -v)
echo -e "${GREEN}✅ Node.js ${NODE_VERSION} found${NC}"
echo ""

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not installed!${NC}"
    exit 1
fi

NPM_VERSION=$(npm -v)
echo -e "${GREEN}✅ npm ${NPM_VERSION} found${NC}"
echo ""

# Install dependencies
echo "================================================"
echo "📦 Installing dependencies..."
echo "================================================"
npm install

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to install dependencies${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Dependencies installed${NC}"
echo ""

# Create necessary directories
echo "================================================"
echo "📁 Creating directories..."
echo "================================================"

mkdir -p public/barcodes
mkdir -p supabase

echo -e "${GREEN}✅ Directories created${NC}"
echo ""

# Create .gitkeep for barcodes folder
touch public/barcodes/.gitkeep

# Setup environment variables
echo "================================================"
echo "🔐 Setting up environment variables..."
echo "================================================"

if [ ! -f .env.local ]; then
    if [ -f .env.example ]; then
        cp .env.example .env.local
        echo -e "${GREEN}✅ .env.local created from .env.example${NC}"
        echo ""
        echo -e "${YELLOW}⚠️  IMPORTANT: Edit .env.local with your Supabase credentials${NC}"
        echo ""
    else
        echo -e "${RED}❌ .env.example not found${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  .env.local already exists, skipping...${NC}"
fi

echo ""

# Check if Supabase schema exists
if [ -f supabase/schema.sql ]; then
    echo -e "${GREEN}✅ Supabase schema found${NC}"
else
    echo -e "${YELLOW}⚠️  Supabase schema not found at supabase/schema.sql${NC}"
fi

echo ""
echo "================================================"
echo "✅ Setup Complete!"
echo "================================================"
echo ""
echo "Next steps:"
echo ""
echo "1. Setup Supabase:"
echo "   - Create account at https://supabase.com"
echo "   - Create new project"
echo "   - Run supabase/schema.sql in SQL Editor"
echo "   - Copy API keys to .env.local"
echo ""
echo "2. Edit .env.local:"
echo "   nano .env.local"
echo ""
echo "3. Run development server:"
echo "   npm run dev"
echo ""
echo "4. Open browser:"
echo "   http://localhost:3000"
echo ""
echo "5. Login with:"
echo "   Username: admin"
echo "   Password: admin123"
echo ""
echo "================================================"
echo "📚 Documentation:"
echo "   - README.md         - Full documentation"
echo "   - QUICKSTART.md     - Quick setup guide"
echo "   - DEPLOYMENT.md     - Deploy to Vercel"
echo "================================================"
echo ""
echo -e "${GREEN}Happy coding! 🚀${NC}"