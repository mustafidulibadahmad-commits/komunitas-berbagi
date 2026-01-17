# Panduan Instalasi Komunitas Berbagi

## Persyaratan

- Node.js versi 18.17.0 atau lebih tinggi
- npm atau yarn

## Langkah Instalasi

1. **Install Dependencies**

   Masuk ke folder project dan install semua dependencies:
   ```bash
   cd komunitas-berbagi
   npm install
   ```

2. **Jalankan Development Server**

   ```bash
   npm run dev
   ```

3. **Akses Aplikasi**

   Buka browser dan akses: [http://localhost:3000](http://localhost:3000)

4. **Inisialisasi Database**

   Database akan dibuat otomatis saat pertama kali aplikasi dijalankan. 
   Atau Anda bisa mengakses: [http://localhost:3000/api/init-db](http://localhost:3000/api/init-db)

## Cara Menggunakan

1. **Daftar Akun Baru**
   - Klik tombol "Masuk" di navbar
   - Klik "Daftar di sini"
   - Isi formulir registrasi
   - Login dengan akun yang baru dibuat

2. **Daftarkan Barang**
   - Setelah login, klik "Daftarkan Barang" di dashboard atau navbar
   - Isi informasi barang (nama, deskripsi, kategori, lokasi, deposit, tarif harian)
   - Klik "Daftarkan Barang"

3. **Cari dan Pinjam Barang**
   - Buka halaman "Barang" atau gunakan pencarian di homepage
   - Klik barang yang ingin dipinjam
   - Pilih tanggal mulai dan akhir peminjaman
   - Klik "Pinjam Sekarang"
   - Tunggu persetujuan dari pemilik barang

4. **Kelola Peminjaman**
   - Di dashboard, Anda bisa:
     - Melihat barang yang Anda pinjam
     - Melihat permintaan peminjaman untuk barang Anda
     - Menyetujui/menolak permintaan
     - Mengembalikan barang yang dipinjam

## Fitur Keamanan

- **Deposit**: Setiap peminjaman memerlukan deposit yang akan dikembalikan setelah barang dikembalikan
- **Denda Keterlambatan**: Otomatis dihitung 10% dari tarif harian per hari keterlambatan
- **Rating & Reputasi**: Setiap pengguna memiliki skor reputasi berdasarkan rating dari transaksi sebelumnya

## Troubleshooting

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

## Catatan

- Database SQLite akan disimpan di file `komunitas.db` di root folder project
- Untuk production, disarankan menggunakan database yang lebih robust seperti PostgreSQL
- JWT secret key default ada di kode, pastikan untuk mengubahnya di production dengan environment variable

## Persyaratan Node.js

**PENTING**: Aplikasi ini memerlukan Node.js versi 18.17.0 atau lebih tinggi.

Jika Anda menggunakan Node.js versi lama, silakan baca file **UPGRADE_NODE.md** untuk panduan upgrade Node.js.
