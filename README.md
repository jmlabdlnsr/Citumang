# Citumang

Prototipe beranda destinasi wisata Citumang dalam bahasa Indonesia dan Inggris,
dengan Next.js 16, React 19,
TypeScript, App Router, Tailwind CSS 4, dan ESLint. Desain menggunakan hero
fotografis sinematik, nuansa hijau hutan, aksen jingga, dan tata letak editorial.

## Menjalankan

Gunakan Node.js 24.22.1, kemudian:

```bash
npm install
npm run dev
```

Buka http://localhost:3000. Halaman akan diarahkan ke `/id`; gunakan `/en`
untuk bahasa Inggris. Di PowerShell yang memblokir npm.ps1, gunakan
`npm.cmd run dev`. Hentikan server dengan Ctrl+C.

## Pemeriksaan dan produksi

```bash
npm run lint
npm run typecheck
npm run build
npm start
```

Font disimpan lokal; build tidak memerlukan Google Fonts.
`npm run build` juga memeriksa TypeScript.

## Isi Beranda

- Profil usaha dan jasa Citumang.
- Paket wisata dengan dialog penjelasan.
- Galeri foto, artikel, dan informasi kunjungan.
- Navbar dengan navigasi antarbagian dan menu mobile, hero foto penuh dengan
  pesan dan satu CTA utama, tombol WhatsApp melayang, serta footer.

Semua bagian masih berada di satu halaman. Ini adalah acuan visual awal:
konten dan terjemahan tersimpan statis di `src/lib/messages.ts`, sedangkan
kontak situs berada di `src/lib/site.ts`. Belum ada panel admin, CMS, atau
backend untuk mengelolanya.

## Bahasa

Beranda tersedia di `/id` dan `/en`, dengan Bahasa Indonesia sebagai bahasa
default pada `/`. Pemilih bahasa di navbar mempertahankan bagian halaman yang
sedang dibuka. Teks, metadata, konten artikel, informasi kunjungan, serta
formulir reservasi tersedia dalam kedua bahasa.

## Konten dummy dan WhatsApp

Foto dan kontak masih dummy sesuai permintaan. Tidak ada backend reservasi,
pembayaran, atau pengiriman pesan otomatis. Formulir menyusun pratinjau pesan;
pengunjung dapat menyalinnya. Tidak ada data formulir yang disimpan ke server.

Untuk mengaktifkan WhatsApp:

1. Buka `src/lib/site.ts`.
2. Isi `site.whatsappNumber` dengan nomor resmi format internasional, hanya angka,
   diawali kode negara (62 untuk Indonesia).
3. Ganti `phoneDisplay`, `email`, dan lokasi dalam kedua bahasa dengan data
   pengelola yang benar.
4. Perbarui label kontak dummy di footer dan jawaban FAQ.
5. Bangun ulang proyek. Pratinjau pesan akan menampilkan tautan WhatsApp.

Ganti foto di `public/images/` dan deskripsi foto pada `src/lib/messages.ts`.
Foto dummy harus diganti dengan foto berizin sebelum publikasi.

## Struktur

- `src/app/route.ts`: mengarahkan `/` ke `/id`.
- `src/app/[lang]/page.tsx`: beranda dan metadata per bahasa.
- `src/app/[lang]/layout.tsx`: font lokal dan atribut bahasa dokumen.
- `src/app/globals.css`: import Tailwind, token desain, dan reset global.
- Styling komponen menggunakan utility class Tailwind di JSX.
- `src/components/home-page.tsx`: komponen Beranda dan interaksi.
- `src/components/icon.tsx`: logo dan ikon SVG.
- `src/lib/messages.ts`: teks, konten, dan metadata Bahasa Indonesia/Inggris.
- `src/lib/site.ts`: kontak dan konfigurasi situs.
- `src/app/fonts/`: font lokal dan berkas lisensinya.

## Aksesibilitas

Navigasi keyboard, skip link, label ikon, focus-visible, dialog native dengan
Escape dan pengembalian fokus, validasi inline, serta reduced-motion tersedia.
Kontrol tanggal memakai date picker bawaan browser; perhitungan tanggal kunjungan
menggunakan zona Asia/Jakarta. Tidak ada slider yang bergerak otomatis.
