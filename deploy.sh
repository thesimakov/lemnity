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

echo "==> Cleanup old versions of server and collector images"
# Получаем ID текущего образа сервера и удаляем все остальные(устаревшие)
CURRENT_SERVER_ID=$(docker images -q ghcr.io/${REPOSITORY_OWNER}/server:${IMAGE_TAG})
docker images ghcr.io/${REPOSITORY_OWNER}/server --format "{{.ID}}" | grep -v "${CURRENT_SERVER_ID}" | xargs -r docker rmi -f
# Получаем ID текущего образа коллектора и удаляем все остальные(устаревшие)
CURRENT_COLLECTOR_ID=$(docker images -q ghcr.io/${REPOSITORY_OWNER}/collector:${IMAGE_TAG})
docker images ghcr.io/${REPOSITORY_OWNER}/collector --format "{{.ID}}" | grep -v "${CURRENT_COLLECTOR_ID}" | xargs -r docker rmi -f

echo "==> Cleanup unused images"
docker image prune -f



