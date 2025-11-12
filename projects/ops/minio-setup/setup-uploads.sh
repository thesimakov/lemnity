#!/bin/sh
set -eu

echo "[minio-setup/uploads] Creating bucket 'uploads'..."
mc mb -p local/uploads || true

echo "[minio-setup/uploads] Creating uploads-rw policy..."
cat >/tmp/uploads-rw.json <<'EOF'
{
  "Version": "2012-10-17",
  "Statement": [
    { "Effect": "Allow", "Action": ["s3:ListBucket"], "Resource": ["arn:aws:s3:::uploads"] },
    { "Effect": "Allow", "Action": ["s3:PutObject","s3:GetObject","s3:DeleteObject"], "Resource": ["arn:aws:s3:::uploads/*"] }
  ]
}
EOF
mc admin policy create local uploads-rw /tmp/uploads-rw.json || true

if [ -n "${MINIO_APP_ACCESS_KEY:-}" ] && [ -n "${MINIO_APP_SECRET_KEY:-}" ]; then
  echo "[minio-setup/uploads] Ensuring app user exists and has uploads-rw..."
  mc admin user add local "${MINIO_APP_ACCESS_KEY}" "${MINIO_APP_SECRET_KEY}" || true
  mc admin policy attach local uploads-rw --user "${MINIO_APP_ACCESS_KEY}" || true
fi

echo "[minio-setup/uploads] Enabling anonymous download for 'uploads'..."
mc anonymous set download local/uploads || true

echo "[minio-setup/uploads] Done."


