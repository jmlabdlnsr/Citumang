# scripts/setup-minio.ps1
#
# Versi PowerShell dari setup-minio.sh untuk dev Windows
# Buat bucket "citumang" di MinIO dan set policy public-read.
#
# Prasyarat: mc.exe tersedia di PATH
#   Download: https://dl.min.io/client/mc/release/windows-amd64/mc.exe
#   Taruh di folder PATH atau di direktori proyek
#
# Penggunaan dari PowerShell:
#   $env:MINIO_ENDPOINT="localhost:9002"
#   $env:MINIO_ACCESS_KEY="minioadmin"
#   $env:MINIO_SECRET_KEY="minioadmin-local"
#   $env:MINIO_BUCKET="citumang"
#   .\scripts\setup-minio.ps1

$Endpoint   = $env:MINIO_ENDPOINT   ?? "localhost:9002"
$AccessKey  = $env:MINIO_ACCESS_KEY ?? "minioadmin"
$SecretKey  = $env:MINIO_SECRET_KEY ?? "minioadmin-local"
$Bucket     = $env:MINIO_BUCKET     ?? "citumang"
$UseSSL     = $env:MINIO_USE_SSL    ?? "false"

$Scheme = if ($UseSSL -eq "true") { "https" } else { "http" }

Write-Host "→ Mengonfigurasi MinIO client alias..."
mc alias set citumang-minio "$Scheme`://$Endpoint" $AccessKey $SecretKey

Write-Host "→ Membuat bucket '$Bucket' (jika belum ada)..."
mc mb --ignore-existing "citumang-minio/$Bucket"

Write-Host "→ Menerapkan policy public-read untuk gallery/..."
mc anonymous set download "citumang-minio/$Bucket/gallery"

Write-Host "→ Verifikasi..."
mc ls "citumang-minio/$Bucket"
mc anonymous info "citumang-minio/$Bucket/gallery"

Write-Host ""
Write-Host "✅ Setup MinIO selesai."
Write-Host "   Bucket  : $Bucket"
Write-Host "   Endpoint: $Scheme`://$Endpoint"
Write-Host "   Contoh URL: $Scheme`://$Endpoint/$Bucket/gallery/<uuid>.jpg"
