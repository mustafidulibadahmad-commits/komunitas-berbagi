# Panduan Push ke GitHub

Panduan lengkap untuk mengupload project Komunitas Berbagi ke GitHub.

## Prasyarat

1. **Akun GitHub**: Pastikan Anda sudah memiliki akun GitHub
   - Jika belum, daftar di: https://github.com/signup

2. **Git terinstall**: Cek apakah Git sudah terinstall
   ```bash
   git --version
   ```
   - Jika belum terinstall: `sudo apt install git` (Ubuntu/Debian)

3. **SSH Key atau Personal Access Token**: 
   - **Opsi 1**: Setup SSH Key (direkomendasikan untuk keamanan)
   - **Opsi 2**: Gunakan Personal Access Token (lebih mudah)

## Langkah 1: Setup Git (Jika Belum)

### Konfigurasi Git untuk pertama kali:

```bash
git config --global user.name "Nama Anda"
git config --global user.email "email@example.com"
```

Contoh:
```bash
git config --global user.name "Ibad"
git config --global user.email "ibad@example.com"
```

## Langkah 2: Inisialisasi Git Repository

```bash
cd /home/ibad/Documents/komunitas-berbagi

# Inisialisasi git repository
git init

# Cek status
git status
```

## Langkah 3: Tambahkan File ke Git

```bash
# Tambahkan semua file (kecuali yang ada di .gitignore)
git add .

# Cek file yang akan di-commit
git status
```

## Langkah 4: Commit Pertama

```bash
git commit -m "Initial commit: Komunitas Berbagi - Platform berbagi sumber daya komunitas"
```

## Langkah 5: Buat Repository di GitHub

1. **Login ke GitHub**: https://github.com/login

2. **Buat Repository Baru**:
   - Klik tombol **"+"** di pojok kanan atas
   - Pilih **"New repository"**
   - Isi informasi:
     - **Repository name**: `komunitas-berbagi` (atau nama lain)
     - **Description**: "Platform web untuk berbagi sumber daya dan alat-alat dalam komunitas"
     - **Visibility**: Pilih **Public** atau **Private**
     - **JANGAN** centang "Initialize this repository with a README" (karena kita sudah punya)
   - Klik **"Create repository"**

3. **Copy URL Repository**:
   - Setelah repository dibuat, GitHub akan menampilkan URL
   - Copy URL tersebut (contoh: `https://github.com/username/komunitas-berbagi.git`)

## Langkah 6: Hubungkan dengan GitHub

### Opsi A: Menggunakan HTTPS (Dengan Personal Access Token)

```bash
# Tambahkan remote repository
git remote add origin https://github.com/USERNAME/komunitas-berbagi.git

# Ganti USERNAME dengan username GitHub Anda
```

**Untuk push menggunakan HTTPS, Anda perlu Personal Access Token:**

1. Buat Personal Access Token:
   - GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
   - Klik "Generate new token (classic)"
   - Beri nama token (contoh: "komunitas-berbagi")
   - Pilih scope: **repo** (full control)
   - Klik "Generate token"
   - **COPY TOKEN** (hanya muncul sekali!)

2. Saat push, gunakan token sebagai password:
   ```bash
   git push -u origin main
   # Username: username GitHub Anda
   # Password: Personal Access Token (bukan password GitHub)
   ```

### Opsi B: Menggunakan SSH (Lebih Aman)

**Setup SSH Key (jika belum):**

```bash
# Generate SSH key
ssh-keygen -t ed25519 -C "email@example.com"
# Tekan Enter untuk semua pertanyaan (atau isi passphrase jika mau)

# Copy public key
cat ~/.ssh/id_ed25519.pub
# Copy seluruh output yang muncul
```

**Tambahkan SSH Key ke GitHub:**

1. GitHub → Settings → SSH and GPG keys
2. Klik "New SSH key"
3. Title: "Komunitas Berbagi" (atau nama lain)
4. Key: Paste public key yang sudah di-copy
5. Klik "Add SSH key"

**Setup remote dengan SSH:**

```bash
# Tambahkan remote repository (gunakan SSH URL)
git remote add origin git@github.com:USERNAME/komunitas-berbagi.git

# Ganti USERNAME dengan username GitHub Anda
```

## Langkah 7: Push ke GitHub

```bash
# Rename branch ke main (jika perlu)
git branch -M main

# Push ke GitHub
git push -u origin main
```

**Jika menggunakan SSH untuk pertama kali:**
```bash
# Test koneksi SSH
ssh -T git@github.com
# Ketik "yes" jika diminta

# Push
git push -u origin main
```

## Langkah 8: Verifikasi

1. Buka repository di GitHub: `https://github.com/USERNAME/komunitas-berbagi`
2. Pastikan semua file sudah ter-upload
3. Cek apakah README.md terlihat dengan baik

## Troubleshooting

### Error: "remote origin already exists"

```bash
# Hapus remote yang lama
git remote remove origin

# Tambahkan lagi dengan URL yang benar
git remote add origin https://github.com/USERNAME/komunitas-berbagi.git
```

### Error: "Permission denied (publickey)"

**Jika menggunakan SSH:**
```bash
# Pastikan SSH key sudah ditambahkan ke GitHub
ssh -T git@github.com

# Jika masih error, cek SSH agent
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519
```

**Atau gunakan HTTPS dengan Personal Access Token**

### Error: "Authentication failed"

**Jika menggunakan HTTPS:**
- Pastikan menggunakan Personal Access Token, bukan password GitHub
- Token harus memiliki scope "repo"

### Error: "Updates were rejected"

```bash
# Jika ada perubahan di GitHub yang belum ada di local
git pull origin main --allow-unrelated-histories

# Atau force push (HATI-HATI, hanya jika yakin)
git push -u origin main --force
```

## Update Repository (Setelah Perubahan)

Setelah melakukan perubahan, update repository:

```bash
# Cek perubahan
git status

# Tambahkan file yang berubah
git add .

# Commit perubahan
git commit -m "Deskripsi perubahan yang dilakukan"

# Push ke GitHub
git push
```

## File yang TIDAK akan di-upload (Sudah di .gitignore)

- `node_modules/` - Dependencies (akan diinstall ulang dengan `npm install`)
- `.next/` - Build files Next.js
- `*.db` - Database SQLite
- `.env*` - Environment variables
- File PWA yang di-generate

## Tips

1. **Commit Message yang Baik**:
   - Gunakan bahasa Indonesia atau Inggris yang konsisten
   - Deskriptif dan jelas
   - Contoh: "Fix: Perbaikan error login", "Feat: Tambah fitur wallet"

2. **Branch untuk Fitur Baru**:
   ```bash
   # Buat branch baru
   git checkout -b fitur-baru
   
   # Lakukan perubahan
   # ...
   
   # Commit
   git add .
   git commit -m "Feat: Tambah fitur baru"
   
   # Push branch
   git push -u origin fitur-baru
   
   # Buat Pull Request di GitHub untuk merge ke main
   ```

3. **Update README**: Pastikan README.md sudah lengkap sebelum push pertama

## Checklist Sebelum Push

- [ ] Git sudah dikonfigurasi (user.name dan user.email)
- [ ] Repository GitHub sudah dibuat
- [ ] Remote origin sudah ditambahkan
- [ ] Semua file penting sudah di-commit
- [ ] README.md sudah lengkap
- [ ] .gitignore sudah benar
- [ ] Tidak ada file sensitif (password, API key) yang ter-commit

## Selesai! 🎉

Repository Anda sekarang sudah ada di GitHub dan bisa diakses oleh siapa saja (jika Public) atau hanya Anda (jika Private).

**URL Repository**: `https://github.com/USERNAME/komunitas-berbagi`
