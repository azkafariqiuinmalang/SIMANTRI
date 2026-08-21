# Diagram Arsitektur Sistem - SIMANTRI

Source code Mermaid berikut bisa langsung dipakai di Mermaid Live Editor
(https://mermaid.live), VS Code (extension Mermaid Preview), atau tools lain
yang mendukung Mermaid.

```mermaid
flowchart TD
    subgraph Client["Client Layer"]
        Petani[/Petani/]
        Penyuluh[/Penyuluh/]
        Admin[/Admin/]
    end

    subgraph WebApp["Next.js Application"]
        direction TB
        FE["Frontend Pages<br/>Dunia Brambang, Dashboard,<br/>Form Kontribusi, dst"]
        API["API Routes<br/>/api/predict-price<br/>/api/detect-disease<br/>/api/knowledge<br/>/api/chat<br/>/api/reports"]
    end

    subgraph SupabasePlatform["Supabase Platform"]
        direction TB
        Auth["Auth Service<br/>Role: Petani / Penyuluh / Admin"]
        DB[("PostgreSQL Database<br/>+ Row Level Security")]
        Storage[("Storage<br/>Foto Tanaman & Media")]
    end

    subgraph MLBackend["FastAPI Backend (Railway)"]
        direction TB
        PriceRouter["Router: Prediksi Harga<br/>Model XGBoost (MAPE 3%)"]
        CVRouter["Router: Deteksi Penyakit<br/>Model Computer Vision"]
    end

    subgraph External["Layanan Eksternal"]
        Gemini["Gemini API<br/>Chatbot Asisten"]
        OpenMeteo["Open-Meteo API<br/>Data Cuaca"]
        PIHPS["PIHPS<br/>Data Historis Harga"]
    end

    Petani --> FE
    Penyuluh --> FE
    Admin --> FE
    FE --> API

    API -->|Autentikasi & Role Check| Auth
    API -->|Query / Insert Data| DB
    API -->|Upload Foto Tanaman| Storage
    API -->|POST target_date| PriceRouter
    API -->|POST file gambar| CVRouter
    API -->|POST pesan pengguna| Gemini

    PriceRouter -->|Ambil data historis harga & cuaca| DB
    PriceRouter -->|Ambil data cuaca terkini| OpenMeteo
    PriceRouter -.->|Update data berkala| PIHPS

    CVRouter -->|Ambil gambar tersimpan| Storage
    CVRouter -->|Simpan hasil deteksi + confidence| DB

    Auth -.->|Referensi role & profil| DB

    classDef client fill:#C4487A,stroke:#4A1F2B,color:#fff
    classDef webapp fill:#3A5A40,stroke:#0E080A,color:#fff
    classDef supabase fill:#3ECF8E,stroke:#0E080A,color:#0E080A
    classDef mlbackend fill:#E6A15C,stroke:#3D261A,color:#0E080A
    classDef external fill:#8A8580,stroke:#0E080A,color:#fff

    class Petani,Penyuluh,Admin client
    class FE,API webapp
    class Auth,DB,Storage supabase
    class PriceRouter,CVRouter mlbackend
    class Gemini,OpenMeteo,PIHPS external
```

## Penjelasan tiap layer

### 1. Client Layer
Tiga aktor (Petani, Penyuluh, Admin) mengakses sistem lewat browser, tidak
ada perbedaan platform teknis di layer ini — perbedaan akses ditentukan
oleh role yang tervalidasi di layer Supabase.

### 2. Next.js Application
Satu aplikasi menangani dua peran sekaligus: merender halaman (Frontend
Pages) dan menyediakan API Routes sebagai jembatan ke semua layanan
backend. Ini yang membuat client tidak pernah berkomunikasi langsung ke
Supabase service role, FastAPI, atau Gemini API — semua request disaring
lewat API Routes agar kredensial sensitif tidak pernah terekspos ke browser.

### 3. Supabase Platform
Tiga layanan berjalan bersamaan: Auth (identitas & role), Database dengan
Row Level Security (query hanya berhasil kalau role pengguna sesuai
kebijakan), dan Storage (untuk foto yang diupload saat fitur deteksi
penyakit dipakai).

### 4. FastAPI Backend (Railway)
Satu service, dua router terpisah secara kode (sesuai keputusan sebelumnya
untuk tidak memisah jadi microservices terpisah). Router prediksi harga
mengambil data historis dari Supabase dan data cuaca terkini dari
Open-Meteo untuk menyusun fitur sebelum memanggil model XGBoost. Router
deteksi penyakit mengambil gambar dari Storage sebelum diproses model CV.

### 5. Layanan Eksternal
Gemini API dipanggil langsung dari API Routes Next.js (bukan dari FastAPI)
karena sifatnya percakapan langsung, tidak butuh pemrosesan data tambahan.
Open-Meteo dipanggil real-time oleh router prediksi harga. PIHPS ditandai
dengan garis putus-putus karena sifatnya pembaruan data berkala (bukan
dipanggil di setiap request), berbeda dari Open-Meteo yang dipanggil
langsung saat prediksi diminta.
