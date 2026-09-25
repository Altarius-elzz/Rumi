# 📱 Rumi — Dokumentasi Aplikasi

> Smart To-Do List & Calendar — aplikasi pengingat kegiatan pintar untuk Android & iOS.

---

## 1. Deskripsi Singkat

**Rumi** adalah aplikasi to-do list dan kalender pintar yang membantu kamu mengatur
kegiatan sehari-hari dengan cara yang cepat dan natural. Cukup ketik agenda memakai
bahasa sehari-hari — misalnya *"besok jam 5 sore masak nasi goreng"* — dan Rumi
otomatis mengenali **tanggal**, **jam**, **judul kegiatan**, dan **kategorinya**,
lalu menaruhnya di kalender lengkap dengan pengingat.

Rumi dirancang untuk siapa saja yang ingin mencatat tugas, jadwal masak, deadline
kuliah/kerja, atau rencana harian — tanpa ribet mengisi banyak kolom satu per satu.

---

## 2. Deskripsi Singkat (untuk toko aplikasi / promosi)

**Versi pendek:**
> Rumi — atur harimu dengan cepat. Ketik agenda pakai bahasa biasa, biarkan Rumi
> membaca tanggal, jam, dan kategorinya secara otomatis. Dilengkapi kalender,
> pengingat deadline, mode gelap, dan dua bahasa (Indonesia & Inggris).

**Versi satu kalimat:**
> Aplikasi to-do list pintar yang mengubah kalimat biasa menjadi jadwal terorganisir.

---

## 3. Fitur Utama

| Fitur | Penjelasan |
|-------|-----------|
| 🧠 **Input Pintar** | Ketik bebas ("besok jam 7 pagi olahraga") → otomatis jadi tugas terjadwal |
| ✨ **Preview Cerdas** | Hasil pembacaan ditampilkan dulu → kamu tinggal **Simpan** atau **Ubah** |
| ➕ **Dua Cara Input** | (1) Input pintar cepat, atau (2) Form manual lengkap lewat tombol + |
| 📅 **Kalender Visual** | Tanggal yang punya agenda ditandai titik warna sesuai kategori |
| 🔀 **Mode Kalender / Daftar** | Ganti tampilan antara kalender bulanan & daftar tugas |
| 🏷️ **Kategori** | 6 bawaan (Kerja, Masak, Kesehatan, Sosial, Pribadi, Jalan-jalan) + bisa tambah sendiri |
| ⏰ **Pengingat Fleksibel** | Tepat waktu, 5/15/30 menit, 1/3 jam, H-1, H-2, H-3, atau 1 minggu sebelumnya |
| 🔔 **Notifikasi** | Pengingat otomatis muncul di HP saat waktunya tiba |
| ✅ **Tandai Selesai** | Centang tugas yang sudah dikerjakan |
| 🌙 **Mode Gelap** | Tema terang & gelap, bisa diganti kapan saja |
| 🌐 **Dua Bahasa** | Indonesia & Inggris |
| 💾 **Offline** | Semua data tersimpan di HP, tetap ada walau tanpa internet |

---

## 4. Cara Kerja Aplikasi (Alur Pengguna)

### A. Menambah tugas dengan Input Pintar
```
1. Buka Rumi → ketik di kolom atas:
   "besok jam 5 sore masak nasi goreng"
2. Rumi membaca & memisahkan:
   📅 Tanggal : besok
   🕐 Jam     : 17:00
   📝 Judul   : Masak nasi goreng   (kata waktu dibuang otomatis)
   🏷️ Kategori: Masak               (ditebak dari kata "masak")
3. Muncul PREVIEW → tekan "Simpan" (atau "Ubah" untuk koreksi)
4. Tugas masuk ke kalender + pengingat aktif otomatis
```

### B. Menambah tugas manual
```
1. Tekan tombol + (kanan bawah)
2. Isi: judul, tanggal, jam, kategori, pengingat
3. Tekan "Tambah ke Kalender"
```

### C. Melihat & mengelola
```
- Tab Beranda  : input pintar + kalender/daftar hari terpilih
- Tab Tugas    : semua tugas
- Tab Pengaturan: kelola kategori, bahasa, notifikasi, mode gelap
- Ketuk tugas  → edit  |  Tekan lama → hapus  |  Ketuk lingkaran → selesai
```

---

## 5. Cara Kerja "Otak Pintar" (Teknis Sederhana)

Otak pintar Rumi (`parseSmartInput`) bekerja **100% di dalam HP** (offline, gratis,
tanpa AI online). Ia mengenali pola dari teks:

- **Kata waktu relatif**: "hari ini", "besok", "lusa", "minggu depan"
- **Tanggal eksplisit**: "26 nov", "november 26", "tanggal 25"
- **Jam**: "2 pm", "14:00", "jam 5 sore", "jam 7 pagi", "9am"
- **Kategori**: ditebak dari kata kunci (masak/cook → Masak, olahraga/gym → Kesehatan, dst)
- **Judul bersih**: kata tanggal & jam dibuang, huruf awal dikapitalkan

> **Catatan pengembangan:** otak pintar ini sengaja dibuat agar mudah "disambung"
> ke AI online (ChatGPT/Gemini) di masa depan bila ingin pemahaman kalimat yang
> lebih canggih — tanpa membongkar kode yang sudah ada.

---

## 6. Teknologi yang Dipakai

| Bagian | Teknologi |
|--------|-----------|
| Framework | React Native + **Expo SDK 53** |
| Bahasa | TypeScript |
| Navigasi | Expo Router (berbasis file) |
| Penyimpanan | AsyncStorage (lokal di HP) |
| Kalender | react-native-calendars |
| Notifikasi | expo-notifications |
| Update | expo-updates (OTA — update tanpa install ulang) |
| Build APK | EAS Build |

---

## 7. Struktur Proyek (untuk pengembang)

```
Rumi/
├── app/                      # Layar aplikasi (Expo Router)
│   ├── _layout.tsx           # Kerangka root + tema
│   └── (tabs)/
│       ├── _layout.tsx       # Header + tab bar (Beranda, Tugas, Pengaturan)
│       ├── index.tsx         # Beranda: input pintar + kalender/daftar
│       ├── tasks.tsx         # Semua tugas + empty state
│       └── settings.tsx      # Kategori, bahasa, notifikasi, mode gelap
├── src/
│   ├── components/           # Komponen UI (kartu tugas, kalender, sheet, dll)
│   ├── store.tsx             # Pusat data (tugas, kategori, pengaturan) + tema
│   ├── storage.ts            # Simpan/baca data di HP
│   ├── notifications.ts      # Jadwalkan & batalkan notifikasi
│   ├── i18n.ts               # Teks 2 bahasa + kategori
│   ├── theme.ts              # Warna & gaya (terang + gelap)
│   ├── types.ts              # Struktur data
│   └── utils/
│       ├── date.ts           # Bantuan tanggal/jam
│       └── smartParse.ts     # 🧠 Otak pintar
├── assets/                   # Ikon & splash
├── app.json                  # Konfigurasi aplikasi
├── eas.json                  # Konfigurasi build APK
└── README.md                 # Panduan menjalankan
```

---

## 8. Cara Update Aplikasi

Rumi mendukung **dua jenis update**:

1. **OTA Update (cepat, tanpa install ulang)** — untuk perubahan kode JS
   (fitur, teks, desain, otak pintar). Pengguna mendapat update otomatis saat
   membuka aplikasi. Cukup jalankan `eas update` dari komputer.

2. **Build ulang APK** — hanya bila menambah/mengganti library besar atau izin
   sistem. Jarang diperlukan.

---

## 9. Identitas Aplikasi

- **Nama**: Rumi
- **Warna utama**: Ungu (`#6C5CE7`)
- **Platform**: Android & iOS
- **Bahasa**: Indonesia & Inggris
- **Mode**: Terang & Gelap
- **Versi**: 1.0.0

---

*Dibuat dengan React Native + Expo. Dokumentasi ini bisa dipakai untuk deskripsi
toko aplikasi, portfolio, atau catatan pengembangan.*
