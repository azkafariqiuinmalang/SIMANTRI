# API Contract v4 — SIMANTRI (perubahan dari v3)

> Menambahkan endpoint untuk `market_price` (dari PRD-Market.md) dan
> merombak endpoint deteksi CV untuk mendukung multi-hasil per foto.

---

## Market Price & Forecast (BARU, dari PRD-Market.md)

### `POST /api/market/price`
Input harga harian oleh admin.
Request:
```json
{ "tanggal": "2026-08-20", "harga": 19400 }
```
Auth: HARUS role `admin`
Proses: insert/update (upsert berdasarkan `tanggal`) ke tabel
`market_price`. Kalau tanggal sudah ada, overwrite sesuai spek asli
di PRD-Market.md.

### `GET /api/market/price/history`
Ambil riwayat harga untuk grafik tren.
Query params: `?days=30`
Auth: role login mana pun

### `GET /api/market/forecast`
**Catatan:** ini query ke tabel `price_predictions` yang sudah ada
sejak v1, BUKAN tabel baru. Nama endpoint mengikuti PRD-Market.md,
tapi implementasinya reuse yang sudah dibangun.
Auth: role login mana pun

---

## Deteksi Penyakit — PERUBAHAN untuk multi-hasil per foto

### `POST /api/detect-disease`
Request: `multipart/form-data` — file gambar

Proses internal (BERUBAH):
1. Upload gambar ke Supabase Storage
2. Insert satu baris ke `cv_detections` (representasi sesi upload)
3. Panggil model YOLOv8, terima SEMUA objek terdeteksi (bisa lebih dari satu)
4. Insert satu baris ke `cv_detection_results` UNTUK SETIAP objek yang terdeteksi

Response (BERUBAH, sekarang array):
```json
{
  "data": {
    "detection_id": "uuid",
    "results": [
      { "result_id": "uuid", "predicted_class": "Fusarium", "confidence": 61.2, "bbox": {"x":0.2,"y":0.1,"width":0.3,"height":0.4} },
      { "result_id": "uuid", "predicted_class": "Sehat", "confidence": 88.5, "bbox": {"x":0.6,"y":0.5,"width":0.2,"height":0.3} }
    ],
    "disclaimer": "Ini dugaan awal, disarankan konfirmasi ke penyuluh terdekat"
  },
  "error": null
}
```
Auth: role login mana pun

### `PATCH /api/detect-disease/results/:result_id/feedback`
**BERUBAH** — feedback sekarang per hasil deteksi (`result_id`), bukan
per foto, karena satu foto bisa punya beberapa kelas terdeteksi
sekaligus.
Request:
```json
{ "farmer_feedback": "sesuai" | "tidak_sesuai", "farmer_correction_note": "..." }
```
Auth: role `petani` (pemilik sesi upload, dicek lewat relasi `detection_id`)

---

## Dashboard Sinyal Perlu Ditinjau

Tidak berubah secara kontrak API, tapi query di baliknya sekarang
mengambil dari `v_cv_signal_review` versi baru yang join ke
`cv_detection_results`, bukan langsung ke `cv_detections` seperti v2/v3.
