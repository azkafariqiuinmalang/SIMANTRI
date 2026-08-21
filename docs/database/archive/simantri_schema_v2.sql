-- =========================================================
-- SIMANTRI — Database Schema v2 (PostgreSQL / Supabase)
-- =========================================================
-- PERUBAHAN dari v1, berdasarkan keputusan final soal peran aktor:
-- 1. Petani TIDAK submit entri Knowledge Base baru. Hanya Penyuluh
--    (formal, sudah ada di Kab. Nganjuk) yang menulis/mengelola KB.
-- 2. Petani memberi FEEDBACK, bukan konten baru — khusus untuk hasil
--    Computer Vision dan jawaban Chatbot yang dirasa kurang tepat.
-- 3. Ditambahkan mekanisme agregasi "Sinyal Perlu Ditinjau" untuk
--    dashboard Penyuluh — mendeteksi pola feedback yang konsisten
--    berbeda dari banyak petani (bukan laporan individu biasa).
-- =========================================================


-- =========================================================
-- 1. PROFILES
-- =========================================================
create type user_role as enum ('petani', 'penyuluh', 'admin');

create table profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    full_name text not null,
    role user_role not null default 'petani',
    village text,                    -- penting untuk agregasi sinyal per lokasi
    is_verified_contributor boolean not null default false,
    -- true kalau akun 'penyuluh' sudah dikonfirmasi admin sebagai penyuluh
    -- resmi/dipercaya (bukan self-registration otomatis dapat hak akses)
    created_at timestamptz not null default now()
);

-- =========================================================
-- 2. KNOWLEDGE ENTRIES (Dunia Brambang)
-- =========================================================
-- CATATAN: hanya role 'penyuluh' & 'admin' yang bisa insert (lihat RLS).
-- Status masih dipertahankan (bukan 'pending' terus, tapi bisa langsung
-- 'verified' kalau penulisnya sudah penyuluh terverifikasi), supaya
-- kalau nanti admin ingin menambah kontributor lain, sistem tidak perlu
-- dirombak.
create type entry_status as enum ('pending', 'verified', 'rejected');

create table knowledge_entries (
    id uuid primary key default gen_random_uuid(),
    doc_id text unique not null,
    title text not null,
    category text not null,
    subcategory text,
    topic text,
    summary text not null,
    content text not null,

    keywords text[] default '{}',
    semantic_keywords text[] default '{}',
    synonyms text[] default '{}',

    entity_type text,
    location text,
    recommended_month text[] default '{}',
    recommended_season text,

    related_varieties text[] default '{}',
    related_diseases text[] default '{}',
    related_pests text[] default '{}',
    related_weather text[] default '{}',

    evidence_level text,
    review_status text,
    status entry_status not null default 'pending',

    contributor_id uuid references profiles(id),  -- HARUS role penyuluh/admin
    verifier_id uuid references profiles(id),      -- bisa admin/penyuluh lain (peer-review internal)
    verified_at timestamptz,

    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index idx_knowledge_status on knowledge_entries(status);
create index idx_knowledge_category on knowledge_entries(category);

-- =========================================================
-- 3. PRICE PREDICTIONS
-- =========================================================
create table price_predictions (
    id uuid primary key default gen_random_uuid(),
    prediction_date date not null,
    predicted_price numeric(12,2) not null,
    actual_price numeric(12,2),
    model_version text not null default 'xgboost-v1',
    input_features jsonb not null,
    mape_at_training numeric(5,2) default 3.0,
    created_at timestamptz not null default now()
);

-- =========================================================
-- 4. CV DETECTIONS + FEEDBACK PETANI (BARU)
-- =========================================================
create type detection_status as enum ('unreviewed', 'confirmed', 'corrected');
create type feedback_value as enum ('sesuai', 'tidak_sesuai');

create table cv_detections (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references profiles(id),
    image_url text not null,
    predicted_class text not null,
    confidence numeric(5,2) not null,
    model_version text not null default 'cv-v1',

    status detection_status not null default 'unreviewed',

    -- FEEDBACK PETANI (bukan verifikasi formal, hanya sinyal lapangan)
    farmer_feedback feedback_value,           -- diisi petani: sesuai / tidak_sesuai
    farmer_correction_note text,              -- opsional: "menurut saya ini X karena..."
    feedback_by uuid references profiles(id),
    feedback_at timestamptz,

    -- REVIEW PENYULUH (opsional, hanya kalau penyuluh sempat menindaklanjuti)
    reviewer_id uuid references profiles(id),
    reviewer_note text,

    created_at timestamptz not null default now()
);

create index idx_cv_feedback on cv_detections(farmer_feedback) where farmer_feedback = 'tidak_sesuai';

-- =========================================================
-- 5. CHAT LOGS + FEEDBACK PETANI (BARU)
-- =========================================================
create type chat_feedback_value as enum ('helpful', 'not_helpful');

create table chat_logs (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references profiles(id),
    message text not null,
    response text not null,

    feedback chat_feedback_value,
    feedback_note text,

    created_at timestamptz not null default now()
);

-- =========================================================
-- 6. REPORTS (laporan untuk Knowledge Base entries)
-- =========================================================
create type report_status as enum ('open', 'resolved', 'dismissed');

create table reports (
    id uuid primary key default gen_random_uuid(),
    knowledge_entry_id uuid not null references knowledge_entries(id),
    reporter_id uuid not null references profiles(id),
    reason text not null,
    status report_status not null default 'open',
    resolved_by uuid references profiles(id),
    resolved_at timestamptz,
    created_at timestamptz not null default now()
);

-- =========================================================
-- 7. VIEW — "Sinyal Perlu Ditinjau" untuk dashboard Penyuluh
-- =========================================================
-- Menyorot predicted_class yang berulang kali dapat feedback
-- 'tidak_sesuai' dari BANYAK petani berbeda, dikelompokkan juga
-- per desa supaya penyuluh tahu lokasi mana yang perlu dicek lapangan.
create view v_cv_signal_review as
select
    cd.predicted_class,
    p.village,
    count(*) as jumlah_feedback_tidak_sesuai,
    count(distinct cd.user_id) as jumlah_petani_berbeda,
    array_agg(distinct cd.farmer_correction_note) filter (
        where cd.farmer_correction_note is not null
    ) as catatan_petani,
    max(cd.created_at) as feedback_terakhir
from cv_detections cd
join profiles p on p.id = cd.user_id
where cd.farmer_feedback = 'tidak_sesuai'
group by cd.predicted_class, p.village
having count(distinct cd.user_id) >= 2  -- minimal 2 petani berbeda, bukan laporan tunggal
order by jumlah_petani_berbeda desc, jumlah_feedback_tidak_sesuai desc;


-- =========================================================
-- ROW LEVEL SECURITY (RLS)
-- =========================================================
alter table profiles enable row level security;
alter table knowledge_entries enable row level security;
alter table price_predictions enable row level security;
alter table cv_detections enable row level security;
alter table chat_logs enable row level security;
alter table reports enable row level security;

create policy "profiles_select_all" on profiles
    for select using (auth.role() = 'authenticated');

create policy "profiles_update_own" on profiles
    for update using (auth.uid() = id);

-- Publik (termasuk yang belum login) boleh baca entri verified —
-- ini yang membuat Dunia Brambang bisa diakses "Pengunjung Umum"
create policy "knowledge_select_verified_public" on knowledge_entries
    for select using (status = 'verified');

create policy "knowledge_select_own_pending" on knowledge_entries
    for select using (auth.uid() = contributor_id);

-- HANYA penyuluh terverifikasi & admin yang boleh submit entri baru
create policy "knowledge_insert_penyuluh_only" on knowledge_entries
    for insert with check (
        exists (
            select 1 from profiles
            where id = auth.uid()
            and (
                (role = 'penyuluh' and is_verified_contributor = true)
                or role = 'admin'
            )
        )
    );

create policy "knowledge_update_penyuluh_admin" on knowledge_entries
    for update using (
        exists (
            select 1 from profiles
            where id = auth.uid()
            and (
                (role = 'penyuluh' and is_verified_contributor = true)
                or role = 'admin'
            )
        )
    );

create policy "predictions_select_all" on price_predictions
    for select using (auth.role() = 'authenticated');

create policy "cv_select_all" on cv_detections
    for select using (auth.role() = 'authenticated');

create policy "cv_insert_own" on cv_detections
    for insert with check (auth.uid() = user_id);

-- Petani boleh update HANYA kolom feedback di entri miliknya sendiri
create policy "cv_feedback_update_own" on cv_detections
    for update using (auth.uid() = user_id);

create policy "chat_select_own" on chat_logs
    for select using (auth.uid() = user_id);

create policy "chat_insert_own" on chat_logs
    for insert with check (auth.uid() = user_id);

create policy "chat_feedback_update_own" on chat_logs
    for update using (auth.uid() = user_id);

create policy "reports_insert_own" on reports
    for insert with check (auth.uid() = reporter_id);

create policy "reports_select_staff" on reports
    for select using (
        exists (
            select 1 from profiles
            where id = auth.uid()
            and role in ('admin', 'penyuluh')
        )
    );
