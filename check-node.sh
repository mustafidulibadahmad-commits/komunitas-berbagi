#!/bin/bash

REQUIRED_VERSION="18.17.0"
CURRENT_VERSION=$(node --version | sed 's/v//')

echo "Checking Node.js version..."
echo "Current: $CURRENT_VERSION"
echo "Required: >= $REQUIRED_VERSION"

if [ "$(printf '%s\n' "$REQUIRED_VERSION" "$CURRENT_VERSION" | sort -V | head -n1)" != "$REQUIRED_VERSION" ]; then
    echo "❌ Node.js version is too old!"
    echo "Please use Node.js $REQUIRED_VERSION or higher"
    echo ""
    echo "If you have Node.js 18 installed in ~/nodejs-18, run:"
    echo "export PATH=\"\$HOME/nodejs-18/node-v18.20.8-linux-x64/bin:\$PATH\""
    exit 1
else
    echo "✅ Node.js version is OK"
    exit 0
fi
