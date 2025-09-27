# scripts/generate-api.sh
#!/usr/bin/env bash
set -euo pipefail

pnpm dlx @openapitools/openapi-generator-cli generate \
  -g typescript-axios \
  -i http://localhost:3000/docs-json \
  -o packages/api-sdk \
  -p withSeparateModelsAndApi=true \
  -p apiPackage=apis \
  -p modelPackage=models \
  -p modelPropertyNaming=original \
  -p useSingleRequestParameter=true \
  -p supportsES6=true \
  -p enumPropertyNaming=original