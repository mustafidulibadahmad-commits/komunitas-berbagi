# Panduan Upgrade Node.js

## Masalah
Aplikasi ini menggunakan Next.js dengan App Router yang memerlukan Node.js versi 18.17.0 atau lebih tinggi. Node.js versi Anda saat ini adalah v12.22.9.

## Solusi: Upgrade Node.js

### Opsi 1: Menggunakan NVM (Node Version Manager) - **DIREKOMENDASIKAN**

NVM memungkinkan Anda menginstall dan menggunakan beberapa versi Node.js tanpa mengganggu versi sistem.

1. **Install NVM:**
   ```bash
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
   ```
   
   Atau untuk wget:
   ```bash
   wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
   ```

2. **Reload shell:**
   ```bash
   source ~/.bashrc
   ```
   atau
   ```bash
   source ~/.zshrc
   ```

3. **Install Node.js LTS (Long Term Support):**
   ```bash
   nvm install 18
   nvm use 18
   ```

4. **Verifikasi:**
   ```bash
   node --version
   ```
   Seharusnya menampilkan versi 18.x.x atau lebih tinggi

5. **Install dependencies:**
   ```bash
   cd /home/ibad/Documents/komunitas-berbagi
   rm -rf node_modules package-lock.json
   npm install
   ```

### Opsi 2: Install Node.js Langsung

1. **Download Node.js LTS dari website resmi:**
   - Kunjungi: https://nodejs.org/
   - Download versi LTS (Long Term Support)
   - Install sesuai instruksi untuk sistem operasi Anda

2. **Atau menggunakan package manager:**

   **Ubuntu/Debian:**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

   **Atau menggunakan snap:**
   ```bash
   sudo snap install node --classic
   ```

### Opsi 3: Menggunakan Versi Next.js yang Lebih Lama (TIDAK DIREKOMENDASIKAN)

Jika Anda tidak bisa upgrade Node.js, Anda perlu mengubah struktur aplikasi dari App Router ke Pages Router, yang memerlukan refactor besar pada kode.

## Setelah Upgrade Node.js

1. **Hapus node_modules dan package-lock.json:**
   ```bash
   cd /home/ibad/Documents/komunitas-berbagi
   rm -rf node_modules package-lock.json
   ```

2. **Update package.json ke versi Next.js terbaru:**
   File package.json sudah diupdate, tapi jika perlu, gunakan:
   ```json
   "next": "^14.0.0"
   ```

3. **Install ulang dependencies:**
   ```bash
   npm install
   ```

4. **Jalankan aplikasi:**
   ```bash
   npm run dev
   ```

## Catatan

- NVM adalah solusi terbaik karena memungkinkan Anda beralih antar versi Node.js dengan mudah
- Versi Node.js LTS (18 atau 20) direkomendasikan untuk stabilitas
- Setelah upgrade, aplikasi akan berjalan dengan baik karena semua fitur modern Next.js akan tersedia
