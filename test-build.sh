#!/bin/bash
# Quick deployment test script

echo "🧪 Testing production build locally..."

# Build the project
echo "📦 Building Next.js and compiling server..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    echo "📋 Deployment Checklist:"
    echo "  [ ] .env file NOT in git (check .gitignore)"
    echo "  [ ] dist/ folder NOT in git (check .gitignore)"
    echo "  [ ] All dependencies in package.json"
    echo "  [ ] Socket.IO uses dynamic URL"
    echo "  [ ] Server uses process.env.PORT"
    echo ""
    echo "🚀 Ready to deploy to Render!"
    echo ""
    echo "Next steps:"
    echo "  1. Push to GitHub: git push origin main"
    echo "  2. Go to https://dashboard.render.com"
    echo "  3. Create New Web Service"
    echo "  4. Connect your repo"
    echo "  5. Add environment variables"
    echo "  6. Deploy!"
else
    echo "❌ Build failed - fix errors before deploying"
    exit 1
fi
