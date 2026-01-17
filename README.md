# Komunitas Berbagi

Platform web untuk berbagi sumber daya dan alat-alat dalam komunitas. Aplikasi ini memungkinkan anggota komunitas untuk meminjam dan meminjamkan barang dengan sistem jaminan deposit, rating, dan notifikasi otomatis.

## ⚠️ PENTING: Persyaratan Node.js

**Aplikasi ini memerlukan Node.js versi 18.17.0 atau lebih tinggi.**

Jika Anda menggunakan Node.js versi 12 atau lebih lama, silakan baca file **UPGRADE_NODE.md** untuk panduan upgrade Node.js.

### Cek Versi Node.js Anda:
```bash
node --version
```

Jika versi Anda di bawah 18.17.0, ikuti panduan di **UPGRADE_NODE.md**.

## Fitur Utama

### 1. Sistem Jaminan Pengembalian
- **Deposit**: Setiap peminjaman memerlukan deposit yang akan dikembalikan setelah barang dikembalikan
- **Denda Keterlambatan**: Sistem otomatis menghitung denda 10% dari tarif harian per hari keterlambatan
- **Kontrak Digital**: Setiap peminjaman memiliki perjanjian digital dengan tanggal jelas

### 2. Sistem Rating & Reputasi
- Rating 1-5 untuk setiap transaksi
- Skor reputasi 0-200 untuk setiap pengguna
- Transparansi riwayat peminjaman

### 3. Notifikasi Otomatis
- Notifikasi untuk permintaan peminjaman baru
- Pengingat pengembalian barang
- Update status peminjaman

### 4. Fitur Lainnya
- Pencarian dan filter barang
- Dashboard untuk mengelola barang dan peminjaman
- Verifikasi identitas pengguna
- Manajemen ketersediaan barang

## Teknologi

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: SQLite
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs

## Instalasi

### 1. Pastikan Node.js >= 18.17.0

Cek versi Node.js:
```bash
node --version
```

Jika versi Anda di bawah 18.17.0, ikuti panduan di **UPGRADE_NODE.md**.

### 2. Install Dependencies

```bash
npm install
```

Jika ada masalah dengan peer dependencies, gunakan:
```bash
npm install --legacy-peer-deps
```

### 3. Pastikan Node.js yang Benar Digunakan

**PENTING**: Sebelum menjalankan aplikasi, pastikan Anda menggunakan Node.js 18.20.8:

```bash
# Cek versi Node.js
node --version
# Seharusnya: v18.20.8

# Jika versi salah, set PATH:
export PATH="$HOME/nodejs-18/node-v18.20.8-linux-x64/bin:$PATH"

# Verifikasi optional chaining support:
node -e "console.log('Test:', {a: {b: 1}}?.a?.b)"
# Seharusnya menampilkan: Test: 1
```

### 4. Jalankan Development Server

**Opsi 1: Menggunakan script helper (Direkomendasikan)**
```bash
./start-dev.sh
```

**Opsi 2: Langsung menggunakan npm**
```bash
npm run dev
```

Script `check-node.sh` akan otomatis memverifikasi versi Node.js sebelum menjalankan server.

### 5. Akses Aplikasi

Buka browser dan akses: [http://localhost:3000](http://localhost:3000)

### Troubleshooting

Jika Anda mendapatkan error `SyntaxError: Unexpected token '?'`:
1. Pastikan menggunakan Node.js 18.20.8 (bukan versi lama)
2. Pastikan PATH sudah di-set dengan benar
3. Restart terminal setelah mengubah PATH
4. Lihat file **SETUP_NODE_ENV.md** untuk panduan lengkap

Database akan dibuat otomatis saat pertama kali aplikasi dijalankan.

## Struktur Database

### Users
- Informasi pengguna, password ter-hash, skor reputasi

### Items
- Barang yang bisa dipinjam, lokasi, deposit, tarif harian

### Bookings
- Peminjaman dengan status (pending, approved, active, completed, rejected)

### Reviews
- Rating dan review untuk setiap transaksi

### Deposits
- Tracking deposit dan pengembalian

### Notifications
- Notifikasi untuk pengguna

## Cara Menggunakan

1. **Daftar/Login**: Buat akun baru atau login dengan akun yang sudah ada
2. **Daftarkan Barang**: Tambahkan barang yang ingin Anda pinjamkan
3. **Cari Barang**: Jelajahi barang yang tersedia atau gunakan fitur pencarian
4. **Pinjam Barang**: Pilih tanggal dan buat permintaan peminjaman
5. **Setujui/Tolak**: Sebagai pemilik, setujui atau tolak permintaan peminjaman
6. **Kembalikan**: Kembalikan barang setelah selesai digunakan
7. **Rating**: Berikan rating setelah transaksi selesai

## Keamanan

- Password di-hash menggunakan bcryptjs
- JWT untuk authentication
- Validasi input di semua endpoint
- SQL injection protection dengan parameterized queries

## Troubleshooting

### Error: Unsupported engine / Node version too old
**Solusi**: Upgrade Node.js ke versi 18.17.0 atau lebih tinggi. Lihat **UPGRADE_NODE.md**.

### Database tidak terbuat
- Pastikan folder project memiliki permission write
- Cek console untuk error message
- Coba akses `/api/init-db` secara manual

### Error saat install dependencies
- Pastikan Node.js versi 18.17.0 atau lebih tinggi terinstall
- Coba hapus `node_modules` dan `package-lock.json`, lalu install ulang:
  ```bash
  rm -rf node_modules package-lock.json
  npm install
  ```

### Port 3000 sudah digunakan
- Gunakan port lain dengan menambahkan flag:
  ```bash
  npm run dev -- -p 3001
  ```

## Pengembangan Selanjutnya

- [ ] Integrasi payment gateway untuk deposit
- [ ] Upload gambar untuk barang
- [ ] Chat antar pengguna
- [ ] Peta lokasi dengan Google Maps
- [ ] Email notifications
- [ ] Mobile app
- [ ] Sistem poin/reward

## Lisensi

MIT
