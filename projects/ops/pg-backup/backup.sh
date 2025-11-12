#!/usr/bin/env bash
set -euo pipefail

: "${PGHOST:?PGHOST is required}"
: "${PGUSER:?PGUSER is required}"
: "${PGPASSWORD:?PGPASSWORD is required}"
: "${PGDATABASE:?PGDATABASE is required}"
: "${AWS_ENDPOINT_URL:?AWS_ENDPOINT_URL is required}"

timestamp="$(date +%F_%H%M)"
object="s3://backups/postgres/db_${timestamp}.sql.gz"

echo "[pg-backup] Starting backup to ${object}"
pg_dump -h "${PGHOST}" -U "${PGUSER}" -d "${PGDATABASE}" -F c \
  | gzip \
  | aws s3 cp - "${object}" --endpoint-url "${AWS_ENDPOINT_URL}" --no-progress
echo "[pg-backup] Done"


