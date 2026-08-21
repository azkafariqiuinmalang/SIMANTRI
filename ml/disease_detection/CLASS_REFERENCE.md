# CV Class Reference — SIMANTRI

> Referensi WAJIB dibaca sebelum membangun UI hasil deteksi penyakit.
> Model YOLOv8 mendeteksi 6 kelas campuran (penyakit + bagian tanaman),
> harus dibedakan penanganannya di aplikasi, JANGAN ditampilkan
> sejajar seolah semuanya "hasil diagnosis".

## Daftar kelas (dari data.yaml)

| Index | Nama Kelas (raw) | Kategori | Tampilkan sebagai hasil diagnosis ke petani? |
|---|---|---|---|
| 0 | `Antranoksa` | disease | Ya — tampilkan sebagai "Antraknosa" (kemungkinan typo di source data) |
| 1 | `Daun-Bawang` | anatomy | TIDAK — internal saja |
| 2 | `Moler` | disease | Ya |
| 3 | `Pucuk-Daun` | anatomy | TIDAK — internal saja |
| 4 | `Sehat` | healthy | Ya |
| 5 | `Trotol` | disease | Ya |

## Aturan penanganan di kode

```js
// Konstanta ini WAJIB dipakai di backend/frontend, jangan hardcode
// logika kategori di banyak tempat berbeda.
export const CV_CLASS_REFERENCE = {
  'Antranoksa': { category: 'disease', displayName: 'Antraknosa' },
  'Daun-Bawang': { category: 'anatomy', displayName: null },
  'Moler': { category: 'disease', displayName: 'Moler' },
  'Pucuk-Daun': { category: 'anatomy', displayName: null },
  'Sehat': { category: 'healthy', displayName: 'Sehat' },
  'Trotol': { category: 'disease', displayName: 'Trotol' },
}
```

### Logika tampilan di endpoint `/api/detect-disease`

1. Filter hasil deteksi dari model: pisahkan yang `category: 'disease'`
   atau `'healthy'` (ini yang ditampilkan sebagai "hasil diagnosis")
   dari yang `category: 'anatomy'` (ini cuma dipakai untuk validasi
   internal, misal cek apakah foto memang berisi bawang merah).
2. Kalau HANYA kelas `anatomy` yang terdeteksi (tidak ada disease/
   healthy sama sekali), tampilkan pesan berbeda ke petani: "Foto
   terdeteksi berisi tanaman bawang, tapi sistem belum bisa
   menyimpulkan kondisi kesehatannya. Coba foto yang lebih jelas pada
   bagian yang dicurigai sakit."
3. Kelas `anatomy` TETAP disimpan di `cv_detection_results` (jangan
   dibuang), cuma diberi flag/tidak ditampilkan di UI utama, supaya
   datanya tetap ada untuk analisis nanti.

## Catatan tambahan yang perlu diperiksa manual

- **`Antranoksa` kemungkinan typo dari `Antraknosa`** (nama penyakit
  jamur Colletotrichum yang umum di bawang merah). Sebelum training
  ulang atau publikasi ke Dunia Brambang, cek ke sumber literatur
  resmi untuk memastikan ejaan yang benar. Untuk tampilan ke pengguna,
  boleh langsung dikoreksi jadi "Antraknosa" tanpa perlu training
  ulang model (cukup di layer `displayName`), asal nilai mentah dari
  model tetap `Antranoksa` untuk konsistensi data.
- **`Moler`** dan **`Trotol`** adalah istilah lokal yang sudah umum
  dipakai petani Indonesia, aman dipakai langsung tanpa perlu
  diterjemahkan ke istilah ilmiah di UI utama, tapi bisa ditambahkan
  nama ilmiah sebagai info tambahan di Dunia Brambang.
