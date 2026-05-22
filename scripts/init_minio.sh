#!/usr/bin/env sh
set -e

MINIO_ROOT_USER=${MINIO_ROOT_USER:-minioadmin}
MINIO_ROOT_PASSWORD=${MINIO_ROOT_PASSWORD:-minioadmin}
MINIO_BUCKET=${MINIO_BUCKET:-aquapay-media}

printf "Waiting for MinIO to be ready...\n"
until docker compose exec minio mc ls minio >/dev/null 2>&1; do
  sleep 1
  printf "."
done
printf "\nConfiguring bucket %s\n" "$MINIO_BUCKET"

docker compose run --rm --no-deps -e MINIO_ROOT_USER -e MINIO_ROOT_PASSWORD minio/mc sh -c \
  "mc alias set minio http://minio:9000 $MINIO_ROOT_USER $MINIO_ROOT_PASSWORD && mc mb --ignore-existing minio/$MINIO_BUCKET && mc policy set public minio/$MINIO_BUCKET"

printf "Bucket %s configured with public policy.\n" "$MINIO_BUCKET"
