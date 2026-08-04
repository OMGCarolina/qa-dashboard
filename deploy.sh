#!/bin/bash

# Deploy script que arregla el KV namespace automáticamente

set -e

echo "🔨 Building..."
npm run build

echo "🔧 Fixing KV namespace ID..."
cat dist/server/wrangler.json | jq '.kv_namespaces = [{"binding": "SESSION", "id": "4893a057fef54574a19c235e8c029473"}]' > /tmp/wrangler.json
mv /tmp/wrangler.json dist/server/wrangler.json

echo "🚀 Deploying..."
npx wrangler deploy

echo "✅ Deploy complete!"
