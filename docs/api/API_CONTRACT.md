# API Contract — SIMANTRI

> Kontrak ini WAJIB diikuti agent saat membuat API routes. Kalau butuh
> endpoint baru di luar daftar ini, agent harus mengusulkan dulu, bukan
> langsung membuat.

## Konvensi umum

- Semua endpoint di bawah `/api/*` (Next.js API routes)
- Auth: pakai Supabase session, kirim lewat cookie/header standar Supabase
- Response format sukses: `{ data: ..., error: null }`
- Response format gagal: `{ data: null, error: { message, code } }`
- Endpoint yang butuh role tertentu WAJIB divalidasi ganda: di route handler
  DAN mengandalkan RLS di database (defense in depth)

---

## 1. Prediksi Harga

### `POST /api/predict-price`
Request:
```json
{ "target_date": "2026-08-15" }
```
Proses internal:
1. Ambil data historis terbaru dari tabel harga/cuaca
2. Hitung ulang fitur (Lag1/3/7/14/30, MA7/14/30, dst) — **lihat FEATURE_ENGINEERING_SPEC.md untuk formula PERSIS**
3. Panggil endpoint model XGBoost eksternal
4. Simpan hasil ke tabel `price_predictions` (termasuk `input_features` snapshot)

Response:
```json
{
  "data": {
    "predicted_price": 26500,
    "prediction_date": "2026-08-15",
    "mape_at_training": 3.0,
    "model_version": "xgboost-v1"
  },
  "error": null
}
```
Auth: semua role login bisa akses (read)

---

## 2. Deteksi Penyakit (Computer Vision)

### `POST /api/detect-disease`
Request: `multipart/form-data` — file gambar
Proses internal:
1. Upload gambar ke Supabase Storage
2. Panggil endpoint model CV eksternal
3. Simpan hasil ke `cv_detections` dengan `status = 'unreviewed'`

Response:
```json
{
  "data": {
    "predicted_class": "Fusarium",
    "confidence": 58.3,
    "disclaimer": "Ini dugaan awal, disarankan konfirmasi ke penyuluh terdekat",
    "detection_id": "uuid"
  },
  "error": null
}
```
Auth: role `petani`, `penyuluh`, `admin` (harus login)

### `PATCH /api/detect-disease/:id/review`
Untuk penyuluh mengoreksi/mengonfirmasi hasil CV.
Auth: HARUS role `penyuluh` dengan `is_verified_contributor = true`

---

## 3. Knowledge Base (Dunia Brambang)

### `GET /api/knowledge`
Query params: `?category=&status=verified&search=`
Default: hanya return `status = 'verified'` kecuali user adalah pemilik entri
Auth: publik boleh baca yang verified; login untuk lihat punya sendiri yang pending

### `POST /api/knowledge`
Request: mengikuti struktur field di `simantri_schema.sql` (title, category,
summary, content, keywords, dst)
Proses: otomatis `status = 'pending'`, `contributor_id = current_user`
Auth: role login mana pun boleh submit

### `PATCH /api/knowledge/:id/verify`
Request: `{ "action": "verify" | "reject", "note": "..." }`
Auth: HARUS role `penyuluh` dengan `is_verified_contributor = true`, atau `admin`

---

## 4. Chatbot (Gemini + RAG)

### `POST /api/chat`
Request:
```json
{ "message": "Kapan waktu tanam Bauji yang ideal?" }
```
Proses internal:
1. **Retrieval:** cari entri `knowledge_entries` (status `published` saja)
   yang relevan dengan pesan user, cocokkan lewat kolom `keywords` dan
   `semantic_keywords`, ambil beberapa entri teratas
2. **Augmentation:** susun system prompt Gemini yang menyertakan isi
   entri-entri itu sebagai konteks, supaya jawaban grounded ke
   knowledge base SIMANTRI, bukan pengetahuan umum Gemini semata
3. Panggil Gemini API SERVER-SIDE dengan API key dari env var, JANGAN dari client
4. Simpan log ke `chat_logs`, idealnya sertakan juga `doc_id` entri
   yang dipakai sebagai konteks (untuk audit/transparansi jawaban)

Response:
```json
{ "data": { "response": "...", "sumber": ["VAR-BAUJI-001"] }, "error": null }
```
Auth: role login mana pun

**Catatan implementasi (MVP vs lanjutan):** untuk versi awal, retrieval
cukup pakai pencocokan keyword/text sederhana (`ILIKE` atau full-text
search PostgreSQL bawaan), TIDAK perlu vector embedding/pgvector dulu,
itu over-engineering untuk skala kompetisi. Vector search bisa jadi
peningkatan di iterasi berikutnya kalau jumlah entri Dunia Brambang
sudah banyak dan pencocokan keyword mulai kurang akurat.

---

## 5. Laporan (Report)

### `POST /api/reports`
Request:
```json
{
  "knowledge_entry_id": "uuid | null",
  "cv_detection_id": "uuid | null",
  "reason": "Informasi ini tidak akurat karena..."
}
```
Auth: role login mana pun

### `GET /api/reports` (untuk admin/penyuluh)
Auth: HARUS role `admin` atau `penyuluh`

---

## Environment Variables yang Dibutuhkan

Lihat `.env.example` — WAJIB diisi sebelum endpoint di atas bisa jalan.
