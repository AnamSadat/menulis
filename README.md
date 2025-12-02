# 🎨 Ruang Latihan Menulis

Web aplikasi interaktif untuk latihan menulis dan menggambar dengan efek suara dan animasi yang menyenangkan.

## ✨ Fitur Utama

### 9 Kegiatan Interaktif:

1. **Coret-coret Bebas** - Menggambar bebas sesuka hati
2. **Coretan Terkontrol** - Latihan menggambar di dalam kotak
3. **Menghubungkan Titik** - Membentuk gambar dari titik-titik (Bintang, Rumah, Segitiga, Bunga)
4. **Menghubungkan Titik Acak** - Menghubungkan titik dengan urutan angka/huruf
5. **Garis Lurus** - Latihan membuat garis horizontal, vertikal, diagonal
6. **Garis Melengkung** - Latihan garis gelombang, spiral, dan lengkung
7. **Pola Sederhana** - Menggambar pola berulang (titik, gelombang, zigzag, dll)
8. **Menebalkan Huruf** - Latihan menulis huruf A-Z
9. **Game Evaluasi** - Uji kemampuan dengan tantangan berwaktu

### Fitur Tambahan:

- 🎨 Pilihan warna marker (6 warna)
- 📏 Pilihan ukuran marker (kecil, sedang, besar)
- 🧹 Penghapus
- 🔄 Reset canvas
- 🔊 Efek suara interaktif
- 🎵 Kontrol volume
- 💾 Penyimpanan otomatis (localStorage)
- 📱 Responsif (mobile, tablet, desktop)
- ✨ Animasi dan feedback visual

## 🚀 Cara Menggunakan

### Langkah 1: Buka Aplikasi

Buka file `index.html` di browser modern (Chrome, Firefox, Edge, Safari).

### Langkah 2: Masukkan Nama

Di halaman awal, masukkan nama Anda dan klik "Mulai Belajar".

### Langkah 3: Pilih Kegiatan

Pilih salah satu dari 9 kegiatan yang tersedia.

### Langkah 4: Mulai Berlatih

Gunakan mouse atau touchscreen untuk menggambar di canvas.

### Kontrol:

- **Ukuran**: Pilih ukuran marker
- **Warna**: Pilih warna yang diinginkan
- **Penghapus**: Klik untuk menghapus coretan
- **Reset**: Hapus semua dan mulai dari awal
- **Kembali**: Kembali ke menu kegiatan

## 📁 Struktur Proyek

```
menulis-v1/
├── index.html                          # Halaman utama
├── css/
│   ├── base.css                        # Style dasar & variabel
│   ├── layout.css                      # Layout & grid
│   ├── components.css                  # Komponen UI
│   └── animations.css                  # Animasi
├── js/
│   ├── main.js                         # Entry point aplikasi
│   ├── stateManager.js                 # Manajemen state
│   ├── uiManager.js                    # Manajemen UI
│   ├── soundManager.js                 # Manajemen suara
│   ├── drawingTools.js                 # Tools menggambar
│   ├── helpers.js                      # Fungsi helper
│   └── activities/
│       ├── activityFreeDraw.js         # Kegiatan 1
│       ├── activityControlledDraw.js   # Kegiatan 2
│       ├── activityConnectDots.js      # Kegiatan 3
│       ├── activityConnectRandomDots.js # Kegiatan 4
│       ├── activityStraightLines.js    # Kegiatan 5
│       ├── activityCurvedLines.js      # Kegiatan 6
│       ├── activitySimplePatterns.js   # Kegiatan 7
│       ├── activityBoldLetters.js      # Kegiatan 8
│       └── activityEvaluationGame.js   # Kegiatan 9
└── README.md                           # Dokumentasi
```

## 🛠️ Teknologi

- **HTML5** - Struktur halaman
- **CSS3** - Styling dengan custom properties, flexbox, grid
- **Vanilla JavaScript (ES6+)** - Logika aplikasi dengan modules
- **Canvas API** - Menggambar dan interaksi
- **Web Audio API** - Efek suara
- **LocalStorage API** - Penyimpanan data

## 🎨 Desain

### Warna Utama:

- Primary: `#6C5CE7` (Ungu)
- Secondary: `#00B894` (Hijau)
- Accent: `#FD79A8` (Pink), `#FFA502` (Orange), `#74B9FF` (Biru)

### Font:

- Display: Fredoka
- Body: Poppins

### Animasi:

- Pulse, Bounce, Pop-in
- Slide, Fade, Shake
- Particles, Confetti
- Smooth transitions

## 📱 Kompatibilitas

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 🔧 Pengembangan

### Menambah Kegiatan Baru:

1. Buat file baru di `js/activities/activityNamaKegiatan.js`
2. Export fungsi `init()` dan `cleanup()`
3. Import di `main.js`
4. Tambahkan ke registry `activities`
5. Tambahkan card di menu (HTML)

### Contoh Template Kegiatan:

```javascript
import drawing from "../drawingTools.js";
import ui from "../uiManager.js";
import sound from "../soundManager.js";

export function init() {
  ui.updateActivityTitle("Judul Kegiatan");
  ui.updateModeIndicator("Mode");
  ui.updateInstructions("Instruksi untuk user");
  ui.clearActivityControls();

  // Setup kegiatan
  drawing.clear();
  // ... logika kegiatan
}

export function cleanup() {
  // Bersihkan event listeners, timers, dll
}
```

## 📝 Lisensi

Proyek ini dibuat untuk tujuan edukasi dan pembelajaran.

## 👨‍💻 Pengembang

Dibuat dengan ❤️ menggunakan HTML, CSS, dan Vanilla JavaScript.

## 🎯 Roadmap

- [ ] Tambah lebih banyak bentuk di Connect Dots
- [ ] Sistem achievement dan badges
- [ ] Export gambar sebagai PNG
- [ ] Mode multiplayer
- [ ] Lebih banyak pola dan huruf
- [ ] Dukungan multi-bahasa lengkap
- [ ] Tutorial interaktif
- [ ] Statistik progress

---

**Selamat Berlatih! 🎨✏️**
