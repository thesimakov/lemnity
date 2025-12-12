#!/usr/bin/env bash
set -euo pipefail

IMAGE_TAG="${1:-}"
REPOSITORY_OWNER="${2:-}"

if [ -z "${IMAGE_TAG}" ] || [ -z "${REPOSITORY_OWNER}" ]; then
  echo "Usage: $0 <IMAGE_TAG> <REPOSITORY_OWNER>"
  exit 1
fi

export IMAGE_TAG
export REPOSITORY_OWNER

echo "==> Pull images defined in docker-compose.prod.yml"
docker compose -f docker-compose.prod.yml pull

echo "==> Ensure postgres is up (DB for migrations)"
docker compose -f docker-compose.prod.yml up -d postgres

echo "==> Apply Prisma migrations (if any)"
docker compose -f docker-compose.prod.yml run --rm server \
  pnpm --filter @lemnity/database exec prisma migrate deploy

echo "==> Start / update full stack (server + nginx + infra) with recreate"
docker compose -f docker-compose.prod.yml up -d --force-recreate --remove-orphans

echo "==> Run MinIO setup profile (creates buckets/users)"
docker compose -f docker-compose.prod.yml --profile setup run --rm minio_setup

echo "==> Cleanup unused images"
docker image prune -f



