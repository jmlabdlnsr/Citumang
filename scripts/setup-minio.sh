#!/usr/bin/env bash
# scripts/setup-minio.sh
#
# Buat bucket "citumang" di MinIO dan set policy public-read.
# Jalankan SEKALI setelah MinIO pertama kali berjalan di CT 102 (atau dev).
#
# Prasyarat: mc (MinIO Client) tersedia di PATH
#   Install: https://min.io/docs/minio/linux/reference/minio-mc.html
#   Atau via Docker: docker run -it --rm --entrypoint mc minio/mc ...
#
# Penggunaan:
#   chmod +x scripts/setup-minio.sh
#   MINIO_ENDPOINT=10.10.10.12:9002 \
#   MINIO_ACCESS_KEY=<key> \
#   MINIO_SECRET_KEY=<secret> \
#   MINIO_BUCKET=citumang \
#   bash scripts/setup-minio.sh

set -euo pipefail

ENDPOINT="${MINIO_ENDPOINT:-localhost:9002}"
ACCESS_KEY="${MINIO_ACCESS_KEY:-minioadmin}"
SECRET_KEY="${MINIO_SECRET_KEY:-minioadmin-local}"
BUCKET="${MINIO_BUCKET:-citumang}"
USE_SSL="${MINIO_USE_SSL:-false}"

SCHEME="http"
if [ "$USE_SSL" = "true" ]; then
  SCHEME="https"
fi

echo "→ Mengonfigurasi MinIO client..."
mc alias set citumang-minio "$SCHEME://$ENDPOINT" "$ACCESS_KEY" "$SECRET_KEY"

echo "→ Membuat bucket '$BUCKET' (jika belum ada)..."
mc mb --ignore-existing "citumang-minio/$BUCKET"

echo "→ Menerapkan policy download (public-read) untuk path media..."
# Hanya folder gallery/ yang public — artikel/paket bisa ditambahkan sesuai kebutuhan
mc anonymous set download "citumang-minio/$BUCKET/gallery"

echo "→ Verifikasi..."
mc ls "citumang-minio/$BUCKET"
mc anonymous info "citumang-minio/$BUCKET/gallery"

echo ""
echo "✅ Setup MinIO selesai."
echo "   Bucket  : $BUCKET"
echo "   Endpoint: $SCHEME://$ENDPOINT"
echo "   Upload URL contoh: $SCHEME://$ENDPOINT/$BUCKET/gallery/<uuid>.jpg"
