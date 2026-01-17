# Quick Start: Push ke GitHub

Panduan cepat untuk push project ke GitHub.

## Langkah Cepat

### 1. Setup Git (Pertama Kali Saja)

```bash
git config --global user.name "Nama Anda"
git config --global user.email "email@example.com"
```

### 2. Inisialisasi & Commit

```bash
cd /home/ibad/Documents/komunitas-berbagi

# Inisialisasi git
git init

# Tambahkan semua file
git add .

# Commit pertama
git commit -m "Initial commit: Komunitas Berbagi"
```

### 3. Buat Repository di GitHub

1. Buka: https://github.com/new
2. Repository name: `komunitas-berbagi`
3. Description: "Platform berbagi sumber daya komunitas"
4. Pilih Public atau Private
5. **JANGAN** centang "Initialize with README"
6. Klik "Create repository"

### 4. Push ke GitHub

**Menggunakan HTTPS (Mudah):**

```bash
# Ganti USERNAME dengan username GitHub Anda
git remote add origin https://github.com/USERNAME/komunitas-berbagi.git
git branch -M main
git push -u origin main
```

**Saat diminta password, gunakan Personal Access Token:**
- Buat token di: https://github.com/settings/tokens
- Pilih scope: **repo**
- Copy token dan gunakan sebagai password

**Menggunakan SSH (Lebih Aman):**

```bash
# Setup SSH key (jika belum)
ssh-keygen -t ed25519 -C "email@example.com"
cat ~/.ssh/id_ed25519.pub
# Copy output dan tambahkan ke GitHub → Settings → SSH keys

# Push
git remote add origin git@github.com:USERNAME/komunitas-berbagi.git
git branch -M main
git push -u origin main
```

## Update Setelah Perubahan

```bash
git add .
git commit -m "Deskripsi perubahan"
git push
```

## Bantuan Lebih Lengkap

Lihat file **PUSH_TO_GITHUB.md** untuk panduan lengkap dengan troubleshooting.
