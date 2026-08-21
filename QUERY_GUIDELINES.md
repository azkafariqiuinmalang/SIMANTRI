# Query & Database Quality Guidelines — SIMANTRI

> Dokumen ini WAJIB dibaca agent sebelum menulis query apa pun (Supabase
> client, raw SQL, atau ORM). Tujuannya bukan supaya kode "jalan", tapi
> supaya tetap cepat begitu data mulai banyak. Semua contoh merujuk
> langsung ke tabel di `simantri_schema_v3.sql`, bukan tips generik.

---

## 1. Jangan pernah `SELECT *`

Selalu sebutkan kolom yang benar-benar dipakai di UI. Ini bukan cuma
soal kecepatan network, tapi juga supaya kalau ada kolom besar seperti
`content` di `knowledge_entries` (isi artikel penuh) atau
`input_features` (jsonb) di `price_predictions`, kolom itu tidak
ke-fetch percuma di halaman yang cuma butuh daftar ringkas.

Salah:
```js
const { data } = await supabase.from('knowledge_entries').select('*')
```

Benar, untuk halaman daftar Dunia Brambang:
```js
const { data } = await supabase
  .from('knowledge_entries')
  .select('id, title, summary, category, evidence_level, author_id, created_at')
  .eq('status', 'published')
```
Kolom `content` (isi lengkap) baru di-fetch di halaman detail satu entri.

## 2. Cegah N+1 query — pakai nested select Supabase, jangan loop

Kalau agent perlu menampilkan entri Knowledge Base beserta nama
penulisnya (dari tabel `profiles`), JANGAN fetch semua entri dulu lalu
loop fetch profile satu-satu.

Salah (N+1, satu query per entri):
```js
const { data: entries } = await supabase.from('knowledge_entries').select('*')
for (const entry of entries) {
  const { data: author } = await supabase.from('profiles').select('full_name').eq('id', entry.author_id).single()
  // ...
}
```

Benar (satu query, pakai relasi foreign key):
```js
const { data } = await supabase
  .from('knowledge_entries')
  .select('id, title, summary, author:profiles!knowledge_entries_author_id_fkey(full_name)')
  .eq('status', 'published')
```
Ini berlaku untuk semua relasi FK di skema: `cv_detections.user_id`,
`content_suggestions.submitted_by`, `content_suggestions.reviewed_by`, dst.

## 3. Selalu paginasi, jangan fetch semua baris sekaligus

Tabel yang berpotensi tumbuh besar seiring waktu, terutama
`knowledge_entries`, `cv_detections`, `content_suggestions`, dan
`chat_logs`, WAJIB pakai `.range()` atau `.limit()`, tidak boleh fetch
tanpa batas.

```js
const PAGE_SIZE = 20
const { data } = await supabase
  .from('knowledge_entries')
  .select('id, title, summary')
  .eq('status', 'published')
  .order('created_at', { ascending: false })
  .range(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE - 1)
```

Kalau butuh total count untuk UI pagination, gunakan `count: 'exact',
head: true` di query terpisah yang ringan, jangan hitung `data.length`
dari hasil fetch penuh:
```js
const { count } = await supabase
  .from('knowledge_entries')
  .select('*', { count: 'exact', head: true })
  .eq('status', 'published')
```

## 4. Pakai view yang sudah ada, jangan hitung ulang agregasi di kode

`v_cv_signal_review` sudah menghitung agregasi feedback CV per jenis
penyakit dan desa, termasuk filter minimal 2 petani berbeda. JANGAN
tulis ulang logika agregasi ini di Next.js/FastAPI dengan fetch semua
baris `cv_detections` lalu diolah manual di kode aplikasi. Itu jauh
lebih lambat dan bisa tidak sinkron dengan definisi resmi di database.

Benar:
```js
const { data } = await supabase.from('v_cv_signal_review').select('*')
```

Kalau ke depan butuh agregasi serupa untuk kasus lain (misal statistik
per bulan), buat VIEW baru di database lewat migration, bukan query
manual berulang di kode.

## 5. Index yang WAJIB ada (sebagian sudah di schema v4, cek sebelum query production)

Sudah ada di `docs/database/simantri_schema_v4.sql`:
- `idx_knowledge_status`, `idx_knowledge_category`
- `idx_suggestions_status`, `idx_suggestions_submitted_by`
- `idx_cv_detections_user` (tabel sesi upload)
- `idx_detection_results_detection`, `idx_detection_results_feedback` (partial index, hanya baris `tidak_sesuai`)
- `idx_market_price_tanggal`, `idx_weather_tanggal`

**Catatan struktur CV (berubah dari versi sebelumnya):** hasil deteksi
sekarang ada di tabel terpisah `cv_detection_results` (satu foto bisa
punya banyak baris hasil, karena model YOLOv8 mendeteksi multi-objek).
Query yang butuh gabungan sesi upload + hasilnya WAJIB join dua tabel
ini, jangan asumsikan satu baris = satu hasil:

```js
const { data } = await supabase
  .from('cv_detections')
  .select(`
    id, image_url, created_at,
    results:cv_detection_results(predicted_class, confidence, farmer_feedback)
  `)
  .eq('user_id', userId)
```

## 6. Kolom array (`keywords`, `related_diseases`, dst) butuh GIN index kalau dipakai untuk filter/search

Kolom seperti `keywords text[]`, `semantic_keywords text[]`,
`related_diseases text[]` di `knowledge_entries` TIDAK otomatis cepat
dicari pakai operator `@>` atau `&&` tanpa index yang tepat. Kalau
agent membangun fitur pencarian berdasarkan kolom-kolom ini, WAJIB
tambahkan GIN index lewat migration:
```sql
create index idx_knowledge_keywords on knowledge_entries using gin(keywords);
```
Jangan fetch semua baris lalu filter array di kode JavaScript, itu
tidak scalable begitu jumlah entri bertambah.

## 7. RLS itu otomatis, tapi tetap perlu index pada kolom yang dicek policy

Karena RLS di skema ini banyak melibatkan subquery ke `profiles`
(misal cek `role = 'admin'`), performanya bergantung pada index di
`profiles.id` (sudah primary key, otomatis ada index) dan `profiles.role`
kalau volume user sudah besar. Untuk skala kompetisi/demo ini bukan
prioritas, tapi kalau agent menambahkan policy RLS baru yang mengecek
kolom selain `id`, pertimbangkan index tambahan.

## 8. Query dari FastAPI (model ML) — pakai connection pooling, jangan buka koneksi baru tiap request

Endpoint prediksi harga dan deteksi CV akan sering dipanggil. JANGAN
buat koneksi database baru di setiap request handler. Gunakan
connection pool (SQLAlchemy engine dengan pool, atau Supabase Python
client yang di-reuse), diinisialisasi sekali saat aplikasi start, bukan
per-request.

Salah:
```python
@app.post("/predict-price")
def predict(payload: PredictRequest):
    conn = psycopg2.connect(...)  # koneksi baru tiap request, lambat
```

Benar:
```python
# Diinisialisasi sekali di module level atau lifespan startup
engine = create_engine(DATABASE_URL, pool_size=5, max_overflow=10)

@app.post("/predict-price")
def predict(payload: PredictRequest):
    with engine.connect() as conn:
        ...
```

## 9. Cache hasil yang tidak berubah tiap detik

Prediksi harga untuk tanggal yang sama tidak perlu dihitung ulang dari
nol setiap kali ada request identik dalam rentang waktu pendek. Kalau
agent membangun endpoint ini, pertimbangkan cek dulu ke tabel
`price_predictions` apakah sudah ada hasil untuk `prediction_date` yang
diminta sebelum memanggil model lagi, bukan selalu re-compute.

## 10. Sebelum menganggap query "selesai", jalankan `EXPLAIN ANALYZE` untuk query yang kompleks

Untuk query dengan JOIN lebih dari dua tabel atau agregasi (termasuk
turunan dari `v_cv_signal_review`), agent sebaiknya menjalankan
`EXPLAIN ANALYZE` lewat Supabase MCP (`execute_sql`, khusus untuk
read-only analisis, bukan untuk DDL) untuk memastikan tidak ada
sequential scan yang tidak perlu pada tabel besar, sebelum
mengintegrasikannya ke endpoint final.

---

## Ringkasan checklist sebelum agent menganggap sebuah query "production-ready"

1. Tidak ada `SELECT *`
2. Tidak ada loop fetch di dalam loop (N+1)
3. Ada pagination untuk semua list yang berpotensi tumbuh
4. Memakai view yang sudah ada, bukan menghitung ulang agregasi manual
5. Index yang relevan sudah dipastikan ada (cek atau tambahkan lewat migration)
6. Koneksi database di-pool, bukan dibuat baru tiap request
7. Untuk query kompleks, sudah dicek dengan `EXPLAIN ANALYZE`
