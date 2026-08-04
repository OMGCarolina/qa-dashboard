#!/bin/bash

# Post-build script que elimina el KV namespace del wrangler.json generado
# Esto evita que Cloudflare Pages intente crear un nuevo KV namespace

if [ -f "dist/server/wrangler.json" ]; then
  echo "🔧 Removing KV namespace from generated wrangler.json..."
  cat dist/server/wrangler.json | jq 'del(.kv_namespaces)' > /tmp/wrangler.json
  mv /tmp/wrangler.json dist/server/wrangler.json
  echo "✅ KV namespace removed"
fi
