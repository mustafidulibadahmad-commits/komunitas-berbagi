# Setup Node.js 18 - Selesai! ✅

Node.js 18.20.8 sudah berhasil diinstall di folder `~/nodejs-18/node-v18.20.8-linux-x64/`

## Cara Menggunakan

### Untuk sesi terminal saat ini:
```bash
export PATH="$HOME/nodejs-18/node-v18.20.8-linux-x64/bin:$PATH"
```

### Untuk semua sesi terminal (sudah otomatis ditambahkan ke ~/.bashrc):
Setelah restart terminal atau jalankan:
```bash
source ~/.bashrc
```

## Verifikasi

Cek versi Node.js:
```bash
node --version
# Seharusnya menampilkan: v18.20.8

npm --version
# Seharusnya menampilkan versi npm yang sesuai
```

## Menjalankan Aplikasi

Sekarang Anda bisa menjalankan aplikasi:

```bash
cd /home/ibad/Documents/komunitas-berbagi

# Pastikan PATH sudah diset
export PATH="$HOME/nodejs-18/node-v18.20.8-linux-x64/bin:$PATH"

# Jalankan aplikasi
npm run dev
```

## Catatan

- Node.js 18 sudah terinstall dan siap digunakan
- Dependencies sudah terinstall dengan sukses
- PATH sudah ditambahkan ke ~/.bashrc untuk sesi terminal berikutnya
- Jika terminal baru masih menggunakan Node.js versi lama, jalankan: `source ~/.bashrc`
