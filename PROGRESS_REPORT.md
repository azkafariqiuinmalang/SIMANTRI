# Laporan Progress SIMANTRI — Ringkasan untuk Sesi Baru

> Paste ini sebagai pesan pertama di sesi Antigravity baru supaya
> agent langsung paham konteks tanpa perlu dijelaskan ulang dari nol.

---

## Status Project

Nama project: SIMANTRI (Sistem Informasi Manajemen Pertanian Bawang
Merah Nganjuk). Kompetisi web development dengan tema "NextGen Secure:
Building the Future of Trusted Web Ecosystems".

Tech stack: Next.js App Router + TypeScript + Tailwind CSS (frontend
& API routes), Supabase (PostgreSQL + Auth + Storage + RLS), FastAPI
Python (backend model ML, rencana deploy Railway), XGBoost (prediksi
harga), YOLOv8 (deteksi penyakit), Gemini API (chatbot RAG).

Branch aktif: `feat/phase1-foundation-auth` (semua perubahan Fase 1
dan Fase 2 ada di sini).

Supabase project ID: `giobbmjbykwqxzigmqzf`

---

## Fase 1 — SELESAI & DIVERIFIKASI

**Yang sudah jalan:**
- Setup Next.js App Router + TypeScript + Tailwind CSS
- Supabase terhubung, skema database `simantri_schema_v4` berhasil
  di-apply via `apply_migration`
- 9 tabel aktif dengan RLS: `profiles`, `knowledge_entries`,
  `market_price`, `weather_data`, `price_predictions`, `cv_detections`,
  `cv_detection_results`, `chat_logs`, `content_suggestions`
- View `v_cv_signal_review` aktif
- Trigger `on_auth_user_created` + fungsi `handle_new_user()` aktif,
  auto-insert ke `profiles` saat user daftar, dengan sanitasi role:
  hanya `petani` atau `penyuluh` yang diterima, percobaan self-assign
  `admin` otomatis diubah jadi `petani`
- Halaman Landing, Login, Registrasi sudah ada sesuai design system
- Dashboard dengan Interactive RLS Verifier Tool sudah terbukti
  memanggil Supabase asli (error 42501 untuk akses yang ditolak)
- Email confirmation Supabase sudah dimatikan untuk kemudahan demo

**Akun demo yang sudah di-seed:**
| Akun | Email | Password | Role | is_verified_contributor |
|---|---|---|---|---|
| Admin | admin@simantri.id | Simantri123! | admin | true |
| Penyuluh | penyuluh@simantri.id | Simantri123! | penyuluh | true |
| Petani | petani@simantri.id | Simantri123! | petani | false |

---

## Fase 2 — SELESAI SEBAGIAN, ADA BLOCKER

**Yang sudah jalan:**
- Form input harga harian Admin di `/admin/market/input` (upsert
  berdasarkan tanggal, redirect non-admin ke /dashboard)
- Auto-fetch cuaca dari Open-Meteo API (lat -7.604, lon 111.904 —
  Nganjuk) setiap kali admin input harga, tersimpan ke `weather_data`
- Tabel `market_price` dan `weather_data` sudah di-seed data historis
  30 hari terakhir
- Halaman prediksi harga Petani di `/dashboard/harga` (grafik tren
  30 hari + kartu prakiraan besok/+3 hari/+7 hari)
- FastAPI service sudah disiapkan file-nya:
  `ml/price_prediction/main.py`, `Dockerfile`, `requirements.txt`,
  `railway.json`, model sudah dikonversi ke format native `.json`
- Feature engineering 23 fitur sudah terdokumentasi di
  `ml/FEATURE_ENGINEERING_SPEC.md`

**BLOCKER yang BELUM selesai:**
1. **FastAPI belum di-deploy ke Railway.** `PRICE_MODEL_API_URL` di
   `.env.local` masih kosong. Saat ini prediksi menggunakan rumus
   baseline fallback (`MA7×0.4 + EMA7×0.4 + Lag1×0.2`), BUKAN model
   XGBoost asli.
2. **Rain7 perlu divalidasi.** Perlu dicek apakah nilai Rain7 di
   dataset training adalah akumulasi 7 hari nyata atau estimasi
   `rainfall×7`. Kalau akumulasi nyata, implementasi FastAPI perlu
   query SUM 7 hari terakhir dari `weather_data`, bukan pakai estimasi
   kasar.
3. **WeekOfYear di Next.js perlu disinkronkan** dengan logika Python
   `isocalendar().week` untuk konsistensi di edge case awal/akhir
   tahun.

---

## Fase 3 — BELUM DIMULAI

Scope Fase 3 yang akan dikerjakan selanjutnya (setelah blocker Fase 2
selesai):
- Deteksi penyakit tanaman via YOLOv8 multi-objek (`best.pt` ada di
  `ml/disease_detection/`)
- 6 kelas model: Antranoksa (0), Daun-Bawang (1), Moler (2),
  Pucuk-Daun (3), Sehat (4), Trotol (5)
- Kelas kategori `anatomy` (Daun-Bawang, Pucuk-Daun) TIDAK
  ditampilkan sebagai hasil diagnosis ke petani, hanya `disease` dan
  `healthy`
- Feedback petani per hasil deteksi (bukan per foto)
- Dashboard "Sinyal Perlu Ditinjau" untuk Penyuluh (query ke view
  `v_cv_signal_review`)
- Integrasi Dunia Brambang (konten dinamis dari `knowledge_entries`,
  tema museum gelap)

## Fase 4 — BELUM DIMULAI

- Chatbot Gemini dengan RAG (retrieval dari `knowledge_entries` pakai
  keyword/text search sederhana, BUKAN vector embedding)
- Mekanisme usulan/koreksi konten (`content_suggestions`)
- Polish UI & testing end-to-end

---

## Yang TIDAK Boleh Dibangun (Larangan Mutlak dari PRD)

Job board/penghubung tenaga kerja (jebol brambang, ombyok, pritil)
TIDAK dibangun dalam bentuk apa pun. Ini murni visi roadmap di
proposal, tidak ada implementasi.

---

## Tugas Sesi Ini

Selesaikan BLOCKER Fase 2 terlebih dahulu:

1. Deploy `ml/price_prediction/` ke Railway, dapatkan URL publik,
   set ke `PRICE_MODEL_API_URL` di environment variable
2. Test endpoint `/predict-from-history` dengan data nyata dari
   Supabase, pastikan response angka prediksi masuk akal
3. Setelah URL aktif, hapus/nonaktifkan fallback baseline di
   `predict-price/route.ts`
4. Validasi Rain7 (cek dataset training, sesuaikan implementasi
   FastAPI kalau perlu)
5. Sinkronkan WeekOfYear di Next.js dengan logika Python isocalendar()

Setelah semua blocker selesai dan dilaporkan, lanjut ke Fase 3.

---

## Dokumen Referensi Utama (ada di folder project)

| File | Fungsi |
|---|---|
| `PRD.md` | Requirement lengkap semua fitur |
| `PROJECT_CONTEXT.md` | Aturan kerja agent, prinsip desain, larangan |
| `QUERY_GUIDELINES.md` | Standar kualitas query database |
| `docs/database/simantri_schema_v4.sql` | Skema database aktif |
| `docs/api/API_CONTRACT.md` | Kontrak endpoint dasar + chatbot |
| `docs/api/API_CONTRACT_v4.md` | Override endpoint market price & CV |
| `docs/design/DESIGN_SIMANTRI.md` | Design system lengkap |
| `docs/product/PRD-Market.md` | Detail modul input harga harian |
| `ml/FEATURE_ENGINEERING_SPEC.md` | 23 fitur XGBoost (urutan wajib) |
| `ml/disease_detection/CLASS_REFERENCE.md` | Mapping 6 kelas CV |
