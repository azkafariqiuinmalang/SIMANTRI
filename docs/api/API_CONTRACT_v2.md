# API Contract v2 — SIMANTRI (perubahan dari v1)

> File ini melengkapi `API_CONTRACT.md` sebelumnya. Perubahan utama:
> endpoint submit Knowledge Base sekarang KHUSUS Penyuluh/Admin, dan
> ada endpoint feedback baru dari Petani untuk CV & Chatbot.

---

## Knowledge Base — PERUBAHAN AKSES

### `POST /api/knowledge`
**BERUBAH dari v1.** Sebelumnya semua role bisa submit, sekarang:

Auth: **HANYA role `penyuluh` (dengan `is_verified_contributor = true`) atau `admin`**
Response gagal kalau petani mencoba akses:
```json
{ "data": null, "error": { "message": "Hanya penyuluh dan admin yang dapat menambah entri", "code": "FORBIDDEN" } }
```

### `GET /api/knowledge`
Tidak berubah — publik boleh baca entri `verified` tanpa login (mendukung akses "Pengunjung Umum" ke Dunia Brambang).

---

## Feedback Petani untuk Computer Vision (BARU)

### `PATCH /api/detect-disease/:id/feedback`
Request:
```json
{
  "farmer_feedback": "sesuai" | "tidak_sesuai",
  "farmer_correction_note": "Menurut pengalaman saya, gejala ini lebih mirip busuk daun, bukan Fusarium"
}
```
Proses: update kolom `farmer_feedback`, `farmer_correction_note`, `feedback_by`, `feedback_at` di `cv_detections`

Auth: role `petani` (harus pemilik record `user_id`)

---

## Feedback Petani untuk Chatbot (BARU)

### `PATCH /api/chat/:id/feedback`
Request:
```json
{
  "feedback": "helpful" | "not_helpful",
  "feedback_note": "Jawabannya kurang spesifik untuk kondisi tanah di Nganjuk"
}
```
Auth: role `petani` (harus pemilik record)

---

## Dashboard "Sinyal Perlu Ditinjau" untuk Penyuluh (BARU)

### `GET /api/penyuluh/signals`
Mengambil data dari view `v_cv_signal_review` — menampilkan pola feedback
`tidak_sesuai` yang konsisten dari minimal 2 petani berbeda, dikelompokkan
per jenis penyakit dan desa.

Response:
```json
{
  "data": [
    {
      "predicted_class": "Fusarium",
      "village": "Gondang",
      "jumlah_feedback_tidak_sesuai": 6,
      "jumlah_petani_berbeda": 4,
      "catatan_petani": [
        "Gejala di lahan saya beda, daunnya tidak menguning dulu",
        "Menurut saya ini lebih mirip busuk daun"
      ],
      "feedback_terakhir": "2026-08-05T10:00:00Z"
    }
  ],
  "error": null
}
```

Auth: HARUS role `penyuluh` (dengan `is_verified_contributor = true`) atau `admin`

**Catatan implementasi:** endpoint ini query langsung ke view
`v_cv_signal_review` di database — tidak perlu logika agregasi
tambahan di Next.js, cukup `SELECT * FROM v_cv_signal_review`.

---

## Ringkasan perubahan role & akses

| Aksi | Petani | Penyuluh (verified) | Admin |
|---|---|---|---|
| Lihat Knowledge Base (verified) | ✅ (bahkan tanpa login) | ✅ | ✅ |
| Submit entri Knowledge Base baru | ❌ | ✅ | ✅ |
| Verifikasi/edit entri KB | ❌ | ✅ | ✅ |
| Lihat prediksi harga | ✅ | ✅ | ✅ |
| Deteksi penyakit (CV) | ✅ | ✅ | ✅ |
| Beri feedback hasil CV | ✅ | ✅ | ✅ |
| Beri feedback jawaban chatbot | ✅ | ✅ | ✅ |
| Lihat dashboard "Sinyal Perlu Ditinjau" | ❌ | ✅ | ✅ |
| Laporkan entri KB yang keliru | ✅ | ✅ | ✅ |
| Kelola pengguna & konten | ❌ | ❌ | ✅ |
