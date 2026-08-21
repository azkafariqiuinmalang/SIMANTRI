# Diagram Arsitektur Sistem - SIMANTRI (v2)

> Perubahan dari versi sebelumnya: PIHPS diklarifikasi sebagai sumber
> data historis untuk TRAINING MODEL (diambil manual sekali di awal,
> bukan koneksi live), karena PIHPS tidak menyediakan API publik
> (lihat `docs/product/PRD-Market.md`). Alur data harga harian yang
> sesungguhnya sekarang lewat Admin yang input manual ke `market_price`,
> yang lalu memicu fetch cuaca hari itu ke Open-Meteo.

```mermaid
flowchart TD
    subgraph Client["Client Layer"]
        Petani[/Petani/]
        Penyuluh[/Penyuluh/]
        Admin[/Admin/]
    end

    subgraph WebApp["Next.js Application"]
        direction TB
        FE["Frontend Pages<br/>Dunia Brambang, Dashboard,<br/>Form Input Harga, dst"]
        API["API Routes<br/>/api/market/price<br/>/api/market/forecast<br/>/api/detect-disease<br/>/api/knowledge<br/>/api/chat<br/>/api/suggestions"]
    end

    subgraph SupabasePlatform["Supabase Platform"]
        direction TB
        Auth["Auth Service<br/>Role: Petani / Penyuluh / Admin"]
        DB[("PostgreSQL Database<br/>market_price, weather_data,<br/>price_predictions, cv_detections,<br/>cv_detection_results, dst<br/>+ Row Level Security")]
        Storage[("Storage<br/>Foto Tanaman & Media")]
    end

    subgraph MLBackend["FastAPI Backend (Railway)"]
        direction TB
        PriceRouter["Router: Prediksi Harga<br/>Model XGBoost (MAPE 3%)"]
        CVRouter["Router: Deteksi Penyakit<br/>Model YOLOv8 (multi-deteksi)"]
    end

    subgraph External["Layanan Eksternal (Live)"]
        Gemini["Gemini API<br/>Chatbot Asisten"]
        OpenMeteo["Open-Meteo API<br/>Data Cuaca Harian"]
    end

    subgraph Historical["Sumber Data Historis (One-time, Offline)"]
        PIHPS["PIHPS<br/>Dataset Harga Historis<br/>TIDAK ADA API PUBLIK,<br/>diambil manual sekali di awal"]
    end

    Petani --> FE
    Penyuluh --> FE
    Admin --> FE
    FE --> API

    API -->|Autentikasi & Role Check| Auth
    API -->|Query / Insert Data| DB
    API -->|Upload Foto Tanaman| Storage
    API -->|POST harga harian, KHUSUS Admin| DB
    API -->|POST target_date| PriceRouter
    API -->|POST file gambar| CVRouter
    API -->|POST pesan pengguna| Gemini

    API -->|Setelah admin input harga,<br/>fetch cuaca hari itu| OpenMeteo
    OpenMeteo -->|Simpan ke weather_data| DB

    PriceRouter -->|Ambil market_price &<br/>weather_data historis| DB

    CVRouter -->|Ambil gambar tersimpan| Storage
    CVRouter -->|Simpan hasil deteksi<br/>multi-objek ke cv_detection_results| DB

    Auth -.->|Referensi role & profil| DB

    PIHPS -.->|Dataset awal pelatihan<br/>model XGBoost, TIDAK live| PriceRouter

    classDef client fill:#C4487A,stroke:#4A1F2B,color:#fff
    classDef webapp fill:#3A5A40,stroke:#0E080A,color:#fff
    classDef supabase fill:#3ECF8E,stroke:#0E080A,color:#0E080A
    classDef mlbackend fill:#E6A15C,stroke:#3D261A,color:#0E080A
    classDef external fill:#8A8580,stroke:#0E080A,color:#fff
    classDef historical fill:#D6D0C4,stroke:#4A3A32,color:#4A3A32,stroke-dasharray: 5 5

    class Petani,Penyuluh,Admin client
    class FE,API webapp
    class Auth,DB,Storage supabase
    class PriceRouter,CVRouter mlbackend
    class Gemini,OpenMeteo external
    class PIHPS historical
```

## Penjelasan tiap layer

### 1. Client Layer
Tidak berubah — tiga aktor (Petani, Penyuluh, Admin) mengakses lewat
browser, perbedaan akses ditentukan role yang tervalidasi di Supabase.

### 2. Next.js Application
Sekarang API Routes mencantumkan `/api/market/price` dan
`/api/market/forecast` secara eksplisit, mengikuti kontrak di
`API_CONTRACT_v4.md`.

### 3. Supabase Platform
Database sekarang eksplisit mencantumkan tabel-tabel baru
(`market_price`, `weather_data`, `cv_detection_results`) supaya diagram
ini tetap akurat merepresentasikan skema v4.

### 4. FastAPI Backend (Railway)
Tidak berubah struktur, tapi CVRouter sekarang dicatat sebagai
"multi-deteksi" mengikuti temuan dari training batch YOLOv8.

### 5. Layanan Eksternal (Live) vs Sumber Data Historis (One-time)
**Ini perubahan paling penting.** Open-Meteo dan Gemini dipisah ke
kelompok "Live" karena memang dipanggil real-time saat dibutuhkan.
PIHPS dipisah ke kelompok tersendiri "Historical, One-time, Offline"
dengan gaya garis putus-putus dan warna berbeda (abu-abu, bukan warna
solid seperti komponen aktif lain), untuk menegaskan secara visual
bahwa PIHPS BUKAN bagian dari alur kerja sistem yang berjalan, itu
cuma sumber dataset yang dipakai sekali saat melatih model di masa
lalu. Kalau ada yang bertanya "kok PIHPS gak ada di alur utama",
jawabannya ada di diagram ini, karena memang tidak ada API resmi untuk
itu.

### 6. Alur Data Harga yang Sesungguhnya
Admin login → input harga hari ini lewat form → tersimpan ke
`market_price` → sistem otomatis fetch cuaca hari itu dari Open-Meteo
→ tersimpan ke `weather_data` → begitu ada permintaan prediksi,
PriceRouter mengambil gabungan riwayat `market_price` + `weather_data`
untuk menghitung fitur dan memanggil model.
