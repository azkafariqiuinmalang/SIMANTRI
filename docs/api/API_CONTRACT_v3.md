# API Contract v3 — SIMANTRI (perubahan dari v2)

> Menggantikan bagian Knowledge Base di `API_CONTRACT.md` dan
> `API_CONTRACT_v2.md`. Perubahan utama: submit entri KB sekarang
> KHUSUS admin, dan ada endpoint baru untuk usulan/koreksi dari
> petani & penyuluh yang tidak langsung mengubah konten.

---

## Knowledge Base — PERUBAHAN AKSES (v3)

### `POST /api/knowledge`
**BERUBAH dari v2.** Sebelumnya penyuluh terverifikasi bisa submit,
sekarang HANYA admin.

Auth: HARUS role `admin`

### `PATCH /api/knowledge/:id`
Update entri yang sudah ada. Auth: HARUS role `admin`

### `GET /api/knowledge`
Tidak berubah — publik boleh baca entri `published` tanpa login.

---

## Usulan & Koreksi Konten (BARU, menggantikan konsep report lama)

### `POST /api/suggestions`
Request:
```json
{
  "type": "laporan_keliru" | "usulan_pembaruan",
  "related_entry_id": "uuid atau null",
  "content_note": "Menurut pengamatan saya, waktu tanam ideal Bauji sebaiknya diperbarui karena..."
}
```
Auth: role `petani` atau `penyuluh` (harus login)
Proses: `submitted_by` dan `submitted_role` otomatis dari sesi login,
status awal selalu `diterima_menunggu_tinjauan`

### `GET /api/suggestions/mine`
Mengambil daftar usulan yang pernah dikirim user yang sedang login,
lengkap dengan status terkininya. Ini yang memberi transparansi ke
pengirim, "usulan saya diterima tapi belum ditinjau" atau "sudah
digunakan dalam pembaruan".

Response:
```json
{
  "data": [
    {
      "id": "uuid",
      "type": "usulan_pembaruan",
      "content_note": "...",
      "status": "digunakan_dalam_pembaruan",
      "review_note": "Sudah diintegrasikan ke entri Waspada Busuk Daun",
      "reviewed_at": "2026-08-10T09:00:00Z"
    }
  ],
  "error": null
}
```
Auth: pemilik record saja (role apa pun yang login)

### `GET /api/suggestions` (untuk admin)
Melihat semua usulan yang masuk, bisa difilter `?status=diterima_menunggu_tinjauan`
Auth: HARUS role `admin`

### `PATCH /api/suggestions/:id/review`
Request:
```json
{
  "status": "digunakan_dalam_pembaruan" | "tidak_digunakan",
  "review_note": "..."
}
```
Auth: HARUS role `admin`
Proses: kalau status `digunakan_dalam_pembaruan`, admin lanjut membuat
atau mengedit entri lewat `POST/PATCH /api/knowledge` secara terpisah,
lalu bisa isi `based_on_suggestion_id` di entri tersebut untuk menjaga
jejak asal usulan.

---

## Dashboard "Sinyal Perlu Ditinjau" untuk Penyuluh

Tidak berubah dari v2 — tetap query ke view `v_cv_signal_review`.
Lihat `API_CONTRACT_v2.md` untuk detail lengkap endpoint ini.

---

## Ringkasan perubahan role & akses (v3, final)

| Aksi | Petani | Penyuluh (verified) | Admin |
|---|---|---|---|
| Lihat Knowledge Base (published) | ✅ (bahkan tanpa login) | ✅ | ✅ |
| Membuat/mengedit entri KB langsung | ❌ | ❌ | ✅ |
| Ajukan usulan/koreksi konten KB | ✅ | ✅ | — |
| Lihat status usulan sendiri | ✅ | ✅ | — |
| Tinjau & putuskan semua usulan | ❌ | ❌ | ✅ |
| Lihat prediksi harga | ✅ | ✅ | ✅ |
| Deteksi penyakit (CV) + feedback | ✅ | ✅ | ✅ |
| Lihat dashboard "Sinyal Perlu Ditinjau" | ❌ | ✅ | ✅ |
| Kelola pengguna & konten | ❌ | ❌ | ✅ |
