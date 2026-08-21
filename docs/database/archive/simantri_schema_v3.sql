-- =========================================================
-- SIMANTRI — Database Schema v3 (PostgreSQL / Supabase)
-- =========================================================
-- PERUBAHAN dari v2:
-- 1. HANYA admin yang bisa insert/update knowledge_entries.
--    Penyuluh TIDAK LAGI menulis langsung (beda dari v2).
-- 2. Tabel `reports` diperluas jadi `content_suggestions`, menampung
--    dua jenis masukan: laporan info keliru DAN usulan/koreksi
--    pengetahuan, dari petani maupun penyuluh, dengan status yang
--    bisa dipantau pengirimnya sendiri.
-- =========================================================


-- =========================================================
-- 1. PROFILES (tidak berubah dari v2)
-- =========================================================
create type user_role as enum ('petani', 'penyuluh', 'admin');

create table profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    full_name text not null,
    role user_role not null default 'petani',
    village text,
    is_verified_contributor boolean not null default false,
    created_at timestamptz not null default now()
);

-- =========================================================
-- 2. KNOWLEDGE ENTRIES (Dunia Brambang)
-- =========================================================
-- CATATAN v3: HANYA admin yang bisa insert/update. Penyuluh dan
-- petani berkontribusi lewat content_suggestions, bukan tabel ini
-- secara langsung.
create type entry_status as enum ('draft', 'published');

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
    status entry_status not null default 'draft',

    author_id uuid not null references profiles(id),  -- SELALU admin
    based_on_suggestion_id uuid,  -- opsional, isi kalau entri ini hasil tindak lanjut usulan (FK ditambahkan di bawah setelah tabel suggestion dibuat)

    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index idx_knowledge_status on knowledge_entries(status);
create index idx_knowledge_category on knowledge_entries(category);

-- =========================================================
-- 3. PRICE PREDICTIONS (tidak berubah dari v2)
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
-- 4. CV DETECTIONS + FEEDBACK PETANI (tidak berubah dari v2)
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

    farmer_feedback feedback_value,
    farmer_correction_note text,
    feedback_by uuid references profiles(id),
    feedback_at timestamptz,

    reviewer_id uuid references profiles(id),
    reviewer_note text,

    created_at timestamptz not null default now()
);

create index idx_cv_feedback on cv_detections(farmer_feedback) where farmer_feedback = 'tidak_sesuai';

-- =========================================================
-- 5. CHAT LOGS + FEEDBACK PETANI (tidak berubah dari v2)
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
-- 6. CONTENT SUGGESTIONS (BARU, menggantikan `reports` v2)
-- =========================================================
-- Menampung DUA jenis masukan dari petani/penyuluh:
--   'laporan_keliru'    -> menunjuk ke entri KB yang sudah ada, dianggap salah
--   'usulan_pembaruan'  -> masukan baru/koreksi, boleh tanpa entri KB rujukan
create type suggestion_type as enum ('laporan_keliru', 'usulan_pembaruan');
create type suggestion_status as enum (
    'diterima_menunggu_tinjauan',
    'digunakan_dalam_pembaruan',
    'tidak_digunakan'
);

create table content_suggestions (
    id uuid primary key default gen_random_uuid(),
    type suggestion_type not null,

    -- opsional: isi kalau usulan ini terkait entri KB yang sudah ada
    related_entry_id uuid references knowledge_entries(id),

    submitted_by uuid not null references profiles(id),
    submitted_role user_role not null,  -- snapshot role saat submit (petani/penyuluh)
    content_note text not null,          -- isi laporan/usulan dari pengirim

    status suggestion_status not null default 'diterima_menunggu_tinjauan',
    reviewed_by uuid references profiles(id),  -- SELALU admin
    review_note text,
    reviewed_at timestamptz,

    created_at timestamptz not null default now()
);

create index idx_suggestions_status on content_suggestions(status);
create index idx_suggestions_submitted_by on content_suggestions(submitted_by);

-- Tambahkan FK dari knowledge_entries ke content_suggestions setelah
-- tabel ini ada (menjaga jejak entri mana yang lahir dari usulan mana)
alter table knowledge_entries
    add constraint fk_based_on_suggestion
    foreign key (based_on_suggestion_id) references content_suggestions(id);


-- =========================================================
-- 7. VIEW — "Sinyal Perlu Ditinjau" untuk dashboard Penyuluh (tidak berubah dari v2)
-- =========================================================
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
having count(distinct cd.user_id) >= 2
order by jumlah_petani_berbeda desc, jumlah_feedback_tidak_sesuai desc;


-- =========================================================
-- ROW LEVEL SECURITY (RLS)
-- =========================================================
alter table profiles enable row level security;
alter table knowledge_entries enable row level security;
alter table price_predictions enable row level security;
alter table cv_detections enable row level security;
alter table chat_logs enable row level security;
alter table content_suggestions enable row level security;

create policy "profiles_select_all" on profiles
    for select using (auth.role() = 'authenticated');

create policy "profiles_update_own" on profiles
    for update using (auth.uid() = id);

-- Publik (termasuk belum login) boleh baca entri published
create policy "knowledge_select_published_public" on knowledge_entries
    for select using (status = 'published');

-- HANYA admin yang boleh insert/update entri KB
create policy "knowledge_insert_admin_only" on knowledge_entries
    for insert with check (
        exists (select 1 from profiles where id = auth.uid() and role = 'admin')
    );

create policy "knowledge_update_admin_only" on knowledge_entries
    for update using (
        exists (select 1 from profiles where id = auth.uid() and role = 'admin')
    );

create policy "predictions_select_all" on price_predictions
    for select using (auth.role() = 'authenticated');

create policy "cv_select_all" on cv_detections
    for select using (auth.role() = 'authenticated');

create policy "cv_insert_own" on cv_detections
    for insert with check (auth.uid() = user_id);

create policy "cv_feedback_update_own" on cv_detections
    for update using (auth.uid() = user_id);

create policy "chat_select_own" on chat_logs
    for select using (auth.uid() = user_id);

create policy "chat_insert_own" on chat_logs
    for insert with check (auth.uid() = user_id);

create policy "chat_feedback_update_own" on chat_logs
    for update using (auth.uid() = user_id);

-- Petani & Penyuluh bisa submit usulan/laporan
create policy "suggestions_insert_own" on content_suggestions
    for insert with check (auth.uid() = submitted_by);

-- Pengirim bisa lihat status usulannya sendiri kapan saja
create policy "suggestions_select_own" on content_suggestions
    for select using (auth.uid() = submitted_by);

-- HANYA admin yang bisa lihat semua usulan & mengubah statusnya
create policy "suggestions_select_admin" on content_suggestions
    for select using (
        exists (select 1 from profiles where id = auth.uid() and role = 'admin')
    );

create policy "suggestions_update_admin_only" on content_suggestions
    for update using (
        exists (select 1 from profiles where id = auth.uid() and role = 'admin')
    );
