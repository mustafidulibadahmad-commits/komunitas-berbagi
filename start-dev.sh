#!/bin/bash

# Script untuk memastikan Node.js yang benar digunakan sebelum menjalankan dev server

echo "🚀 Starting development server..."
echo ""

# Pastikan menggunakan Node.js yang benar
if [ -d "$HOME/nodejs-18/node-v18.20.8-linux-x64/bin" ]; then
    export PATH="$HOME/nodejs-18/node-v18.20.8-linux-x64/bin:$PATH"
    echo "✅ Using Node.js from ~/nodejs-18/node-v18.20.8-linux-x64"
else
    echo "⚠️  Warning: Node.js 18.20.8 not found in ~/nodejs-18/"
    echo "   Make sure Node.js 18.20.8 is installed"
fi

# Verifikasi versi
NODE_VERSION=$(node --version)
echo "📦 Node.js version: $NODE_VERSION"
echo ""

# Test optional chaining
if node -e "const test = {a: {b: 1}}?.a?.b; console.log(test)" > /dev/null 2>&1; then
    echo "✅ Optional chaining is supported"
else
    echo "❌ ERROR: Optional chaining is NOT supported!"
    echo "   Your Node.js version is too old. Please use Node.js 18.17.0 or higher."
    exit 1
fi

echo ""
echo "▶️  Starting Next.js dev server..."
echo ""

# Jalankan npm run dev
npm run dev
