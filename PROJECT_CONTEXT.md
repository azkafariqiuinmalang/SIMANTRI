# SIMANTRI — Project Context

> File ini adalah SUMBER KEBENARAN UTAMA untuk agent AI (Antigravity).
> Baca file ini di awal setiap sesi sebelum membuat/mengubah kode apa pun.

## Ringkasan Proyek

SIMANTRI (Sistem Informasi Manajemen Pertanian Bawang Merah Nganjuk) adalah
web app untuk membantu petani bawang merah di Kabupaten Nganjuk, dengan tema
lomba "NextGen Secure: Building the Future of Trusted Web Ecosystems".

Kontribusi ke SDG: SDG 2 (Zero Hunger), SDG 4 (Quality Education),
SDG 8 (Decent Work), SDG 9 (Industry, Innovation, Infrastructure).

## Tech Stack (WAJIB DIIKUTI, jangan diganti tanpa konfirmasi)

- Frontend + API routes: Next.js (App Router)
- Auth + Database + Storage: Supabase (PostgreSQL + RLS)
- Model prediksi harga: XGBoost (`xgboost_price_forecast.pkl`), di-serve
  sebagai endpoint terpisah (Python/FastAPI), dipanggil dari Next.js API route
- Model deteksi penyakit: Computer Vision (Roboflow-trained), endpoint terpisah
- Chatbot: Gemini API, dipanggil SERVER-SIDE saja (jangan pernah dari client)
- Styling: Tailwind CSS (lihat `design-tokens.md` untuk warna/font resmi)

## Aktor & Role

> **CATATAN VERSI 3:** Admin adalah SATU-SATUNYA yang mengedit konten
> Dunia Brambang secara langsung. Penyuluh dan Petani sama-sama hanya
> bisa mengajukan usulan/koreksi (bukan submit konten final), yang
> masuk ke antrian dengan status terlacak, ditinjau dan diintegrasikan
> Admin secara berkala. Lihat `simantri_schema_v3.sql` dan
> `API_CONTRACT_v3.md` untuk detail.

| Role | Deskripsi | Batasan akses |
|---|---|---|
| `petani` | Pengguna umum | Lihat prediksi harga, upload foto CV, chat AI, beri feedback (sesuai/tidak sesuai) pada hasil CV & jawaban chatbot, ajukan usulan/koreksi untuk Dunia Brambang. TIDAK bisa mengedit entri KB secara langsung. |
| `penyuluh` | Penyuluh pertanian formal | Mengakses dashboard "Sinyal Perlu Ditinjau" untuk melihat pola feedback petani. Mengajukan usulan/koreksi pengetahuan berdasarkan kompetensi dan hasil peninjauan lapangan, HANYA jika `is_verified_contributor = true`. TIDAK bisa mengedit entri KB secara langsung. |
| `admin` | Moderator sistem | SATU-SATUNYA role yang bisa membuat/mengedit entri Dunia Brambang. Meninjau dan mengintegrasikan usulan dari petani & penyuluh secara berkala. Kelola user (termasuk approve status `is_verified_contributor` penyuluh), kelola konten, monitoring |

Role-based access WAJIB ditegakkan di level database lewat RLS
(lihat `simantri_schema_v3.sql`), bukan hanya di frontend.

### Alur pengetahuan petani/penyuluh → Knowledge Base (via usulan, bukan submit langsung)

Petani memberi feedback (`farmer_feedback`, `farmer_correction_note`) pada
hasil CV yang dirasa kurang tepat. Sistem mengagregasi pola feedback ini
lewat view `v_cv_signal_review` (minimal 2 petani berbeda melapor hal
serupa). Penyuluh melihat pola ini di dashboard, melakukan verifikasi
lapangan, lalu MENGAJUKAN USULAN (bukan menulis langsung) lewat tabel
`content_suggestions`. Petani juga bisa mengajukan usulan serupa kapan
saja. Admin meninjau seluruh usulan yang masuk, memutuskan status
(diterima/ditindaklanjuti/tidak digunakan), dan kalau dipakai, Admin
sendiri yang membuat/mengubah entri di `knowledge_entries`. Pengirim
usulan bisa memantau status usulannya sendiri kapan saja.

## Modul Fitur & Prioritas

| Modul | Prioritas | Status data pendukung |
|---|---|---|
| Input harga harian (Admin) | Tier 1 | BARU — prasyarat wajib sebelum prediksi harga bisa jalan, PIHPS tidak punya API publik sehingga input manual |
| Prediksi harga | Tier 1 | Model sudah ada (MAPE 3%), lihat `ml/FEATURE_ENGINEERING_SPEC.md` |
| Auth & role-based access | Tier 1 | Schema sudah ada di `simantri_schema.sql` |
| Knowledge base (ditulis Penyuluh) | Tier 1 | Template markdown sudah ada, field mapping ada di schema |
| Feedback CV & Chatbot + dashboard Sinyal Perlu Ditinjau | Tier 1 | Kolom feedback + view `v_cv_signal_review` sudah dirancang di schema v2 |
| Dunia Brambang (UI museum) | Tier 2 | Prototype HTML statis sudah ada, PERLU dihubungkan ke data dinamis |
| Deteksi penyakit (CV) | Tier 2 | Akurasi model saat ini < 65% — WAJIB ditampilkan sebagai "dugaan awal" dengan confidence score, JANGAN diklaim akurat |
| Chatbot Gemini | Tier 3 | Belum ada implementasi |

## Prinsip Desain yang WAJIB Dipatuhi Agent

1. **Trust bukan klaim, tapi mekanisme.** Setiap fitur yang menampilkan
   informasi (harga, hasil CV, entri knowledge base) HARUS menampilkan
   sumber data dan tingkat keandalannya (badge/label), bukan hanya angka polos.
2. **Verifikasi berlapis.** Konten baru dari petani selalu masuk sebagai
   `pending`. Hanya penyuluh terverifikasi yang bisa mengubah jadi `verified`.
3. **CV bukan diagnosis final.** Selalu tampilkan confidence score +
   disclaimer "konfirmasi ke penyuluh", jangan tampilkan hasil sebagai
   kepastian.
4. **Konsistensi visual.** Semua halaman baru HARUS pakai token warna/font
   dari `docs/design/DESIGN_SIMANTRI.md`, jangan membuat palet baru.
   Untuk modul Dunia Brambang secara spesifik, rujuk juga kode asli di
   `docs/design/dunia_brambang_pameran_digital.html` sebagai basis
   adaptasi komponen.
5. **API key selalu server-side.** Gemini API key, Supabase service role
   key, dsb — tidak boleh pernah muncul di kode client/browser.

## Yang TIDAK Boleh Dilakukan Agent Tanpa Konfirmasi

- Membuat tabel database baru di luar `docs/database/simantri_schema_v4.sql`
- Mengubah struktur RLS policy yang sudah ada
- Menghapus/mengganti fitur di luar prompt yang diberikan
- Menjalankan `execute_sql` untuk operasi DDL (harus `apply_migration`)
- Membangun modul job board/penghubung tenaga kerja (jebol brambang,
  ombyok, pritil) dalam bentuk apa pun — ini murni visi roadmap di
  proposal, TIDAK ADA implementasi untuk ini di MVP
- Memberi akses insert/update ke `knowledge_entries` untuk role selain
  `admin`
