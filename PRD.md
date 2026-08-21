# PRD — SIMANTRI (Sistem Informasi Manajemen Pertanian Bawang Merah Nganjuk)

> Dokumen ini adalah PINTU MASUK UTAMA untuk memahami produk. Baca ini
> lebih dulu sebelum file teknis lain. Untuk detail implementasi,
> dokumen ini merujuk ke file terpisah (skema database, kontrak API,
> dst) agar tidak ada duplikasi yang berisiko saling tidak sinkron.
>
> Status proyek saat ini: BELUM ADA KODE YANG DITULIS. Ini adalah
> rencana produk dari nol, bukan dokumentasi sistem yang sudah berjalan.

---

## 1. Overview & Visi Produk

SIMANTRI adalah web app yang membantu petani bawang merah di Kabupaten
Nganjuk mengambil keputusan berbasis data di sepanjang siklus budidaya,
mulai dari kapan menjual hasil panen, mendeteksi dini penyakit tanaman,
hingga mengakses pengetahuan lokal yang selama ini hanya diwariskan
lisan. Dibangun untuk kompetisi web development bertema *"NextGen
Secure: Building the Future of Trusted Web Ecosystems"*.

**Prinsip inti produk:** kepercayaan (*trust*) dibangun dari transparansi
mekanisme sistem, bukan dari klaim sepihak. Setiap output sistem
(prediksi, deteksi, entri pengetahuan) menunjukkan sumber data, tingkat
keandalan, dan siapa yang bertanggung jawab atasnya.

## 2. Masalah yang Diselesaikan

Tiga akar masalah, masing-masing dijawab satu pilar fitur:

| Masalah | Akar Penyebab | Fitur yang Menjawab |
|---|---|---|
| Ketidakpastian ekonomi akibat fluktuasi harga | Tidak ada alat bantu menerjemahkan pola harga jadi keputusan waktu jual | Prediksi Harga |
| Keterlambatan penanganan hama/penyakit | Petani hanya bertindak reaktif, tidak ada deteksi dini | Deteksi Penyakit (CV) + Dashboard Sinyal |
| Hilangnya pengetahuan budidaya lintas generasi | Tidak ada dokumentasi sistematis, pengetahuan tacit di kepala petani senior | Dunia Brambang |

## 3. Target Pengguna

| Persona | Kebutuhan Utama | Level Akses |
|---|---|---|
| **Petani** | Keputusan jual, diagnosis dini, akses pengetahuan | Konsumen utama fitur, bisa beri feedback & usulan |
| **Penyuluh** | Alat bantu memantau kondisi lapangan, memberi masukan pengetahuan | Bisa lihat dashboard sinyal, ajukan usulan/koreksi ke Admin |
| **Admin** | Kontrol kualitas konten dan integritas sistem | Satu-satunya yang mengedit Dunia Brambang, kelola user & laporan |
| **Pengunjung Umum** | Edukasi, regenerasi minat pertanian | Akses baca Dunia Brambang tanpa login |

## 4. Tujuan & Metrik Keberhasilan (untuk konteks demo/kompetisi)

Karena ini proyek kompetisi dengan skala pengguna terbatas saat demo,
metrik keberhasilan versi MVP bersifat **kualitatif dan fungsional**,
bukan metrik skala produksi:

- Prediksi harga menghasilkan output yang konsisten dengan MAPE model
  asli (3%) saat diberi input data historis yang sama
- Deteksi CV mengembalikan hasil beserta confidence score, tanpa
  pernah mengklaim kepastian
- Role-based access terbukti berfungsi (petani tidak bisa mengakses
  endpoint admin, dst), diverifikasi lewat RLS
- Dunia Brambang bisa diakses tanpa login dan menampilkan metadata
  sumber di setiap entri
- Alur end-to-end lengkap bisa didemokan tanpa error: login → lihat
  prediksi → upload foto CV → beri feedback → lihat Dunia Brambang

## 5. Ruang Lingkup

### Dalam cakupan (MVP, harus selesai)

**Tier 1 — wajib jalan sempurna:**
1. Autentikasi & role-based access (Petani, Penyuluh, Admin)
2. Input harga harian oleh Admin + prediksi harga bawang merah
   (model XGBoost sudah ada, tinggal di-serve; TAPI butuh data harian
   dari `market_price` dulu sebelum bisa prediksi apa pun)
3. Dunia Brambang — tampilan baca publik, dikelola Admin

**Tier 2 — penting, boleh versi sederhana dulu:**
4. Deteksi penyakit (CV) + feedback petani
5. Dashboard "Sinyal Perlu Ditinjau" untuk Penyuluh
6. Mekanisme usulan/koreksi dari Penyuluh & Petani ke Admin

**Tier 3 — nice to have kalau waktu cukup:**
7. Chatbot Gemini
8. Mekanisme pelaporan entri keliru

### Di luar cakupan (JANGAN dibangun, ini roadmap masa depan)

- Job board / penghubung tenaga kerja pascapanen (jebol brambang,
  ombyok, pritil) — ini HANYA disebut sebagai visi di proposal,
  TIDAK ADA kode, tabel, atau UI untuk ini
- Sistem pembayaran atau eskrow dalam bentuk apa pun
- Live-edit Dunia Brambang oleh Penyuluh (Penyuluh hanya mengajukan
  usulan, Admin yang mengeksekusi perubahan)
- Sinkronisasi dengan data fase musim tanam (labuhan 1/2/3, apitan)
  karena dataset historis tidak punya label ini

## 6. Requirement per Fitur (User Stories & Acceptance Criteria)

### 6.1 Prediksi Harga

**User story:** Sebagai Petani, saya ingin melihat estimasi harga
beberapa hari ke depan, supaya saya bisa memutuskan kapan waktu jual
yang lebih menguntungkan.

**Acceptance criteria:**
- Menampilkan prediksi harga untuk tanggal yang diminta
- Menampilkan sumber data (PIHPS + Open-Meteo) dan MAPE model
- Fitur turunan (Lag, MA, EMA, dst) dihitung PERSIS sesuai
  `FEATURE_ENGINEERING_SPEC.md` — lihat file itu untuk formula wajib
- Hasil prediksi tersimpan di tabel `price_predictions` untuk audit

### 6.2 Deteksi Penyakit (CV)

**User story:** Sebagai Petani, saya ingin upload foto tanaman untuk
dapat dugaan awal penyakit, supaya saya bisa bertindak lebih cepat
sebelum kerusakan meluas.

**Acceptance criteria:**
- Upload foto, kembalikan DAFTAR hasil deteksi (satu foto bisa
  menghasilkan lebih dari satu objek terdeteksi — lihat
  `ml/disease_detection/CLASS_REFERENCE.md`), masing-masing dengan
  predicted_class + confidence score
- Kelas kategori `anatomy` (Daun-Bawang, Pucuk-Daun) TIDAK ditampilkan
  sebagai hasil diagnosis ke petani, hanya kelas `disease`/`healthy`
- WAJIB tampilkan disclaimer "dugaan awal, konfirmasi ke penyuluh"
- TIDAK BOLEH ada bahasa yang menyiratkan hasil ini pasti/final
- Ada tombol feedback (sesuai/tidak sesuai) PER hasil deteksi, bukan
  per foto, karena satu foto bisa punya beberapa kelas sekaligus

### 6.2b Input Harga Harian (Admin)

**User story:** Sebagai Admin, saya ingin menginput harga bawang
merah setiap hari secara manual, supaya model prediksi punya data
terbaru untuk dihitung (karena PIHPS tidak menyediakan API publik).

**Acceptance criteria:**
- Form input tanggal + harga, submit ke tabel `market_price`
- Kalau tanggal sudah pernah diinput, sistem overwrite (upsert),
  bukan menambah duplikat
- Setelah input harga baru, sistem fetch data cuaca hari itu dari
  Open-Meteo dan simpan ke `weather_data`
- Riwayat harga yang sudah diinput ditampilkan sebagai grafik/tabel
  di halaman yang sama

### 6.3 Dashboard Sinyal Perlu Ditinjau

**User story:** Sebagai Penyuluh, saya ingin melihat pola feedback
CV yang konsisten dari banyak petani berbeda, supaya saya tahu kapan
perlu turun ke lapangan.

**Acceptance criteria:**
- Query dari view `v_cv_signal_review` (lihat `simantri_schema_v2.sql`)
- Hanya tampil kalau minimal 2 petani berbeda melapor hal serupa
- Dikelompokkan per jenis penyakit dan desa

### 6.4 Dunia Brambang

**User story:** Sebagai Pengunjung Umum, saya ingin menjelajahi
pengetahuan bawang merah Nganjuk tanpa perlu daftar akun, supaya saya
bisa belajar dan tertarik dengan sektor pertanian.

**Acceptance criteria:**
- Bisa diakses tanpa autentikasi sama sekali
- Setiap entri menampilkan penulis, evidence level, status pemutakhiran
- Gaya visual mengikuti `design-tokens.md` (tema museum digital)
- Petani/Penyuluh bisa kirim usulan/koreksi, TAPI tidak langsung
  mengubah konten — masuk ke antrian yang dilihat Admin

### 6.5 Autentikasi & Role-Based Access

**User story:** Sebagai sistem, akses setiap fitur harus dibatasi
sesuai peran, supaya integritas data terjaga.

**Acceptance criteria:**
- RLS aktif di semua tabel sensitif (lihat `docs/database/simantri_schema_v4.sql`)
- Dicoba dan dipastikan gagal kalau role tidak sesuai (misal petani
  mencoba edit Dunia Brambang langsung harus ditolak)

### 6.6 Chatbot (Gemini + RAG)

**User story:** Sebagai Petani, saya ingin bertanya seputar budidaya
bawang merah dan mendapat jawaban yang relevan dengan pengetahuan
resmi SIMANTRI, supaya jawabannya bisa dipercaya, bukan sekadar
jawaban umum dari internet.

**Acceptance criteria:**
- Chatbot menggunakan pendekatan RAG: pertanyaan user dicocokkan
  dulu ke `knowledge_entries` (status `published`) lewat kolom
  `keywords`/`semantic_keywords`, hasil yang relevan disertakan
  sebagai konteks ke prompt Gemini
- MVP cukup pakai pencocokan keyword/text search sederhana, BUKAN
  vector embedding (lihat catatan di `API_CONTRACT.md` bagian 4)
- Response menyertakan referensi entri KB yang dipakai sebagai sumber
  jawaban (`doc_id`), supaya transparan asal jawabannya dari mana,
  konsisten dengan prinsip trust yang dipegang seluruh sistem
- Kalau tidak ada entri KB yang relevan ditemukan, chatbot tetap
  boleh menjawab dari pengetahuan umum Gemini, TAPI wajib beri
  penanda berbeda (misal tanpa badge "sumber: Dunia Brambang") supaya
  petani tahu itu bukan jawaban yang divalidasi lewat KB
- Gemini API key WAJIB dipanggil server-side, tidak pernah dari client
- Tersedia mekanisme feedback (helpful/not helpful) per jawaban,
  tersimpan di `chat_logs`
- Referensi implementasi ada di `ml/chatbot/chat_bot_simantri_reference.py`
  (hasil eksperimen Colab, perlu diadaptasi ke pola API route Next.js,
  bukan disalin mentah)

## 7. Referensi Dokumen Teknis

File-file berikut adalah SUMBER KEBENARAN untuk detail implementasi,
JANGAN generate ulang dari nol jika file ini sudah tersedia di project:

| File | Isi |
|---|---|
| `PROJECT_CONTEXT.md` | Aturan kerja agent, prinsip desain, larangan |
| `docs/database/simantri_schema_v4.sql` | Skema database lengkap + RLS (v4, termasuk market_price & multi-deteksi CV) |
| `docs/api/API_CONTRACT.md` | Kontrak endpoint dasar (termasuk chatbot RAG) — masih berlaku untuk bagian yang tidak di-override v2/v3/v4 |
| `docs/api/API_CONTRACT_v4.md` | Kontrak endpoint terbaru (market price, deteksi CV multi-hasil) |
| `ml/FEATURE_ENGINEERING_SPEC.md` | Formula fitur model harga (WAJIB diisi dulu dengan kode training asli sebelum dipakai) |
| `ml/disease_detection/CLASS_REFERENCE.md` | Pemetaan 6 kelas CV, kategori disease/anatomy/healthy |
| `docs/product/PRD-Market.md` | Spesifikasi detail modul input harga harian |
| `docs/design/DESIGN_SIMANTRI.md` | Warna, font, komponen visual |
| `docs/architecture/simantri_architecture.md` | Diagram arsitektur sistem (Mermaid) — catatan: relasi ke PIHPS perlu dibaca bersama klarifikasi di `PRD-Market.md` soal ketiadaan API resmi |
| `docs/architecture/simantri_usecase_v3.dot` | Diagram use case (belum termasuk use case Input Harga Harian) |
| `.env.example` | Daftar environment variable yang dibutuhkan |

## 8. Timeline (3–4 minggu)

| Minggu | Fokus |
|---|---|
| 1 | Setup Next.js + Supabase, jalankan schema via `apply_migration`, auth + role-based access |
| 2 | Deploy model prediksi harga (FastAPI di Railway), integrasi ke frontend |
| 3 | Deteksi CV + feedback, dashboard sinyal, Dunia Brambang (baca publik) |
| 4 | Mekanisme usulan/koreksi, chatbot (kalau sempat), polish UI, testing end-to-end |

## 9. Risiko & Asumsi

- **Risiko tertinggi:** feature engineering saat inference tidak sama
  persis dengan saat training model harga → prediksi salah tanpa
  error. Mitigasi: isi `FEATURE_ENGINEERING_SPEC.md` dengan kode asli
  sebelum membangun endpoint.
- **Risiko kompatibilitas model:** file `.pkl` XGBoost punya warning
  versi saat load. Mitigasi: convert ke format native `.json` sebelum
  deploy.
- **Asumsi:** akurasi model CV tidak akan meningkat signifikan dalam
  waktu tersisa, sehingga desain produk (confidence score + disclaimer)
  dibuat robust terhadap akurasi rendah, bukan bergantung model
  membaik.

## 10. Prinsip Non-Negotiable

Hal-hal ini TIDAK BOLEH dikompromikan oleh agent demi kecepatan:

1. API key (Gemini, Supabase service role) tidak pernah di client-side
2. Role-based access ditegakkan di database (RLS), bukan hanya UI
3. Fitur CV tidak pernah diklaim sebagai keputusan final/pasti
4. Job board tenaga kerja TIDAK dibangun dalam bentuk apa pun di MVP ini
