# Setup Node.js Environment

## Masalah yang Sering Terjadi

Jika Anda mendapatkan error `SyntaxError: Unexpected token '?'` saat menjalankan `npm run dev`, kemungkinan besar Anda menggunakan Node.js versi yang terlalu lama.

## Solusi

### 1. Pastikan Menggunakan Node.js 18.20.8

Sebelum menjalankan aplikasi, pastikan Anda menggunakan Node.js yang benar:

```bash
# Cek versi Node.js
node --version

# Seharusnya menampilkan: v18.20.8
```

### 2. Jika Versi Node.js Salah

Jika versi Node.js Anda bukan 18.20.8, jalankan:

```bash
export PATH="$HOME/nodejs-18/node-v18.20.8-linux-x64/bin:$PATH"
```

Atau tambahkan ke `~/.bashrc` untuk membuatnya permanen:

```bash
echo 'export PATH="$HOME/nodejs-18/node-v18.20.8-linux-x64/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

### 3. Verifikasi Node.js Support Optional Chaining

Jalankan test ini untuk memastikan Node.js Anda mendukung optional chaining:

```bash
node -e "console.log('Test:', {a: {b: 1}}?.a?.b)"
```

Seharusnya menampilkan: `Test: 1`

### 4. Jalankan Aplikasi

Setelah memastikan Node.js versi benar:

```bash
npm run dev
```

Script `check-node.sh` akan otomatis memverifikasi versi Node.js sebelum menjalankan server.

## Troubleshooting

### Error: SyntaxError: Unexpected token '?'

**Penyebab**: Node.js versi terlalu lama atau tidak menggunakan Node.js yang benar.

**Solusi**:
1. Pastikan menggunakan Node.js 18.20.8
2. Pastikan PATH sudah di-set dengan benar
3. Restart terminal setelah mengubah PATH

### Error: Command not found: node

**Penyebab**: Node.js tidak ada di PATH.

**Solusi**: Jalankan perintah export PATH seperti di atas.
