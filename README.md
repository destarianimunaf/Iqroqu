# IqroQu

Game belajar Islam untuk anak: Iqro, Qur'an, tajwid, sholat, kisah nabi, bahasa
Arab, dan doa harian. Semua pelajaran dan lima mini-game berjalan di browser,
tanpa akun, server aplikasi, framework, atau proses build.

## Menjalankan aplikasi

Dari folder utama proyek:

```sh
python3 -m http.server 4173
```

Buka <http://localhost:4173>. Saat deploy, sertakan `index.html`, `src/`, dan
`assets/` sekaligus. Jangan hanya mengunggah HTML-nya.

## Peta folder

```text
index.html                 Kerangka halaman dan urutan pemuatan skrip
src/
  app.js                   Titik masuk dan perpindahan layar
  state.js                 Progres, favorit, XP, streak, dan state permainan
  audio.js                 Pemutaran contoh suara, fallback, dan musik latar
  ui.js                    Ikon, komponen bersama, dan helper tampilan
  data/
    categories.js          Label, warna, dan pilihan game setiap kategori
    lessons.js             Semua isi pelajaran dan urutan kartu
    images.js              Jalur ilustrasi yang dipakai tampilan
  screens/
    menu.js                Beranda, pencapaian, favorit, dan pengaturan
    lessons.js             Peta modul dan kartu belajar
    games.js               Menu game, lima mini-game, dan hasil permainan
    welcome.js             Intro promosi IqroQu
  styles/
    base.css               Gaya dasar komponen
    game.css               Tema taman bermain, responsif, dan animasi
assets/
  images/                  Ilustrasi yang sebelumnya tertanam di HTML
  audio/                   MP3, manifest.js, dan catatan sumber rekaman
scripts/
  generate_arabic_audio.py  Membuat ulang contoh audio
tests/
  audio.test.cjs           Audio, lanjut kartu, dan resume pelajaran
  progress.test.cjs        Progres, XP, streak, timer, dan reset
  static.test.cjs          Jalur berkas tampilan dan aset
  helpers/load-app.cjs     Memuat skrip dengan urutan yang sama seperti browser
```

### Mulai mengubah dari mana?

| Yang ingin diubah | Berkas |
| --- | --- |
| Kata Arab, arti, dan contoh pelajaran | `src/data/lessons.js` |
| Judul dunia belajar dan warna kategori | `src/data/categories.js` |
| Gambar Raqi atau ilustrasi kartu | `assets/images/` dan `src/data/images.js` |
| Intro saat pertama buka | `src/screens/welcome.js` |
| Tombol “Aku bisa!” dan perpindahan kartu | `src/screens/lessons.js` |
| Warna, ukuran, tampilan HP, dan motion | `src/styles/game.css` |
| Suara dan penanganan gagal memutar | `src/audio.js` |

Skrip memakai JavaScript biasa dan dimuat berurutan dengan `defer` di
`index.html`; `src/app.js` dijalankan paling akhir setelah data dan fungsi siap.
Tidak ada bundler atau dependensi runtime baru.

**Jangan mengganti ID modul atau menyisipkan kartu di tengah modul lama.**
Progres menyimpan ID modul dan indeks kartu. Tambahkan modul baru untuk materi
tambahan agar progres pengguna lama tidak bergeser.

## Progres pemain

Progres, favorit, XP, musik, dan streak tersimpan di localStorage perangkat.
Semua kunci penyimpanan lama tetap dipakai. Setiap 100 XP menaikkan level;
misi harian menghitung 20 XP pada hari kalender yang sama. Reset di Pengaturan
juga menghapus progres misi harian.

## Motion

Intro promosi tanpa suara muncul sekali per tab, bisa dilewati atau diputar
ulang lewat **Putar intro IqroQu** di beranda. Pengaturan perangkat “kurangi
gerakan” menonaktifkan animasi tanpa menyembunyikan isinya.

**Aku bisa!** menyimpan kartu lalu otomatis berpindah dengan sapuan seperti air
dan slide. Kartu terakhir membuka menu game. Ketukan cepat tidak melompati
kartu; keluar dari pelajaran membatalkan perpindahan yang masih menunggu.
Saat “kurangi gerakan” aktif, kartu langsung berlanjut tanpa animasi.

## Pelafalan dan audio

Bahasa Arab memiliki sembilan unit, termasuk 48 kata tambahan tentang hewan,
makanan, tubuh, dan alam. ID serta posisi kartu unit lama tetap sama.

Kosakata memakai MP3 bawaan dengan suara Arab Saudi Microsoft
`ar-SA-HamedNeural`. Huruf hijaiyah berharakat memakai rekaman manusia dari
**Marked Hijaiyah Letters' Pronunciation Dataset** berlisensi CC0. Latihan
beberapa huruf memutar suku kata berurutan, bukan mengeja nama huruf.
**Pelan-pelan** memperlambat suara tanpa mengubah nadanya.

Pemutar memakai ulang elemen audio untuk rangkaian suku kata di Safari,
mencoba ulang satu kali bila file gagal dimuat, lalu memakai suara perangkat
sebagai cadangan. Pindah layar atau memutar contoh baru menghentikan audio lama.
File diambil sesuai kebutuhan dari situs yang sama, tanpa API key atau layanan
TTS saat bermain. Musik latar bersifat opsional.

Materi lain, termasuk Qur'an dan tajwid, masih memakai suara perangkat.
Audio ini bukan pengganti bimbingan guru untuk makhraj/tajwid. Sumber, lisensi,
dan keterbatasan pelafalan dijelaskan di [catatan sumber audio](assets/audio/SOURCES.md).

### Membuat ulang contoh audio

MP3 yang sudah tersedia tidak perlu dibuat ulang untuk menjalankan aplikasi.
Untuk regenerasi, pasang `edge-tts==7.2.3` dan `ffmpeg`, lalu jalankan:

```sh
python3 scripts/generate_arabic_audio.py
```

Skrip membaca `src/data/lessons.js` dan menulis `assets/audio/manifest.js`.
MP3 yang sudah ada dipakai ulang; hapus satu MP3 jika ingin membuat ulang
contoh tersebut. Jangan mengedit manifest hasil generator secara manual.

## Pemeriksaan

Dengan Node.js:

```sh
node --test tests/*.test.cjs
```

Mencakup ketersediaan aset, audio tanpa suara Arab perangkat, urutan suku kata,
pemutaran pelan, retry/fallback, interupsi navigasi, lanjut kartu, resume,
localStorage, XP, streak, unlock modul, dan reset.

## Ilustrasi dan font

Taman bermain adalah ilustrasi orisinal, bukan salinan referensi. Google Fonts
opsional; font sistem dipakai saat jaringan tidak tersedia. Simbol game memakai
subset lokal 87 KB dari Noto Color Emoji dengan nama keluarga
`IqroQu Symbols`. Lisensi SIL Open Font License tersedia di
`assets/Noto-Emoji-LICENSE.txt`.
