export const locales = ["id", "en"] as const;
export type Locale = (typeof locales)[number];

export function isLocale(value: string): value is Locale {
  return value === "id" || value === "en";
}

export const messages = {
  id: {
    metadata: {
      title: "Citumang — Petualangan Alami di Pangandaran",
      description:
        "Temukan sisi alami Pangandaran di Citumang. Jelajahi sungai yang jernih, nikmati body rafting, dan rencanakan waktu bersama di tengah alam.",
      openGraphDescription:
        "Sungai jernih, alam yang asri, dan cerita baru untuk dibawa pulang.",
      openGraphLocale: "id_ID",
    },
    language: { label: "Pilih bahasa" },
    accessibility: {
      skipToContent: "Langsung ke konten",
      homeLink: "Citumang, kembali ke Beranda",
      mainNavigation: "Navigasi utama",
      mobileNavigation: "Navigasi mobile",
      openMenu: "Buka menu",
      closeMenu: "Tutup menu",
      closeDialog: "Tutup dialog",
    },
    navigation: [
      { label: "Beranda", href: "#beranda" },
      { label: "Paket Wisata", href: "#paket-wisata" },
      { label: "Galeri", href: "#galeri" },
      { label: "Artikel", href: "#artikel" },
      { label: "Informasi", href: "#informasi" },
    ],
    header: { inquiry: "Tanya Paket" },
    hero: {
      regionLabel: "Selamat datang di Citumang",
      title: "Temukan sisi alami Citumang bersama kami",
      description:
        "Dari jernihnya aliran sungai hingga hangatnya cerita bersama warga lokal, rencanakan petualangan yang terasa dekat dengan alam.",
      action: "Jelajahi Paket Wisata",
    },
    profile: {
      eyebrow: "Tentang Citumang",
      title: "Lebih dari perjalanan. Sebuah pengalaman lokal.",
      description:
        "Tersembunyi di antara hijaunya Pangandaran, Citumang mengajak Anda melambat sejenak. Kami membantu Anda mengenal suasana sungai, aktivitas alam, dan cerita di balik perjalanan melalui informasi yang dekat dengan warga setempat.",
      highlights: [
        {
          title: "Kenali alamnya",
          description:
            "Informasi aktivitas dan suasana Citumang untuk membantu Anda merencanakan kunjungan.",
        },
        {
          title: "Rencanakan bersama",
          description:
            "Tanyakan kebutuhan perjalanan dan konfirmasikan detail langsung dengan pengelola.",
        },
      ],
      action: "Kenali Informasi Wisata",
      imageCaption: "Cerita dari Citumang",
    },
    destinations: {
      eyebrow: "Jelajahi sekitar",
      title: "Lanskap yang mengundang untuk dijelajahi",
      description:
        "Lihat sekilas sungai, aktivitas, dan sudut alam yang bisa menjadi bagian dari perjalanan Anda.",
      openPhoto: "Lihat foto",
      category: "CITUMANG",
    },
    photos: [
      {
        src: "/images/citumang-river.jpg",
        alt: "Air sungai berwarna toska di antara bebatuan dan pepohonan Citumang",
        label: "Sungai yang bercerita",
        location: "Sungai Citumang",
      },
      {
        src: "/images/citumang-waterfall.jpg",
        alt: "Air terjun kecil di tengah rimbunnya hutan Citumang",
        label: "Sejuknya air, tenangnya alam",
        location: "Air terjun Citumang",
      },
      {
        src: "/images/citumang-rafting.jpg",
        alt: "Wisatawan dengan pelampung menikmati body rafting di Sungai Citumang",
        label: "Petualangan lebih seru bersama",
        location: "Body rafting Citumang",
      },
    ],
    packages: {
      eyebrow: "Pilih cara menikmati alam",
      title: "Paket wisata dan aktivitas",
      description:
        "Pilihan di bawah ini adalah gambaran awal. Detail aktivitas, fasilitas, ketersediaan, dan harga perlu dikonfirmasi.",
      openDetails: "Lihat detail",
      inquire: "Tanya paket",
      experiences: [
        {
          title: "Body rafting",
          category: "UNTUK SI PENJELAJAH",
          photo: 2,
          description:
            "Ikuti aliran sungai. Temukan serunya petualangan di setiap belokan.",
          details:
            "Rasakan pengalaman menyusuri sungai dengan pelampung, ditemani pemandu. Di antara arus, bebatuan, dan hijaunya pepohonan, ada banyak momen untuk dinikmati bersama.",
          notes: [
            "Konsultasikan kondisi peserta dengan pemandu",
            "Gunakan pelampung dan ikuti arahan selama kegiatan",
            "Konfirmasi rute, durasi, dan harga sebelum berkunjung",
          ],
        },
        {
          title: "Jelajah alam",
          category: "DEKAT DENGAN ALAM",
          photo: 0,
          description:
            "Berjalan di bawah rindangnya pohon, ditemani suara alam yang menenangkan.",
          details:
            "Luangkan waktu untuk menikmati suasana di sekitar sungai. Pepohonan yang rimbun, batuan alami, dan air yang mengalir menjadi teman perjalanan santai Anda.",
          notes: [
            "Gunakan alas kaki yang nyaman dan tidak licin",
            "Bawa air minum dan simpan kembali sampah Anda",
            "Tanyakan jalur yang dapat diakses kepada pengelola",
          ],
        },
        {
          title: "Momen di tepi sungai",
          category: "JEDA YANG BERARTI",
          photo: 1,
          description:
            "Simpan ceritanya dalam foto. Atau cukup duduk, dan nikmati suasananya.",
          details:
            "Tidak semua petualangan harus terburu-buru. Temukan sudut untuk mengabadikan lanskap, menikmati suara air, dan berbagi waktu bersama orang terdekat.",
          notes: [
            "Lindungi kamera dan ponsel dengan kantong kedap air",
            "Ambil foto dari tempat yang aman",
            "Hormati alam dan kenyamanan pengunjung lain",
          ],
        },
      ],
    },
    gallery: {
      eyebrow: "Momen di alam",
      title: "Galeri Citumang",
      hint: "Pilih foto untuk melihat lebih dekat",
      openPhoto: "Buka foto",
      dialogPreview: "Foto untuk pratinjau",
      previousPhoto: "Foto sebelumnya",
      nextPhoto: "Foto berikutnya",
      showPhoto: "Tampilkan",
    },
    articles: {
      eyebrow: "Bekal sebelum berangkat",
      title: "Cerita dan panduan perjalanan",
      description:
        "Artikel singkat untuk membantu Anda menikmati perjalanan dengan lebih nyaman.",
      read: "Baca artikel",
      items: [
        {
          title: "Pertama kali body rafting? Mulai dari sini.",
          category: "PANDUAN WISATA",
          photo: 2,
          text: "Sebelum masuk ke sungai, kenali aktivitasnya dan bicarakan kebutuhan Anda dengan pemandu. Sampaikan kondisi kesehatan serta kemampuan berenang dengan jujur. Gunakan pelampung yang sesuai ukuran, ikuti pengarahan, dan jangan memisahkan diri dari kelompok. Kondisi air dapat berubah, jadi selalu ikuti keputusan pemandu di lokasi.",
        },
        {
          title: "Barang kecil, liburan lebih nyaman.",
          category: "TIPS PERJALANAN",
          photo: 0,
          text: "Siapkan pakaian ganti, handuk, alas kaki yang tidak licin, dan kantong untuk pakaian basah. Bawa air minum sendiri dan gunakan pelindung kedap air untuk barang penting. Simpan perhiasan serta barang berharga sebelum beraktivitas. Konfirmasi terlebih dahulu fasilitas penitipan dan ruang ganti yang tersedia.",
        },
        {
          title: "Datang untuk menikmati, pulang tanpa jejak.",
          category: "CERITA ALAM",
          photo: 1,
          text: "Keindahan sungai adalah bagian dari perjalanan yang perlu kita jaga bersama. Bawa kembali sampah Anda, hindari merusak tanaman dan bebatuan, serta gunakan jalur yang diarahkan pengelola. Beri ruang bagi satwa dan pengunjung lain. Hal-hal sederhana ini membantu menjaga Citumang tetap menyenangkan untuk dikunjungi kembali.",
        },
      ],
    },
    information: {
      eyebrow: "Informasi kunjungan",
      title: "Siapkan perjalanan Anda ke Citumang",
      description:
        "Informasi pada halaman ini merupakan panduan awal. Untuk kondisi terkini, fasilitas, titik pertemuan, dan ketersediaan aktivitas, silakan konfirmasi kepada pengelola sebelum berangkat.",
      map: "Buka lokasi di peta",
      contact: "Kontak pengelola (contoh)",
      faq: [
        {
          question: "Di mana lokasi Citumang?",
          answer:
            "Citumang berada di Kecamatan Parigi, Kabupaten Pangandaran, Jawa Barat. Gunakan tautan peta untuk merencanakan perjalanan dan konfirmasikan titik pertemuan dengan pengelola sebelum berangkat.",
        },
        {
          question: "Apa saja yang perlu dibawa?",
          answer:
            "Bawa pakaian ganti, handuk, alas kaki yang tidak licin, air minum, dan kantong kedap air untuk barang pribadi. Tanyakan kepada pengelola perlengkapan dan fasilitas yang termasuk dalam pilihan aktivitas Anda.",
        },
        {
          question: "Bagaimana cara melakukan reservasi?",
          answer:
            "Klik tombol Tanya Paket, isi rencana kunjungan, lalu siapkan pesan untuk pengelola. Saat ini kontak masih berupa contoh; pesan hanya ditampilkan sebagai pratinjau dan tidak dikirim.",
        },
      ],
    },
    cta: {
      eyebrow: "Perjalanan dimulai dari rencana",
      title: "Ingin tahu aktivitas yang sesuai untuk Anda?",
      description:
        "Sampaikan rencana kunjungan. Detail akhir tetap dikonfirmasi langsung dengan pengelola.",
      action: "Tanya Pengelola",
    },
    footer: {
      description:
        "Informasi awal untuk mengenal alam, aktivitas, dan cerita lokal di Citumang, Pangandaran.",
      explore: "Jelajahi",
      contact: "Kontak contoh",
      copyright:
        "Copyright 2026 Citumang. Konten dan informasi masih berupa contoh awal.",
    },
    reservation: {
      title: "Tanyakan rencana kunjungan",
      intro:
        "Petualangan Anda dimulai dari sebuah rencana. Ceritakan kapan dan bersama siapa Anda ingin berkunjung.",
      demoNotice: "Mode demo - Kontak pengelola belum diatur.",
      messageReady: "Pesan Anda sudah siap",
      messageToWhatsApp:
        "Anda dapat melanjutkan percakapan dengan pengelola di WhatsApp. Reservasi belum dikonfirmasi.",
      previewOnly:
        "Ini hanya pratinjau. Belum ada pesan yang dikirim atau reservasi yang dibuat.",
      copy: "Salin pesan",
      copySuccess: "Pesan berhasil disalin.",
      copyFailure:
        "Pesan belum dapat disalin otomatis. Silakan pilih dan salin teks di atas.",
      editPlan: "Ubah rencana",
      name: "Nama Anda",
      namePlaceholder: "Nama lengkap",
      date: "Tanggal kunjungan",
      people: "Jumlah peserta",
      nameRequired: "Masukkan nama Anda.",
      dateInvalid: "Pilih tanggal hari ini atau setelahnya.",
      peopleInvalid: "Masukkan jumlah peserta antara 1-200 orang.",
      submit: "Siapkan pesan WhatsApp",
      submitting: "Mengirim...",
      apiError: "Gagal mengirim reservasi. Silakan coba lagi.",
      kodeLabel: "Kode reservasi Anda:",
      success: "Reservasi berhasil disimpan! Gunakan kode ini untuk konfirmasi.",
      disclaimer:
        "Tidak ada pembayaran pada tahap ini. Harga dan ketersediaan dikonfirmasi langsung dengan pengelola.",
      message: (name: string, people: string, date: string) =>
        `Halo Citumang! Saya ${name}, ingin menanyakan ketersediaan wisata untuk ${people} orang pada ${date}. Mohon informasi paket, fasilitas, dan harganya. Terima kasih!`,
    },
    dialogs: {
      activityDetails:
        "Detail paket, fasilitas, ketersediaan, dan harga perlu dikonfirmasi dengan pengelola.",
      askAboutActivity: "Tanyakan aktivitas ini",
      back: "Kembali",
    },
    whatsapp: {
      message: "Halo, saya ingin menanyakan informasi wisata Citumang.",
      ariaLabel: "Siapkan pesan WhatsApp",
      title: "Siapkan pesan WhatsApp",
    },
  },
  en: {
    metadata: {
      title: "Citumang — Nature Adventures in Pangandaran",
      description:
        "Discover Citumang in Pangandaran. Explore its clear river, enjoy body rafting, and plan a memorable day surrounded by nature.",
      openGraphDescription:
        "Clear river water, lush scenery, and new stories to take home.",
      openGraphLocale: "en_US",
    },
    language: { label: "Select language" },
    accessibility: {
      skipToContent: "Skip to content",
      homeLink: "Citumang, back to Home",
      mainNavigation: "Main navigation",
      mobileNavigation: "Mobile navigation",
      openMenu: "Open menu",
      closeMenu: "Close menu",
      closeDialog: "Close dialog",
    },
    navigation: [
      { label: "Home", href: "#beranda" },
      { label: "Tour Packages", href: "#paket-wisata" },
      { label: "Gallery", href: "#galeri" },
      { label: "Articles", href: "#artikel" },
      { label: "Visitor Info", href: "#informasi" },
    ],
    header: { inquiry: "Ask about packages" },
    hero: {
      regionLabel: "Welcome to Citumang",
      title: "Discover the natural beauty of Citumang",
      description:
        "From the clear river to warm stories shared by local people, plan an adventure that brings you closer to nature.",
      action: "Explore Tour Packages",
    },
    profile: {
      eyebrow: "About Citumang",
      title: "More than a trip. A local experience.",
      description:
        "Tucked among the green landscapes of Pangandaran, Citumang invites you to slow down. We help you discover the river, outdoor activities, and stories behind your visit with useful information from the local community.",
      highlights: [
        {
          title: "Get to know the landscape",
          description:
            "Learn about Citumang's activities and atmosphere as you plan your visit.",
        },
        {
          title: "Plan together",
          description:
            "Share your travel needs and confirm the details with the local operator.",
        },
      ],
      action: "Explore Visitor Information",
      imageCaption: "Stories from Citumang",
    },
    destinations: {
      eyebrow: "Explore the area",
      title: "Landscapes waiting to be explored",
      description:
        "Take a look at the river, outdoor activities, and natural scenery that could be part of your trip.",
      openPhoto: "View photo",
      category: "CITUMANG",
    },
    photos: [
      {
        src: "/images/citumang-river.jpg",
        alt: "Turquoise river flowing between rocks and trees in Citumang",
        label: "A river with stories to tell",
        location: "Citumang River",
      },
      {
        src: "/images/citumang-waterfall.jpg",
        alt: "Small waterfall surrounded by the lush Citumang forest",
        label: "Cool water, quiet forest",
        location: "Citumang Waterfall",
      },
      {
        src: "/images/citumang-rafting.jpg",
        alt: "Visitors wearing life jackets enjoy body rafting on the Citumang River",
        label: "Adventure is better together",
        location: "Citumang Body Rafting",
      },
    ],
    packages: {
      eyebrow: "Choose your way to enjoy nature",
      title: "Tour packages and activities",
      description:
        "These options are an initial overview. Please confirm activity details, facilities, availability, and prices with the local operator.",
      openDetails: "View details",
      inquire: "Ask about this package",
      experiences: [
        {
          title: "Body rafting",
          category: "FOR THE ADVENTUROUS",
          photo: 2,
          description:
            "Follow the river and find a little adventure around every bend.",
          details:
            "Float along the river with a guide. Between the current, river rocks, and green trees, there are plenty of moments to enjoy together.",
          notes: [
            "Discuss participant needs with your guide",
            "Wear a life jacket and follow the guide's instructions",
            "Confirm the route, duration, and price before your visit",
          ],
        },
        {
          title: "Nature walk",
          category: "CLOSER TO NATURE",
          photo: 0,
          description:
            "Walk beneath the trees and take in the calming sounds of nature.",
          details:
            "Take your time and enjoy the area around the river. Lush trees, natural rock formations, and flowing water make a relaxing backdrop for your walk.",
          notes: [
            "Wear comfortable, non-slip footwear",
            "Bring drinking water and take your rubbish with you",
            "Ask the local operator which trails are accessible",
          ],
        },
        {
          title: "Riverside moments",
          category: "A MOMENT TO SLOW DOWN",
          photo: 1,
          description:
            "Capture the scenery, or simply sit back and enjoy the moment.",
          details:
            "Not every adventure needs to be rushed. Find a safe place to take in the scenery, listen to the water, and spend time with the people you care about.",
          notes: [
            "Protect cameras and phones in a waterproof pouch",
            "Take photos from a safe place",
            "Respect nature and other visitors",
          ],
        },
      ],
    },
    gallery: {
      eyebrow: "Moments in nature",
      title: "Citumang Gallery",
      hint: "Choose a photo to take a closer look",
      openPhoto: "Open photo",
      dialogPreview: "Preview photo",
      previousPhoto: "Previous photo",
      nextPhoto: "Next photo",
      showPhoto: "Show",
    },
    articles: {
      eyebrow: "A few tips before you go",
      title: "Travel stories and guides",
      description:
        "Short reads to help you enjoy a more comfortable visit.",
      read: "Read article",
      items: [
        {
          title: "First time body rafting? Start here.",
          category: "TRAVEL GUIDE",
          photo: 2,
          text: "Before entering the river, learn about the activity and discuss your needs with the guide. Be honest about your health and swimming ability. Wear a properly fitted life jacket, listen to the briefing, and stay with your group. Water conditions can change, so always follow the guide's instructions on site.",
        },
        {
          title: "A few small things for a more comfortable trip.",
          category: "TRAVEL TIPS",
          photo: 0,
          text: "Pack a change of clothes, a towel, non-slip footwear, and a bag for wet items. Bring drinking water and use a waterproof pouch for valuables. Store jewellery and other valuables before your activity. Ask the local operator about storage and changing facilities before you arrive.",
        },
        {
          title: "Enjoy the river. Leave no trace.",
          category: "NATURE NOTES",
          photo: 1,
          text: "The river is part of a landscape we can all help protect. Take your rubbish with you, avoid disturbing plants and rocks, and stay on the paths recommended by the local operator. Give wildlife and other visitors space. Small actions help keep Citumang welcoming for future visits.",
        },
      ],
    },
    information: {
      eyebrow: "Visitor information",
      title: "Plan your visit to Citumang",
      description:
        "This page is an initial guide. Please confirm current conditions, facilities, meeting points, and activity availability with the local operator before setting out.",
      map: "Open map",
      contact: "Operator contact (example)",
      faq: [
        {
          question: "Where is Citumang?",
          answer:
            "Citumang is in Parigi District, Pangandaran Regency, West Java. Use the map link to plan your trip and confirm the meeting point with the local operator before you leave.",
        },
        {
          question: "What should I bring?",
          answer:
            "Bring a change of clothes, a towel, non-slip footwear, drinking water, and a waterproof bag for personal items. Ask the local operator which equipment and facilities are included with your chosen activity.",
        },
        {
          question: "How do I make a reservation?",
          answer:
            "Select Ask about packages, enter your visit details, and prepare a message for the local operator. Contact details are currently examples; messages are only shown as a preview and are not sent.",
        },
      ],
    },
    cta: {
      eyebrow: "Every trip starts with a plan",
      title: "Looking for an activity that suits you?",
      description:
        "Tell us about your visit. Please confirm all final details directly with the local operator.",
      action: "Ask the local operator",
    },
    footer: {
      description:
        "An introduction to the nature, activities, and local stories of Citumang, Pangandaran.",
      explore: "Explore",
      contact: "Contact (example)",
      copyright:
        "Copyright 2026 Citumang. Content and information are initial examples.",
    },
    reservation: {
      title: "Plan your visit",
      intro:
        "Every adventure starts with a plan. Tell us when you would like to visit and who will be joining you.",
      demoNotice: "Demo mode - Operator contact has not been set up.",
      messageReady: "Your message is ready",
      messageToWhatsApp:
        "You can continue the conversation with the local operator on WhatsApp. Your visit is not confirmed.",
      previewOnly:
        "This is only a preview. No message has been sent and no reservation has been made.",
      copy: "Copy message",
      copySuccess: "Message copied.",
      copyFailure:
        "The message could not be copied automatically. Please select and copy the text above.",
      editPlan: "Edit your plan",
      name: "Your name",
      namePlaceholder: "Full name",
      date: "Visit date",
      people: "Number of visitors",
      nameRequired: "Enter your name.",
      dateInvalid: "Choose today or a future date.",
      peopleInvalid: "Enter between 1 and 200 visitors.",
      submit: "Prepare WhatsApp message",
      submitting: "Sending...",
      apiError: "Failed to submit reservation. Please try again.",
      kodeLabel: "Your reservation code:",
      success: "Reservation saved! Use this code for confirmation.",
      disclaimer:
        "No payment is taken at this stage. Confirm prices and availability directly with the local operator.",
      message: (name: string, people: string, date: string) =>
        `Hello Citumang! My name is ${name}, and I would like to ask about availability for ${people} people on ${date}. Please share information about packages, facilities, and prices. Thank you!`,
    },
    dialogs: {
      activityDetails:
        "Please confirm package details, facilities, availability, and prices with the local operator.",
      askAboutActivity: "Ask about this activity",
      back: "Back",
    },
    whatsapp: {
      message: "Hello, I would like to ask about visiting Citumang.",
      ariaLabel: "Prepare a WhatsApp message",
      title: "Prepare a WhatsApp message",
    },
  },
} as const;
