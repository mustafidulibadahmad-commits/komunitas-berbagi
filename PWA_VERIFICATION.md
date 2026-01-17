# Verifikasi PWA

## Cara Cek PWA Sudah Aktif

### 1. Di Browser (Chrome DevTools)

1. Buka aplikasi di browser: http://localhost:3000
2. Buka Chrome DevTools (F12)
3. Pergi ke tab **Application**
4. Di sidebar kiri, cek:
   - ✅ **Manifest** - Harus ada dan valid
   - ✅ **Service Workers** - Harus ter-register
   - ✅ **Cache Storage** - Harus ada cache

### 2. Cek Service Worker

1. Di DevTools > Application > Service Workers
2. Harus ada service worker dengan status "activated and is running"
3. URL: `http://localhost:3000/sw.js`

### 3. Cek Manifest

1. Di DevTools > Application > Manifest
2. Harus menampilkan:
   - Name: Komunitas Berbagi
   - Short name: Komunitas Berbagi
   - Start URL: /
   - Display: standalone
   - Icons: icon-192x192.png dan icon-512x512.png

### 4. Test Install Prompt

1. Di address bar, harus ada icon "+" atau "Install" button
2. Klik untuk install aplikasi
3. Aplikasi akan terbuka sebagai window terpisah

### 5. Test Offline

1. Di DevTools > Network tab
2. Pilih "Offline" checkbox
3. Refresh halaman
4. Aplikasi harus masih bisa diakses (dari cache)

## Troubleshooting

### Service Worker tidak muncul:
- Pastikan server sudah restart setelah install next-pwa
- Clear cache browser (Ctrl+Shift+Delete)
- Hard refresh (Ctrl+Shift+R)

### Install button tidak muncul:
- Pastikan menggunakan HTTPS atau localhost
- Cek di DevTools > Application > Manifest untuk error
- Pastikan semua icon ada di /public/

### PWA tidak bekerja di development:
- Sudah diaktifkan! PWA sekarang bekerja di development dan production
- Jika masih tidak muncul, restart server: `npm run dev`
