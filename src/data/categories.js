// Label, warna, dan pilihan permainan setiap dunia belajar.
const CATEGORY_META = {
  iqro: {
    label: "Iqro &amp; Qur'an", icon: "📖", desc: "Baca huruf hijaiyah sampai Al-Qur'an", badgeImg: IMG_CARD_IQRO,
    heroTitle: "Belajar Iqro jadi seru!",
    heroDesc: "Dengar contoh pelafalan, lihat tulisan Arabnya, lalu main game serunya.",
    heroGradient: "linear-gradient(135deg, var(--violet), var(--teal))",
    shelfLabel: "📚 Rak Buku Iqro",
    intro: "Halo, Sahabat! Pilih jilid buat mulai belajar ya! 👋",
    quizMode: "audio", quizIcon: "🎧", quizLabel: "Kuis Suara",
    quizDesc: "Dengar suaranya, tebak tulisannya yang benar!",
    matchDesc: "Buka dua kartu, cocokkan huruf Arab dengan bacaannya!"
  },
  sholat: {
    label: "Belajar Sholat", icon: "🕌", desc: "Wudhu, gerakan & bacaan sholat", badgeImg: IMG_CARD_SHOLAT,
    heroTitle: "Yuk rajin sholat!",
    heroDesc: "Belajar niat wudhu sampai bacaan sholat lengkap, urut dan mudah diingat.",
    heroGradient: "linear-gradient(135deg, var(--coral), #ffb14c)",
    shelfLabel: "🕌 Modul Wudhu & Sholat",
    intro: "Assalamu'alaikum! Yuk belajar wudhu dan gerakan sholat bareng Kak Iqro 🤲",
    quizMode: "audio", quizIcon: "🎧", quizLabel: "Kuis Suara",
    quizDesc: "Dengar bacaannya, tebak nama gerakannya!",
    matchDesc: "Cocokkan bacaan Arab dengan artinya!"
  },
  tajwid: {
    label: "Belajar Tajwid", icon: "📜", desc: "Hukum bacaan Al-Qur'an", badgeImg: IMG_CARD_TAJWID,
    heroTitle: "Yuk mahir tajwid!",
    heroDesc: "Kenali hukum-hukum bacaan supaya mengajinya makin fasih dan benar.",
    heroGradient: "linear-gradient(135deg, var(--violet), var(--pink))",
    shelfLabel: "📜 Modul Hukum Tajwid",
    intro: "Yuk kenalan sama hukum-hukum bacaan tajwid, biar makin lancar mengaji! 📖",
    quizMode: "audio", quizIcon: "🎧", quizLabel: "Kuis Suara",
    quizDesc: "Dengar contohnya, tebak nama hukum tajwidnya!",
    matchDesc: "Cocokkan contoh bacaan dengan nama hukumnya!"
  },
  nabi: {
    label: "Kisah 25 Nabi", icon: "👳", desc: "Cerita seru para nabi & rasul", badgeImg: IMG_CARD_NABI,
    heroTitle: "Yuk kenal para Nabi!",
    heroDesc: "Baca kisah singkat 25 Nabi dan Rasul, teladan akhlak mulia untuk kita semua.",
    heroGradient: "linear-gradient(135deg, var(--green), var(--teal))",
    shelfLabel: "👳 Kisah Para Nabi",
    intro: "Yuk baca kisah seru 25 Nabi dan Rasul pilihan Allah! 🌟",
    quizMode: "text", quizIcon: "🕵️", quizLabel: "Tebak Nabi",
    quizDesc: "Baca petunjuknya, lalu tebak siapa nabinya!",
    matchDesc: "Cocokkan nama Arab dengan nama Indonesianya!"
  },
  arab: {
    label: "Bahasa Arab", icon: "🗣️", desc: "Kosakata & percakapan sehari-hari", badgeImg: IMG_CARD_ARAB,
    heroTitle: "Yuk pintar Bahasa Arab!",
    heroDesc: "Belajar kata dan kalimat Arab sehari-hari, dari angka sampai percakapan sederhana.",
    heroGradient: "linear-gradient(135deg, #FF9F43, var(--coral))",
    shelfLabel: "🗣️ Unit Bahasa Arab",
    intro: "Marhaban! Yuk mulai belajar kosakata Bahasa Arab bareng-bareng! 🗣️",
    quizMode: "text", quizIcon: "🧠", quizLabel: "Tebak Arti",
    quizDesc: "Baca artinya, lalu tebak kata Bahasa Arabnya!",
    matchDesc: "Cocokkan kata Arab dengan artinya dalam Bahasa Indonesia!"
  },
  doa: {
    label: "Doa Harian", icon: "🤲", desc: "Doa-doa pendek sehari-hari", badgeImg: IMG_CARD_DOA,
    heroTitle: "Yuk hafal doa sehari-hari!",
    heroDesc: "Belajar doa-doa pendek yang dipakai setiap hari, dari bangun tidur sampai mau tidur lagi.",
    heroGradient: "linear-gradient(135deg, var(--green), #1f8a4c)",
    shelfLabel: "🤲 Unit Doa Harian",
    intro: "Yuk hafalkan doa-doa pendek supaya harimu makin berkah! 🤲",
    quizMode: "audio", quizIcon: "🎧", quizLabel: "Kuis Suara",
    quizDesc: "Dengar bacaannya, tebak nama doanya!",
    matchDesc: "Cocokkan bacaan doa dengan artinya!"
  }
};

const MASKOT_KATA = {
  benar: ["Betul sekali! Kamu hebat! 🌟", "Mantap! Lanjut yuk! 🎉", "Iya, tepat sekali! 👍"],
  salah: ["Belum tepat, coba dengarkan lagi ya! 🔁", "Ayo dicoba sekali lagi, pasti bisa! 💪"],
  selesaiJilid: ["Horeee! Kamu keren! 🏆"]
};
