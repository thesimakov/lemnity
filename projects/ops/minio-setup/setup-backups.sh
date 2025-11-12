#!/bin/sh
set -eu

echo "[minio-setup/backups] Creating bucket 'backups'..."
mc mb -p local/backups || true

echo "[minio-setup/backups] Creating backups-rw policy..."
cat >/tmp/backups-rw.json <<'EOF'
{
  "Version": "2012-10-17",
  "Statement": [
    { "Effect": "Allow", "Action": ["s3:ListBucket"], "Resource": ["arn:aws:s3:::backups"] },
    { "Effect": "Allow", "Action": ["s3:PutObject","s3:GetObject","s3:DeleteObject"], "Resource": ["arn:aws:s3:::backups/*"] }
  ]
}
EOF
mc admin policy create local backups-rw /tmp/backups-rw.json || true

if [ -n "${MINIO_BACKUP_ACCESS_KEY:-}" ] && [ -n "${MINIO_BACKUP_SECRET_KEY:-}" ]; then
  echo "[minio-setup/backups] Ensuring backup user exists and has backups-rw..."
  mc admin user add local "${MINIO_BACKUP_ACCESS_KEY}" "${MINIO_BACKUP_SECRET_KEY}" || true
  mc admin policy attach local backups-rw --user "${MINIO_BACKUP_ACCESS_KEY}" || true
fi

echo "[minio-setup/backups] Done."


