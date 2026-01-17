# Setup PWA (Progressive Web App)

Aplikasi ini sudah dikonfigurasi untuk menjadi PWA! 🎉

## Fitur PWA yang Tersedia

✅ **Installable** - Bisa diinstall di mobile dan desktop  
✅ **Offline Support** - Bisa digunakan offline (dengan caching)  
✅ **App-like Experience** - Tampil seperti aplikasi native  
✅ **Fast Loading** - Service worker untuk performa lebih cepat  

## Cara Install PWA

### Di Mobile (Android/iOS):

1. Buka aplikasi di browser (Chrome/Safari)
2. Pilih menu browser (3 titik atau share)
3. Pilih "Add to Home Screen" atau "Install App"
4. Aplikasi akan muncul di home screen seperti aplikasi native

### Di Desktop (Chrome/Edge):

1. Buka aplikasi di browser
2. Klik icon "+" di address bar atau menu
3. Pilih "Install Komunitas Berbagi"
4. Aplikasi akan terbuka sebagai window terpisah

## Icon yang Diperlukan

Untuk PWA berfungsi dengan baik, Anda perlu menambahkan icon:

1. **icon-192x192.png** - Icon 192x192 pixels
2. **icon-512x512.png** - Icon 512x512 pixels

### Cara Membuat Icon:

1. Buat logo/icon dengan ukuran minimal 512x512 pixels
2. Simpan sebagai PNG dengan background transparan atau solid
3. Place di folder `/public/`
4. Nama file harus: `icon-192x192.png` dan `icon-512x512.png`

### Tools untuk Membuat Icon:

- **Online**: https://www.favicon-generator.org/
- **Online**: https://realfavicongenerator.net/
- **Design**: Canva, Figma, atau tools design lainnya

## Konfigurasi

PWA sudah dikonfigurasi di:
- `next.config.js` - Konfigurasi next-pwa
- `public/manifest.json` - Web app manifest
- `app/layout.tsx` - Metadata untuk PWA

## Testing PWA

1. Build aplikasi: `npm run build`
2. Start production: `npm start`
3. Buka di browser dan cek:
   - Icon install muncul di address bar
   - Bisa diinstall
   - Bisa digunakan offline

## Catatan

- ✅ **PWA sudah aktif di development dan production!**
- PWA akan otomatis ter-register saat aplikasi dijalankan
- HTTPS diperlukan untuk PWA di production (localhost OK untuk development)
- Service worker akan di-generate otomatis di folder `/public/`

## Troubleshooting

### Icon tidak muncul:
- Pastikan file icon ada di `/public/`
- Cek nama file harus tepat: `icon-192x192.png` dan `icon-512x512.png`
- Clear cache browser

### Install button tidak muncul:
- Pastikan menggunakan HTTPS (atau localhost)
- Cek di Chrome DevTools > Application > Manifest
- Pastikan semua requirements PWA terpenuhi
