# 🚀 Cara Menjalankan Aplikasi

## Metode 1: Menggunakan Python HTTP Server (Recommended)

### Windows:

```bash
cd d:\Coding\basic\menulis-v1
python -m http.server 8000
```

### Mac/Linux:

```bash
cd /path/to/menulis-v1
python3 -m http.server 8000
```

Kemudian buka browser dan akses: **http://localhost:8000**

## Metode 2: Menggunakan Node.js HTTP Server

### Install http-server (sekali saja):

```bash
npm install -g http-server
```

### Jalankan server:

```bash
cd d:\Coding\basic\menulis-v1
http-server -p 8000
```

Kemudian buka browser dan akses: **http://localhost:8000**

## Metode 3: Menggunakan Live Server (VS Code Extension)

1. Install extension "Live Server" di VS Code
2. Buka folder `menulis-v1` di VS Code
3. Klik kanan pada `index.html`
4. Pilih "Open with Live Server"

## Metode 4: Menggunakan PHP Built-in Server

```bash
cd d:\Coding\basic\menulis-v1
php -S localhost:8000
```

Kemudian buka browser dan akses: **http://localhost:8000**

---

## ⚠️ Catatan Penting

**JANGAN** membuka file `index.html` langsung dengan double-click atau `file:///` protocol!

Aplikasi ini menggunakan **ES6 Modules** yang memerlukan server HTTP untuk berfungsi dengan benar. Browser akan memblokir module imports dari `file:///` karena kebijakan CORS (Cross-Origin Resource Sharing).

### Error yang akan muncul jika dibuka langsung:

```
Access to script at 'file:///.../main.js' from origin 'null' has been blocked by CORS policy
```

### Solusi:

Selalu gunakan salah satu metode server lokal di atas.

---

## 🎯 Setelah Server Berjalan

1. Buka browser (Chrome, Firefox, Edge, atau Safari)
2. Akses **http://localhost:8000**
3. Masukkan nama Anda
4. Klik "Mulai Belajar"
5. Pilih kegiatan yang ingin Anda coba
6. Selamat berlatih! 🎨

---

## 🔧 Troubleshooting

### Port 8000 sudah digunakan?

Ganti dengan port lain, misalnya:

```bash
python -m http.server 8080
```

Lalu akses: **http://localhost:8080**

### Server tidak bisa diakses?

- Pastikan firewall tidak memblokir port
- Coba gunakan `127.0.0.1` instead of `localhost`
- Restart terminal/command prompt

### JavaScript tidak berjalan?

- Periksa console browser (F12) untuk error
- Pastikan semua file ada di folder yang benar
- Clear cache browser (Ctrl+Shift+Delete)

---

## 📱 Akses dari Device Lain (Optional)

Untuk mengakses dari smartphone/tablet di jaringan yang sama:

1. Cari IP address komputer Anda:

   - Windows: `ipconfig` di Command Prompt
   - Mac/Linux: `ifconfig` di Terminal

2. Jalankan server dengan:

   ```bash
   python -m http.server 8000 --bind 0.0.0.0
   ```

3. Di device lain, akses:
   ```
   http://[IP-ADDRESS-KOMPUTER]:8000
   ```
   Contoh: `http://192.168.1.100:8000`

---

**Happy Learning! 🎨✏️**
