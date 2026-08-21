-- =========================================================
-- SIMANTRI — Database Schema v4 (PostgreSQL / Supabase)
-- =========================================================
-- PERUBAHAN dari v3:
-- 1. `cv_detections` dipecah jadi dua tabel: `cv_detections` (sesi
--    upload) dan `cv_detection_results` (tiap objek yang terdeteksi
--    dalam satu foto, karena model YOLOv8 bisa mendeteksi BANYAK
--    objek/kelas sekaligus per gambar, terkonfirmasi dari training
--    batch images yang menunjukkan multi-label per foto).
-- 2. Tabel BARU `market_price` — input harga harian manual oleh admin,
--    ini bahan baku mentah untuk fitur Lag/MA, terpisah dari
--    `price_predictions` yang isinya hasil prediksi.
-- 3. Tabel BARU `weather_data` — cache data cuaca dari Open-Meteo per
--    tanggal, supaya tidak fetch API berulang untuk tanggal yang sama.
-- =========================================================

-- Bagian PROFILES, KNOWLEDGE_ENTRIES, CONTENT_SUGGESTIONS, CHAT_LOGS,
-- dan semua RLS terkait TIDAK BERUBAH dari v3. Lihat simantri_schema_v3.sql
-- untuk definisi lengkapnya. File ini hanya berisi tabel yang berubah/baru.

-- =========================================================
-- A. MARKET_PRICE (BARU) — input harga harian mentah
-- =========================================================
create type price_source as enum ('manual', 'scraping');

create table market_price (
    id uuid primary key default gen_random_uuid(),
    tanggal date unique not null,
    harga numeric(12,2) not null,
    source price_source not null default 'manual',
    input_by uuid references profiles(id),  -- admin yang input
    created_at timestamptz not null default now()
);

create index idx_market_price_tanggal on market_price(tanggal desc);

-- =========================================================
-- B. WEATHER_DATA (BARU) — cache data cuaca per tanggal
-- =========================================================
create table weather_data (
    id uuid primary key default gen_random_uuid(),
    tanggal date unique not null,
    temperature numeric(6,2),
    rainfall numeric(6,2),
    wind_speed numeric(6,2),
    fetched_at timestamptz not null default now()
);

create index idx_weather_tanggal on weather_data(tanggal desc);

-- =========================================================
-- C. PRICE_PREDICTIONS — tidak berubah dari v3, tetap dipakai
-- =========================================================
-- (definisi lengkap ada di simantri_schema_v3.sql, tidak diulang di sini)
-- Ini yang berperan sebagai "market_forecast" pada PRD-Market.md,
-- TIDAK perlu tabel baru terpisah untuk itu.

-- =========================================================
-- D. CV_DETECTIONS (DIROMBAK) — sesi upload, bukan hasil tunggal
-- =========================================================
create type detection_status as enum ('unreviewed', 'confirmed', 'corrected');
create type feedback_value as enum ('sesuai', 'tidak_sesuai');

-- Drop struktur lama v3 dulu kalau migration dijalankan di database
-- yang sudah pernah apply v3. Kalau ini fresh install, baris drop
-- ini aman diabaikan/dilewati.
drop table if exists cv_detections cascade;

create table cv_detections (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references profiles(id),
    image_url text not null,
    model_version text not null default 'yolov8-v1',
    created_at timestamptz not null default now()
);

create index idx_cv_detections_user on cv_detections(user_id);

-- =========================================================
-- E. CV_DETECTION_RESULTS (BARU) — satu baris per objek terdeteksi
-- =========================================================
create table cv_detection_results (
    id uuid primary key default gen_random_uuid(),
    detection_id uuid not null references cv_detections(id) on delete cascade,

    predicted_class text not null,     -- isi sesuai mapping data.yaml (mis. "Fusarium", "Sehat", dst)
    confidence numeric(5,2) not null,
    bbox_x numeric(8,4),               -- koordinat bounding box (opsional, untuk overlay di UI)
    bbox_y numeric(8,4),
    bbox_width numeric(8,4),
    bbox_height numeric(8,4),

    status detection_status not null default 'unreviewed',

    -- feedback petani, per KELAS yang terdeteksi (bukan per bounding box literal)
    farmer_feedback feedback_value,
    farmer_correction_note text,
    feedback_by uuid references profiles(id),
    feedback_at timestamptz,

    reviewer_id uuid references profiles(id),
    reviewer_note text,

    created_at timestamptz not null default now()
);

create index idx_detection_results_detection on cv_detection_results(detection_id);
create index idx_detection_results_feedback on cv_detection_results(farmer_feedback) where farmer_feedback = 'tidak_sesuai';

-- =========================================================
-- F. VIEW — "Sinyal Perlu Ditinjau" (DIPERBARUI untuk struktur baru)
-- =========================================================
drop view if exists v_cv_signal_review;

create view v_cv_signal_review as
select
    cdr.predicted_class,
    p.village,
    count(*) as jumlah_feedback_tidak_sesuai,
    count(distinct cd.user_id) as jumlah_petani_berbeda,
    array_agg(distinct cdr.farmer_correction_note) filter (
        where cdr.farmer_correction_note is not null
    ) as catatan_petani,
    max(cdr.created_at) as feedback_terakhir
from cv_detection_results cdr
join cv_detections cd on cd.id = cdr.detection_id
join profiles p on p.id = cd.user_id
where cdr.farmer_feedback = 'tidak_sesuai'
group by cdr.predicted_class, p.village
having count(distinct cd.user_id) >= 2
order by jumlah_petani_berbeda desc, jumlah_feedback_tidak_sesuai desc;

-- =========================================================
-- RLS untuk tabel baru/berubah
-- =========================================================
alter table market_price enable row level security;
alter table weather_data enable row level security;
alter table cv_detections enable row level security;
alter table cv_detection_results enable row level security;

-- Semua user login boleh baca harga & cuaca (untuk grafik tren)
create policy "market_price_select_all" on market_price
    for select using (auth.role() = 'authenticated');

-- HANYA admin yang boleh input/update harga harian
create policy "market_price_insert_admin_only" on market_price
    for insert with check (
        exists (select 1 from profiles where id = auth.uid() and role = 'admin')
    );

create policy "market_price_update_admin_only" on market_price
    for update using (
        exists (select 1 from profiles where id = auth.uid() and role = 'admin')
    );

create policy "weather_select_all" on weather_data
    for select using (auth.role() = 'authenticated');

-- weather_data diisi otomatis oleh backend (service role), bukan user biasa
-- jadi tidak perlu policy insert untuk role user — service role otomatis
-- bypass RLS di Supabase.

create policy "cv_detections_select_all" on cv_detections
    for select using (auth.role() = 'authenticated');

create policy "cv_detections_insert_own" on cv_detections
    for insert with check (auth.uid() = user_id);

create policy "cv_results_select_all" on cv_detection_results
    for select using (auth.role() = 'authenticated');

-- Insert hasil deteksi dilakukan oleh backend (setelah panggil model),
-- tapi tetap dicek kepemilikan lewat relasi ke cv_detections
create policy "cv_results_insert_via_own_detection" on cv_detection_results
    for insert with check (
        exists (
            select 1 from cv_detections
            where id = detection_id and user_id = auth.uid()
        )
    );

-- Petani boleh update feedback HANYA pada hasil deteksi miliknya sendiri
create policy "cv_results_feedback_update_own" on cv_detection_results
    for update using (
        exists (
            select 1 from cv_detections
            where id = detection_id and user_id = auth.uid()
        )
    );
