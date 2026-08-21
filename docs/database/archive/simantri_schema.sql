-- =========================================================
-- SIMANTRI — Database Schema (PostgreSQL / Supabase)
-- =========================================================
-- Struktur ini dirancang supaya:
-- 1. Role-based access (Petani / Penyuluh / Admin) langsung
--    ketahan lewat kolom `role` + Row Level Security (RLS).
-- 2. Struktur `knowledge_entries` mengikuti persis frontmatter
--    di template varietas-bauji.md, supaya file markdown-mu
--    bisa langsung di-migrasi ke tabel tanpa restrukturisasi.
-- 3. Traceability & verifikasi built-in di level skema,
--    bukan ditambal belakangan di UI.
-- =========================================================


-- =========================================================
-- 1. PROFILES (extends auth.users bawaan Supabase)
-- =========================================================
create type user_role as enum ('petani', 'penyuluh', 'admin');

create table profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    full_name text not null,
    role user_role not null default 'petani',
    village text,                    -- desa/kecamatan asal, opsional
    is_verified_contributor boolean not null default false,
    -- true kalau penyuluh sudah diverifikasi admin (bukan cuma daftar sendiri)
    created_at timestamptz not null default now()
);

-- =========================================================
-- 2. KNOWLEDGE ENTRIES (Dunia Brambang / Knowledge Base)
-- =========================================================
create type entry_status as enum ('pending', 'verified', 'rejected');

create table knowledge_entries (
    id uuid primary key default gen_random_uuid(),
    doc_id text unique not null,          -- contoh: VAR-BAUJI-001
    title text not null,
    category text not null,               -- contoh: Varietas Bawang Merah
    subcategory text,
    topic text,
    summary text not null,
    content text not null,                -- isi lengkap (markdown body)

    -- metadata pencarian & RAG (untuk chatbot Gemini nanti)
    keywords text[] default '{}',
    semantic_keywords text[] default '{}',
    synonyms text[] default '{}',

    -- metadata domain pertanian
    entity_type text,                     -- Varietas / Hama / Penyakit / Fase Musim
    location text,
    recommended_month text[] default '{}',
    recommended_season text,

    -- relasi ke entri lain (disimpan sebagai array doc_id, cukup untuk skala hackathon)
    related_varieties text[] default '{}',
    related_diseases text[] default '{}',
    related_pests text[] default '{}',
    related_weather text[] default '{}',

    -- TRUST & TRACEABILITY — inti dari elemen "NextGen Secure"
    evidence_level text,                  -- contoh: "Tinggi - dikonfirmasi SK Kementan..."
    review_status text,                   -- contoh: "Direvisi ke template v2"
    status entry_status not null default 'pending',

    contributor_id uuid references profiles(id),
    verifier_id uuid references profiles(id),
    verified_at timestamptz,

    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index idx_knowledge_status on knowledge_entries(status);
create index idx_knowledge_category on knowledge_entries(category);

-- =========================================================
-- 3. PRICE PREDICTIONS (log hasil model XGBoost)
-- =========================================================
create table price_predictions (
    id uuid primary key default gen_random_uuid(),
    prediction_date date not null,        -- tanggal yang diprediksi
    predicted_price numeric(12,2) not null,
    actual_price numeric(12,2),           -- diisi belakangan untuk tracking akurasi real
    model_version text not null default 'xgboost-v1',
    input_features jsonb not null,        -- snapshot fitur (Temperature, Lag1, MA7, dst) — untuk audit
    mape_at_training numeric(5,2) default 3.0,  -- transparansi keandalan ke user
    created_at timestamptz not null default now()
);

-- =========================================================
-- 4. CV DETECTIONS (deteksi penyakit via Computer Vision)
-- =========================================================
create type detection_status as enum ('unreviewed', 'confirmed', 'corrected');

create table cv_detections (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references profiles(id),
    image_url text not null,              -- path di Supabase Storage
    predicted_class text not null,        -- Fusarium / Moler / Sehat / dll
    confidence numeric(5,2) not null,     -- 0-100, WAJIB ditampilkan di UI (transparansi)
    model_version text not null default 'cv-v1',

    -- alur verifikasi oleh penyuluh, sama seperti knowledge base
    status detection_status not null default 'unreviewed',
    reviewer_id uuid references profiles(id),
    reviewer_note text,

    created_at timestamptz not null default now()
);

-- =========================================================
-- 5. REPORTS (mekanisme "laporkan info keliru")
-- =========================================================
create type report_status as enum ('open', 'resolved', 'dismissed');

create table reports (
    id uuid primary key default gen_random_uuid(),
    knowledge_entry_id uuid references knowledge_entries(id),
    cv_detection_id uuid references cv_detections(id),
    -- salah satu di atas wajib diisi (dicek lewat check constraint di bawah)
    reporter_id uuid not null references profiles(id),
    reason text not null,
    status report_status not null default 'open',
    resolved_by uuid references profiles(id),
    resolved_at timestamptz,
    created_at timestamptz not null default now(),

    constraint report_target_check check (
        (knowledge_entry_id is not null and cv_detection_id is null) or
        (knowledge_entry_id is null and cv_detection_id is not null)
    )
);

-- =========================================================
-- 6. CHAT LOGS (opsional — histori chatbot Gemini)
-- =========================================================
create table chat_logs (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references profiles(id),
    message text not null,
    response text not null,
    created_at timestamptz not null default now()
);


-- =========================================================
-- ROW LEVEL SECURITY (RLS) — role-based access di level DB
-- =========================================================
alter table profiles enable row level security;
alter table knowledge_entries enable row level security;
alter table price_predictions enable row level security;
alter table cv_detections enable row level security;
alter table reports enable row level security;

-- Semua orang login bisa lihat profil dasar (untuk menampilkan nama kontributor)
create policy "profiles_select_all" on profiles
    for select using (auth.role() = 'authenticated');

-- User hanya bisa update profilnya sendiri
create policy "profiles_update_own" on profiles
    for update using (auth.uid() = id);

-- Semua orang bisa lihat entri yang sudah 'verified'
create policy "knowledge_select_verified" on knowledge_entries
    for select using (status = 'verified');

-- Kontributor bisa lihat entri pending miliknya sendiri
create policy "knowledge_select_own_pending" on knowledge_entries
    for select using (auth.uid() = contributor_id);

-- Semua user login bisa submit entri baru (otomatis berstatus 'pending')
create policy "knowledge_insert_own" on knowledge_entries
    for insert with check (auth.uid() = contributor_id and status = 'pending');

-- HANYA penyuluh terverifikasi yang boleh mengubah status jadi verified/rejected
create policy "knowledge_update_verify" on knowledge_entries
    for update using (
        exists (
            select 1 from profiles
            where id = auth.uid()
            and role = 'penyuluh'
            and is_verified_contributor = true
        )
    );

-- Prediksi harga & hasil CV bisa dilihat semua user login
create policy "predictions_select_all" on price_predictions
    for select using (auth.role() = 'authenticated');

create policy "cv_select_all" on cv_detections
    for select using (auth.role() = 'authenticated');

-- User hanya bisa insert hasil CV miliknya sendiri
create policy "cv_insert_own" on cv_detections
    for insert with check (auth.uid() = user_id);

-- Semua user login bisa membuat laporan
create policy "reports_insert_own" on reports
    for insert with check (auth.uid() = reporter_id);

-- Hanya admin & penyuluh yang bisa lihat & resolve laporan
create policy "reports_select_staff" on reports
    for select using (
        exists (
            select 1 from profiles
            where id = auth.uid()
            and role in ('admin', 'penyuluh')
        )
    );
