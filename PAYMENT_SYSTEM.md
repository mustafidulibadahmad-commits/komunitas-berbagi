# Sistem Pembayaran Komunitas Berbagi

## Overview

Aplikasi ini memiliki sistem pembayaran lengkap untuk mendukung berbagai transaksi dalam platform.

## Fitur Pembayaran

### 1. **Biaya Listing (Listing Fee)**
- **Status**: Opsional (bisa diaktifkan/nonaktifkan)
- **Default**: Gratis (Rp 0)
- **Konfigurasi**: Set via environment variable `LISTING_FEE`
- **Kapan dibayar**: Saat mendaftarkan barang baru
- **Fungsi**: Untuk aktivasi barang agar muncul di listing

### 2. **Deposit Peminjaman**
- **Status**: Wajib untuk setiap peminjaman
- **Jumlah**: Ditentukan oleh pemilik barang
- **Kapan dibayar**: Saat membuat permintaan peminjaman
- **Pengembalian**: Otomatis dikembalikan setelah barang dikembalikan (minus denda jika ada)

### 3. **Biaya Sewa (Rental Fee)**
- **Status**: Wajib
- **Perhitungan**: Tarif harian × jumlah hari
- **Kapan dibayar**: Saat peminjaman disetujui
- **Penerima**: Pemilik barang (minus platform fee)

### 4. **Platform Fee**
- **Status**: Otomatis
- **Persentase**: Default 5% (konfigurasi via `PLATFORM_FEE_PERCENTAGE`)
- **Dari**: Biaya sewa
- **Fungsi**: Biaya operasional platform

### 5. **Denda Keterlambatan**
- **Status**: Otomatis
- **Perhitungan**: 10% dari tarif harian per hari keterlambatan
- **Dipotong dari**: Deposit

## Metode Pembayaran

### 1. **Wallet (Saldo)**
- User memiliki wallet/saldo
- Bisa top up saldo
- Pembayaran instan dari saldo
- Gratis (tidak ada fee)

### 2. **Payment Gateway**
- Integrasi dengan payment provider (Midtrans, Stripe, dll)
- Support: Transfer Bank, E-Wallet, Kartu Kredit
- Ada fee transaksi (tergantung provider)

## Alur Pembayaran

### Saat Mendaftarkan Barang:
1. User mengisi form barang
2. Jika listing fee > 0, redirect ke halaman payment
3. User bayar listing fee
4. Barang aktif setelah pembayaran

### Saat Meminjam Barang:
1. User pilih barang dan tanggal
2. Sistem hitung: Deposit + (Tarif Harian × Hari)
3. User bayar deposit + biaya sewa
4. Setelah disetujui, dana ditransfer ke pemilik (minus platform fee)
5. Deposit disimpan sebagai jaminan

### Saat Mengembalikan Barang:
1. User klik "Kembalikan Barang"
2. Sistem hitung denda (jika terlambat)
3. Deposit dikembalikan (minus denda jika ada)
4. Notifikasi ke pemilik dan peminjam

## Database Schema

### Tables:
- **transactions**: Semua transaksi pembayaran
- **listing_fees**: Biaya listing per barang
- **deposits**: Deposit peminjaman
- **user_wallets**: Saldo wallet user

## Konfigurasi

### Environment Variables:
```env
# Listing fee (default: 0 = gratis)
LISTING_FEE=0

# Platform fee percentage (default: 5%)
PLATFORM_FEE_PERCENTAGE=5

# Payment gateway (untuk integrasi real)
PAYMENT_GATEWAY=midtrans
MIDTRANS_SERVER_KEY=your_key
MIDTRANS_CLIENT_KEY=your_key
```

## Integrasi Payment Gateway

### Saat ini: Simulasi
Sistem saat ini menggunakan simulasi payment untuk development.

### Untuk Production:
1. **Midtrans** (Indonesia):
   - Install: `npm install midtrans-client`
   - Update `lib/payment.ts` dengan integrasi Midtrans
   - Setup webhook untuk callback

2. **Stripe** (International):
   - Install: `npm install stripe`
   - Update `lib/payment.ts` dengan integrasi Stripe
   - Setup webhook untuk callback

3. **Payment Gateway Lain**:
   - Sesuaikan dengan provider yang dipilih
   - Update fungsi `processPayment()` dan `verifyPayment()`

## API Endpoints

### Payment:
- `POST /api/payments/create` - Buat pembayaran
- `GET /api/payments/transactions` - Riwayat transaksi
- `GET /api/payments/wallet` - Cek saldo wallet

### Webhook (untuk production):
- `POST /api/payments/webhook` - Callback dari payment gateway

## Keamanan

- ✅ Semua transaksi memerlukan authentication
- ✅ Validasi amount dan type
- ✅ Transaction records untuk audit
- ✅ Status tracking untuk setiap transaksi
- ✅ Refund system untuk deposit

## Catatan Penting

1. **Listing Fee**: Default gratis, bisa diaktifkan jika diperlukan
2. **Deposit**: Wajib untuk semua peminjaman
3. **Platform Fee**: Otomatis dipotong dari biaya sewa
4. **Denda**: Otomatis dihitung jika terlambat
5. **Wallet**: User bisa top up saldo untuk pembayaran lebih cepat

## Testing

Untuk testing, sistem menggunakan simulasi payment yang selalu berhasil. Untuk production, ganti dengan integrasi payment gateway yang sebenarnya.
