# Design System — SIMANTRI (direvisi dari referensi Apricot Lane Farms)

> **STATUS: Sumber kebenaran desain tunggal.** File `design-tokens.md`
> dan alur kerja via Google Stitch sudah tidak dipakai, semua isinya
> sudah digabung ke sini. Agent membangun UI langsung berdasarkan file
> ini, tanpa tahap desain terpisah di tool lain.
>
> Struktur, tipografi, spacing, dan komponen dipertahankan dari referensi
> asli. HANYA warna yang direvisi. Seluruh kode warna di bawah ini
> SENGAJA memakai ulang persis nilai hex yang sebelumnya ada di
> `design-tokens.md` (hasil ekstraksi dari
> `dunia_brambang_pameran_digital.html`), supaya seluruh halaman tetap
> satu ekosistem visual dengan Dunia Brambang, bukan sistem warna
> terpisah.

## 1. Visual Theme & Atmosphere

SIMANTRI mengusung nuansa hangat dan membumi yang terinspirasi langsung
dari warna alami bawang merah, kulit merah keunguan, daging umbi yang
pink lembut, dan batang hijau segar, dipadukan dengan latar netral
hangat yang menonjolkan kehangatan agraris Nganjuk. Berbeda dari
palet sage-terracotta yang dingin dan pastel pada referensi asli,
SIMANTRI memakai warna yang lebih jenuh dan hidup, mencerminkan
semangat dan keceriaan pertanian lokal, bukan estetika farm-to-table
yang kalem.

**Key Characteristics**
- Palet hangat berbasis warna alami bawang merah: maroon, pink shallot, hijau daun
- Latar krem hangat sebagai default, bukan putih dingin
- Kontras tegas antara elemen gelap (maroon, deep-dark) dan terang (cream)
- Aksen emas (golden-glow) untuk elemen penting/highlight, dipakai jarang
- Tetap mempertahankan tipografi editorial dan whitespace lapang dari referensi asli

## 2. Color Palette & Roles

### Primary

- **Shallot Pink** (`#C4487A`): Aksen brand utama; dipakai untuk CTA utama, link, dan elemen interaktif. Warna paling dominan dan paling sering dipakai di seluruh sistem. (Setara peran "Terracotta" pada referensi asli)
- **Deep Dark** (`#0E080A`): Warna teks utama dan elemen struktural gelap; kontras kuat untuk hierarki yang mudah dibaca. (Setara peran "Deep Charcoal")

### Accent Colors

- **Maroon** (`#4A1F2B`): Aksen hangat untuk heading, border, dan elemen kartu; merepresentasikan kulit bawang merah. (Setara "Terracotta" varian gelap)
- **Soft Green** (`#3A5A40`): Aksen sekunder untuk badge, highlight, dan elemen bertema pertumbuhan/alam. (Setara "Sage Green")
- **Golden Glow** (`#E6A15C`): Aksen langka untuk CTA khusus atau penekanan visual; dipakai sangat jarang, hanya untuk elemen paling penting. (Setara "Accent Purple", dipakai sparingly)
- **Earth Brown** (`#3D261A`): Aksen tersier untuk tombol sekunder dan elemen pendukung terkait tanah/budidaya. (Setara "Rust Brown")
- **Growth Green** (`#3A5A40`): Aksen afirmatif untuk aksi positif dan status UI yang baik. Memakai nilai yang sama dengan Soft Green untuk menjaga satu bahasa warna hijau di seluruh sistem, bukan dua hijau berbeda seperti referensi asli.

### Interactive

- **Link Shallot Pink** (`#C4487A`): Semua hyperlink dan teks interaktif konsisten memakai warna ini.
- **Button Shallot Pink** (`#C4487A`): Warna border dan teks untuk tombol secondary/outline; dipasangkan dengan latar transparan.

### Neutral Scale

- **Warm Charcoal** (`#4A3A32`): Neutral utama untuk teks tubuh dan elemen UI umum, nuansa hangat alih-alih abu netral dingin seperti referensi asli.
- **Pure White** (`#FFFFFF`): Latar dan permukaan kartu utama untuk halaman fungsional (dashboard, form); memberi kontras bersih dan mudah dibaca.
- **Deep Dark** (`#0E080A`): Dipakai sparingly untuk kontras maksimum di headline atau teks kritikal, dan sebagai latar utama khusus modul Dunia Brambang (tema museum gelap).
- **Cream** (`#FBF4EE`): Latar hangat utama untuk halaman fungsional di luar Dunia Brambang (dashboard, form, halaman umum); pengganti "Warm Off-White" pada referensi asli.
- **Light Tan Border** (`#E5DFD6`): Warna transisi untuk border dan pemisah permukaan halus, turunan dari Cream.
- **Muted Gray** (`#8A8580`): Neutral untuk teks sekunder, placeholder, dan status "belum diproses" (dipakai juga sebagai warna badge status `pending` di seluruh sistem).

### Semantic / Status

- **Warning** (`#E6A15C` — Golden Glow): Status peringatan dan pesan hati-hati; memakai warna yang sama dengan aksen highlight untuk menjaga jumlah warna tetap ringkas.
- **Error** (`#8C3A3A`): Error kritikal, aksi destruktif, dan status yang butuh perhatian segera. Warna ini turunan dari Maroon (bukan merah generik), supaya tetap dalam keluarga warna SIMANTRI meski menandakan bahaya.
- **Success** (`#3A5A40` — Soft Green): Status berhasil/terverifikasi, dipakai juga sebagai warna badge "Terverifikasi" di Dunia Brambang.

## 3. Typography Rules

*(Tidak berubah dari referensi asli — tetap dipertahankan)*

**Primary (Display & Headings):** Bourbon-Regular, Georgia, serif
**Secondary (Body & UI):** Adelle-Light, Roboto, sans-serif
**Tertiary (Form Inputs):** Adelle, -apple-system, sans-serif

Seluruh tabel hierarki ukuran, weight, line-height, dan letter-spacing
pada dokumen referensi asli TETAP BERLAKU tanpa perubahan. SIMANTRI
menggunakan font Fraunces (menggantikan Bourbon-Regular untuk heading)
dan Inter (menggantikan Adelle untuk body/UI) sesuai `design-tokens.md`,
namun aturan hierarki ukuran dan weight-nya mengikuti pola yang sama
seperti referensi ini.

## 4. Component Stylings

### Buttons

#### Primary Button
- **Background Color:** `#C4487A` (Shallot Pink)
- **Text Color:** `#FFFFFF` (Pure White)
- **Border:** `2px solid #C4487A`
- **Hover State:** Background `#A83A68`, border `#A83A68`
- **Active State:** Background `#8C2E56`, border `#8C2E56`
- **Disabled State:** Background `#CCCCCC`, border `#CCCCCC`, color `#808080`, cursor `not-allowed`, opacity `0.5`

#### Secondary Button
- **Background Color:** `rgba(0, 0, 0, 0)` (Transparent)
- **Text Color:** `#C4487A` (Shallot Pink)
- **Border:** `2px solid #C4487A`
- **Hover State:** Background `rgba(196, 72, 122, 0.08)`, text color `#A83A68`
- **Active State:** Background `rgba(196, 72, 122, 0.15)`, text color `#8C2E56`

#### Ghost Button
- **Background Color:** `rgba(0, 0, 0, 0)` (Transparent)
- **Text Color:** `#4A3A32` (Warm Charcoal)
- **Hover State:** Text color `#C4487A`, background `rgba(196, 72, 122, 0.05)`

*(Semua ukuran font, padding, border-radius mengikuti referensi asli — hanya warna yang berubah)*

### Cards & Containers

#### Standard Card (halaman fungsional)
- **Background Color:** `#FFFFFF` (Pure White)
- **Text Color:** `#4A3A32` (Warm Charcoal)

#### Standard Card (khusus modul Dunia Brambang)
- **Background Color:** `#0E080A` (Deep Dark)
- **Text Color:** `#FBF4EE` (Cream)
- Ini SATU-SATUNYA modul yang memakai latar gelap; halaman lain (dashboard, form, prediksi harga) memakai latar terang seperti Standard Card di atas.

#### Feature Card (Grid)
- **Background Color:** `#FFFFFF` (Pure White)
- **Text Color:** `#4A3A32` (Warm Charcoal)
- **Box Shadow:** `0px 2px 8px rgba(0, 0, 0, 0.1)` (tidak berubah dari referensi)

### Inputs & Forms

#### Text Input
- **Background Color:** `#FFFFFF` (Pure White)
- **Text Color:** `#0E080A` (Deep Dark)
- **Placeholder Color:** `#8A8580` (Muted Gray)
- **Border:** `1px solid #8A8580`
- **Focus State:** Border `1px solid #C4487A`, box-shadow `0px 0px 0px 3px rgba(196, 72, 122, 0.1)`
- **Error State:** Border `1px solid #8C3A3A`, box-shadow `0px 0px 0px 3px rgba(140, 58, 58, 0.1)`

#### Checkbox / Radio
- **Border:** `2px solid #8A8580`
- **Checked State:** Background `#C4487A`, border `2px solid #C4487A`

### Navigation

#### Header Navigation
- **Background Color:** `#FFFFFF` (halaman fungsional) atau `#0E080A` (khusus Dunia Brambang)
- **Text Color:** `#4A3A32` (Warm Charcoal) di halaman fungsional, `#FBF4EE` (Cream) di Dunia Brambang
- **Border Bottom:** `1px solid #E5DFD6`

#### Navigation Link
- **Color:** `#4A3A32` (Warm Charcoal)
- **Hover State:** Color `#C4487A`, background `rgba(196, 72, 122, 0.05)`
- **Active State:** Color `#C4487A`, border-bottom `2px solid #C4487A`

### Badges

#### Primary Badge
- **Background Color:** `#E6A15C` (Golden Glow)
- **Text Color:** `#0E080A` (Deep Dark)

#### Status Badge — Pending / Belum Diproses
- **Background Color:** `#8A8580` (Muted Gray)
- **Text Color:** `#FFFFFF`

#### Status Badge — Terverifikasi / Success
- **Background Color:** `#3A5A40` (Soft Green)
- **Text Color:** `#FFFFFF`

#### Status Badge — Warning
- **Background Color:** `#E6A15C` (Golden Glow)
- **Text Color:** `#0E080A` (Deep Dark)

#### Status Badge — Error / Ditolak
- **Background Color:** `#8C3A3A`
- **Text Color:** `#FFFFFF`

### Links

#### Standard Link
- **Color:** `#C4487A` (Shallot Pink)
- **Hover State:** `text-decoration: underline`, color `#A83A68`
- **Active State:** Color `#8C2E56`
- **Visited State:** Color `#9B6079` (muted pink)

## 5–8. Layout, Elevation, Responsive

*(TIDAK BERUBAH dari referensi asli — spacing scale, grid, border radius,
border width, shadow levels, opacity levels, z-index, breakpoints, dan
touch target semuanya tetap sama persis. Hanya nilai warna di section
2 dan 4 yang direvisi.)*

## 9. Agent Prompt Guide

### Quick Color Reference

- **Primary CTA:** Shallot Pink (`#C4487A`) — Tombol, elemen interaktif, teks link
- **Secondary Accent:** Golden Glow (`#E6A15C`) — Highlight langka, badge penting
- **Text / Headings:** Deep Dark (`#0E080A`) — Headline; Warm Charcoal (`#4A3A32`) — Teks tubuh
- **Background (halaman fungsional):** Pure White (`#FFFFFF`) atau Cream (`#FBF4EE`)
- **Background (khusus Dunia Brambang):** Deep Dark (`#0E080A`)
- **Success/Terverifikasi:** Soft Green (`#3A5A40`)
- **Warning:** Golden Glow (`#E6A15C`)
- **Error/Ditolak:** `#8C3A3A`
- **Borders & Dividers:** Light Tan Border (`#E5DFD6`)

### Iteration Guide

1. **Selalu pakai `#C4487A` (Shallot Pink) untuk tombol primary, link, dan teks interaktif**; pasangkan dengan latar `#FFFFFF` pada tombol primary.
2. **Dunia Brambang adalah SATU-SATUNYA modul dengan latar gelap** (`#0E080A`). Semua halaman lain (dashboard, form, prediksi harga, deteksi CV) memakai latar terang (`#FFFFFF` atau `#FBF4EE`). Jangan terapkan tema gelap ke seluruh aplikasi.
3. **Jangan perkenalkan warna baru di luar palet ini.** Kalau butuh variasi tone (hover, active, disabled), turunkan dari warna dasar yang sudah ada, jangan menambah hex baru sembarangan.
4. **Badge status pakai kode warna tetap**: abu-abu Muted Gray untuk pending, hijau Soft Green untuk terverifikasi, merah `#8C3A3A` untuk ditolak/error, golden-glow untuk warning. Konsisten dipakai di semua modul (Dunia Brambang, dashboard petani, dashboard penyuluh).
5. Sisanya (spacing, tipografi, shadow, breakpoint) ikuti persis aturan pada dokumen referensi asli, tidak ada perubahan di luar warna.

---

## Catatan untuk Agent (Antigravity)

File ini adalah SATU-SATUNYA sumber kebenaran desain untuk seluruh
SIMANTRI. `design-tokens.md` dan alur generate lewat Google Stitch
sudah tidak dipakai lagi, seluruh isinya sudah tercakup di sini.

Saat membangun komponen atau halaman baru:

1. **Ambil warna, font, dan aturan komponen (button, card, input,
   badge, nav) langsung dari section 2 dan 4 di atas.** Jangan
   menciptakan hex color atau ukuran baru di luar yang sudah
   ditentukan.
2. **Untuk modul Dunia Brambang secara spesifik**, jangan bangun dari
   nol. Buka `docs/design/dunia_brambang_pameran_digital.html` sebagai
   referensi kode nyata (struktur HTML, class Tailwind, animasi GSAP,
   efek `.museum-noise`, `.glass-panel`, `.ambient-spotlight`), lalu
   adaptasi jadi komponen React/Next.js. Ini kode yang sudah teruji
   secara visual, tidak perlu didesain ulang, cukup di-porting.
3. **Untuk halaman fungsional lain** (dashboard, form, prediksi
   harga, deteksi CV, kelola pengguna), bangun langsung sebagai
   komponen baru mengikuti aturan di section 2 dan 4, TIDAK perlu
   melalui tahap desain terpisah di tool lain. Latar terang
   (`#FFFFFF`/`#FBF4EE`), bukan gelap, kecuali disebutkan lain.
4. **Kalau ragu soal styling suatu elemen yang belum tercakup di
   dokumen ini**, ikuti pola yang paling dekat kemiripannya dari
   section 4, jangan menebak-nebak gaya baru yang tidak konsisten.

