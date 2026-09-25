# 📝 Rumi v3 — Smart To-Do List & Calendar

Aplikasi to-do list pintar untuk **iOS & Android** (React Native + **Expo SDK 54**).
Ketik agenda pakai bahasa sehari-hari, aplikasi otomatis membaca tanggal, jam, dan kategorinya.

![Platform](https://img.shields.io/badge/platform-iOS%20%7C%20Android-blueviolet)
![Expo](https://img.shields.io/badge/Expo-SDK%2054-black)

---

## ✨ Fitur

| Fitur | Keterangan |
|-------|-----------|
| 🧠 **Otak pintar (Smart Input)** | Ketik "besok jam 5 sore masak nasi goreng" → otomatis terurai jadi tanggal, jam, judul bersih & kategori |
| ✨ **Preview dulu** | Hasil baca pintar ditampilkan sebagai preview → tekan **Simpan** atau **Ubah** |
| ➕ **Dua jalur input** | (1) Smart input bar di atas · (2) Tombol + untuk isi manual detail |
| 📅 **Kalender + penanda** | Tanggal yang ada agenda ditandai titik warna sesuai kategori |
| 🔀 **Geser Kalender ↔ List** | Tombol toggle untuk ganti tampilan |
| 🏷️ **Kategori** | 6 bawaan (Work, Cooking, Health, Social, Personal, Travel) + bisa buat sendiri |
| ⏰ **Reminder lengkap** | Tepat waktu, 5/15/30 mnt, 1/3 jam, **H-1, H-2, H-3**, 1 minggu |
| 🔔 **Notifikasi** | Pengingat otomatis (perangkat fisik) |
| 🌙 **Dark mode** | Tema terang & gelap, bisa diganti di Pengaturan |
| 🌐 **2 Bahasa** | Indonesia 🇮🇩 & Inggris 🇬🇧 |
| 💾 **Offline** | Data tersimpan di HP (AsyncStorage) |

---

## 🚀 Cara Menjalankan

Butuh **Node.js 18+** dan aplikasi **Expo Go** di HP.

```bash
cd todoku
npm install
npx expo start
```

Scan QR code dengan **Expo Go**. (Tekan `s` untuk mode LAN, atau `--tunnel` bila jaringan bermasalah.)

> 💡 Notifikasi hanya berjalan di **perangkat fisik**, bukan simulator.

---

## 🧠 Otak Pintar — cara kerjanya

File: `src/utils/smartParse.ts` (fungsi `parseSmartInput`)

Mengenali:
- **Tanggal**: "besok", "lusa", "minggu depan", "hari ini", "26 nov", "november 26", "tanggal 25"
- **Jam**: "2 pm", "14:00", "jam 5 sore", "jam 7 pagi", "9am"
- **Kategori**: dari kata kunci (masak/cook → Cooking, olahraga/gym → Health, dst)
- **Judul bersih**: membuang kata tanggal/jam & merapikan kapital

> Dirancang **siap disambung ke AI online (hybrid)** nanti — tinggal tambah fungsi async yang memanggil AI lalu fallback ke parser lokal ini.

---

## 🎨 Kustomisasi Desain (untuk kamu, si desainer)

| Mau ubah apa? | Buka file |
|---------------|-----------|
| 🎨 Warna & tema (light + dark) | `src/theme.ts` |
| 🏷️ Kategori bawaan | `src/storage.ts` → `DEFAULT_CATEGORIES` |
| ✍️ Semua teks (ID & EN) | `src/i18n.ts` |
| 🎴 Kartu tugas | `src/components/TaskCard.tsx` |
| ✨ Smart preview | `src/components/SmartPreviewSheet.tsx` |

---

## 📂 Struktur Proyek

```
todoku/
├── app/                         # Layar (expo-router)
│   ├── _layout.tsx              # Root: provider + tema
│   └── (tabs)/
│       ├── _layout.tsx          # Header + tab bar (Home, Tasks, Settings)
│       ├── index.tsx            # 🏠 Home (smart input, kalender/list toggle)
│       ├── tasks.tsx            # ✅ Semua tugas + empty state
│       └── settings.tsx         # ⚙️ Kategori, bahasa, notifikasi, dark mode
├── src/
│   ├── components/              # TaskCard, CalendarGrid, SmartInputBar,
│   │                            # SmartPreviewSheet, NewTaskSheet, ui, dll
│   ├── store.tsx                # State global + tema
│   ├── storage.ts               # Simpan/baca data di HP
│   ├── notifications.ts         # Jadwal & batal notifikasi
│   ├── i18n.ts                  # Teks 2 bahasa + kategori
│   ├── theme.ts                 # Token desain (light + dark)
│   ├── types.ts                 # Tipe data
│   └── utils/
│       ├── date.ts              # Format tanggal/jam
│       └── smartParse.ts        # 🧠 Otak pintar
└── assets/                      # Ikon & splash
```

---

## 💡 Tips Pemakaian

- **Ketik di kolom atas** → dapat preview pintar → Simpan/Ubah
- **Tombol +** → form manual lengkap
- **Ketuk** tugas untuk edit · **Tekan lama** untuk hapus
- **Ketuk lingkaran** untuk tandai selesai
- Di **Pengaturan** → nyalakan **Dark Mode** & ganti bahasa

Selamat memakai Todoku v2! 🎉
