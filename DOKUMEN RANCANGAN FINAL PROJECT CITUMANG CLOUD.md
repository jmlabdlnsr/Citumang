# DOKUMEN RANCANGAN FINAL PROJECT — KOMPUTASI AWAN
 
**Kelompok 11 · Informatika Semester 5 · Universitas Siliwangi**
**Dosen Pengampu:** Reza Febriana, S.Kom., M.Kom., CEH.
**Tanggal dokumen:** 22 November 2026
**Status:** Draft rancangan — menunggu persetujuan kelompok
 
---
 
## Keterangan status informasi
 
Sepanjang dokumen ini digunakan empat penanda:
 
- **[VERIFIED]** — sudah dibuktikan lewat output perintah atau konfigurasi aktual
- **[PLANNED]** — sudah diputuskan, belum diimplementasikan
- **[PROPOSED]** — usulan yang masih bisa dikoreksi kelompok
- **[OPEN]** — belum diputuskan, perlu jawaban
---
 
## 1. Latar Belakang dan Tujuan
 
### 1.1 Mengapa proyek ini ada
 
Final project ini merupakan kelanjutan langsung dari implementasi UTS Komputasi Awan, di mana kelompok telah membangun infrastruktur IaaS berbasis Proxmox VE dengan tiga Linux Container, jaringan internal virtual, NAT, dan Cloudflare Tunnel sebagai jalur akses eksternal.
 
Pada UTS, infrastruktur tersebut hanya menjalankan halaman statis sederhana. Tujuan final project adalah **menjadikan infrastruktur itu menopang sebuah layanan nyata**, sehingga hubungan antara ketiga model layanan cloud dapat ditunjukkan secara konkret, bukan sekadar dijelaskan secara teoritis.
 
### 1.2 Produk yang dibangun
 
Website destinasi wisata **Citumang** (Parigi, Pangandaran, Jawa Barat) yang terdiri dari situs publik dua bahasa, modul reservasi, dan dashboard administrator.
 
Aplikasi ini adalah lapisan SaaS. Infrastruktur dan platform yang menopangnya merupakan bagian yang sama pentingnya dalam penilaian proyek.
 
### 1.3 Tujuan
 
1. Membangun ekosistem layanan cloud yang mengintegrasikan IaaS, PaaS, dan SaaS di atas infrastruktur yang dimiliki sendiri
2. Menyediakan aplikasi yang dapat diakses pengguna melalui browser dari jaringan publik
3. Mengevaluasi kinerja server berbasis container di bawah beban request yang bervariasi
4. Menghasilkan dokumentasi implementasi yang dapat diverifikasi dan dipertanggungjawabkan secara akademik
### 1.4 Landasan akademik
 
Definisi dan karakteristik cloud computing mengacu pada **NIST SP 800-145**, khususnya lima karakteristik esensial (on-demand self-service, broad network access, resource pooling, rapid elasticity, measured service) dan tiga model layanan (IaaS, PaaS, SaaS).
 
---
 
## 2. Goals, Non-Goals, dan Anti-Goals
 
### 2.1 Goals
 
- Ketiga lapisan layanan memiliki komponen, fungsi, dan bukti implementasi yang dapat didemonstrasikan terpisah
- Aplikasi berjalan di infrastruktur kelompok sendiri dan dapat diakses dari internet
- Data reservasi, konten, dan akun tersimpan di database yang dikelola kelompok
- Seluruh layanan terkontainerisasi sehingga terukur melalui monitoring
- Pengujian performa menghasilkan angka nyata yang dapat dikorelasikan antara beban, konsumsi resource container, dan waktu respons
- Seluruh konfigurasi tersimpan sebagai file deklaratif di repository, sehingga infrastruktur dapat dipulihkan tanpa mengandalkan ingatan satu orang
### 2.2 Non-Goals
 
Hal-hal berikut secara sadar **tidak** dikerjakan:
 
- Payment gateway dan transaksi pembayaran
- Notifikasi email otomatis
- Aplikasi mobile native
- Fitur real-time (WebSocket, live chat)
- Multi-tenancy
- Hosting video mandiri — video galeri menggunakan embed pihak ketiga
- Modul Manajemen Beranda, Pengaturan SEO, dan Pengaturan Website pada dashboard admin — alasan lengkap di **§6.3**
- Registrasi dan akun untuk pengunjung — pengunjung situs bersifat anonim; hanya pengelola yang memiliki akun (lihat **§6.5**)
### 2.3 Anti-Goals
 
Kondisi berikut akan dianggap kegagalan proyek **meskipun aplikasinya berjalan**:
 
- Aplikasi di-deploy ke penyedia cloud pihak ketiga (Vercel, Supabase, dan sejenisnya), karena itu menghilangkan seluruh lapisan IaaS dan PaaS yang menjadi inti penilaian
- Aplikasi selesai tetapi tidak pernah diuji beban, sehingga tidak ada data evaluasi kinerja
- Hanya satu anggota yang memahami infrastruktur
- Angka performa dalam laporan tidak berasal dari pengukuran aktual
---
 
## 3. Kondisi Infrastruktur Aktual
 
Seluruh data pada bagian ini **[VERIFIED]** melalui output perintah pada 22 November 2026.
 
### 3.1 Proxmox Host
 
| Parameter | Nilai |
|---|---|
| Hypervisor | Proxmox VE 9.2.2 |
| Kernel | Linux 7.0.2-6-pve |
| Processor | Intel Core i3-6006U @ 2.00 GHz (2 core fisik, 4 thread) |
| RAM total | 3,6 GiB |
| RAM terpakai | 1,9 GiB |
| RAM tersedia | 1,7 GiB |
| Swap | 4,0 GiB (0 B terpakai) |
| Storage | ±931,5 GiB |
| Hostname | pve |
 
### 3.2 Container
 
| CT | Hostname | IP | RAM | Terpakai | Tersedia | Layanan aktif |
|---|---|---|---|---|---|---|
| 101 | app-node | 10.10.10.11 | 1,5 GiB | 262 MiB | 1,2 GiB | Docker, Portainer, Prometheus, cAdvisor |
| 102 | db-node | 10.10.10.12 | 1,0 GiB | 94 MiB | 929 MiB | MariaDB 10.6.23, Postfix |
| 103 | proxy-node | 10.10.10.13 | 1,0 GiB | 52 MiB | 971 MiB | cloudflared (57,8 MiB) |
 
**Catatan koreksi:** RAM CT 101 aktual adalah **1,5 GiB**, bukan 1 GiB seperti tercatat pada dokumentasi sebelumnya. Dokumentasi lama perlu diperbarui agar konsisten dengan laporan akhir.
 
### 3.3 Jaringan
 
| Parameter | Nilai |
|---|---|
| Interface upstream | nic0 — 192.168.100.64/24 |
| Gateway upstream | 192.168.100.1 |
| Virtual bridge | vmbr0 — 10.10.10.1/24 |
| Subnet internal | 10.10.10.0/24 |
| Default gateway ketiga CT | 10.10.10.1 (Proxmox Host) |
| NAT dan IP forwarding | Ditangani Proxmox Host |
| Akses masuk | Cloudflare Tunnel via cloudflared di CT 103 |
 
CT 103 **bukan** default gateway bagi CT 101 dan CT 102. Ia hanya menangani jalur masuk dari Cloudflare.
 
### 3.4 Temuan yang harus diperbaiki
 
| No | Temuan | Dampak | Status |
|---|---|---|---|
| 1 | Container dibuat ad-hoc via `docker run`, tanpa definisi tertulis | Infrastruktur tidak dapat dipulihkan atau direproduksi | Diperbaiki oleh §5 |
| 2 | Grafana `RestartPolicy: "no"` — mati setelah reboot dan tidak naik lagi | Layanan hilang tanpa disadari | Diperbaiki oleh §5 |
| 3 | Image tanpa tag versi (`latest`) kecuali cAdvisor | Hasil pengujian tidak reprodusibel | Diperbaiki oleh §5 |
| 4 | Lima container sisa tugas sebelumnya (3× hello-world, grafana lama, web2) | Kebersihan; membingungkan saat demo | Dibersihkan saat migrasi |
| 5 | Postfix berjalan di server database | Layanan tidak perlu dengan listener jaringan; melanggar least privilege | `systemctl disable --now postfix` |
| 6 | Nginx di CT 101 masih container demo, bukan reverse proxy | Belum ada routing layer | Dibangun ulang di §5 |
 
**Yang terbukti TIDAK bermasalah:** tidak ditemukan indikasi tekanan memori di node mana pun. Swap nol terpakai di seluruh node. Grafana yang mati terbukti bukan karena OOM (`OOMKilled: false` pada kedua container), melainkan karena tidak adanya restart policy.
 
---
 
## 4. Alternatif yang Dipertimbangkan
 
### 4.1 Lapisan PaaS
 
| Pendekatan | Isi | Klaim PaaS | Risiko | Keputusan |
|---|---|---|---|---|
| **A** | Docker + Portainer + Nginx + database service | Sedang | Rendah | **Dipilih**, digabung elemen C |
| **B** | PaaS self-hosted (Coolify / Dokploy / CapRover) | Kuat | **Tinggi** | Ditolak |
| **C** | Platform minimal buatan sendiri (compose + pipeline) | Kuat | Sedang | Elemen pipeline diambil |
 
**Alasan menolak B:** Coolify dan Dokploy umumnya menuntut ±2 GB RAM hanya untuk platformnya. Host hanya memiliki 1,7 GiB tersedia yang masih harus menanggung aplikasi, database, object storage, dan monitoring. CapRover lebih ringan tetapi menambahkan Docker Swarm sebagai lapisan kerumitan baru. Kegagalan di tengah pengerjaan berbiaya tinggi mengingat waktu yang terbatas.
 
**Alasan memilih A + elemen C:** Portainer, Prometheus, dan cAdvisor sudah terpasang dan berjalan **[VERIFIED]**, sehingga separuh lapisan platform sudah ada. Kelemahan klaim PaaS pada pendekatan A ditutup dengan menambahkan pipeline deployment berbasis Git (elemen dari C), tanpa biaya RAM tambahan karena memanfaatkan Portainer Stack yang sudah tersedia.
 
### 4.2 Database
 
| Alternatif | Pertimbangan | Keputusan |
|---|---|---|
| MariaDB 10.6.23 native (eksisting) | Sudah terpasang, tetapi **kosong** — belum ada database maupun akses | Dihentikan |
| PostgreSQL dalam container | Dua anggota kelompok sudah pernah menggunakannya | **Dipilih** |
 
Rekomendasi awal untuk mempertahankan MariaDB bertumpu pada asumsi bahwa instalasi tersebut sudah membawa data dan konfigurasi. Asumsi itu gugur setelah diverifikasi bahwa instalasinya masih kosong.
 
Faktor penentu kedua: **database akan dikontainerisasi apa pun pilihannya.** Jika database berjalan native sementara seluruh layanan lain dalam container, database menjadi satu-satunya komponen yang tidak terbaca oleh cAdvisor dan Grafana — padahal pada aplikasi seperti ini database umumnya menjadi bottleneck pertama. Karena instalasi native akan diganti dalam skenario mana pun, biaya memilih PostgreSQL menjadi mendekati nol.
 
### 4.3 Object Storage
 
| Alternatif | Biaya | Nilai akademik | Keputusan |
|---|---|---|---|
| Volume persisten + Nginx | ±0 MiB | Rendah | Ditolak |
| MinIO (S3-compatible) | ±250 MiB | Menyediakan komponen storage yang eksplisit untuk bab IaaS | **Dipilih** |
 
NIST SP 800-145 menempatkan storage sebagai salah satu sumber daya fundamental yang disediakan IaaS. MinIO memberi kelompok komponen penyimpanan objek yang berdiri sendiri, terkontainerisasi, dan karenanya ikut terukur dalam monitoring. Dengan 1,7 GiB tersedia di host, biayanya terjangkau.
 
### 4.4 Lokasi build aplikasi
 
| Alternatif | Pertimbangan | Keputusan |
|---|---|---|
| Build di CT 101 | `next build` menuntut 1–2 GB RAM; CT 101 hanya 1,5 GiB dengan swap 512 MiB di atas i3-6006U | Ditolak |
| Build di GitHub Actions → GHCR | CT 101 hanya menarik image jadi; sekaligus menjadi pipeline deployment yang dapat didemonstrasikan | **Dipilih** |
 
Egress internet dari CT 101 **[VERIFIED]** — seluruh image yang berjalan saat ini ditarik dari registry publik.
 
---
 
## 5. Rancangan Arsitektur
 
### 5.1 Pembagian peran node
 
| Node | Peran | Alasan |
|---|---|---|
| **CT 101** app-node | Aplikasi + pengumpulan metrik | Node yang menjadi target pengujian beban; dijaga tetap ramping |
| **CT 102** db-node | Data tier: database + object storage | Memisahkan beban data dari node yang diuji |
| **CT 103** proxy-node | Edge + observability | Beban ringan; Grafana dipindah ke sini agar tidak mencemari pengukuran |
 
### 5.2 Komposisi layanan
 
**CT 101 — app-node (10.10.10.11)** `[PLANNED]`
 
| Layanan | Port | Eksposur | Perkiraan RAM |
|---|---|---|---|
| Nginx reverse proxy | 80 | Publik via tunnel | ±20 MiB |
| Next.js (image dari GHCR) | 3000 | Internal container saja | ±250 MiB |
| Portainer CE (server) | 9000 | LAN saja | ±100 MiB |
| Prometheus | 9090 | LAN saja | ±200 MiB |
| cAdvisor | 8081 | LAN saja | ±80 MiB |
| node_exporter | 9100 | LAN saja | ±15 MiB |
 
**CT 102 — db-node (10.10.10.12)** `[PLANNED]`
 
| Layanan | Port | Eksposur | Perkiraan RAM |
|---|---|---|---|
| PostgreSQL | 5432 | Internal 10.10.10.0/24 saja | ±180 MiB |
| MinIO API | 9002 | Internal saja | ±250 MiB |
| MinIO Console | 9003 | LAN saja | — |
| Portainer Agent | 9001 | Internal saja | ±30 MiB |
| node_exporter | 9100 | LAN saja | ±15 MiB |
 
MinIO API sengaja tidak menggunakan port 9000 untuk menghindari bentrok dengan konvensi Portainer.
 
**CT 103 — proxy-node (10.10.10.13)** `[PLANNED]`
 
| Layanan | Port | Eksposur | Perkiraan RAM |
|---|---|---|---|
| cloudflared (native, systemd) | — | — | 58 MiB **[VERIFIED]** |
| Grafana | 3001 | LAN saja | ±300 MiB |
| Portainer Agent | 9001 | Internal saja | ±30 MiB |
| node_exporter | 9100 | LAN saja | ±15 MiB |
 
cloudflared tetap berjalan native dan **tidak diubah**. Ia sudah berfungsi; tidak ada alasan teknis untuk mengontainerkannya.
 
### 5.3 Proyeksi konsumsi memori
 
| Node | Sekarang | Setelah implementasi | Kapasitas | Margin |
|---|---|---|---|---|
| CT 101 | 262 MiB | ±550 MiB | 1,5 GiB | ±63% |
| CT 102 | 94 MiB | ±620 MiB | 1,0 GiB | ±38% |
| CT 103 | 52 MiB | ±500 MiB | 1,0 GiB | ±50% |
| **Host** | 1,9 GiB | ±2,6 GiB | 3,6 GiB | ±28% |
 
Angka "setelah implementasi" adalah **estimasi perencanaan, bukan hasil pengukuran**. Harus diverifikasi ulang setelah deployment dan angka aktualnya yang masuk ke laporan.
 
**Rekomendasi:** naikkan alokasi CT 102 dari 1,0 GiB menjadi 1,5 GiB (`pct set 102 -memory 1536`). Alokasi RAM pada LXC adalah batas atas berbasis cgroup, bukan reservasi — RAM tidak dipesan di muka. Total alokasi 4,0 GiB pada host 3,6 GiB adalah over-commit yang aman selama konsumsi gabungan aktual tetap di bawah kapasitas, dengan swap 4 GiB sebagai jaring pengaman. Kondisi ini justru layak dijelaskan di laporan sebagai praktik resource pooling.
 
Setiap service pada compose file **wajib** memiliki batas memori eksplisit, agar tidak ada satu layanan pun yang dapat membengkak dan menjatuhkan node.
 
### 5.4 Alur jaringan
 
```
                    Pengguna (browser)
                            |
                          HTTPS
                            |
                    Cloudflare Edge
                            |
                   Cloudflare Tunnel
                            |
              CT 103 — cloudflared (10.10.10.13)
                            |
                     HTTP internal
                            |
              CT 101 — Nginx :80 (10.10.10.11)
                            |
                +-----------+-----------+
                |                       |
        Next.js :3000            /media/* (proxy)
                |                       |
     +----------+----------+            |
     |                     |            |
PostgreSQL :5432      MinIO :9002  <----+
   (CT 102)             (CT 102)
```
 
**Aturan eksposur:** hanya Nginx di CT 101 yang dipublikasikan melalui Cloudflare Tunnel. Portainer, Grafana, Prometheus, cAdvisor, dan MinIO Console **tidak boleh** diekspos ke internet. Akses dilakukan dari jaringan lokal atau melalui SSH port-forward.
 
Jika saat presentasi Grafana perlu ditampilkan dari luar, gunakan Cloudflare Access sebagai lapisan autentikasi di depannya — jangan membuka route tunnel polos.
 
### 5.5 Pemetaan IaaS, PaaS, SaaS
 
| Lapisan | Komponen | Yang didemonstrasikan |
|---|---|---|
| **IaaS** | Proxmox VE 9.2.2; 3× LXC dengan alokasi CPU/RAM/storage; vmbr0 dan subnet 10.10.10.0/24; NAT dan IP forwarding; storage pool 931,5 GiB; akses SSH dan web UI Proxmox | Pembuatan dan penghapusan container; pengubahan alokasi resource; pengujian konektivitas antarnode; remote access; akses eksternal |
| **PaaS** | Docker Engine di tiga node; Portainer CE + Agent (pengelolaan multi-node); Portainer Stack dari Git; GitHub Actions + GHCR (pipeline deployment); PostgreSQL sebagai layanan database; MinIO sebagai layanan object storage; Nginx sebagai routing layer; environment variable, resource limit, restart policy | Deployment dari git push sampai service hidup; penambahan dan penghapusan service; konfigurasi runtime; pembacaan log; penegakan resource limit |
| **SaaS** | Aplikasi web Citumang: situs publik dua bahasa, modul reservasi, dashboard administrator | Registrasi dan login admin; CRUD konten; pengiriman reservasi oleh pengunjung; perubahan status reservasi; pergantian bahasa; akses multi-user dari browser |
 
Catatan penting untuk presentasi: **Docker bukan PaaS.** Yang menjadikan lapisan ini PaaS adalah kemampuan deployment, konfigurasi runtime, pengelolaan siklus hidup aplikasi, dan penyediaan layanan pendukung — bukan keberadaan Docker itu sendiri.
 
### 5.6 Ketetapan teknis tambahan
 
Hal-hal berikut ditetapkan agar pelaksana tidak perlu menebak. Semuanya `[PROPOSED]` dan boleh dikoreksi, tetapi harus diputuskan sebelum implementasi dimulai.
 
**TLS diterminasi di Cloudflare Edge, bukan di Nginx.** Lalu lintas dari cloudflared ke Nginx berjalan sebagai HTTP biasa di jaringan internal 10.10.10.0/24. Tidak perlu memasang sertifikat di CT 101. Pengguna tetap mengakses situs melalui HTTPS karena Cloudflare yang menanganinya di sisi edge. Ini perlu dijelaskan di bab keamanan agar tidak terbaca sebagai kelalaian.
 
**Jalur baca media.** Browser tidak pernah menghubungi MinIO secara langsung. Nginx di CT 101 mem-proxy `/media/*` ke MinIO di `10.10.10.12:9002`. Dengan begitu hanya ada satu origin publik, dan MinIO tetap tertutup dari internet. Jalur tulis berbeda: aplikasi Next.js mengunggah langsung ke MinIO melalui S3 API di jaringan internal.
 
**Endpoint health check: `/api/health`.** Mengembalikan status aplikasi beserta hasil tes koneksi ke PostgreSQL. Dipakai oleh `healthcheck` pada compose file dan sebagai verifikasi setelah deployment. Tanpa ini, pipeline tidak punya cara mengetahui apakah deployment berhasil.
 
**Versi Node.js mengikuti `.node-version` di repository** (saat ini 24.22.1) agar image produksi identik dengan lingkungan pengembangan.
 
**Data Portainer, PostgreSQL, MinIO, Grafana, dan Prometheus disimpan di named volume**, bukan di dalam container. Tanpa ini, satu kali `docker compose down` akan menghapus seluruh dashboard, data reservasi, dan file media.
 
**Target scrape Prometheus:** cAdvisor di CT 101 (`10.10.10.11:8081`) serta node_exporter di ketiga node (`:9100`). Aplikasi tidak mengekspos metrik sendiri dan tidak perlu dipaksa melakukannya — metrik per container dari cAdvisor sudah memadai untuk kebutuhan evaluasi.
 
---
 
## 6. Ruang Lingkup Dashboard Admin
 
Rancangan awal memuat sepuluh modul. Dokumen ini menetapkan **enam modul fungsional ditambah satu halaman ringkasan**. Seluruh bagian ini berstatus `[PROPOSED]`.
 
### 6.1 Prinsip pemangkasan
 
Setiap modul diuji dengan tiga pertanyaan:
 
1. Apakah modul ini mengubah sesuatu yang **dilihat pengunjung**?
2. Apakah ada yang benar-benar akan **memakainya** selama masa proyek?
3. Apakah dia menambah bobot untuk **penilaian komputasi awan**?
Jika ketiganya dijawab tidak, modul tersebut bukan fitur melainkan pekerjaan yang menghabiskan waktu tanpa menghasilkan sesuatu yang dinilai.
 
Prinsip yang mendasarinya: **setelah modul CRUD ketiga, modul berikutnya tidak membuktikan apa pun yang baru.** Lapisan SaaS sudah terbukti melalui autentikasi, akses multi-user, penyimpanan data, dan akses melalui browser. Modul admin kesepuluh membuktikan hal yang persis sama dengan modul admin ketiga, dengan biaya waktu yang jauh lebih besar.
 
Waktu yang dibebaskan dialihkan ke bagian yang dinilai: pipeline deployment, dashboard monitoring, pengujian beban, dan penyusunan laporan.
 
### 6.2 Modul yang dibangun
 
| Modul | Fungsi | Alasan dipertahankan |
|---|---|---|
| **Dashboard** (halaman ringkasan) | Jumlah reservasi menunggu, paket aktif, artikel terbit; daftar 5 reservasi terbaru | Murah (beberapa query COUNT) dan berdampak besar saat demo — angkanya berubah di layar ketika pengunjung mengirim reservasi, membuktikan seluruh rantai data mengalir |
| **Manajemen Paket Wisata** | CRUD paket, harga, durasi, fasilitas | Konten inti yang dilihat pengunjung dan menjadi acuan reservasi |
| **Manajemen Reservasi** | Daftar reservasi, ubah status, detail pemesan | Menjadikan judul proyek jujur; sekaligus menyediakan endpoint tulis database untuk skenario pengujian beban utama (§9.2 skenario C) |
| **Manajemen Galeri** | CRUD foto dan embed video | Konten yang berubah; terhubung ke MinIO sehingga membuktikan integrasi object storage |
| **Manajemen Artikel** | CRUD artikel dua bahasa, termasuk pengelolaan kategori di dalamnya | Konten yang berubah; mendukung skenario pengujian pencarian (§9.2 skenario D) |
| **Manajemen FAQ** | CRUD pertanyaan dan jawaban | Biaya sangat kecil; tampil di halaman Informasi |
| **Manajemen Akun Admin** | CRUD akun pengelola | Diperlukan untuk pengujian autentikasi dan akses multi-user |
 
### 6.3 Modul yang dicoret dan alasannya
 
**Manajemen Beranda — dicoret**
 
Beranda bukan konten yang berdiri sendiri. Bagian highlight-nya menarik dari modul lain: paket unggulan dari Manajemen Paket, foto dari Galeri, artikel terbaru dari Artikel. Yang benar-benar unik hanya teks hero dan paragraf pengenalan — beberapa kalimat yang realistis diubah sekali setahun.
 
Risiko yang lebih serius dari sekadar waktu: **dua sumber kebenaran.** Jika highlight paket dapat diatur manual melalui Manajemen Beranda sementara datanya juga berasal dari Manajemen Paket, terjadi ambiguitas yang berpotensi menjadi bug dan umumnya baru terdeteksi saat demo.
 
*Gantinya:* beranda menarik otomatis dari modul yang sudah ada — tiga paket dengan urutan teratas, enam foto terbaru, tiga artikel terbaru. Teks hero masuk ke data awal (seed).
 
**Manajemen Kategori Artikel — dilebur, bukan dihapus**
 
Fiturnya tetap ada. Tabel `artikel_kategori` tetap berada di skema (§7.2), kategori tetap tampil di situs publik, filter dan pencarian tetap berfungsi. Yang dihilangkan hanya halaman admin tersendiri untuk mengelolanya.
 
Kategori terdiri dari tiga kolom dan realistisnya akan berjumlah empat sampai enam, dibuat sekali di awal lalu tidak disentuh lagi. Modul tersendiri berarti route baru, halaman daftar, halaman tambah, halaman edit, konfirmasi hapus, dan penjaga autentikasi — untuk tabel berisi lima baris.
 
*Gantinya:* satu bagian kecil di dalam modul Artikel, atau di-seed langsung melalui migrasi.
 
**Pengaturan SEO — dicoret**
 
Dua alasan.
 
Pertama, sebagian besar kemampuannya sudah ada. Next.js menghasilkan metadata per halaman, dan repository saat ini sudah melakukannya — `src/app/[lang]/page.tsx` menangani metadata per bahasa dan `src/lib/messages.ts` sudah memuat key `metadata` untuk kedua bahasa **[VERIFIED]**. Membangun antarmuka untuk mengeditnya berarti menambah lapisan di atas sesuatu yang sudah berfungsi.
 
Kedua, SEO relevan untuk situs yang hidup berbulan-bulan, terindeks, dan bersaing memperebutkan trafik. Situs ini berjalan selama masa proyek dan satu sesi presentasi. Kontribusinya terhadap penilaian komputasi awan adalah nol.
 
*Jika nanti dibutuhkan:* cukup tambahkan kolom `meta_title` dan `meta_description` pada tabel artikel dan paket, tanpa modul pengaturan tersendiri.
 
**Pengaturan Website — dicoret**
 
Modul ini paling kabur definisinya, dan kekaburan itu sendiri merupakan peringatan. Dalam praktik, modul semacam ini berkembang menjadi keranjang serbaguna: nama situs, logo, kontak, media sosial, jam operasional, mode maintenance, zona waktu. Ruang lingkup yang tidak terdefinisi adalah ruang lingkup yang akan tumbuh.
 
Isinya pun sudah memiliki tempat masing-masing: kontak pengelola berada di `src/lib/site.ts` dan tampil di halaman Informasi; jam operasional, lokasi, dan rute merupakan konten halaman Informasi; logo diganti sekali selama proyek.
 
*Gantinya, dan ini menguntungkan:* nilai konfigurasi yang jarang berubah lebih tepat ditempatkan sebagai environment variable yang dikelola melalui Portainer. Dengan demikian pengelolaannya berpindah dari lapisan yang tidak dinilai ke lapisan yang dinilai — "konfigurasi runtime aplikasi dikelola melalui environment variable pada platform tanpa mengubah source code" merupakan kemampuan PaaS yang dapat didemonstrasikan (§5.5).
 
### 6.4 Catatan kejujuran
 
Dari enam modul yang dipertahankan, **FAQ adalah yang paling lemah justifikasinya.** Isinya jarang berubah dan sebenarnya dapat di-seed seperti kategori. Modul ini dipertahankan karena biayanya sangat kecil, tetapi apabila waktu menipis, **FAQ adalah kandidat pertama untuk dicoret berikutnya.**
 
Jika kelompok ingin mempertahankan salah satu modul yang dicoret, keputusan tersebut sah — tetapi harus diambil dengan kesadaran bahwa ada pekerjaan lain yang perlu mengalah, bukan ditambahkan di atas beban yang sudah ada.
 
### 6.5 Pemetaan modul admin ke halaman publik
 
Modul admin bukan fitur yang berdiri sendiri. Ia adalah **permukaan tulis** untuk data yang **dibaca** oleh halaman publik — tabelnya sama persis, hanya arah aksesnya berbeda.
 
```
            PENGUNJUNG (anonim)          ADMIN (login)
                   |                          |
              baca saja                  tulis & baca
                   |                          |
                   +------------+-------------+
                                |
                        PostgreSQL (CT 102)
```
 
| Tabel | Ditulis oleh | Dibaca pengunjung di |
|---|---|---|
| `paket_wisata` | Manajemen Paket | `/paket-wisata`, `/paket-wisata/[slug]`, highlight beranda |
| `galeri` | Manajemen Galeri | `/galeri`, highlight beranda |
| `artikel` + `artikel_kategori` | Manajemen Artikel | `/artikel`, `/artikel/[slug]`, pencarian, highlight beranda |
| `faq` | Manajemen FAQ | bagian FAQ pada `/informasi` |
| `reservasi` | **pengunjung** (buat) + admin (ubah status) | konfirmasi setelah pengiriman |
| `admin_users` | Manajemen Akun Admin | — tidak ada permukaan publik |
 
**Tiga ketimpangan yang harus dipahami sebelum implementasi:**
 
**Arah tulis `reservasi` terbalik dibanding tabel lain.** Di semua tabel lain, admin menulis dan pengunjung membaca. Di `reservasi`, pengunjunglah yang menulis. Konsekuensinya, `POST /api/reservasi` adalah **satu-satunya jalur di mana pihak tak dikenal dapat memasukkan data ke database** — endpoint ini wajib mendapat validasi ketat dan pembatasan laju (rate limiting), dan itu perlu masuk ke bab keamanan laporan. Endpoint yang sama inilah yang menjadi skenario pengujian beban utama (§9.2 skenario C), karena ia satu-satunya jalur tulis yang bisa diuji tanpa login.
 
**Tidak ada registrasi untuk pengunjung.** Pengunjung situs bersifat anonim — tanpa akun, tanpa login, tanpa profil. Akun hanya disediakan untuk pengelola melalui `admin_users`. Ini menyederhanakan banyak hal (tidak perlu reset password publik, verifikasi email, atau halaman profil pengunjung) dan harus disepakati eksplisit, karena jika dibayangkan "pengunjung bisa login melihat riwayat pesanan", itu ruang lingkup yang jauh lebih besar.
 
**Beranda dan Informasi tidak memiliki modul admin — ini sesuai desain, bukan kelalaian.** Beranda adalah *view* yang menggabungkan tiga tabel yang sudah punya modul masing-masing (§6.3). Konten halaman Informasi (profil, sejarah, lokasi, rute, jam operasional) di-seed sebagai data awal karena hampir tidak pernah berubah; hanya FAQ yang mendapat modul karena paling mungkin bertambah.
 
**Arsitektur teknis: satu aplikasi, dua kelompok route, bukan dua aplikasi terpisah.**
 
```
CT 101 — container aplikasi (dari GHCR)
    |
    +-- /[lang]/...        publik · tanpa login · baca saja · dua bahasa
    |
    +-- /admin/...         wajib login · baca & tulis · bahasa Indonesia saja
    |
    +-- /api/reservasi     publik · tulis · satu-satunya jalur tulis anonim
```
 
Dipertahankan sebagai satu aplikasi karena memisahkan admin dan publik ke dua container berarti dua proses Node yang melayani database yang sama — pemborosan pada CPU 2 core dan RAM 1,5 GiB. Penjagaan di tingkat route (middleware autentikasi) sudah memadai pada skala ini.
 
Antarmuka dashboard admin **tidak perlu dua bahasa** — pengelolanya adalah penutur bahasa Indonesia, sehingga hal ini menghemat kira-kira separuh pekerjaan UI admin. Yang tetap dua bahasa adalah **konten yang diedit**: form tetap memiliki field Judul (ID) dan Judul (EN) berdampingan.
 
**Koreksi penting terhadap aturan eksposur §5.4:** aturan "hindari mengekspos dashboard administrasi ke internet" pada §5.4 dan §5.5 berlaku untuk **dashboard infrastruktur** (Portainer, Grafana, Prometheus, MinIO Console), bukan untuk `/admin` aplikasi Citumang.
 
| | Contoh | Eksposur |
|---|---|---|
| Dashboard infrastruktur | Portainer, Grafana, Prometheus, MinIO Console | LAN saja — tidak lewat tunnel |
| Dashboard aplikasi | `/admin` pada situs Citumang | **Publik lewat tunnel**, dilindungi login |
 
Pengelola wisata Citumang mengakses `/admin` dari mana saja, bukan dari jaringan lokal kelompok — ini bagian dari lapisan SaaS yang dapat digunakan lewat browser tanpa instalasi. Yang tidak boleh terekspos adalah alat pengelola **infrastruktur**, bukan alat pengelola **konten**.
 
---
 
## 7. Rancangan Database
 
**PostgreSQL** dalam container di CT 102. `[PLANNED]`
 
### 7.1 Pendekatan dua bahasa
 
Kolom terpisah per bahasa (`_id` dan `_en`), bukan tabel terjemahan terpisah. Alasan: hanya dua bahasa, tidak ada rencana penambahan, dan struktur ini selaras dengan `src/lib/messages.ts` yang sudah ada sehingga migrasi kontennya lurus. Tabel terjemahan akan menambah join pada hampir setiap query tanpa manfaat yang sepadan di skala ini.
 
### 7.2 Tabel
 
**`admin_users`** — akun pengelola
`id`, `email` (unik), `password_hash`, `nama`, `role`, `created_at`, `updated_at`
 
**`paket_wisata`**
`id`, `slug` (unik), `nama_id`, `nama_en`, `deskripsi_id`, `deskripsi_en`, `harga`, `durasi_menit`, `min_peserta`, `maks_peserta`, `fasilitas` (jsonb), `cover_object_key`, `aktif`, `urutan`, `created_at`, `updated_at`
 
**`reservasi`** — inti modul reservasi
`id`, `kode_reservasi` (unik), `paket_id` (FK → paket_wisata), `nama_pemesan`, `telepon`, `email`, `tanggal_kunjungan`, `jumlah_peserta`, `catatan`, `status`, `created_at`, `updated_at`
 
`status` adalah enum: `menunggu` · `dikonfirmasi` · `dibatalkan` · `selesai`
 
**`artikel_kategori`**
`id`, `slug` (unik), `nama_id`, `nama_en`
 
**`artikel`**
`id`, `slug` (unik), `kategori_id` (FK), `judul_id`, `judul_en`, `ringkasan_id`, `ringkasan_en`, `konten_id`, `konten_en`, `cover_object_key`, `dipublikasikan`, `published_at`, `created_at`, `updated_at`
 
**`galeri`**
`id`, `judul_id`, `judul_en`, `tipe` (`foto` | `video_embed`), `object_key`, `embed_url`, `urutan`, `aktif`
 
**`faq`**
`id`, `pertanyaan_id`, `pertanyaan_en`, `jawaban_id`, `jawaban_en`, `urutan`, `aktif`
 
### 7.3 Index
 
- `reservasi(tanggal_kunjungan)` dan `reservasi(status)` — query dashboard admin
- `reservasi(kode_reservasi)` unik — penelusuran oleh pemesan
- `artikel(slug)`, `paket_wisata(slug)` unik
- GIN index pada `to_tsvector` gabungan judul dan ringkasan artikel — mendukung fitur pencarian artikel
### 7.4 Catatan
 
Kolom `object_key` menyimpan kunci objek di MinIO, **bukan URL lengkap**. Dengan begitu, perpindahan atau perubahan endpoint storage tidak memaksa migrasi data.
 
Seluruh akses file ke MinIO dibungkus dalam satu modul di aplikasi. Tidak boleh ada pemanggilan storage yang tersebar di banyak komponen.
 
---
 
## 8. Pipeline Deployment
 
```
Developer                GitHub                    CT 101
    |                       |                         |
 git push ──────────────>  main                       |
                            |                         |
                     GitHub Actions                   |
                     - checkout                       |
                     - docker build (multi-stage)     |
                     - push image ───> ghcr.io        |
                            |                         |
                            +──── webhook ──────>  Portainer
                                                      |
                                                 pull image
                                                      |
                                              recreate service
                                                      |
                                               healthcheck
```
 
**Ketentuan:**
 
1. `next.config.ts` harus diset `output: 'standalone'` agar image runtime kecil. Saat ini belum diset. **[OPEN — harus dikerjakan]**
2. Image diberi dua tag: `:<git-sha>` untuk reprodusibilitas dan `:latest` untuk kemudahan. Yang dirujuk compose file adalah tag SHA, bukan latest.
3. Seluruh image pihak ketiga (PostgreSQL, MinIO, Grafana, Prometheus, Nginx, Portainer) **wajib dipin ke versi spesifik**. Tidak ada `latest` di compose file.
4. Credential tidak pernah masuk repository. Environment variable dikelola melalui Portainer Stack atau GitHub Secrets.
5. Setiap service memiliki `restart: unless-stopped` dan batas memori eksplisit.
6. Keberhasilan deployment diverifikasi melalui `/api/health`, bukan melalui asumsi bahwa container sudah naik.
Seluruh definisi container berpindah dari `docker run` ad-hoc menjadi `docker-compose.yml` yang di-commit ke repository dan di-deploy sebagai Portainer Stack dari Git. Ini sekaligus menyelesaikan temuan 1, 2, dan 3 pada §3.4.
 
---
 
## 9. Rencana Pengujian
 
### 9.1 Pengujian fungsional
 
**IaaS** — pembuatan dan penghapusan LXC; pengubahan alokasi CPU, RAM, dan storage; konektivitas antarnode (10.10.10.11 ↔ .12 ↔ .13); remote access via SSH dan web UI Proxmox; akses eksternal melalui Cloudflare Tunnel.
 
**PaaS** — deployment stack dari Git; pembaruan image; start, stop, restart, dan penghapusan service; pembacaan log melalui dashboard; verifikasi penegakan resource limit; pengelolaan tiga node dari satu Portainer.
 
**SaaS** — registrasi dan login admin; CRUD paket, artikel, galeri, dan FAQ; pengiriman reservasi oleh pengunjung; perubahan status reservasi; pergantian bahasa; akses bersamaan oleh beberapa pengguna; verifikasi penyimpanan data.
 
### 9.2 Pengujian performa
 
**Aturan mutlak:** JMeter dijalankan dari laptop di luar infrastruktur, **tidak** dari Proxmox Host maupun CT mana pun. Generator beban yang berbagi CPU dengan target menghasilkan data yang tidak valid.
 
**Skenario:**
 
| Kode | Endpoint | Yang diukur |
|---|---|---|
| A | `GET /` | Baseline — rendering halaman |
| B | `GET /paket-wisata` | Operasi baca database |
| C | `POST /api/reservasi` | **Operasi tulis database — skenario utama** |
| D | `GET /artikel?q=` | Pencarian dengan full-text index |
 
Skenario C adalah yang paling penting. Menembak halaman statis hanya mengukur Nginx. Menembak endpoint yang menulis ke PostgreSQL mengukur seluruh rantai: reverse proxy, runtime aplikasi, database, dan container yang menampungnya.
 
**Peringatan tentang caching halaman publik.** Halaman seperti `/paket-wisata` adalah kandidat kuat untuk di-cache oleh Next.js karena isinya jarang berubah. Jika skenario B di-cache, request tidak lagi menyentuh PostgreSQL sama sekali — angka yang dihasilkan akan terlihat bagus tetapi tidak mengukur apa pun yang berarti. Dua pilihan, dan keduanya sah **asal ditulis eksplisit di laporan**:
 
- Nonaktifkan cache pada endpoint yang diuji, sehingga setiap request benar-benar menyentuh database; atau
- Biarkan cache aktif, tetapi nyatakan bahwa skenario B mengukur penyajian ter-cache sementara skenario C mengukur rantai penuh — perbandingan keduanya dapat dijadikan salah satu temuan analisis (dampak caching terhadap beban database)
Pilihan mana pun diterima; yang tidak boleh terjadi adalah cache aktif secara tidak sengaja tanpa disadari saat menafsirkan hasil.
 
**Tingkat beban:** 10, 25, 50, dan 100 concurrent user, dengan ramp-up bertahap dan durasi tetap per tingkat.
 
**Metrik dari JMeter:** response time (rata-rata, p95, p99), throughput, error rate.
 
**Metrik dari Prometheus + cAdvisor, divisualisasikan di Grafana:** penggunaan CPU dan memori **per container** (aplikasi, PostgreSQL, Nginx, MinIO), network I/O, jumlah restart.
 
**Keluaran analisis:** korelasi antara tingkat beban, konsumsi resource per container, dan waktu respons — untuk menemukan titik di mana kinerja mulai menurun.
 
**Catatan kebersihan data:** data reservasi hasil pengujian beban harus dapat dibedakan dari data sungguhan — gunakan penanda khusus pada `nama_pemesan` atau `catatan`, dan bersihkan sebelum demo.
 
### 9.3 Eksperimen alokasi CPU container
 
Ini menjawab langsung pertanyaan yang diajukan dosen pada tugas asinkronus: *sejauh mana efektivitas container Docker dalam mengelola alokasi CPU saat menerima beban request yang bervariasi.*
 
Jalankan skenario C pada beban identik, dengan tiga konfigurasi batas CPU pada container aplikasi:
 
| Konfigurasi | `cpus` |
|---|---|
| Terbatas ketat | 0.5 |
| Terbatas sedang | 1.0 |
| Tanpa batas | — |
 
Bandingkan response time, throughput, dan error rate ketiganya. Hasilnya menunjukkan secara empiris bagaimana cgroup menegakkan alokasi CPU dan apa dampaknya terhadap kualitas layanan.
 
**Seluruh angka dalam laporan harus berasal dari pengukuran aktual.** Tidak boleh ada tabel atau grafik yang diisi perkiraan.
 
---
 
## 10. Backup dan Recovery
 
Efisiensi resource dan keamanan termasuk kriteria penilaian, dan backup adalah bagian darinya. Rancangan ini menetapkan tiga lapisan.
 
**Konfigurasi** — seluruh `docker-compose.yml`, konfigurasi Nginx, konfigurasi Prometheus, dan definisi dashboard Grafana disimpan di repository Git. Ini adalah bentuk backup yang paling penting: infrastruktur dapat dibangun ulang dari nol tanpa mengandalkan ingatan siapa pun.
 
**Database** — `pg_dump` terjadwal melalui cron di CT 102, hasilnya disimpan di direktori terpisah dari volume PostgreSQL. Minimal satu kali per hari selama masa pengembangan, dan **wajib satu kali sesaat sebelum presentasi**.
 
**Snapshot container** — Proxmox menyediakan snapshot LXC. Ambil snapshot ketiga CT pada setiap milestone besar: sebelum migrasi database, sebelum deployment pertama, dan sebelum rangkaian pengujian beban. Ini jalan mundur tercepat bila ada langkah yang merusak.
 
**Ketentuan pembuktian:** proses restore harus **diuji minimal satu kali**, bukan sekadar dijadwalkan. Backup yang belum pernah dipulihkan belum terbukti berfungsi, dan pengujian restore itu sendiri merupakan bukti implementasi yang layak masuk laporan.
 
---
 
## 11. Pembagian Kerja
 
Lima peran berikut `[PROPOSED]`. Penetapan PIC diserahkan kepada kelompok.
 
| Peran | Tanggung jawab | Output yang diperiksa |
|---|---|---|
| **1. Cloud Infrastructure (IaaS)** | Proxmox, LXC, jaringan, storage, backup dan snapshot, alokasi resource | Dokumentasi infrastruktur, bukti pengujian jaringan dan remote access, bukti uji restore |
| **2. Platform & DevOps (PaaS)** | Docker, compose file, Portainer multi-node, GitHub Actions, GHCR, Nginx | `docker-compose.yml`, workflow CI, bukti deployment berjalan |
| **3. Backend & Database** | API, skema PostgreSQL, autentikasi, integrasi MinIO | Skema dan migrasi, dokumentasi API |
| **4. Frontend & SaaS** | UI situs publik, dashboard admin, dua bahasa | Aplikasi berfungsi, bukti pengujian fungsional |
| **5. QA, Monitoring & Dokumentasi** | Dashboard Grafana, skenario JMeter, analisis hasil, kompilasi laporan | Dashboard, file skenario uji, data mentah, draft laporan |
 
**Berdasarkan bukti yang ada:** Jamal Abdul Nasir sudah mengerjakan repository dan rancangan frontend; Faisal Hadi Saik sudah mengerjakan dokumentasi IaaS UTS dan laporan tugas asinkronus. Sisanya belum teridentifikasi dari dokumen yang tersedia.
 
**Ketentuan:** setiap anggota wajib mampu menjelaskan alur deployment dan arsitektur cloud secara keseluruhan, bukan hanya bagiannya sendiri. Ketergantungan pada satu orang yang menguasai infrastruktur adalah anti-goal proyek ini.
 
---
 
## 12. Risiko
 
| Risiko | Dampak | Mitigasi |
|---|---|---|
| Build gagal di server | Deployment buntu | Build dipindah ke GitHub Actions — sudah tertangani di rancangan |
| CT 102 kehabisan RAM setelah ditambah PostgreSQL dan MinIO | Layanan data mati | Naikkan alokasi ke 1,5 GiB; pasang batas memori per service; verifikasi setelah deployment |
| Scope dashboard admin membengkak kembali | Proyek tidak selesai | Ruang lingkup dikunci di §6: enam modul fungsional dan satu halaman ringkasan; empat modul lain sudah dicoret dengan alasan tercatat |
| Image `latest` berubah menjelang presentasi | Perilaku sistem berubah tak terduga | Seluruh image dipin ke versi spesifik |
| Pengujian beban dilakukan terlalu akhir | Tidak ada data untuk bab evaluasi | Deployment dan monitoring diselesaikan lebih dulu; pengujian bukan tahap terakhir |
| Hanya satu orang memahami infrastruktur | Kelompok lumpuh jika ia berhalangan | Seluruh konfigurasi deklaratif di repo; dokumentasi bersama |
| Migrasi MariaDB ke PostgreSQL bermasalah | Database tidak siap | Urutan non-destruktif: stop dan disable MariaDB, verifikasi PostgreSQL berfungsi, baru hapus |
| Data hilang saat eksperimen atau salah perintah | Pekerjaan berminggu-minggu lenyap | Named volume, `pg_dump` terjadwal, snapshot LXC per milestone, uji restore |
| Cache halaman publik aktif tanpa disadari saat pengujian beban | Angka skenario B/D tidak merepresentasikan beban database | Nonaktifkan cache pada endpoint yang diuji, atau catat eksplisit bahwa hasil mengukur penyajian ter-cache (§9.2) |
 
---
 
## 13. Yang Diserahkan kepada Pelaksana
 
Keputusan berikut tidak dikunci dalam dokumen ini dan diserahkan kepada yang mengerjakan:
 
- **ORM atau query builder.** Pertimbangkan konsumsi memori — Prisma membawa query engine tambahan yang relatif berat untuk container 1,5 GiB. Alternatif yang lebih ringan layak dipertimbangkan.
- **Library autentikasi admin.** Kebutuhannya sederhana: beberapa akun, satu level peran. Tidak perlu solusi berat.
- **Detail komponen UI dashboard admin**, selama ruang lingkup modulnya mengikuti §6.2.
- **Struktur migrasi database** dan mekanisme seeding data awal.
- **Nama service dan volume** dalam compose file, selama port mengikuti §5.2.
- **Jadwal dan retensi `pg_dump`**, selama memenuhi ketentuan minimum di §10.
---
 
## 14. Keputusan yang Masih Terbuka
 
| No | Hal | Keterangan |
|---|---|---|
| 1 | **Judul final proyek** | Harus mencerminkan isi sebenarnya. Modul reservasi dibangun, sehingga judul boleh memuat unsur reservasi — tetapi perlu disepakati kelompok dan dikonsultasikan ke dosen |
| 2 | **Tenggat final project** | Belum diketahui dari dokumen yang tersedia. Menentukan apakah scope perlu dipangkas lagi |
| 3 | **Ketentuan resmi final project** | Belum ada dokumen brief resmi di arsip kelompok. Rancangan ini disusun berdasarkan kerangka IaaS–PaaS–SaaS dari dokumen perencanaan kelompok, bukan dari brief dosen. **Harus dikonfirmasi** |
| 4 | **ZFS ARC** | Jika storage host menggunakan ZFS, pembatasan `zfs_arc_max` berpotensi membebaskan ratusan MiB. Perlu dicek dengan `zpool list` |
| 5 | **Masa dukungan MariaDB 10.6** | Tidak lagi relevan setelah migrasi ke PostgreSQL, tetapi layak disebut di bab keterbatasan sebagai alasan pendukung keputusan |
 
---
 
## 15. Catatan Proses
 
Pemilihan topik, judul, dan technology stack awal dilakukan tanpa diskusi kelompok — repository dan rancangan website muncul lebih dulu, sementara tahap diskusi dan voting pada rencana 10 hari belum dijalankan.
 
Dokumen ini dimaksudkan menjadi dasar kesepakatan bersama. **Dokumen ini belum merupakan keputusan kelompok sampai kelima anggota menyetujuinya.**
 
Kerja frontend yang sudah ada tidak terbuang: Next.js, TypeScript, Tailwind, seluruh komponen UI, sistem dua bahasa, dan penanganan aksesibilitas tetap dipakai. Yang berubah hanya lapisan di bawahnya — dari layanan terkelola pihak ketiga menjadi infrastruktur milik kelompok sendiri.