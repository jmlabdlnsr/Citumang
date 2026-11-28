/**
 * Seed data awal: kategori artikel, paket wisata, harga, artikel, dan FAQ.
 * Data diambil dari messages.ts sebagai titik awal.
 *
 * Jalankan: npm.cmd run db:seed-data
 * Idempoten: aman dijalankan berulang (upsert by slug / pertanyaan).
 */

import { eq } from "drizzle-orm";
import { db } from "../src/db";
import {
  artikelKategori,
  articles,
  faq,
  packages,
  prices,
} from "../src/db/schema";

// ─── 1. Kategori Artikel ─────────────────────────────────────────────────────

const kategoriData = [
  { slug: "panduan-wisata", namaId: "Panduan Wisata", namaEn: "Travel Guide" },
  { slug: "tips-perjalanan", namaId: "Tips Perjalanan", namaEn: "Travel Tips" },
  { slug: "cerita-alam", namaId: "Cerita Alam", namaEn: "Nature Notes" },
];

// ─── 2. Paket Wisata ─────────────────────────────────────────────────────────

const paketData = [
  {
    slug: "body-rafting",
    nameId: "Body Rafting",
    nameEn: "Body Rafting",
    descriptionId:
      "Ikuti aliran sungai. Temukan serunya petualangan di setiap belokan.",
    descriptionEn:
      "Follow the river and find a little adventure around every bend.",
    duration: "2–3 jam",
    minPeserta: 2,
    maksPeserta: 20,
    fasilitas: ["Pemandu lokal", "Pelampung", "Helm", "Briefing keselamatan"],
    sortOrder: 1,
  },
  {
    slug: "jelajah-alam",
    nameId: "Jelajah Alam",
    nameEn: "Nature Walk",
    descriptionId:
      "Berjalan di bawah rindangnya pohon, ditemani suara alam yang menenangkan.",
    descriptionEn:
      "Walk beneath the trees and take in the calming sounds of nature.",
    duration: "1–2 jam",
    minPeserta: 1,
    maksPeserta: 30,
    fasilitas: ["Pemandu lokal", "Air minum"],
    sortOrder: 2,
  },
  {
    slug: "momen-tepi-sungai",
    nameId: "Momen di Tepi Sungai",
    nameEn: "Riverside Moments",
    descriptionId:
      "Simpan ceritanya dalam foto. Atau cukup duduk, dan nikmati suasananya.",
    descriptionEn:
      "Capture the scenery, or simply sit back and enjoy the moment.",
    duration: "Fleksibel",
    minPeserta: 1,
    maksPeserta: 50,
    fasilitas: ["Spot foto terpilih", "Pemandu lokal"],
    sortOrder: 3,
  },
];

// Harga per paket (IDR)
const hargaData: Record<string, { labelId: string; labelEn: string; amount: number }[]> = {
  "body-rafting": [
    { labelId: "Per orang (weekday)", labelEn: "Per person (weekday)", amount: 75000 },
    { labelId: "Per orang (weekend)", labelEn: "Per person (weekend)", amount: 95000 },
  ],
  "jelajah-alam": [
    { labelId: "Per orang", labelEn: "Per person", amount: 50000 },
  ],
  "momen-tepi-sungai": [
    { labelId: "Per orang", labelEn: "Per person", amount: 35000 },
  ],
};

// ─── 3. Artikel ───────────────────────────────────────────────────────────────

// Diisi setelah kategori diinsert — slug kategori dipetakan ke id.
const artikelData = [
  {
    slug: "panduan-body-rafting-pertama-kali",
    kategoriSlug: "panduan-wisata",
    titleId: "Pertama kali body rafting? Mulai dari sini.",
    titleEn: "First time body rafting? Start here.",
    excerptId:
      "Sebelum masuk ke sungai, kenali aktivitasnya dan bicarakan kebutuhan Anda dengan pemandu.",
    excerptEn:
      "Before entering the river, learn about the activity and discuss your needs with the guide.",
    contentId:
      "Sebelum masuk ke sungai, kenali aktivitasnya dan bicarakan kebutuhan Anda dengan pemandu. Sampaikan kondisi kesehatan serta kemampuan berenang dengan jujur. Gunakan pelampung yang sesuai ukuran, ikuti pengarahan, dan jangan memisahkan diri dari kelompok. Kondisi air dapat berubah, jadi selalu ikuti keputusan pemandu di lokasi.",
    contentEn:
      "Before entering the river, learn about the activity and discuss your needs with the guide. Be honest about your health and swimming ability. Wear a properly fitted life jacket, listen to the briefing, and stay with your group. Water conditions can change, so always follow the guide's instructions on site.",
    published: true,
  },
  {
    slug: "barang-bawaan-liburan-nyaman",
    kategoriSlug: "tips-perjalanan",
    titleId: "Barang kecil, liburan lebih nyaman.",
    titleEn: "A few small things for a more comfortable trip.",
    excerptId:
      "Siapkan pakaian ganti, handuk, alas kaki yang tidak licin, dan kantong untuk pakaian basah.",
    excerptEn:
      "Pack a change of clothes, a towel, non-slip footwear, and a bag for wet items.",
    contentId:
      "Siapkan pakaian ganti, handuk, alas kaki yang tidak licin, air minum, dan kantong kedap air untuk barang pribadi. Bawa air minum sendiri dan gunakan pelindung kedap air untuk barang penting. Simpan perhiasan serta barang berharga sebelum beraktivitas. Konfirmasi terlebih dahulu fasilitas penitipan dan ruang ganti yang tersedia.",
    contentEn:
      "Pack a change of clothes, a towel, non-slip footwear, and a bag for wet items. Bring drinking water and use a waterproof pouch for valuables. Store jewellery and other valuables before your activity. Ask the local operator about storage and changing facilities before you arrive.",
    published: true,
  },
  {
    slug: "datang-menikmati-pulang-tanpa-jejak",
    kategoriSlug: "cerita-alam",
    titleId: "Datang untuk menikmati, pulang tanpa jejak.",
    titleEn: "Enjoy the river. Leave no trace.",
    excerptId:
      "Keindahan sungai adalah bagian dari perjalanan yang perlu kita jaga bersama.",
    excerptEn:
      "The river is part of a landscape we can all help protect.",
    contentId:
      "Keindahan sungai adalah bagian dari perjalanan yang perlu kita jaga bersama. Bawa kembali sampah Anda, hindari merusak tanaman dan bebatuan, serta gunakan jalur yang diarahkan pengelola. Beri ruang bagi satwa dan pengunjung lain. Hal-hal sederhana ini membantu menjaga Citumang tetap menyenangkan untuk dikunjungi kembali.",
    contentEn:
      "The river is part of a landscape we can all help protect. Take your rubbish with you, avoid disturbing plants and rocks, and stay on the paths recommended by the local operator. Give wildlife and other visitors space. Small actions help keep Citumang welcoming for future visits.",
    published: true,
  },
];

// ─── 4. FAQ ───────────────────────────────────────────────────────────────────

const faqData = [
  {
    pertanyaanId: "Di mana lokasi Citumang?",
    pertanyaanEn: "Where is Citumang?",
    jawabanId:
      "Citumang berada di Kecamatan Parigi, Kabupaten Pangandaran, Jawa Barat. Gunakan tautan peta untuk merencanakan perjalanan dan konfirmasikan titik pertemuan dengan pengelola sebelum berangkat.",
    jawabanEn:
      "Citumang is in Parigi District, Pangandaran Regency, West Java. Use the map link to plan your trip and confirm the meeting point with the local operator before you leave.",
    urutan: 1,
  },
  {
    pertanyaanId: "Apa saja yang perlu dibawa?",
    pertanyaanEn: "What should I bring?",
    jawabanId:
      "Bawa pakaian ganti, handuk, alas kaki yang tidak licin, air minum, dan kantong kedap air untuk barang pribadi. Tanyakan kepada pengelola perlengkapan dan fasilitas yang termasuk dalam pilihan aktivitas Anda.",
    jawabanEn:
      "Bring a change of clothes, a towel, non-slip footwear, drinking water, and a waterproof bag for personal items. Ask the local operator which equipment and facilities are included with your chosen activity.",
    urutan: 2,
  },
  {
    pertanyaanId: "Bagaimana cara melakukan reservasi?",
    pertanyaanEn: "How do I make a reservation?",
    jawabanId:
      "Isi formulir reservasi dengan nama, tanggal kunjungan, dan jumlah peserta. Anda akan mendapatkan kode reservasi untuk penelusuran. Detail dan konfirmasi dilakukan oleh pengelola melalui WhatsApp atau telepon.",
    jawabanEn:
      "Fill in the reservation form with your name, visit date, and number of visitors. You will receive a reservation code for tracking. The local operator will follow up via WhatsApp or phone to confirm details.",
    urutan: 3,
  },
  {
    pertanyaanId: "Apakah ada batasan usia atau kondisi kesehatan?",
    pertanyaanEn: "Are there age or health restrictions?",
    jawabanId:
      "Beberapa aktivitas memiliki rekomendasi usia dan kondisi fisik minimum. Konsultasikan kondisi peserta dengan pengelola sebelum booking, terutama untuk body rafting.",
    jawabanEn:
      "Some activities have minimum age and fitness recommendations. Please discuss participant conditions with the operator before booking, especially for body rafting.",
    urutan: 4,
  },
  {
    pertanyaanId: "Kapan waktu terbaik untuk berkunjung?",
    pertanyaanEn: "When is the best time to visit?",
    jawabanId:
      "Citumang dapat dikunjungi sepanjang tahun. Musim kemarau (April–Oktober) umumnya lebih nyaman untuk aktivitas air. Konfirmasi kondisi terkini dengan pengelola sebelum berangkat.",
    jawabanEn:
      "Citumang can be visited year-round. The dry season (April–October) is generally more comfortable for water activities. Confirm current conditions with the operator before your visit.",
    urutan: 5,
  },
];

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log("🌱 Memulai seed data...\n");

  // 1. Kategori artikel
  console.log("1. Menyimpan kategori artikel...");
  const kategoriMap = new Map<string, number>();
  for (const kat of kategoriData) {
    const [existing] = await db
      .select({ id: artikelKategori.id })
      .from(artikelKategori)
      .where(eq(artikelKategori.slug, kat.slug))
      .limit(1);

    if (existing) {
      await db
        .update(artikelKategori)
        .set({ namaId: kat.namaId, namaEn: kat.namaEn })
        .where(eq(artikelKategori.id, existing.id));
      kategoriMap.set(kat.slug, existing.id);
      console.log(`   ↻ Kategori diperbarui: ${kat.namaId}`);
    } else {
      const [inserted] = await db
        .insert(artikelKategori)
        .values(kat)
        .returning({ id: artikelKategori.id });
      kategoriMap.set(kat.slug, inserted.id);
      console.log(`   ✓ Kategori dibuat: ${kat.namaId}`);
    }
  }

  // 2. Paket wisata + harga
  console.log("\n2. Menyimpan paket wisata...");
  for (const paket of paketData) {
    const [existing] = await db
      .select({ id: packages.id })
      .from(packages)
      .where(eq(packages.slug, paket.slug))
      .limit(1);

    let packageId: number;
    if (existing) {
      await db
        .update(packages)
        .set({ ...paket, updatedAt: new Date() })
        .where(eq(packages.id, existing.id));
      packageId = existing.id;
      console.log(`   ↻ Paket diperbarui: ${paket.nameId}`);
    } else {
      const [inserted] = await db
        .insert(packages)
        .values(paket)
        .returning({ id: packages.id });
      packageId = inserted.id;
      console.log(`   ✓ Paket dibuat: ${paket.nameId}`);
    }

    // Harga: hapus lama dan insert ulang (sederhana & idempoten)
    const hargaList = hargaData[paket.slug] ?? [];
    if (hargaList.length > 0) {
      await db.delete(prices).where(eq(prices.packageId, packageId));
      await db.insert(prices).values(
        hargaList.map((h, i) => ({
          packageId,
          labelId: h.labelId,
          labelEn: h.labelEn,
          amount: h.amount,
          sortOrder: i,
        })),
      );
      console.log(`      └─ ${hargaList.length} harga disimpan`);
    }
  }

  // 3. Artikel
  console.log("\n3. Menyimpan artikel...");
  for (const art of artikelData) {
    const kategoriId = kategoriMap.get(art.kategoriSlug);
    const { kategoriSlug: _, ...artValues } = art;

    const [existing] = await db
      .select({ id: articles.id })
      .from(articles)
      .where(eq(articles.slug, artValues.slug))
      .limit(1);

    if (existing) {
      await db
        .update(articles)
        .set({ ...artValues, kategoriId, publishedAt: artValues.published ? new Date() : null, updatedAt: new Date() })
        .where(eq(articles.id, existing.id));
      console.log(`   ↻ Artikel diperbarui: ${artValues.titleId}`);
    } else {
      await db.insert(articles).values({
        ...artValues,
        kategoriId,
        publishedAt: artValues.published ? new Date() : null,
      });
      console.log(`   ✓ Artikel dibuat: ${artValues.titleId}`);
    }
  }

  // 4. FAQ
  console.log("\n4. Menyimpan FAQ...");
  for (const item of faqData) {
    const [existing] = await db
      .select({ id: faq.id })
      .from(faq)
      .where(eq(faq.pertanyaanId, item.pertanyaanId))
      .limit(1);

    if (existing) {
      await db.update(faq).set(item).where(eq(faq.id, existing.id));
      console.log(`   ↻ FAQ diperbarui: ${item.pertanyaanId}`);
    } else {
      await db.insert(faq).values(item);
      console.log(`   ✓ FAQ dibuat: ${item.pertanyaanId}`);
    }
  }

  console.log("\n✅ Seed data selesai.");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Seed data gagal:", err);
    process.exit(1);
  });
