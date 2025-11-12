#!/bin/sh # Используем POSIX sh для совместимости внутри контейнера
set -eu # e: завершать при ошибке; u: ошибка при обращении к неустановленной переменной

echo "[minio-setup] Waiting for MinIO to be ready..." # информируем о старте ожидания
try=0 # счётчик попыток подключения
until mc alias set local http://minio:9000 "${MINIO_ROOT_USER}" "${MINIO_ROOT_PASSWORD}" >/dev/null 2>&1; do # пытаемся настроить алиас mc на MinIO
  try=$((try+1)) # инкрементируем счётчик
  if [ "$try" -gt 60 ]; then # если больше 60 попыток (около 60 секунд ожидания)
    echo "[minio-setup] MinIO not ready after 60s, exiting." # сообщение о таймауте
    exit 1 # завершаем с ошибкой
  fi
  sleep 1 # ждём 1 секунду перед следующей попыткой
done
echo "[minio-setup] MinIO is ready." # MinIO доступен — продолжаем

echo "[minio-setup] Running setup-uploads..."
sh /setup-uploads.sh

# echo "[minio-setup] Running setup-backups..."
# sh /setup-backups.sh

echo "[minio-setup] Done." # завершили инициализацию


