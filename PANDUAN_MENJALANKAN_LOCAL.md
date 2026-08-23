# 🚀 Panduan Menjalankan SIMANTRI di Localhost

Panduan lengkap langkah demi langkah untuk menjalankan ekosistem aplikasi **SIMANTRI (Sistem Informasi Manajemen Pertanian Bawang Merah Nganjuk)** di komputer lokal.

---

## 📋 1. Prasyarat Sistem (Prerequisites)

Pastikan perangkat Anda telah terpasang:
1. **Node.js**: Versi `18.x`, `20.x`, atau yang lebih baru. ([Unduh Node.js](https://nodejs.org/))
2. **Python**: Versi `3.10` – `3.13`. ([Unduh Python](https://www.python.org/))
3. **Koneksi Internet**: Diperlukan untuk sinkronisasi database Supabase dan API Google Gemini.

---

## ⚙️ 2. Konfigurasi Environment Variables (`.env.local`)

Pastikan file `.env.local` pada direktori utama (`D:\SIMANTRI\.env.local`) berisi variabel berikut:

```env
NEXT_PUBLIC_SUPABASE_URL=https://giobbmjbykwqxzigmqzf.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdpb2JibWpieWt3cXh6aWdtcXpmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYzMDk3ODQsImV4cCI6MjEwMTg4NTc4NH0.Ntwh9QAQi01GPr42MJNgru1xx5826AQ3hT-48A9QgiE

CV_MODEL_API_URL=http://localhost:8001
PRICE_MODEL_API_URL=http://localhost:8000
GEMINI_API_KEY=your_gemini_api_key_here
```

---

## 🖥️ 3. Langkah Menjalankan Aplikasi

Aplikasi SIMANTRI terdiri dari **2 Layanan Utama** yang berjalan secara berdampingan:
1. **Layanan AI Computer Vision (FastAPI YOLOv8)** di Port `8001`
2. **Aplikasi Web Frontend & API (Next.js)** di Port `3000`

---

### 🔹 TERMINAL 1: Jalankan Model YOLOv8 (Port 8001)

1. Buka Terminal / PowerShell / Command Prompt baru.
2. Masuk ke folder `ml/disease_detection`:
   ```bash
   cd D:\SIMANTRI\ml\disease_detection
   ```
3. Install dependensi Python (hanya perlu sekali):
   ```bash
   pip install -r requirements.txt
   ```
   *(atau `pip install fastapi uvicorn ultralytics pillow python-multipart`)*
4. Jalankan server FastAPI:
   ```bash
   python -m uvicorn main:app --port 8001
   ```
5. **Verifikasi**: Buka browser ke `http://localhost:8001/health`. Jika muncul `{"status":"ok","model":"yolov8-simantri"}`, maka layanan deteksi AI telah aktif!

---

### 🔹 TERMINAL 2: Jalankan Aplikasi Web Next.js (Port 3000)

1. Buka Terminal / PowerShell / Command Prompt kedua.
2. Masuk ke direktori utama proyek:
   ```bash
   cd D:\SIMANTRI
   ```
3. Install dependensi Node.js (jika belum):
   ```bash
   npm install
   ```
4. Jalankan server pengembangan Next.js:
   ```bash
   npm run dev
   ```
5. Buka browser dan akses:
   👉 **`http://localhost:3000`**

---

## 👥 4. Akun Demo untuk Pengujian Cepat

Pada halaman Login (`http://localhost:3000/login`), telah disediakan tombol **1-Klik Akun Demo** untuk memudahkan pengujian:

| Peran (Aktor) | Alamat Email | Kata Sandi | Hak Akses Utama |
|---|---|---|---|
| 👑 **Admin** | `admin@simantri.id` | `Simantri123!` | Moderasi Usulan Petani, Input Harga Pasar Harian, Monitoring Sistem |
| 👨‍💼 **Penyuluh** | `penyuluh@simantri.id` | `Simantri123!` | Pantau Sinyal Anomali Penyakit Wilayah (`v_cv_signal_review`), Usulan |
| 👨‍🌾 **Petani** | `petani@simantri.id` | `Simantri123!` | Deteksi Penyakit, Chat SIMA AI, Prediksi Harga, Usulan Saya |

---

## 🧭 5. Peta Fitur & Rute Navigasi

| Fitur | URL / Rute | Deskripsi |
|---|---|---|
| **Beranda / Landing Page** | `/` | Pengenalan produk, visual interaktif, arsitektur sistem |
| **Halaman Masuk & Daftar** | `/login` & `/register` | Login multi-aktor dengan logo resmi berlatar putih |
| **Dashboard Utama** | `/dashboard` | Ringkasan cuaca, harga bawang, sesi foto, dan navigasi sidebar |
| **Deteksi Penyakit (YOLOv8)** | `/dashboard/deteksi` | Upload foto tanaman, diagnosis AI multi-objek, & feedback petani |
| **AI Asisten (SIMA)** | `/dashboard/chat` | Chatbot RAG berbasis 39 dokumen pengetahuan budidaya Nganjuk |
| **Prediksi Harga Panen** | `/dashboard/harga` | Estimasi cerdas harga 1–7 hari ke depan berbasis XGBoost |
| **Usulan Saya (Petani)** | `/dashboard/usulan` | Form pengajuan usulan/koreksi & pelacakan status realtime |
| **Tinjau Usulan (Admin)** | `/dashboard/tinjau-usulan` | Panel moderasi untuk *Approve/Reject* usulan masuk + catatan |
| **Sinyal Wilayah (Penyuluh)** | `/dashboard/sinyal-wilayah` | Deteksi anomali penyakit lapangan per desa di Nganjuk |
| **Input Harga (Admin)** | `/admin/market/input` | Input harga harian & sinkronisasi otomatis cuaca Open-Meteo |
| **Dunia Brambang** | `/dunia-brambang` | Pameran digital museum 3D & ensiklopedia pengetahuan bawang |
| **Kelola Profil** | `/dashboard/profil` | Edit nama, kecamatan, dan desa lokasi sawah |

---

## 🛠️ 6. Solusi Kendala Umum (Troubleshooting)

1. **Kendala PowerShell Execution Policy pada Windows (`npm : File ... cannot be loaded`)**:
   - Gunakan `cmd /c npm run dev` atau jalankan terminal sebagai Command Prompt (`cmd.exe`).
2. **Layanan Deteksi AI Muncul Notifikasi Tidak Terhubung**:
   - Pastikan **Terminal 1** (`python -m uvicorn main:app --port 8001`) sedang berjalan dan tidak ditutup.
3. **Port 8001 Bentrok**:
   - Jika port 8001 terpakai oleh aplikasi lain, Anda dapat menggantinya ke port lain (misal 8005) lalu sesuaikan `CV_MODEL_API_URL=http://localhost:8005` di file `.env.local`.

---

*SIMANTRI — NextGen Secure: Building the Future of Trusted Web Ecosystems.*
