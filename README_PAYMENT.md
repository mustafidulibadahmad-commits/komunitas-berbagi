# Sistem Pembayaran - FAQ

## Pertanyaan Umum

### 1. Apakah harus bayar untuk memasukkan barang?

**Jawaban**: **TIDAK, GRATIS!** 

Secara default, aplikasi ini **GRATIS** untuk mendaftarkan barang. Namun, admin bisa mengaktifkan biaya listing jika diperlukan.

- **Default**: Gratis (Rp 0)
- **Opsional**: Bisa diaktifkan dengan set `LISTING_FEE` di environment variable
- **Fungsi**: Jika diaktifkan, biaya listing digunakan untuk aktivasi barang

### 2. Bagaimana sistem transaksi pembayaran?

**Jawaban**: Sistem pembayaran lengkap dengan beberapa komponen:

#### A. **Deposit Peminjaman**
- **Wajib** untuk setiap peminjaman
- Jumlah ditentukan oleh pemilik barang
- Dibayar saat membuat permintaan peminjaman
- **Dikembalikan** setelah barang dikembalikan (minus denda jika terlambat)

#### B. **Biaya Sewa**
- **Wajib** untuk setiap peminjaman
- Perhitungan: Tarif Harian × Jumlah Hari
- Dibayar saat membuat permintaan peminjaman
- Diterima oleh pemilik barang (setelah dipotong platform fee)

#### C. **Platform Fee**
- Otomatis dipotong dari biaya sewa
- Default: 5% dari biaya sewa
- Digunakan untuk operasional platform

#### D. **Denda Keterlambatan**
- Otomatis dihitung jika terlambat mengembalikan
- 10% dari tarif harian per hari keterlambatan
- Dipotong dari deposit

### 3. Sistem pembayaran antara penjual dan pembeli?

**Jawaban**: 

#### Alur Pembayaran:

1. **Peminjam (Borrower)**:
   - Bayar: Deposit + Biaya Sewa
   - Deposit: Disimpan sebagai jaminan
   - Biaya Sewa: Diteruskan ke pemilik (minus platform fee)

2. **Pemilik (Owner)**:
   - Menerima: Biaya Sewa (setelah dipotong platform fee)
   - Deposit: Disimpan sampai barang dikembalikan

3. **Saat Pengembalian**:
   - Deposit dikembalikan ke peminjam (minus denda jika ada)
   - Jika ada denda, denda masuk ke pemilik

#### Contoh:
- Deposit: Rp 100.000
- Biaya Sewa (5 hari × Rp 20.000): Rp 100.000
- Platform Fee (5%): Rp 5.000
- **Total yang dibayar peminjam**: Rp 200.000
- **Yang diterima pemilik**: Rp 95.000 (biaya sewa - platform fee)
- **Deposit**: Rp 100.000 (disimpan, dikembalikan setelah barang dikembalikan)

### 4. Metode Pembayaran?

**Jawaban**: 

#### A. **Wallet (Saldo)**
- User bisa top up saldo
- Pembayaran instan dari saldo
- Gratis (tidak ada fee)

#### B. **Payment Gateway**
- Transfer Bank
- E-Wallet (OVO, GoPay, Dana, dll)
- Kartu Kredit/Debit
- Ada fee transaksi (tergantung provider)

### 5. Kapan uang ditransfer?

**Jawaban**:

- **Deposit**: Disimpan sampai barang dikembalikan
- **Biaya Sewa**: Ditransfer ke pemilik setelah peminjaman disetujui
- **Deposit Refund**: Dikembalikan setelah barang dikembalikan (minus denda jika ada)

### 6. Bagaimana jika ada masalah?

**Jawaban**:

- Semua transaksi tercatat di database
- Ada riwayat transaksi lengkap
- Bisa track status setiap pembayaran
- Support refund untuk deposit

## Ringkasan

✅ **Listing Barang**: **GRATIS** (default)  
✅ **Deposit**: Wajib, dikembalikan setelah barang dikembalikan  
✅ **Biaya Sewa**: Wajib, diterima pemilik (minus platform fee)  
✅ **Platform Fee**: 5% dari biaya sewa (otomatis)  
✅ **Denda**: 10% tarif harian per hari keterlambatan  
✅ **Metode**: Wallet atau Payment Gateway  

## Dokumentasi Lengkap

Lihat `PAYMENT_SYSTEM.md` untuk dokumentasi lengkap sistem pembayaran.
