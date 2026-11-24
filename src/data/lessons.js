// Isi pelajaran dan urutan kartu. Pertahankan ID modul dan urutan kartu lama
// karena progres pemain menyimpan ID modul beserta indeks kartu.
const IQRO_MODULES = [
  {
    id: "i1", warna: "#FF6F59", judul: "Jilid 1", deskripsi: "Kenalan sama huruf hijaiyah",
    tujuan: "Mengenal 28 huruf hijaiyah tunggal berharakat fathah (bunyi 'a').",
    kartu: [
      { arab: "أَ", latin: "A", ket: "Alif fathah" },
      { arab: "بَ", latin: "BA", ket: "Ba fathah" },
      { arab: "تَ", latin: "TA", ket: "Ta fathah" },
      { arab: "ثَ", latin: "TSA", ket: "Tsa fathah" },
      { arab: "جَ", latin: "JA", ket: "Jim fathah" },
      { arab: "حَ", latin: "HA", ket: "Ha (tebal) fathah" },
      { arab: "خَ", latin: "KHA", ket: "Kha fathah" },
      { arab: "دَ", latin: "DA", ket: "Dal fathah" },
      { arab: "ذَ", latin: "DZA", ket: "Dzal fathah" },
      { arab: "رَ", latin: "RA", ket: "Ra fathah" },
      { arab: "زَ", latin: "ZA", ket: "Zai fathah" },
      { arab: "سَ", latin: "SA", ket: "Sin fathah" },
      { arab: "شَ", latin: "SYA", ket: "Syin fathah" },
      { arab: "صَ", latin: "SHA", ket: "Shad fathah" },
      { arab: "ضَ", latin: "DHA", ket: "Dhad fathah" },
      { arab: "طَ", latin: "THA", ket: "Tha fathah" },
      { arab: "ظَ", latin: "ZHA", ket: "Zha fathah" },
      { arab: "عَ", latin: "'A", ket: "Ain fathah" },
      { arab: "غَ", latin: "GHA", ket: "Ghain fathah" },
      { arab: "فَ", latin: "FA", ket: "Fa fathah" },
      { arab: "قَ", latin: "QA", ket: "Qaf fathah" },
      { arab: "كَ", latin: "KA", ket: "Kaf fathah" },
      { arab: "لَ", latin: "LA", ket: "Lam fathah" },
      { arab: "مَ", latin: "MA", ket: "Mim fathah" },
      { arab: "نَ", latin: "NA", ket: "Nun fathah" },
      { arab: "وَ", latin: "WA", ket: "Wau fathah" },
      { arab: "هَ", latin: "HA", ket: "Ha (lembut) fathah" },
      { arab: "يَ", latin: "YA", ket: "Ya fathah" },
      { arab: "بَ تَ ثَ جَ", latin: "BA - TA - TSA - JA", ket: "Latihan cepat: baca satu-satu, huruf belum disambung" },
      { arab: "حَ خَ دَ ذَ", latin: "HA - KHA - DA - DZA", ket: "Latihan cepat membaca huruf terpisah" },
      { arab: "رَ زَ سَ شَ", latin: "RA - ZA - SA - SYA", ket: "Latihan cepat membaca huruf terpisah" },
      { arab: "صَ ضَ طَ ظَ", latin: "SHA - DHA - THA - ZHA", ket: "Latihan cepat membaca huruf terpisah" },
      { arab: "عَ غَ فَ قَ", latin: "'A - GHA - FA - QA", ket: "Latihan cepat membaca huruf terpisah" },
      { arab: "كَ لَ مَ نَ", latin: "KA - LA - MA - NA", ket: "Latihan cepat membaca huruf terpisah" },
      { arab: "وَ هَ يَ أَ", latin: "WA - HA - YA - A", ket: "Latihan cepat membaca huruf terpisah, mengulang dari awal" }
    ]
  },
  {
    id: "i2", warna: "#FFC93C", judul: "Jilid 2", deskripsi: "Huruf gandeng & bacaan panjang",
    tujuan: "Membaca huruf yang disambung dan mengenal bacaan panjang (mad) dengan alif.",
    kartu: [
      { arab: "بَا", latin: "BAA", ket: "Ba panjang (mad alif)" },
      { arab: "تَا", latin: "TAA", ket: "Ta panjang" },
      { arab: "ثَا", latin: "TSAA", ket: "Tsa panjang" },
      { arab: "جَا", latin: "JAA", ket: "Jim panjang" },
      { arab: "حَا", latin: "HAA", ket: "Ha panjang" },
      { arab: "دَا", latin: "DAA", ket: "Dal panjang" },
      { arab: "رَا", latin: "RAA", ket: "Ra panjang" },
      { arab: "سَا", latin: "SAA", ket: "Sin panjang" },
      { arab: "فَا", latin: "FAA", ket: "Fa panjang" },
      { arab: "كَا", latin: "KAA", ket: "Kaf panjang" },
      { arab: "مَا", latin: "MAA", ket: "Mim panjang" },
      { arab: "نَا", latin: "NAA", ket: "Nun panjang" },
      { arab: "بَابَا", latin: "BAABAA", ket: "Kata: dua huruf disambung" },
      { arab: "كَتَبَ", latin: "KATABA", ket: "Kata: ia telah menulis" },
      { arab: "ذَهَبَ", latin: "DZAHABA", ket: "Kata: ia telah pergi" },
      { arab: "جَلَسَ", latin: "JALASA", ket: "Kata: ia telah duduk" },
      { arab: "سَارَ", latin: "SAARA", ket: "Kata: ia telah berjalan (mad alif)" },
      { arab: "طَارَ", latin: "THAARA", ket: "Kata: ia telah terbang (mad alif)" },
      { arab: "رَاحَ", latin: "RAAHA", ket: "Kata: ia telah pergi (mad alif)" },
      { arab: "زَارَ", latin: "ZAARA", ket: "Kata: ia telah berkunjung (mad alif)" },
      { arab: "غَسَلَ", latin: "GHASALA", ket: "Kata: ia telah mencuci" },
      { arab: "خَرَجَ", latin: "KHARAJA", ket: "Kata: ia telah keluar" },
      { arab: "دَخَلَ", latin: "DAKHALA", ket: "Kata: ia telah masuk" },
      { arab: "نَظَرَ", latin: "NAZHARA", ket: "Kata: ia telah melihat" }
    ]
  },
  {
    id: "i3", warna: "#4FB0A5", judul: "Jilid 3", deskripsi: "Kasrah, dhommah, dan bacaan panjang",
    tujuan: "Mengenal harakat kasrah (i), dhommah (u), serta mad dengan ya dan wau.",
    kartu: [
      { arab: "بِ", latin: "BI", ket: "Ba kasrah" },
      { arab: "بُ", latin: "BU", ket: "Ba dhommah" },
      { arab: "تِ", latin: "TI", ket: "Ta kasrah" },
      { arab: "تُ", latin: "TU", ket: "Ta dhommah" },
      { arab: "جِ", latin: "JI", ket: "Jim kasrah" },
      { arab: "جُ", latin: "JU", ket: "Jim dhommah" },
      { arab: "سِي", latin: "SII", ket: "Sin panjang (mad ya)" },
      { arab: "نُو", latin: "NUU", ket: "Nun panjang (mad wau)" },
      { arab: "دِي", latin: "DII", ket: "Dal panjang (mad ya)" },
      { arab: "مُو", latin: "MUU", ket: "Mim panjang (mad wau)" },
      { arab: "بِسْمِ", latin: "BISMI", ket: "Kata: dengan nama" },
      { arab: "فِيهِ", latin: "FIIHI", ket: "Kata: di dalamnya" },
      { arab: "دِ", latin: "DI", ket: "Dal kasrah" },
      { arab: "دُ", latin: "DU", ket: "Dal dhommah" },
      { arab: "رِ", latin: "RI", ket: "Ra kasrah" },
      { arab: "رُ", latin: "RU", ket: "Ra dhommah" },
      { arab: "سِ", latin: "SI", ket: "Sin kasrah" },
      { arab: "سُ", latin: "SU", ket: "Sin dhommah" },
      { arab: "مِ", latin: "MI", ket: "Mim kasrah" },
      { arab: "مُ", latin: "MU", ket: "Mim dhommah" },
      { arab: "نِ", latin: "NI", ket: "Nun kasrah" },
      { arab: "نُ", latin: "NU", ket: "Nun dhommah" }
    ]
  },
  {
    id: "i4", warna: "#7C83FD", judul: "Jilid 4", deskripsi: "Tanwin & huruf mati",
    tujuan: "Mengenal bunyi tanwin (an, in, un) dan huruf sukun (mati).",
    kartu: [
      { arab: "بً", latin: "BAN", ket: "Ba fathatain (tanwin)" },
      { arab: "بٍ", latin: "BIN", ket: "Ba kasratain (tanwin)" },
      { arab: "بٌ", latin: "BUN", ket: "Ba dhommatain (tanwin)" },
      { arab: "أَبْ", latin: "AB", ket: "Alif - ba sukun" },
      { arab: "مَنْ", latin: "MAN", ket: "Kata: siapa" },
      { arab: "عَنْ", latin: "'AN", ket: "Kata: dari/tentang" },
      { arab: "مِنْ", latin: "MIN", ket: "Kata: dari" },
      { arab: "قَدْ", latin: "QAD", ket: "Kata: sungguh" },
      { arab: "شَمْسٌ", latin: "SYAMSUN", ket: "Kata: matahari" },
      { arab: "قَلَمٌ", latin: "QALAMUN", ket: "Kata: pena" },
      { arab: "كِتَابٌ", latin: "KITAABUN", ket: "Kata: buku (dhommatain di akhir)" },
      { arab: "بَيْتٌ", latin: "BAITUN", ket: "Kata: rumah (mad layin, ya sukun)" },
      { arab: "عَيْنٌ", latin: "'AINUN", ket: "Kata: mata (mad layin, ya sukun)" },
      { arab: "يَوْمٌ", latin: "YAUMUN", ket: "Kata: hari (mad layin, wau sukun)" },
      { arab: "بَابٌ", latin: "BAABUN", ket: "Kata: pintu (dhommatain)" },
      { arab: "كَلْبٌ", latin: "KALBUN", ket: "Kata: anjing (lam sukun)" },
      { arab: "نَجْمٌ", latin: "NAJMUN", ket: "Kata: bintang (jim sukun)" },
      { arab: "وَجْهٌ", latin: "WAJHUN", ket: "Kata: wajah (jim sukun)" },
      { arab: "أَرْضٌ", latin: "ARDHUN", ket: "Kata: bumi (ra sukun)" },
      { arab: "عِلْمٌ", latin: "'ILMUN", ket: "Kata: ilmu (lam sukun)" }
    ]
  },
  {
    id: "i5", warna: "#E85D9C", judul: "Jilid 5", deskripsi: "Kalimat pendek & tanda berhenti",
    tujuan: "Membaca rangkaian kata menjadi kalimat pendek dan mengenal tanda waqaf (berhenti).",
    kartu: [
      { arab: "قَالَ", latin: "QAALA", ket: "Kata: ia berkata" },
      { arab: "كَانَ", latin: "KAANA", ket: "Kata: adalah" },
      { arab: "خَلَقَ", latin: "KHALAQA", ket: "Kata: menciptakan" },
      { arab: "رَحِمَ", latin: "RAHIMA", ket: "Kata: menyayangi" },
      { arab: "الْقَلَمُ جَمِيلٌ", latin: "AL-QALAMU JAMIILUN", ket: "Kalimat: pena itu indah" },
      { arab: "الشَّمْسُ كَبِيرَةٌ", latin: "ASY-SYAMSU KABIIRATUN", ket: "Kalimat: matahari itu besar" },
      { arab: "مـ", latin: "(waqaf lazim)", ket: "Tanda: wajib berhenti" },
      { arab: "لا", latin: "(laa waqaf)", ket: "Tanda: dilarang berhenti" },
      { arab: "ج", latin: "(waqaf jaiz)", ket: "Tanda: boleh berhenti / boleh lanjut" },
      { arab: "الْبَيْتُ كَبِيرٌ", latin: "AL-BAITU KABIIRUN", ket: "Kalimat: rumah itu besar (Al Qomariyah, lam dibaca jelas)" },
      { arab: "الشَّمْسُ سَاطِعَةٌ", latin: "ASY-SYAMSU SAATHI'AH", ket: "Kalimat: matahari itu bersinar (Al Syamsiyah, lam melebur)" },
      { arab: "الْقَمَرُ جَمِيلٌ", latin: "AL-QAMARU JAMIILUN", ket: "Kalimat: bulan itu indah (Al Qomariyah)" },
      { arab: "الرَّجُلُ صَالِحٌ", latin: "AR-RAJULU SHAALIHUN", ket: "Kalimat: laki-laki itu saleh (Al Syamsiyah)" },
      { arab: "الْمَاءُ صَافٍ", latin: "AL-MAAU SHAAFIN", ket: "Kalimat: air itu jernih (Al Qomariyah)" },
      { arab: "النَّجْمُ يَلْمَعُ", latin: "AN-NAJMU YALMA'U", ket: "Kalimat: bintang itu berkilau (Al Syamsiyah)" },
      { arab: "هَذَا كِتَابٌ", latin: "HAADZAA KITAABUN", ket: "Kalimat: ini adalah buku" },
      { arab: "مِنْ أَيْنَ هَذَا", latin: "MIN AINA HAADZAA", ket: "Kalimat tanya: dari mana ini?" }
    ]
  },
  {
    id: "i6", warna: "#2FA84F", judul: "Jilid 6", deskripsi: "Tajwid dasar & Surat Al-Fatihah",
    tujuan: "Mengenal qalqalah, ghunnah, mad panjang lanjutan, dan membaca Surat Al-Fatihah.",
    kartu: [
      { arab: "قَبْ", latin: "QAB", ket: "Qalqalah pada huruf qaf sukun" },
      { arab: "أَدْ", latin: "AD", ket: "Qalqalah pada huruf dal sukun" },
      { arab: "إِنَّ", latin: "INNA", ket: "Ghunnah, dengung pada nun bertasydid" },
      { arab: "ثُمَّ", latin: "TSUMMA", ket: "Ghunnah pada mim bertasydid" },
      { arab: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", latin: "BISMILLAAHIRRAHMAANIRRAHIIM", ket: "Dengan nama Allah Yang Maha Pengasih, Maha Penyayang" },
      { arab: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ", latin: "ALHAMDU LILLAAHI RABBIL 'AALAMIIN", ket: "Segala puji bagi Allah, Tuhan semesta alam" },
      { arab: "الرَّحْمَٰنِ الرَّحِيمِ", latin: "ARRAHMAANIRRAHIIM", ket: "Yang Maha Pengasih, Maha Penyayang" },
      { arab: "مَالِكِ يَوْمِ الدِّينِ", latin: "MAALIKI YAUMIDDIIN", ket: "Yang menguasai hari pembalasan" },
      { arab: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ", latin: "IYYAAKA NA'BUDU WA IYYAAKA NASTA'IIN", ket: "Hanya kepada-Mu kami menyembah dan memohon pertolongan" },
      { arab: "جَاءَ", latin: "JAA-A", ket: "Mad Wajib Muttashil: mad bertemu hamzah dalam satu kata, dibaca 4-5 harakat" },
      { arab: "سُوءٌ", latin: "SUU-UN", ket: "Contoh lain Mad Wajib Muttashil, pada huruf wau" },
      { arab: "فِي أَنفُسِكُمْ", latin: "FII ANFUSIKUM", ket: "Mad Jaiz Munfashil: mad bertemu hamzah di kata berikutnya" },
      { arab: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ", latin: "IHDINASH SHIRAATHAL MUSTAQIIM", ket: "Lanjutan Al-Fatihah: tunjukilah kami jalan yang lurus" },
      { arab: "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ", latin: "SHIRAATHAL LADZIINA AN'AMTA 'ALAIHIM", ket: "Lanjutan Al-Fatihah: jalan mereka yang telah Engkau beri nikmat" },
      { arab: "غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ", latin: "GHAIRIL MAGHDHUUBI 'ALAIHIM", ket: "Lanjutan Al-Fatihah: bukan jalan mereka yang dimurkai" },
      { arab: "وَلَا الضَّالِّينَ", latin: "WALADH DHAALLIIN", ket: "Penutup Al-Fatihah: dan bukan pula jalan mereka yang sesat" }
    ]
  },
  {
    id: "i7", warna: "#1B7A72", judul: "Jilid 7 · Bonus", deskripsi: "Yuk lanjut ke Al-Qur'an!",
    tujuan: "Setelah lancar Iqro Jilid 1-6, latihan membaca surat-surat pendek dalam Al-Qur'an (Juz Amma).",
    kartu: [
      { arab: "قُلْ أَعُوذُ بِرَبِّ النَّاسِ", latin: "QUL A'UUDZU BIRABBIN NAAS", ket: "An-Naas ayat 1: Katakanlah, aku berlindung kepada Tuhan manusia" },
      { arab: "مَلِكِ النَّاسِ", latin: "MALIKIN NAAS", ket: "An-Naas ayat 2: Raja manusia" },
      { arab: "إِلَٰهِ النَّاسِ", latin: "ILAAHIN NAAS", ket: "An-Naas ayat 3: Sembahan manusia" },
      { arab: "مِنْ شَرِّ الْوَسْوَاسِ الْخَنَّاسِ", latin: "MIN SYARRIL WASWAASIL KHANNAAS", ket: "An-Naas ayat 4: Dari kejahatan bisikan setan yang bersembunyi" },
      { arab: "الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ", latin: "ALLADZII YUWASWISU FII SHUDUURIN NAAS", ket: "An-Naas ayat 5: Yang membisikkan kejahatan ke dalam dada manusia" },
      { arab: "مِنَ الْجِنَّةِ وَالنَّاسِ", latin: "MINAL JINNATI WAN NAAS", ket: "An-Naas ayat 6: Dari golongan jin dan manusia" },
      { arab: "قُلْ هُوَ اللَّهُ أَحَدٌ", latin: "QUL HUWALLAAHU AHAD", ket: "Al-Ikhlas ayat 1: Katakanlah, Dialah Allah Yang Maha Esa" },
      { arab: "اللَّهُ الصَّمَدُ", latin: "ALLAAHUSH SHAMAD", ket: "Al-Ikhlas ayat 2: Allah tempat bergantung segala sesuatu" },
      { arab: "لَمْ يَلِدْ وَلَمْ يُولَدْ", latin: "LAM YALID WA LAM YUULAD", ket: "Al-Ikhlas ayat 3: Dia tiada beranak dan tiada diperanakkan" },
      { arab: "وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ", latin: "WA LAM YAKUL LAHUU KUFUWAN AHAD", ket: "Al-Ikhlas ayat 4: Tidak ada satu pun yang setara dengan-Nya" },
      { arab: "وَالْعَصْرِ", latin: "WAL 'ASHR", ket: "Al-'Ashr ayat 1: Demi masa" },
      { arab: "إِنَّ الْإِنسَانَ لَفِي خُسْرٍ", latin: "INNAL INSAANA LAFII KHUSR", ket: "Al-'Ashr ayat 2: Sesungguhnya manusia benar-benar dalam kerugian" },
      { arab: "إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ وَتَوَاصَوْا بِالْحَقِّ وَتَوَاصَوْا بِالصَّبْرِ", latin: "ILLAL LADZIINA AAMANUU WA 'AMILUSH SHAALIHAATI WA TAWAASHAU BIL HAQQI WA TAWAASHAU BISH SHABR", ket: "Al-'Ashr ayat 3: Kecuali orang beriman, beramal saleh, saling menasihati dalam kebenaran dan kesabaran" },
      { arab: "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ", latin: "QUL A'UUDZU BIRABBIL FALAQ", ket: "Al-Falaq ayat 1: Katakanlah, aku berlindung kepada Tuhan yang menguasai subuh" },
      { arab: "مِنْ شَرِّ مَا خَلَقَ", latin: "MIN SYARRI MAA KHALAQ", ket: "Al-Falaq ayat 2: Dari kejahatan makhluk-Nya" },
      { arab: "وَمِنْ شَرِّ غَاسِقٍ إِذَا وَقَبَ", latin: "WA MIN SYARRI GHAASIQIN IDZAA WAQAB", ket: "Al-Falaq ayat 3: Dari kejahatan malam apabila gelap gulita" },
      { arab: "وَمِنْ شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ", latin: "WA MIN SYARRIN NAFFAATSAATI FIL 'UQAD", ket: "Al-Falaq ayat 4: Dari kejahatan tukang sihir yang meniup pada buhul-buhul" },
      { arab: "وَمِنْ شَرِّ حَاسِدٍ إِذَا حَسَدَ", latin: "WA MIN SYARRI HAASIDIN IDZAA HASAD", ket: "Al-Falaq ayat 5: Dari kejahatan orang yang dengki apabila ia dengki" },
      { arab: "إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ", latin: "INNAA A'THAINAAKAL KAUTSAR", ket: "Al-Kautsar ayat 1: Sungguh, Kami telah memberimu nikmat yang banyak" },
      { arab: "فَصَلِّ لِرَبِّكَ وَانْحَرْ", latin: "FASHALLI LIRABBIKA WANHAR", ket: "Al-Kautsar ayat 2: Maka laksanakanlah salat karena Tuhanmu, dan berkurbanlah" },
      { arab: "إِنَّ شَانِئَكَ هُوَ الْأَبْتَرُ", latin: "INNA SYAANI-AKA HUWAL ABTAR", ket: "Al-Kautsar ayat 3: Sungguh, orang yang membencimu dialah yang terputus" }
    ]
  }
];

// ============================================================
// DATA KONTEN — BELAJAR SHOLAT
// ============================================================
const SHOLAT_MODULES = [
  {
    id: "s1", warna: "#7C83FD", judul: "Wudhu", deskripsi: "Bersuci sebelum sholat",
    tujuan: "Belajar niat dan urutan gerakan wudhu yang benar sebelum sholat.",
    kartu: [
      { arab: "نَوَيْتُ الْوُضُوءَ لِرَفْعِ الْحَدَثِ الْأَصْغَرِ فَرْضًا لِلَّهِ تَعَالَى", latin: "NAWAITUL WUDHUU-A LIRAF'IL HADATSIL ASHGHARI FARDHOL LILLAAHI TA'AALAA", ket: "Niat wudhu: menghilangkan hadas kecil, fardhu karena Allah" },
      { arab: "غَسْلُ الْيَدَيْنِ", latin: "GHASLUL YADAIN", ket: "Membasuh kedua telapak tangan, 3 kali" },
      { arab: "الْمَضْمَضَةُ", latin: "AL-MADHMADHAH", ket: "Berkumur-kumur membersihkan mulut, 3 kali" },
      { arab: "الِاسْتِنْشَاقُ", latin: "AL-ISTINSYAAQ", ket: "Memasukkan air ke hidung lalu mengeluarkannya, 3 kali" },
      { arab: "غَسْلُ الْوَجْهِ", latin: "GHASLUL WAJHI", ket: "Membasuh seluruh wajah, dari batas rambut sampai dagu, 3 kali" },
      { arab: "غَسْلُ الْيَدَيْنِ إِلَى الْمِرْفَقَيْنِ", latin: "GHASLUL YADAINI ILAL MIRFAQAIN", ket: "Membasuh tangan sampai siku, mulai kanan, 3 kali" },
      { arab: "مَسْحُ الرَّأْسِ", latin: "MASHUR RA'SI", ket: "Mengusap sebagian atau seluruh kepala dengan tangan basah" },
      { arab: "مَسْحُ الْأُذُنَيْنِ", latin: "MASHUL UDZUNAIN", ket: "Mengusap bagian luar dan dalam kedua telinga" },
      { arab: "غَسْلُ الرِّجْلَيْنِ إِلَى الْكَعْبَيْنِ", latin: "GHASLUR RIJLAINI ILAL KA'BAIN", ket: "Membasuh kaki sampai mata kaki, mulai kanan, 3 kali" },
      { arab: "أَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا اللَّهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا رَسُولُ اللَّهِ", latin: "ASYHADU ALLAA ILAAHA ILLALLAAH WA ASYHADU ANNA MUHAMMADAR RASUULULLAAH", ket: "Doa setelah wudhu: bersaksi tiada Tuhan selain Allah dan Nabi Muhammad utusan-Nya" }
    ]
  },
  {
    id: "s2", warna: "#FF6F59", judul: "Gerakan Sholat 1", deskripsi: "Niat sampai I'tidal",
    tujuan: "Belajar bacaan dari niat, takbir, Al-Fatihah, ruku', sampai i'tidal.",
    kartu: [
      { arab: "أُصَلِّي فَرْضَ الصُّبْحِ رَكْعَتَيْنِ مُسْتَقْبِلَ الْقِبْلَةِ أَدَاءً لِلَّهِ تَعَالَى", latin: "USHALLII FARDHASH SHUBHI RAK'ATAINI MUSTAQBILAL QIBLATI ADAA-AL LILLAAHI TA'AALAA", ket: "Contoh niat sholat Subuh 2 rakaat" },
      { arab: "اللَّهُ أَكْبَرُ", latin: "ALLAAHU AKBAR", ket: "Takbiratul ihram: mengangkat kedua tangan sambil mengucap Allahu Akbar, tanda mulai sholat" },
      { arab: "اللَّهُمَّ بَاعِدْ بَيْنِي وَبَيْنَ خَطَايَايَ", latin: "ALLAAHUMMA BAA'ID BAINII WA BAINA KHATHAAYAAYA", ket: "Doa iftitah: memohon dijauhkan dari kesalahan" },
      { arab: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", latin: "BISMILLAAHIR RAHMAANIR RAHIIM", ket: "Awal Surat Al-Fatihah, wajib dibaca tiap rakaat" },
      { arab: "قُلْ هُوَ اللَّهُ أَحَدٌ", latin: "QUL HUWALLAAHU AHAD", ket: "Contoh surat pendek setelah Al-Fatihah" },
      { arab: "سُبْحَانَ رَبِّيَ الْعَظِيمِ", latin: "SUBHAANA RABBIYAL 'AZHIIM", ket: "Bacaan ruku', badan membungkuk 90°, dibaca 3 kali" },
      { arab: "سَمِعَ اللَّهُ لِمَنْ حَمِدَهُ", latin: "SAMI'ALLAAHU LIMAN HAMIDAH", ket: "I'tidal: bangkit dari ruku' sambil mengangkat tangan" }
    ]
  },
  {
    id: "s3", warna: "#2FA84F", judul: "Gerakan Sholat 2", deskripsi: "Sujud sampai Salam",
    tujuan: "Belajar bacaan sujud, tasyahud, sholawat, sampai salam penutup sholat.",
    kartu: [
      { arab: "سُبْحَانَ رَبِّيَ الْأَعْلَى", latin: "SUBHAANA RABBIYAL A'LAA", ket: "Bacaan sujud, dahi menyentuh lantai, dibaca 3 kali" },
      { arab: "رَبِّ اغْفِرْ لِي", latin: "RABBIGHFIR LII", ket: "Duduk di antara dua sujud, memohon ampun" },
      { arab: "التَّحِيَّاتُ لِلَّهِ", latin: "ATTAHIYYAATU LILLAAH", ket: "Awal bacaan tasyahud: segala kehormatan bagi Allah" },
      { arab: "اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ", latin: "ALLAAHUMMA SHALLI 'ALAA MUHAMMAD", ket: "Bacaan sholawat pada tasyahud akhir" },
      { arab: "السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ", latin: "ASSALAAMU 'ALAIKUM WA RAHMATULLAAH", ket: "Salam penutup sholat, menoleh ke kanan lalu ke kiri" }
    ]
  }
];

// ============================================================
// DATA KONTEN — BELAJAR TAJWID DASAR
// ============================================================
const TAJWID_MODULES = [
  {
    id: "t1", warna: "#FFC93C", judul: "Nun Mati & Tanwin", deskripsi: "5 hukum bacaan",
    tujuan: "Mengenal 5 hukum bacaan nun mati/tanwin bertemu huruf hijaiyah.",
    kartu: [
      { arab: "مَنْ آمَنَ", latin: "MAN AAMANA", ket: "Izhar: nun mati bertemu huruf tenggorokan, dibaca jelas tanpa dengung" },
      { arab: "مَنْ يَقُولُ", latin: "MAYYAQUULU", ket: "Idgham Bighunnah: nun mati bertemu ي ن م و, melebur disertai dengung" },
      { arab: "مِنْ رَبِّهِمْ", latin: "MIR RABBIHIM", ket: "Idgham Bilaghunnah: nun mati bertemu ل ر, melebur tanpa dengung" },
      { arab: "مِنْ بَعْدِ", latin: "MIM BA'DI", ket: "Iqlab: nun mati bertemu ب, berubah bunyi jadi mim disertai dengung" },
      { arab: "مَنْ كَانَ", latin: "MANGKAANA", ket: "Ikhfa: nun mati bertemu huruf ikhfa lainnya, dibaca samar dengan dengung" }
    ]
  },
  {
    id: "t2", warna: "#7C83FD", judul: "Mim Mati", deskripsi: "3 hukum bacaan",
    tujuan: "Mengenal 3 hukum bacaan mim mati bertemu huruf hijaiyah.",
    kartu: [
      { arab: "هُمْ فِيهَا", latin: "HUM FIIHAA", ket: "Ikhfa Syafawi: mim mati bertemu ب, dibaca samar disertai dengung" },
      { arab: "لَهُمْ مَا", latin: "LAHUM MAA", ket: "Idgham Mimi: mim mati bertemu mim, melebur jadi satu mim berdengung" },
      { arab: "هُمْ نَاصِرُونَ", latin: "HUM NAASHIRUUN", ket: "Izhar Syafawi: mim mati bertemu huruf selain ب dan م, dibaca jelas" }
    ]
  },
  {
    id: "t3", warna: "#E85D9C", judul: "Mad & Qalqalah", deskripsi: "Bacaan panjang & pantul",
    tujuan: "Mengenal jenis-jenis mad (bacaan panjang) dan qalqalah (bacaan pantul).",
    kartu: [
      { arab: "قَالَ", latin: "QAALA", ket: "Mad Thabi'i: bacaan panjang dasar, 2 harakat" },
      { arab: "جَاءَ", latin: "JAA-A", ket: "Mad Wajib Muttashil: mad bertemu hamzah dalam satu kata, 4-5 harakat" },
      { arab: "فِي أَنفُسِكُمْ", latin: "FII ANFUSIKUM", ket: "Mad Jaiz Munfashil: mad bertemu hamzah di kata berikutnya, 4-5 harakat" },
      { arab: "يَقْطَعُونَ", latin: "YAQTHA'UUNA", ket: "Qalqalah Sughra: huruf qalqalah sukun di tengah kata, dipantulkan ringan" },
      { arab: "الْفَلَقِ", latin: "AL-FALAQ", ket: "Qalqalah Kubra: huruf qalqalah di akhir kata/waqaf, dipantulkan lebih kuat" }
    ]
  }
];

// ============================================================
// DATA KONTEN — KISAH 25 NABI & RASUL
// ============================================================
const NABI_MODULES = [
  {
    id: "n1", warna: "#FF6F59", judul: "Nabi Adam - Ishaq", deskripsi: "9 Nabi pertama",
    tujuan: "Mengenal kisah singkat 9 Nabi pertama, dari Nabi Adam sampai Nabi Ishaq.",
    kartu: [
      { arab: "آدَم", latin: "Adam AS", ket: "Manusia dan nabi pertama, diciptakan Allah dari tanah, ayah seluruh manusia" },
      { arab: "إِدْرِيس", latin: "Idris AS", ket: "Dikenal ahli ilmu, orang pertama yang pandai menulis dan menjahit" },
      { arab: "نُوح", latin: "Nuh AS", ket: "Berdakwah ratusan tahun, membuat kapal besar agar umatnya selamat" },
      { arab: "هُود", latin: "Hud AS", ket: "Diutus untuk kaum 'Ad yang sombong dan menyembah berhala" },
      { arab: "صَالِح", latin: "Shaleh AS", ket: "Diutus untuk kaum Tsamud, mukjizatnya unta betina keluar dari batu" },
      { arab: "إِبْرَاهِيم", latin: "Ibrahim AS", ket: "Bapak para nabi, sangat tabah, membangun Ka'bah bersama putranya" },
      { arab: "لُوط", latin: "Luth AS", ket: "Berdakwah kepada kaumnya yang berperilaku menyimpang" },
      { arab: "إِسْمَاعِيل", latin: "Ismail AS", ket: "Putra Nabi Ibrahim yang ikhlas, sumber mata air Zamzam" },
      { arab: "إِسْحَاق", latin: "Ishaq AS", ket: "Putra Nabi Ibrahim, ayah dari Nabi Ya'qub" }
    ]
  },
  {
    id: "n2", warna: "#7C83FD", judul: "Nabi Ya'qub - Sulaiman", deskripsi: "9 Nabi berikutnya",
    tujuan: "Mengenal kisah singkat 9 Nabi, dari Nabi Ya'qub sampai Nabi Sulaiman.",
    kartu: [
      { arab: "يَعْقُوب", latin: "Ya'qub AS", ket: "Ayah dari 12 anak, salah satunya Nabi Yusuf" },
      { arab: "يُوسُف", latin: "Yusuf AS", ket: "Terkenal tampan dan pandai menafsirkan mimpi, sabar menghadapi ujian" },
      { arab: "أَيُّوب", latin: "Ayyub AS", ket: "Terkenal sangat sabar menghadapi sakit dan ujian bertahun-tahun" },
      { arab: "شُعَيْب", latin: "Syu'aib AS", ket: "Diutus untuk kaum Madyan agar jujur dalam berdagang" },
      { arab: "هَارُون", latin: "Harun AS", ket: "Kakak Nabi Musa, membantu berdakwah karena pandai berbicara" },
      { arab: "مُوسَى", latin: "Musa AS", ket: "Diberi mukjizat tongkat jadi ular dan membelah Laut Merah" },
      { arab: "ذُو الْكِفْل", latin: "Zulkifli AS", ket: "Dikenal sabar dan tekun menjalankan tugas serta ibadahnya" },
      { arab: "دَاوُد", latin: "Daud AS", ket: "Diberi Kitab Zabur dan suara merdu, bisa melunakkan besi" },
      { arab: "سُلَيْمَان", latin: "Sulaiman AS", ket: "Putra Nabi Daud, bisa berbicara dengan hewan dan memerintah jin" }
    ]
  },
  {
    id: "n3", warna: "#2FA84F", judul: "Nabi Ilyas - Muhammad", deskripsi: "7 Nabi penutup",
    tujuan: "Mengenal kisah singkat 7 Nabi terakhir, dari Nabi Ilyas sampai Nabi Muhammad SAW.",
    kartu: [
      { arab: "إِلْيَاس", latin: "Ilyas AS", ket: "Mengajak kaumnya berhenti menyembah berhala bernama Ba'al" },
      { arab: "اَلْيَسَع", latin: "Ilyasa AS", ket: "Meneruskan dakwah Nabi Ilyas kepada Bani Israil" },
      { arab: "يُونُس", latin: "Yunus AS", ket: "Pernah ditelan ikan besar, selamat karena banyak berdzikir" },
      { arab: "زَكَرِيَّا", latin: "Zakariya AS", ket: "Berdoa sungguh-sungguh hingga dikaruniai anak di usia tua" },
      { arab: "يَحْيَى", latin: "Yahya AS", ket: "Putra Nabi Zakariya, sejak kecil sudah rajin beribadah" },
      { arab: "عِيسَى", latin: "Isa AS", ket: "Diberi mukjizat bisa bicara sejak bayi dan menyembuhkan orang sakit" },
      { arab: "مُحَمَّد", latin: "Muhammad SAW", ket: "Nabi dan Rasul terakhir, teladan akhlak mulia bagi seluruh manusia" }
    ]
  }
];

// ============================================================
// DATA KONTEN — BELAJAR BAHASA ARAB (kosakata & percakapan dasar)
// ============================================================
const ARAB_MODULES = [
  {
    id: "a1", warna: "#FF9F43", judul: "Salam & Sapaan", deskripsi: "Ucapan sehari-hari",
    tujuan: "Belajar kata sapaan dan ucapan dasar yang sering dipakai sehari-hari.",
    kartu: [
      { arab: "السَّلَامُ عَلَيْكُمْ", latin: "Assalaamu'alaikum", ket: "Artinya: semoga keselamatan untukmu (salam pembuka)" },
      { arab: "وَعَلَيْكُمُ السَّلَامُ", latin: "Wa'alaikumussalaam", ket: "Artinya: dan untukmu juga keselamatan (jawaban salam)" },
      { arab: "صَبَاحُ الْخَيْرِ", latin: "Shobaahul khoir", ket: "Artinya: selamat pagi" },
      { arab: "مَسَاءُ الْخَيْرِ", latin: "Masaa-ul khoir", ket: "Artinya: selamat sore/malam" },
      { arab: "شُكْرًا", latin: "Syukron", ket: "Artinya: terima kasih" },
      { arab: "عَفْوًا", latin: "'Afwan", ket: "Artinya: sama-sama / maaf" },
      { arab: "مِنْ فَضْلِكَ", latin: "Min fadhlik", ket: "Artinya: tolong / silakan" },
      { arab: "مَعَ السَّلَامَةِ", latin: "Ma'assalaamah", ket: "Artinya: sampai jumpa" },
      { arab: "نَعَمْ", latin: "Na'am", ket: "Artinya: ya" },
      { arab: "لَا", latin: "Laa", ket: "Artinya: tidak" }
    ]
  },
  {
    id: "a2", warna: "#FFC93C", judul: "Angka 1-10", deskripsi: "Berhitung dalam Bahasa Arab",
    tujuan: "Menghafal angka 1 sampai 10 dalam Bahasa Arab.",
    kartu: [
      { arab: "وَاحِد", latin: "Waahid", ket: "Artinya: satu (1)" },
      { arab: "اِثْنَانِ", latin: "Itsnaan", ket: "Artinya: dua (2)" },
      { arab: "ثَلَاثَة", latin: "Tsalaatsah", ket: "Artinya: tiga (3)" },
      { arab: "أَرْبَعَة", latin: "Arba'ah", ket: "Artinya: empat (4)" },
      { arab: "خَمْسَة", latin: "Khamsah", ket: "Artinya: lima (5)" },
      { arab: "سِتَّة", latin: "Sittah", ket: "Artinya: enam (6)" },
      { arab: "سَبْعَة", latin: "Sab'ah", ket: "Artinya: tujuh (7)" },
      { arab: "ثَمَانِيَة", latin: "Tsamaaniyah", ket: "Artinya: delapan (8)" },
      { arab: "تِسْعَة", latin: "Tis'ah", ket: "Artinya: sembilan (9)" },
      { arab: "عَشَرَة", latin: "'Asyarah", ket: "Artinya: sepuluh (10)" }
    ]
  },
  {
    id: "a3", warna: "#7C83FD", judul: "Keluarga", deskripsi: "Anggota keluarga",
    tujuan: "Mengenal kata-kata anggota keluarga dalam Bahasa Arab.",
    kartu: [
      { arab: "أَب", latin: "Ab", ket: "Artinya: ayah" },
      { arab: "أُمّ", latin: "Umm", ket: "Artinya: ibu" },
      { arab: "أَخ", latin: "Akh", ket: "Artinya: saudara laki-laki" },
      { arab: "أُخْت", latin: "Ukht", ket: "Artinya: saudara perempuan" },
      { arab: "جَدّ", latin: "Jadd", ket: "Artinya: kakek" },
      { arab: "جَدَّة", latin: "Jaddah", ket: "Artinya: nenek" },
      { arab: "اِبْن", latin: "Ibn", ket: "Artinya: anak laki-laki" },
      { arab: "بِنْت", latin: "Bint", ket: "Artinya: anak perempuan" },
      { arab: "بَيْت", latin: "Bait", ket: "Artinya: rumah" }
    ]
  },
  {
    id: "a4", warna: "#2FA84F", judul: "Warna & Benda", deskripsi: "Warna dan benda sekitar",
    tujuan: "Mengenal nama-nama warna dan benda yang sering ditemui sehari-hari.",
    kartu: [
      { arab: "أَحْمَر", latin: "Ahmar", ket: "Artinya: warna merah" },
      { arab: "أَصْفَر", latin: "Ashfar", ket: "Artinya: warna kuning" },
      { arab: "أَخْضَر", latin: "Akhdhar", ket: "Artinya: warna hijau" },
      { arab: "أَزْرَق", latin: "Azraq", ket: "Artinya: warna biru" },
      { arab: "أَبْيَض", latin: "Abyadh", ket: "Artinya: warna putih" },
      { arab: "أَسْوَد", latin: "Aswad", ket: "Artinya: warna hitam" },
      { arab: "كِتَاب", latin: "Kitaab", ket: "Artinya: buku" },
      { arab: "قَلَم", latin: "Qalam", ket: "Artinya: pena/pensil" },
      { arab: "مَدْرَسَة", latin: "Madrasah", ket: "Artinya: sekolah" },
      { arab: "مَاء", latin: "Maa'", ket: "Artinya: air" }
    ]
  },
  {
    id: "a5", warna: "#E85D9C", judul: "Percakapan Dasar", deskripsi: "Kalimat sehari-hari",
    tujuan: "Menyusun kata-kata dasar menjadi kalimat percakapan sederhana.",
    kartu: [
      { arab: "مَا اسْمُكَ؟", latin: "Maa ismuka?", ket: "Artinya: siapa namamu? (untuk laki-laki)" },
      { arab: "اسْمِي أَحْمَد", latin: "Ismii Ahmad", ket: "Artinya: namaku Ahmad" },
      { arab: "كَيْفَ حَالُكَ؟", latin: "Kaifa haaluka?", ket: "Artinya: apa kabar? (untuk laki-laki)" },
      { arab: "أَنَا بِخَيْرٍ", latin: "Anaa bikhoir", ket: "Artinya: aku baik-baik saja" },
      { arab: "مِنْ أَيْنَ أَنْتَ؟", latin: "Min aina anta?", ket: "Artinya: dari mana kamu?" },
      { arab: "أَنَا مِنْ إِنْدُونِيسِيَا", latin: "Anaa min Indoniisiyaa", ket: "Artinya: aku dari Indonesia" },
      { arab: "هَذَا كِتَابِي", latin: "Haadzaa kitaabii", ket: "Artinya: ini bukuku" },
      { arab: "أُحِبُّ الْقِرَاءَةَ", latin: "Uhibbul qiroo-ah", ket: "Artinya: aku suka membaca" }
    ]
  },
  {
    id: "a6", warna: "#F28A36", judul: "Kebun Binatang", deskripsi: "12 teman hewan baru",
    tujuan: "Kenali hewan di sekitarmu. Dengarkan kata Arabnya, lalu tirukan pelan-pelan!",
    kartu: [
      { arab: "قِطّ", latin: "Qithth", ket: "Artinya: kucing" },
      { arab: "كَلْب", latin: "Kalb", ket: "Artinya: anjing" },
      { arab: "أَرْنَب", latin: "Arnab", ket: "Artinya: kelinci" },
      { arab: "أَسَد", latin: "Asad", ket: "Artinya: singa" },
      { arab: "فِيل", latin: "Fiil", ket: "Artinya: gajah" },
      { arab: "زَرَافَة", latin: "Zaraafah", ket: "Artinya: jerapah" },
      { arab: "حِصَان", latin: "Hishaan", ket: "Artinya: kuda" },
      { arab: "سَمَكَة", latin: "Samakah", ket: "Artinya: ikan" },
      { arab: "طَائِر", latin: "Thaa'ir", ket: "Artinya: burung" },
      { arab: "بَطَّة", latin: "Baththah", ket: "Artinya: bebek" },
      { arab: "دَجَاجَة", latin: "Dajaajah", ket: "Artinya: ayam" },
      { arab: "فَرَاشَة", latin: "Faraasyah", ket: "Artinya: kupu-kupu" }
    ]
  },
  {
    id: "a7", warna: "#E76C92", judul: "Piknik Lezat", deskripsi: "Buah, makanan & minuman",
    tujuan: "Apa isi bekalmu? Belajar menyebut buah, makanan, dan minuman dalam Bahasa Arab.",
    kartu: [
      { arab: "تُفَّاح", latin: "Tuffaah", ket: "Artinya: apel" },
      { arab: "مَوْز", latin: "Mauz", ket: "Artinya: pisang" },
      { arab: "بُرْتُقَال", latin: "Burtuqaal", ket: "Artinya: jeruk" },
      { arab: "عِنَب", latin: "'Inab", ket: "Artinya: anggur" },
      { arab: "تَمْر", latin: "Tamr", ket: "Artinya: kurma" },
      { arab: "بَطِّيخ", latin: "Baththiikh", ket: "Artinya: semangka" },
      { arab: "خُبْز", latin: "Khubz", ket: "Artinya: roti" },
      { arab: "أَرُزّ", latin: "Aruzz", ket: "Artinya: nasi / beras" },
      { arab: "حَلِيب", latin: "Haliib", ket: "Artinya: susu" },
      { arab: "عَصِير", latin: "'Ashiir", ket: "Artinya: jus" },
      { arab: "بَيْض", latin: "Baidh", ket: "Artinya: telur" },
      { arab: "جُبْن", latin: "Jubn", ket: "Artinya: keju" }
    ]
  },
  {
    id: "a8", warna: "#9960DF", judul: "Tubuh Hebatku", deskripsi: "Kenali anggota tubuh",
    tujuan: "Tunjuk anggota tubuhmu sambil menirukan kosakata Arab bersama Raqi!",
    kartu: [
      { arab: "رَأْس", latin: "Ra's", ket: "Artinya: kepala" },
      { arab: "شَعْر", latin: "Sya'r", ket: "Artinya: rambut" },
      { arab: "وَجْه", latin: "Wajh", ket: "Artinya: wajah" },
      { arab: "عَيْن", latin: "'Ain", ket: "Artinya: mata" },
      { arab: "أَنْف", latin: "Anf", ket: "Artinya: hidung" },
      { arab: "فَم", latin: "Fam", ket: "Artinya: mulut" },
      { arab: "أُذُن", latin: "Udzun", ket: "Artinya: telinga" },
      { arab: "يَد", latin: "Yad", ket: "Artinya: tangan" },
      { arab: "إِصْبَع", latin: "Ishba'", ket: "Artinya: jari" },
      { arab: "قَدَم", latin: "Qadam", ket: "Artinya: kaki" },
      { arab: "سِنّ", latin: "Sinn", ket: "Artinya: gigi" },
      { arab: "لِسَان", latin: "Lisaan", ket: "Artinya: lidah" }
    ]
  },
  {
    id: "a9", warna: "#63AF55", judul: "Jelajah Alam", deskripsi: "Langit, laut & taman",
    tujuan: "Jelajahi alam ciptaan Allah dan sebutkan namanya dalam Bahasa Arab.",
    kartu: [
      { arab: "شَمْس", latin: "Syams", ket: "Artinya: matahari" },
      { arab: "قَمَر", latin: "Qamar", ket: "Artinya: bulan" },
      { arab: "نَجْم", latin: "Najm", ket: "Artinya: bintang" },
      { arab: "سَمَاء", latin: "Samaa'", ket: "Artinya: langit" },
      { arab: "سَحَاب", latin: "Sahaab", ket: "Artinya: awan" },
      { arab: "مَطَر", latin: "Mathar", ket: "Artinya: hujan" },
      { arab: "بَحْر", latin: "Bahr", ket: "Artinya: laut" },
      { arab: "نَهْر", latin: "Nahr", ket: "Artinya: sungai" },
      { arab: "جَبَل", latin: "Jabal", ket: "Artinya: gunung" },
      { arab: "شَجَرَة", latin: "Syajarah", ket: "Artinya: pohon" },
      { arab: "زَهْرَة", latin: "Zahrah", ket: "Artinya: bunga" },
      { arab: "رَمْل", latin: "Raml", ket: "Artinya: pasir" }
    ]
  }
];

const DOA_MODULES = [
  {
    id: "d1", warna: "#2FA84F", judul: "Doa di Rumah", deskripsi: "Bangun tidur sampai tidur lagi",
    tujuan: "Menghafal doa-doa pendek yang dibaca sehari-hari di rumah, dari bangun tidur sampai mau tidur lagi.",
    kartu: [
      { arab: "الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ", latin: "ALHAMDU LILLAAHIL LADZII AHYAANAA BA'DA MAA AMAATANAA WA ILAIHIN NUSYUUR", ket: "Doa bangun tidur: memuji Allah yang menghidupkan kami kembali setelah tidur" },
      { arab: "اللَّهُمَّ بَارِكْ لَنَا فِيمَا رَزَقْتَنَا وَقِنَا عَذَابَ النَّارِ", latin: "ALLAAHUMMA BAARIK LANAA FIIMAA RAZAQTANAA WA QINAA 'ADZAABAN NAAR", ket: "Doa sebelum makan: memohon berkah atas rezeki yang diberikan" },
      { arab: "الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِينَ", latin: "ALHAMDU LILLAAHIL LADZII ATH'AMANAA WA SAQOONAA WA JA'ALANAA MUSLIMIIN", ket: "Doa sesudah makan: bersyukur atas makan dan minum yang diberikan" },
      { arab: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْخُبُثِ وَالْخَبَائِثِ", latin: "ALLAAHUMMA INNII A'UUDZU BIKA MINAL KHUBUTSI WAL KHABAA-ITS", ket: "Doa masuk kamar mandi: memohon perlindungan dari gangguan setan" },
      { arab: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا", latin: "BISMIKA ALLAAHUMMA AMUUTU WA AHYAA", ket: "Doa sebelum tidur: menyerahkan diri kepada Allah sebelum terlelap" }
    ]
  },
  {
    id: "d2", warna: "#7C83FD", judul: "Doa Bepergian", deskripsi: "Keluar rumah sampai belajar",
    tujuan: "Menghafal doa-doa pendek saat keluar rumah, naik kendaraan, masuk-keluar masjid, dan sebelum belajar.",
    kartu: [
      { arab: "بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ", latin: "BISMILLAAHI TAWAKKALTU 'ALALLAAHI WA LAA HAWLA WA LAA QUWWATA ILLAA BILLAAH", ket: "Doa keluar rumah: berserah diri dan memohon kekuatan dari Allah" },
      { arab: "سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَٰذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ", latin: "SUBHAANALLADZII SAKHKHARA LANAA HAADZAA WA MAA KUNNAA LAHUU MUQRINIIN", ket: "Doa naik kendaraan: mensucikan Allah yang menundukkan kendaraan untuk kita" },
      { arab: "اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ", latin: "ALLAAHUMMAF TAHLII ABWAABA RAHMATIK", ket: "Doa masuk masjid: memohon dibukakan pintu-pintu rahmat Allah" },
      { arab: "اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ", latin: "ALLAAHUMMA INNII AS-ALUKA MIN FADHLIK", ket: "Doa keluar masjid: memohon karunia dan keutamaan dari Allah" },
      { arab: "رَبِّ زِدْنِي عِلْمًا", latin: "RABBI ZIDNII 'ILMAA", ket: "Doa sebelum belajar: memohon tambahan ilmu yang bermanfaat" }
    ]
  },
  {
    id: "d3", warna: "#FFC93C", judul: "Doa Kebaikan", deskripsi: "Orang tua sampai akhlak mulia",
    tujuan: "Menghafal doa-doa pendek untuk kedua orang tua, penutup majelis, dan memohon akhlak yang baik.",
    kartu: [
      { arab: "رَبِّ اغْفِرْ لِي وَلِوَالِدَيَّ وَارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا", latin: "RABBIGHFIRLII WA LIWAALIDAYYA WARHAMHUMAA KAMAA RABBAYAANII SHAGHIIRAA", ket: "Doa untuk kedua orang tua: memohon ampunan dan kasih sayang untuk mereka" },
      { arab: "سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ أَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا أَنْتَ أَسْتَغْفِرُكَ وَأَتُوبُ إِلَيْكَ", latin: "SUBHAANAKALLAAHUMMA WA BIHAMDIKA ASYHADU ALLAA ILAAHA ILLAA ANTA ASTAGHFIRUKA WA ATUUBU ILAIK", ket: "Doa penutup majelis: memohon ampun sebelum mengakhiri pertemuan" },
      { arab: "الْحَمْدُ لِلَّهِ", latin: "ALHAMDULILLAAH", ket: "Diucapkan ketika bersin, sebagai rasa syukur kepada Allah" },
      { arab: "اللَّهُمَّ رَبَّ هَٰذِهِ الدَّعْوَةِ التَّامَّةِ", latin: "ALLAAHUMMA RABBA HAADZIHID DA'WATIT TAAMMAH", ket: "Doa saat mendengar adzan: memuji Allah pemilik seruan yang sempurna" },
      { arab: "اللَّهُمَّ كَمَا حَسَّنْتَ خَلْقِي فَحَسِّنْ خُلُقِي", latin: "ALLAAHUMMA KAMAA HASSANTA KHALQII FAHASSIN KHULUQII", ket: "Doa bercermin: memohon akhlak yang baik seperti bentuk tubuh yang baik" }
    ]
  }
];

const APP_DATA = {
  iqro: Object.assign({}, CATEGORY_META.iqro, { modules: IQRO_MODULES }),
  sholat: Object.assign({}, CATEGORY_META.sholat, { modules: SHOLAT_MODULES }),
  tajwid: Object.assign({}, CATEGORY_META.tajwid, { modules: TAJWID_MODULES }),
  nabi: Object.assign({}, CATEGORY_META.nabi, { modules: NABI_MODULES }),
  arab: Object.assign({}, CATEGORY_META.arab, { modules: ARAB_MODULES }),
  doa: Object.assign({}, CATEGORY_META.doa, { modules: DOA_MODULES })
};
