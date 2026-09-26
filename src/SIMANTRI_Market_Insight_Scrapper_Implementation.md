# SIMANTRI Market Insight — Analisis & Implementasi `scrapper.py`

## 0. Tujuan

Dokumen ini adalah handoff teknis untuk implementasi scraper Market Insight SIMANTRI berdasarkan hasil eksplorasi PIHPS yang sudah dilakukan.

### Keputusan terbaru

- Komoditas: **Bawang Merah Ukuran Sedang**
- Tipe harga: **Produsen**
- Wilayah MVP: **seluruh provinsi Indonesia**
- Periode initial load: **±30 hari historis**
- Update berikutnya: **incremental**, hanya mengambil tanggal yang belum ada
- Penyimpanan awal: **CSV untuk validasi**, kemudian PostgreSQL/Supabase
- Analytics: **perhitungan deterministic di backend**
- Gemini: **opsional sebagai penjelas hasil analytics**, bukan pembaca database secara bebas

Alur utama:

```text
PIHPS
  ↓
scrapper.py
  ↓
Raw Market Data
  ↓
Validation
  ↓
CSV / Database
  ↓
Market Analytics
  ↓
Market Insight
  ↓
Gemini (opsional: interpretasi)
```

---

# 1. Halaman PIHPS yang Menjadi Acuan

Halaman yang dipilih:

`https://www.bi.go.id/hargapangan/TabelHarga/ProdusenDaerah`

Halaman resmi tersebut berjudul **Tabel Harga Berdasarkan Daerah** dan menyediakan filter Tipe, Komoditas, Provinsi, Kabupaten/Kota, Pasar, Tipe Laporan, Tanggal Mulai, dan Tanggal Selesai. Halaman tersebut juga memiliki bagian Perkembangan Harga Pangan. citeturn1view0

**Penting:** URL halaman UI tidak otomatis berarti kita sudah mengetahui endpoint backend yang digunakan halaman tersebut. Endpoint harus tetap dibuktikan melalui Network/eksperimen.

---

# 2. Endpoint PIHPS yang Sudah Ditemukan

## 2.1 `GetCommoditiesTree`

```text
https://www.bi.go.id/hargapangan/WebSite/Home/GetCommoditiesTree
```

Hasil eksplorasi menunjukkan:

```text
5       → Bawang Merah
5_11    → Bawang Merah Ukuran Sedang
```

### Nilai final

```text
commodity = 5_11
```

Jangan menggunakan `11` sebagai nilai `commodity` untuk `GetGridData1`.

---

## 2.2 `GetType`

```text
https://www.bi.go.id/hargapangan/WebSite/Home/GetType
```

Mapping yang sudah ditemukan:

| ID | Tipe |
|---:|---|
| 1 | Pasar Tradisional |
| 2 | Pasar Modern |
| 3 | Pedagang Besar |
| **4** | **Produsen** |

### Nilai final

```text
priceType = 4
```

---

## 2.3 `GetProvinceAll`

```text
https://www.bi.go.id/hargapangan/WebSite/Home/GetProvinceAll
```

Endpoint ini mengembalikan daftar provinsi.

Contoh yang sudah diuji:

```text
Jawa Tengah → 14
Jawa Timur  → 16
```

Untuk seluruh provinsi:

```text
provId = 0
```

---

## 2.4 `GetRegencyAll`

```text
https://www.bi.go.id/hargapangan/WebSite/Home/GetRegencyAll
```

Parameter:

```text
ref_prov_id
```

Contoh:

```text
GetRegencyAll?ref_prov_id=16
```

Hasil yang sudah ditemukan:

```text
Nganjuk → regency_id = 120
```

### Catatan

Scope Market Insight sekarang **tidak menggunakan level kabupaten/kota sebagai target utama**.

Kita sudah menguji `regId=120` pada `GetGridData1`, tetapi response tetap berbentuk level provinsi. Karena kebutuhan MVP adalah perbandingan seluruh provinsi, kita tidak perlu memaksakan district-level.

---

# 3. Endpoint Utama: `GetGridData1`

Endpoint:

```text
https://www.bi.go.id/hargapangan/WebSite/Home/GetGridData1
```

Parameter yang sudah terbukti digunakan halaman PIHPS:

```text
tanggal
commodity
priceType
isPasokan
jenis
periode
provId
```

### Request final yang akan digunakan

```text
https://www.bi.go.id/hargapangan/WebSite/Home/GetGridData1
?tanggal=Sep%2021%2C%202026
&commodity=5_11
&priceType=4
&isPasokan=1
&jenis=1
&periode=1
&provId=0
```

### Mapping

| Parameter | Nilai | Keterangan |
|---|---|---|
| `tanggal` | `Sep 21, 2026` | Tanggal observasi |
| `commodity` | `5_11` | Bawang Merah Ukuran Sedang |
| `priceType` | `4` | Produsen |
| `isPasokan` | `1` | Dipertahankan dari request browser yang berhasil |
| `jenis` | `1` | Dipertahankan dari request browser yang berhasil |
| `periode` | `1` | Dipertahankan dari request browser yang berhasil |
| `provId` | `0` | Seluruh provinsi |

---

# 4. Hasil Pengujian yang Sudah Berhasil

Kita sudah menguji historical request dengan `GetGridData1`.

Hasil:

```text
21 Sep 2026 → HTTP 200 → 33 records
20 Sep 2026 → HTTP 200 → 33 records
19 Sep 2026 → HTTP 200 → 33 records
18 Sep 2026 → HTTP 200 → 33 records
```

Artinya endpoint dapat digunakan untuk **date-by-date historical ingestion**.

Kita juga sudah menguji request browser untuk:

```text
commodity = 5_11
priceType = 1
provId = 16
```

dan mendapatkan data Jawa Timur.

Setelah itu kita menguji:

```text
commodity = 5_11
priceType = 4
provId = 16
regId = 120
```

Response tetap berbentuk:

```text
ProvID = 16
Provinsi = Jawa Timur
```

Sehingga nilai yang dikembalikan endpoint tersebut **tidak boleh disebut sebagai harga spesifik Nganjuk**.

---

# 5. Mengapa `scraper.py` Lama Tidak Langsung Dipakai?

File `scraper.py` lama menggunakan endpoint:

```text
/hargapangan/WebSite/TabelHarga/GetGridDataKomoditas
```

beserta parameter:

```text
price_type_id
comcat_id
province_id
regency_id
showKota
showPasar
tipe_laporan
start_date
end_date
```

Referensi source:

- Endpoint lama: fileciteturn3file0L152-L166
- Mapping komoditas lama: fileciteturn3file0L56-L74
- Session initialization: fileciteturn3file0L119-L127
- Parsing data level provinsi: fileciteturn3file0L174-L210

Namun endpoint tersebut sudah kita uji dan berakhir pada halaman 404/e404.

Selain itu, script lama hanya memetakan:

```python
{
    "1": "traditional",
    "2": "modern"
}
```

sedangkan mapping PIHPS yang kita temukan sekarang adalah:

```text
1 = Pasar Tradisional
2 = Pasar Modern
3 = Pedagang Besar
4 = Produsen
```

Jadi script lama harus **diadaptasi**, bukan dijalankan apa adanya.

---

# 6. Dataset yang Akan Kita Bangun

Target dataset:

```text
Commodity:
Bawang Merah Ukuran Sedang

Price Type:
Produsen

Coverage:
Seluruh provinsi Indonesia

Historical period:
30 hari

Granularity:
1 record / provinsi / tanggal
```

Contoh:

| date | province_id | province | commodity | price_type | price |
|---|---:|---|---|---|---:|
| 2026-09-21 | 16 | Jawa Timur | Bawang Merah Ukuran Sedang | Produsen | 15300 |
| 2026-09-21 | 14 | Jawa Tengah | Bawang Merah Ukuran Sedang | Produsen | ... |
| 2026-09-20 | 16 | Jawa Timur | Bawang Merah Ukuran Sedang | Produsen | ... |

**Jangan mengisi missing data dengan tebakan.**

PIHPS sendiri menjelaskan bahwa data komoditas tertentu di kota sampel dapat tidak tersedia. citeturn0search2

---

# 7. Alur Implementasi `scrapper.py`

## Step 1 — Request satu tanggal

Jangan langsung membuat scraper 30 hari.

Pertama:

```text
1 tanggal
→ request
→ print response
```

Target:

```text
HTTP 200
data tersedia
```

---

## Step 2 — Parse response

Ambil field yang dibutuhkan:

```text
ProvID
Provinsi
Tanggal
Komoditas
Nilai
```

Kemudian ubah menjadi struktur internal:

```python
{
    "date": "...",
    "province_id": 16,
    "province": "Jawa Timur",
    "commodity": "Bawang Merah Ukuran Sedang",
    "price_type": "Produsen",
    "price": 15300
}
```

---

## Step 3 — Validasi

Minimal:

```text
status_code == 200
data adalah list
ProvID ada
Provinsi ada
Tanggal ada
Nilai tidak null
Nilai > 0
```

Jika:

```json
{"data":[]}
```

maka jangan membuat record palsu.

---

# 8. Step 4 — Test 3–7 Hari

Setelah satu tanggal berhasil:

```text
H-6
H-5
H-4
H-3
H-2
H-1
H
```

Output log:

```text
2026-09-20 → 33 records
2026-09-21 → 33 records
...
```

Tujuannya memastikan historical retrieval stabil.

---

# 9. Step 5 — Initial Historical Load 30 Hari

Setelah test berhasil:

```text
today - 29 hari
        ↓
today
```

Untuk setiap tanggal:

```text
GetGridData1
      ↓
commodity=5_11
priceType=4
provId=0
```

Sehingga:

```text
30 tanggal
×
provinsi yang tersedia
```

menjadi dataset awal Market Insight.

---

# 10. Step 6 — Simpan ke CSV Terlebih Dahulu

Untuk debugging awal:

```text
data/
└── market_prices_producer_30d.csv
```

Jangan langsung mengikat scraper ke database sebelum dataset berhasil divalidasi.

Ini membuat debugging jauh lebih mudah.

---

# 11. Step 7 — Validasi Dataset

Periksa:

### Jumlah tanggal

Apakah 30 hari berhasil diambil?

### Jumlah provinsi

Berapa provinsi yang memiliki data pada setiap tanggal?

### Missing value

Apakah ada harga kosong/null?

### Duplicate

Apakah terdapat:

```text
tanggal + provinsi
```

yang muncul lebih dari satu kali?

### Anomaly

Periksa:

```text
price <= 0
```

dan nilai yang secara teknis tidak masuk akal.

**Jangan langsung membuang outlier tanpa analisis.**

---

# 12. Step 8 — Masukkan ke PostgreSQL/Supabase

Setelah CSV valid:

```text
CSV
 ↓
PostgreSQL/Supabase
```

Struktur minimal:

```text
market_prices
----------------
id
date
province_id
province_name
commodity
price_type
price
source
created_at
updated_at
```

Unique key konseptual:

```text
date
+
province_id
+
commodity
+
price_type
```

Tujuannya agar scraper bersifat **idempotent**.

Menjalankan scraper dua kali tidak membuat duplicate.

---

# 13. Step 9 — Incremental Update

Setelah initial 30 hari selesai, **jangan mengambil ulang 30 hari setiap hari**.

Misalnya database sudah sampai:

```text
2026-09-25
```

ketika dijalankan tanggal:

```text
2026-09-26
```

scraper mengambil:

```text
2026-09-26
```

saja.

Jika ada gap:

```text
23 Sep ✓
24 Sep ✓
25 Sep ✗
26 Sep ✓
```

maka run berikutnya mencari:

```text
25 Sep
```

dan mencoba mengambilnya lagi.

Alur:

```text
Database
 ↓
Cari last date
 ↓
Cari missing date
 ↓
Fetch missing date
 ↓
Upsert
```

---

# 14. Step 10 — Market Analytics

Setelah database tersedia, **jangan meminta Gemini menghitung langsung dari raw database**.

Backend menghitung:

### Current Price

```text
harga terbaru
```

### Daily Change

```text
current_price - previous_price
```

### Percentage Change

```text
((current - previous) / previous) × 100
```

### 30-Day Average

```text
AVG(price)
```

### 30-Day Minimum

```text
MIN(price)
```

### 30-Day Maximum

```text
MAX(price)
```

### Trend

Ditentukan berdasarkan rule analytics yang disepakati.

---

# 15. Output Analytics

Contoh context yang dikirim ke Gemini:

```json
{
  "commodity": "Bawang Merah Ukuran Sedang",
  "price_type": "Produsen",
  "province": "Jawa Timur",
  "current_price": 15300,
  "previous_price": 15100,
  "change": 200,
  "change_percentage": 1.32,
  "average_30d": 14950,
  "min_30d": 13500,
  "max_30d": 16200,
  "trend": "increasing"
}
```

Gemini hanya menjelaskan context tersebut.

Prinsip:

```text
Database
= fakta

Analytics
= perhitungan

Gemini
= interpretasi
```

---

# 16. Struktur Akhir Market Insight

```text
                     PIHPS
                       │
                       ▼
                 scrapper.py
                       │
                       ▼
                 Validation
                       │
                       ▼
              PostgreSQL/Supabase
                       │
               ┌───────┴────────┐
               │                │
               ▼                ▼
           Raw Price       Market Analytics
                                │
                    ┌───────────┼───────────┐
                    ▼           ▼           ▼
                 Current      Change      Trend
                  Price         %        Analysis
                    │           │           │
                    └───────────┼───────────┘
                                ▼
                         Market Insight
                                │
                       ┌────────┴────────┐
                       │                 │
                       ▼                 ▼
                   Frontend          Gemini
                                      (optional)
```

---

# 17. Scheduler

Target update:

```text
Setiap hari
15:00 WIB
```

Tetapi scheduler **tidak perlu dimasukkan ke `scrapper.py`**.

Lebih baik:

```text
Scheduler
    ↓
python scrapper.py
    ↓
Fetch missing data
    ↓
Database
```

Dengan demikian scraper hanya bertanggung jawab terhadap ingestion.

---

# 18. Struktur Folder Awal

```text
market-insight/
│
├── scrapper.py
├── requirements.txt
├── .env
│
├── data/
│   └── market_prices_producer_30d.csv
│
├── logs/
│   └── scraper.log
│
└── README.md
```

Kemudian saat diintegrasikan ke SIMANTRI:

```text
SIMANTRI/
│
├── scraper/
│   └── scrapper.py
│
├── backend/
│   └── market/
│
├── ai/
│
└── frontend/
```

---

# 19. Acceptance Criteria `scrapper.py`

- [ ] Mengakses PIHPS.
- [ ] Menggunakan `GetGridData1`.
- [ ] Menggunakan `commodity=5_11`.
- [ ] Menggunakan `priceType=4`.
- [ ] Menggunakan `provId=0`.
- [ ] Dapat mengambil satu tanggal.
- [ ] Dapat mengambil historical ±30 hari.
- [ ] Dapat memvalidasi response.
- [ ] Tidak membuat data palsu ketika response kosong.
- [ ] Tidak menghasilkan duplicate.
- [ ] Dapat melakukan incremental update.
- [ ] Dapat melakukan gap filling.
- [ ] Dapat menghasilkan CSV.
- [ ] Dataset tervalidasi sebelum masuk database.

---

# 20. Urutan Implementasi Sekarang

Jadi **jangan langsung membuat semuanya sekaligus**.

Urutan kerja yang kita lakukan:

```text
STEP 1
Buat scrapper.py minimal
        ↓
STEP 2
Request 1 tanggal
        ↓
STEP 3
Pastikan priceType=4 berhasil
        ↓
STEP 4
Parse data provinsi
        ↓
STEP 5
Test 3–7 tanggal
        ↓
STEP 6
Ambil 30 hari
        ↓
STEP 7
Simpan CSV
        ↓
STEP 8
Validasi dataset
        ↓
STEP 9
Masukkan PostgreSQL/Supabase
        ↓
STEP 10
Buat incremental update
        ↓
STEP 11
Market Analytics
        ↓
STEP 12
Market Insight API
        ↓
STEP 13
Frontend
        ↓
STEP 14
Gemini explanation
```

---

# 21. Kesimpulan

Untuk implementasi Market Insight saat ini, fondasi yang paling aman adalah:

```text
Bawang Merah Ukuran Sedang
        +
Produsen
        +
Seluruh Provinsi
        +
Historical 30 Hari
```

Endpoint utama:

```text
https://www.bi.go.id/hargapangan/WebSite/Home/GetGridData1
```

Parameter utama:

```text
commodity = 5_11
priceType = 4
provId = 0
```

Kita **tidak lagi menggunakan endpoint lama `GetGridDataKomoditas`** dari scraper sebelumnya sebagai fondasi.

Halaman `ProdusenDaerah` digunakan sebagai acuan halaman/domain data, tetapi endpoint backend khusus halaman tersebut belum boleh diasumsikan tanpa pengujian Network.

Dengan scope provinsi, `GetGridData1` sudah cukup sebagai fondasi MVP Market Insight yang telah kita buktikan melalui pengujian historical date-by-date.

---

## Referensi

- PIHPS — Produsen Berdasarkan Daerah: https://www.bi.go.id/hargapangan/TabelHarga/ProdusenDaerah
- PIHPS — FAQ: https://www.bi.go.id/hargapangan/Informasi/FAQ
- PIHPS — Website: https://www.bi.go.id/hargapangan/
- Source `scraper.py` lama: `turn3file0`
