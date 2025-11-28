#!/usr/bin/env bash
set -euo pipefail

# Если передан JSON, распарсим и экспортируем ключи
if [ -n "${ALL_SECRETS_JSON:-}" ]; then
  if ! command -v jq &> /dev/null; then
    echo "❌ jq could not be found. Please install it."
    exit 1
  fi
  eval "$(echo "$ALL_SECRETS_JSON" | jq -r 'to_entries|map("export \(.key)=\(.value|@sh)")|.[]')"
fi

REQUIRED_VARS=(
  COMPOSE_PROJECT_NAME
  NODE_ENV
  HOST
  PORT
  JWT_SECRET
  POSTGRES_USER
  POSTGRES_PASSWORD
  POSTGRES_DB
  POSTGRES_HOST
  POSTGRES_PORT
  DATABASE_URL
  API_URL
  MINIO_ROOT_USER
  MINIO_ROOT_PASSWORD
  MINIO_APP_ACCESS_KEY
  MINIO_APP_SECRET_KEY
  MINIO_PORT
  MINIO_CONSOLE_PORT
  S3_ENDPOINT
  S3_REGION
  S3_ACCESS_KEY
  S3_SECRET_KEY
  S3_BUCKET_UPLOADS
  S3_PUBLIC_BASE_URL
)

for var in "${REQUIRED_VARS[@]}"; do
  if [ -z "${!var:-}" ]; then
    echo "❌ Missing or empty $var"
    exit 1
  fi
done

echo "✅ All secrets present"
