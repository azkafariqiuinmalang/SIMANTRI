---
doc_id: "simantri-permintaan-pasar-002"
title: "Permintaan Pasar Bawang Merah Kabupaten Nganjuk: Analisis Demand, Pola Konsumsi, dan Sistem Pendukung Keputusan"
category: "Market Intelligence"
subcategory: "Permintaan Pasar"
topic: "Permintaan Pasar (Market Demand)"
summary: >
  Dokumen ini menjelaskan struktur, pola, dan pendorong permintaan (demand) bawang merah
  (bawang brambang) yang bersumber dari Kabupaten Nganjuk, Jawa Timur, sebagai sentra
  produksi bawang merah terbesar di Jawa Timur sekaligus barometer pasokan nasional.
  Dokumen mencakup analisis permintaan rumah tangga, restoran, industri, dan hari besar
  keagamaan nasional (HBKN), data konsumsi nasional dari BPS/Bapanas, kalender permintaan
  musiman, keterkaitan dengan fase tanam lokal (Fase Raya dan Labuhan), serta struktur
  data untuk model machine learning dan sistem RAG.
keywords:
  - permintaan bawang merah
  - demand bawang merah
  - konsumsi bawang merah
  - permintaan pasar Nganjuk
  - permintaan Ramadan bawang merah
  - permintaan Idul Fitri bawang merah
  - konsumsi rumah tangga bawang merah
semantic_keywords:
  - dinamika permintaan komoditas hortikultura
  - elastisitas permintaan bawang merah
  - siklus penawaran permintaan bawang merah
  - konsumsi per kapita bahan pangan strategis
  - lonjakan permintaan hari besar keagamaan nasional
synonyms:
  - "demand brambang"
  - "kebutuhan bawang merah"
  - "shallot demand"
  - "market demand for red onion"
entity_type: "Market_Topic"
location:
  primary: "Kabupaten Nganjuk, Jawa Timur, Indonesia"
  sentra_kecamatan: ["Sukomoro", "Rejoso", "Gondang", "Bagor", "Wilangan", "Berbek"]
  related_region: ["Kediri", "Jombang", "Madiun", "Magetan", "Bojonegoro", "Probolinggo", "Malang", "Sampang", "Surabaya"]
geographic_priority:
  1: "Kabupaten Nganjuk"
  2: "Kediri"
  3: "Jombang"
  4: "Madiun"
  5: "Magetan"
  6: "Bojonegoro"
  7: "Jawa Timur"
  8: "Indonesia"
  9: "Internasional (ASEAN, dunia)"
related_varieties: ["Bauji", "Tajuk", "Manjung"]
related_planting_seasons: ["Fase Raya", "Labuhan 1", "Labuhan 2", "Labuhan 3"]
related_weather: ["curah hujan", "kemarau", "kelembapan tinggi", "anomali cuaca La Nina/El Nino"]
related_documents:
  - "harga-bawang-merah.md"
  - "panen-raya.md"
  - "supply-demand-bawang-merah.md"
  - "hari-besar-nasional.md"
  - "distribusi-bawang-merah.md"
  - "pasar-induk-sukomoro.md"
  - "ekspor-impor-bawang-merah.md"
  - "cold-storage-bawang-merah.md"
  - "fase-raya.md"
market_type: "Pasar komoditas hortikultura dengan permintaan inelastis jangka pendek dan lonjakan musiman signifikan pada periode HBKN"
language: "id-ID"
evidence_level: "Campuran: data konsumsi nasional dari BPS/Bapanas/Susenas terverifikasi (tingkat tinggi); data permintaan spesifik tingkat Kabupaten Nganjuk belum tersedia lengkap dalam dokumen ini (tingkat rendah, ditandai eksplisit)"
review_status: "draft-reviewed"
created_at: "2026-07-15"
last_updated: "2026-07-15"
---

# Executive Summary

Permintaan pasar (demand) bawang merah adalah sisi lain dari persamaan harga yang sama pentingnya dengan pasokan (supply). Jika pasokan menentukan berapa banyak bawang merah yang tersedia di pasar, maka permintaan menentukan seberapa besar pasar bersedia menyerap dan membayar untuk volume tersebut. Bagi petani di Kabupaten Nganjuk, memahami pola permintaan sama pentingnya dengan memahami pola panen, karena harga jual pada akhirnya terbentuk dari titik temu antara kedua kekuatan ini.

Bawang merah adalah bumbu dasar hampir seluruh masakan Indonesia, sehingga permintaannya bersifat kebutuhan pokok (staple-like demand) meski secara resmi tidak digolongkan sebagai bahan pangan pokok utama seperti beras. Karena sifat kebutuhannya yang mendasar, permintaan bawang merah relatif inelastis dalam jangka pendek — artinya konsumen tetap membeli dalam jumlah yang relatif stabil meski harga naik, meskipun pada level rumah tangga tetap ada penyesuaian jumlah pembelian saat harga melonjak sangat tinggi.

Berdasarkan data Badan Pangan Nasional (Bapanas), rata-rata konsumsi bawang merah masyarakat Indonesia tercatat 2,86 kilogram per kapita per tahun pada 2023, turun 5,3 persen dibanding tahun 2022, dengan total kebutuhan konsumsi rumah tangga nasional mencapai 797,3 ribu ton per tahun. Data BPS lain menunjukkan konsumsi mingguan sebesar 0,549 ons per kapita pada 2023. Angka-angka ini menegaskan bahwa meskipun konsumsi per kapita relatif kecil, akumulasi kebutuhan nasional sangat besar mengingat populasi Indonesia yang besar, sehingga fluktuasi kecil pada sisi permintaan dapat berdampak signifikan terhadap harga pasar.

Permintaan bawang merah tidak merata sepanjang tahun. Pola permintaan menunjukkan lonjakan tajam menjelang hari besar keagamaan nasional (HBKN), terutama Ramadan dan Idul Fitri, karena tradisi memasak hidangan khas yang menggunakan bawang merah sebagai bumbu dasar meningkat signifikan pada periode tersebut. Lonjakan serupa, meski relatif lebih moderat, juga terjadi menjelang Natal dan Tahun Baru (Nataru).

Bagi Kabupaten Nganjuk sebagai sentra produksi bawang merah terbesar di Jawa Timur dan barometer pasokan nasional, memahami sisi permintaan menjadi krusial karena sebagian besar hasil produksi Nganjuk didistribusikan ke luar wilayah untuk memenuhi permintaan di Kediri, Jombang, Madiun, Magetan, Bojonegoro, Surabaya, dan wilayah lain di Jawa Timur maupun nasional. Ketika terjadi kesenjangan (gap) antara pasokan yang bersifat musiman dan permintaan yang relatif terus meningkat sejalan dengan pertumbuhan penduduk, gejolak harga antarwaktu menjadi tidak terhindarkan.

Bagi petani, pemahaman terhadap kalender permintaan membantu perencanaan waktu tanam agar panen dapat diarahkan mendekati periode permintaan tinggi, alih-alih hanya mengikuti kebiasaan tanam tanpa mempertimbangkan sisi pasar. Perencanaan semacam ini sangat relevan dengan sistem Fase Raya dan Labuhan 1-3 yang menjadi kalender tanam lokal di Nganjuk, karena pergiliran waktu tanam-panen antarkecamatan dapat dioptimalkan untuk menangkap periode permintaan tinggi seperti Ramadan-Idul Fitri.

Permintaan bawang merah juga berasal dari sumber-sumber non-rumah tangga yang signifikan: restoran dan katering, industri pengolahan makanan (bawang goreng, bumbu instan), serta segmen ekspor pada level nasional. Masing-masing sumber permintaan ini memiliki karakteristik sensitivitas harga dan pola musiman yang berbeda, sehingga strategi pemasaran petani dapat disesuaikan dengan segmen permintaan yang ditargetkan.

Dari sisi kebijakan, pemerintah memantau ketat keseimbangan permintaan-pasokan bawang merah karena statusnya sebagai salah satu bahan pangan bergejolak (volatile food) yang berkontribusi terhadap inflasi. Data menunjukkan bahwa pada April 2024, harga bawang merah eceran nasional sempat melonjak 55,8 persen dalam sebulan, mengindikasikan betapa sensitifnya harga terhadap ketidakseimbangan permintaan-pasokan sesaat.

Penting dicatat bahwa dokumen ini memiliki keterbatasan data: sebagian besar angka konsumsi dan permintaan yang tersedia adalah data agregat nasional dari BPS dan Bapanas, sementara data permintaan spesifik pada level Kabupaten Nganjuk atau data permintaan harian/mingguan di Pasar Sukomoro belum tersedia secara lengkap dalam penyusunan dokumen ini. Angka-angka nasional digunakan sebagai proksi (pendekatan) dengan penanda eksplisit, bukan sebagai representasi pasti kondisi lokal Nganjuk.

Secara ringkas, dokumen ini membahas struktur sumber permintaan, karakteristik konsumsi nasional dan regional, kalender permintaan musiman bulanan, keterkaitan dengan fase tanam lokal, dampak permintaan terhadap harga dan risiko pasar, strategi menangkap peluang permintaan tinggi, serta aturan keputusan dan skenario praktis yang dapat langsung digunakan oleh petani maupun sistem AI SIMANTRI dalam membaca sinyal permintaan pasar.

---

# Quick Facts

| Aspek | Keterangan |
|---|---|
| Topik | Permintaan Pasar (Market Demand) Bawang Merah |
| Jenis Pasar | Permintaan inelastis jangka pendek, dengan lonjakan musiman signifikan saat HBKN |
| Supply | Bersifat musiman (lihat dokumen `harga-bawang-merah.md` dan `panen-raya.md`) |
| Demand | Konsumsi nasional 2,86 kg/kapita/tahun (Bapanas, 2023); total kebutuhan rumah tangga nasional 797,3 ribu ton/tahun |
| Price Trend | Harga sangat sensitif terhadap lonjakan permintaan singkat; pernah naik 55,8% dalam sebulan (April 2024, data nasional) |
| Seasonality | Puncak permintaan menjelang Ramadan dan Idul Fitri; naik moderat menjelang Nataru |
| Risk | Lonjakan permintaan mendadak tanpa diimbangi pasokan memicu inflasi bahan pangan |
| Opportunity | Petani dengan stok tersedia menjelang HBKN berpeluang menangkap harga premium |

---

# Definition

Permintaan pasar (market demand) bawang merah adalah jumlah bawang merah yang bersedia dan mampu dibeli oleh konsumen (rumah tangga, restoran, industri, eksportir) pada berbagai tingkat harga dan periode waktu tertentu. Permintaan ini merupakan sisi berlawanan namun saling melengkapi dengan penawaran (supply) dalam membentuk harga pasar.

Tujuan memahami permintaan bagi petani adalah untuk mengoptimalkan waktu tanam dan waktu jual agar hasil panen tersedia pada saat permintaan sedang tinggi, sehingga memperoleh harga jual yang lebih menguntungkan. Bagi pemerintah, pemantauan permintaan penting untuk merancang kebijakan stabilisasi harga dan mencegah lonjakan inflasi bahan pangan bergejolak.

Secara ekonomi, permintaan bawang merah bersifat relatif inelastis dalam jangka pendek karena statusnya sebagai bumbu dasar yang sulit digantikan dalam masakan Indonesia, namun tetap menunjukkan sensitivitas terhadap kenaikan harga ekstrem, di mana rumah tangga dapat mengurangi jumlah pembelian atau beralih sementara ke bawang bombay/bawang putih sebagai substitusi parsial.

---

# Market Structure

- **Konsumen Rumah Tangga (Household Consumer):** Sumber permintaan terbesar secara volume, dengan pola konsumsi harian yang relatif stabil namun meningkat tajam pada periode HBKN.
- **Restoran dan Katering (Foodservice):** Permintaan kontinu dengan volume signifikan terutama di kota-kota besar dan destinasi wisata kuliner, meningkat pada akhir pekan dan musim liburan.
- **Industri Pengolahan Makanan (Food Processing Industry):** Meliputi produsen bawang goreng, bumbu instan, dan produk siap saji; permintaan cenderung stabil sepanjang tahun dengan pola kontrak volume, kurang sensitif terhadap fluktuasi harga jangka pendek dibanding rumah tangga.
- **Pedagang Antar-Daerah (Interregional Buyer):** Mewakili permintaan agregat dari Kediri, Jombang, Madiun, Magetan, Bojonegoro, dan wilayah lain yang bergantung pasokan dari Nganjuk.
- **Eksportir (Exporter):** Menyerap sebagian produksi nasional untuk pasar luar negeri (Taiwan, Malaysia, dan negara ASEAN lain), meski volume ekspor bawang merah Indonesia relatif kecil dibanding volume konsumsi domestik.
- **Pemerintah/Bulog/Bapanas (Government Buffer Demand):** Melakukan pembelian untuk operasi pasar dan cadangan pangan pemerintah pada kondisi tertentu guna menstabilkan harga.
- **Sektor Bibit (Seed Market Demand):** Permintaan petani lain untuk kebutuhan bibit tanam musim berikutnya, menciptakan segmen permintaan tersendiri dengan pola musiman yang berbeda dari permintaan konsumsi.

---

# Supply Analysis

Catatan: analisis pasokan (supply) secara rinci dibahas pada dokumen `harga-bawang-merah.md` dan `panen-raya.md`. Ringkasan yang relevan untuk memahami interaksi dengan permintaan:

- Pasokan bawang merah bersifat musiman, mengikuti kalender tanam-panen Fase Raya dan Labuhan 1-3 di Nganjuk, dengan musim tanam utama dimulai sekitar bulan Juni dan panen sekitar 55-70 hari kemudian.
- Data terbaru menunjukkan panen di sentra Jawa Timur (termasuk Nganjuk, Probolinggo, Sampang, Sumenep) berlangsung bertahap sepanjang tahun dengan potensi luas panen regional April-Mei 2026 mencapai sekitar 9.440 hektar di Jawa Timur, bagian dari perkiraan luas panen nasional sekitar 32 ribu hektar pada periode yang sama (setara estimasi produksi rogol konsumsi 227 ribu ton), berdasarkan Early Warning System Bawang Merah Nasional.
- Karena sifat pasokan yang musiman sementara permintaan relatif terus-menerus dan cenderung meningkat sejalan pertumbuhan penduduk, kesenjangan (gap) antara pasokan dan permintaan pada periode tertentu menjadi sumber utama gejolak harga.

---

# Demand Analysis

**Permintaan Rumah Tangga (Household Demand):** Berdasarkan data BPS, konsumsi bawang merah rumah tangga nasional pada 2023 tercatat 0,549 ons per kapita per minggu, setara sekitar 2,86 kilogram per kapita per tahun menurut Bapanas, dengan total kebutuhan rumah tangga nasional mencapai 797,3 ribu ton per tahun. Angka ini berfluktuasi dari tahun ke tahun; sebagai gambaran historis, konsumsi per kapita nasional pernah mencapai puncaknya 3,01 kilogram per kapita pada 2007 dan sempat berada di titik terendah 2,06 kilogram per kapita pada 2013, menunjukkan variasi konsumsi yang cukup signifikan antar tahun.

**Permintaan Restoran/Katering (Foodservice Demand):** Permintaan dari sektor ini tidak memiliki data kuantitatif spesifik dalam dokumen ini, namun secara kualitatif diketahui meningkat pada musim liburan, akhir pekan panjang, dan periode wisata kuliner, khususnya di kota-kota dengan aktivitas pariwisata tinggi di Jawa Timur.

**Permintaan Industri (Industrial Demand):** Industri bumbu instan dan bawang goreng menyerap volume signifikan secara kontinu; permintaan segmen ini relatif stabil dan kurang sensitif terhadap fluktuasi harga jangka pendek dibanding permintaan rumah tangga langsung, karena umumnya berbasis kontrak volume.

**Permintaan Hari Besar Keagamaan Nasional (HBKN Demand):** Merupakan pendorong permintaan paling signifikan dalam kalender tahunan. Setiap menjelang Lebaran, permintaan melonjak tajam karena tradisi perayaan hari besar yang menyajikan berbagai hidangan khas daerah dengan bawang merah sebagai bumbu dasar. Lonjakan permintaan serupa, meski relatif lebih moderat, juga terjadi menjelang Natal dan Tahun Baru.

**Permintaan Antar-Wilayah:** Kediri, Jombang, Madiun, Magetan, dan Bojonegoro merupakan wilayah tetangga yang sebagian bergantung pasokan dari Nganjuk, sehingga permintaan gabungan dari wilayah-wilayah ini turut membentuk harga acuan di Pasar Sukomoro.

**Permintaan Bibit (Seed Demand):** Berbeda dari permintaan konsumsi, permintaan bibit meningkat menjelang musim tanam baru (sekitar bulan Juni) dan memiliki elastisitas harga yang berbeda karena terkait langsung dengan ekspektasi harga jual pada musim tanam berikutnya, bukan kebutuhan konsumsi langsung.

**Variasi permintaan antarprovinsi:** Data historis menunjukkan variasi konsumsi bawang merah antarwilayah di Indonesia cukup besar; sebagai contoh, konsumsi terendah pernah tercatat di Nusa Tenggara Timur (1,38-1,63 kg/kapita pada 2017-2018), sementara pertumbuhan konsumsi tertinggi pernah tercatat di Sumatera Utara. **Keterbatasan data:** dokumen ini tidak memiliki angka konsumsi spesifik untuk Kabupaten Nganjuk atau Provinsi Jawa Timur secara terpilah; disarankan merujuk data Susenas BPS untuk analisis konsumsi tingkat provinsi/kabupaten yang lebih presisi.

---

# Price Characteristics

Karakteristik harga secara umum (fluktuasi harian, mingguan, bulanan, dan musiman) dibahas secara rinci pada dokumen `harga-bawang-merah.md`. Dari sisi permintaan, poin penting yang perlu ditambahkan:

- **Sensitivitas harga terhadap lonjakan permintaan:** Data nasional menunjukkan harga bawang merah eceran sempat melonjak 55,8 persen dalam sebulan (23 April 2024, mencapai rata-rata Rp 52.670 per kilogram di tingkat pedagang eceran nasional), mengindikasikan bahwa lonjakan permintaan pada momentum tertentu (mendekati atau menjelang HBKN) dapat mendorong kenaikan harga sangat tajam apabila tidak diimbangi pasokan yang memadai.
- **Perilaku harga saat permintaan tinggi bertemu pasokan rendah:** Kombinasi permintaan HBKN yang tinggi dengan pasokan yang kebetulan sedang rendah (misalnya bertepatan dengan masa tanam, bukan masa panen) menghasilkan kenaikan harga paling tajam dalam kalender tahunan.
- **Perilaku harga saat permintaan tinggi bertemu pasokan tinggi:** Sebagaimana dilaporkan pada panen raya Desember 2025 di Nganjuk, pemerintah dan champion petani berupaya menyinkronkan jadwal panen dengan periode permintaan tinggi (Nataru hingga Ramadan-Idul Fitri) agar harga tetap stabil menguntungkan meski volume permintaan tinggi.

---

# Price Drivers

Faktor pendorong harga dari sisi pasokan dibahas rinci pada `harga-bawang-merah.md`. Dari sisi permintaan, faktor pendorong utama meliputi:

1. **Hari Besar Keagamaan Nasional (HBKN)** — Ramadan dan Idul Fitri adalah pendorong permintaan tertinggi dalam kalender tahunan.
2. **Musim liburan Nataru** — mendorong kenaikan permintaan moderat.
3. **Pertumbuhan penduduk** — mendorong tren kenaikan kebutuhan konsumsi nasional secara struktural jangka panjang.
4. **Perubahan pola makan masyarakat** — pergeseran preferensi kuliner dapat memengaruhi volume konsumsi bawang merah per kapita dari waktu ke waktu.
5. **Permintaan industri olahan** — pertumbuhan industri bumbu instan dan bawang goreng menambah permintaan struktural di luar konsumsi rumah tangga langsung.
6. **Permintaan ekspor** — meski relatif kecil dibanding konsumsi domestik, permintaan ekspor menambah tekanan permintaan total pada saat tertentu.
7. **Substitusi harga** — saat harga bawang merah sangat tinggi, sebagian konsumen beralih sementara ke bawang bombay atau mengurangi porsi penggunaan, sedikit menekan permintaan pada level harga ekstrem.
8. **Kebijakan pemerintah (operasi pasar, cadangan pangan)** — pembelian pemerintah untuk stabilisasi dapat menambah permintaan agregat pada periode tertentu.

---

# Seasonal Market Calendar

Catatan: pola permintaan bulanan berikut bersifat tendensi umum berdasarkan siklus HBKN dan kebiasaan konsumsi masyarakat Indonesia; kalender Hijriah (Ramadan-Idul Fitri) bergeser sekitar 10-11 hari lebih awal setiap tahun Masehi, sehingga bulan spesifik dapat berbeda antar tahun.

- **Januari:** Demand stabil-sedang pasca Nataru; Supply umumnya masih tinggi (lanjutan panen raya); Price tendency cenderung tertekan; Risiko permintaan lesu pasca liburan; Peluang bagi industri olahan membeli stok dengan harga relatif rendah.
- **Februari:** Demand stabil, mulai ada sinyal peningkatan jika Ramadan jatuh di bulan Maret-April; Price tendency stabil; Risiko permintaan belum signifikan naik meski pasar mulai antisipasi HBKN; Peluang petani mulai merencanakan waktu jual mendekati Ramadan.
- **Maret:** Demand mulai meningkat menjelang Ramadan (tergantung kalender Hijriah tahun berjalan); Price tendency cenderung naik jika bertepatan dengan awal Ramadan; Risiko permintaan naik cepat namun pasokan belum tentu menyesuaikan; Peluang harga premium bagi petani dengan stok tersedia.
- **April:** Demand sangat tinggi (puncak Ramadan-Idul Fitri, tergantung kalender Hijriah); Price tendency cenderung naik tajam jika pasokan tidak mencukupi; Risiko lonjakan harga ekstrem seperti pernah tercatat secara nasional; Peluang harga puncak tahun bagi petani yang memiliki stok pada periode ini.
- **Mei:** Demand kembali normal pasca Lebaran, cenderung turun dari puncak; Price tendency menurun dari level puncak; Risiko permintaan menurun cepat menyebabkan harga terkoreksi tajam; Peluang bagi pembeli untuk stok dengan harga lebih wajar pasca HBKN.
- **Juni:** Demand konsumsi stabil normal; Demand bibit meningkat seiring awal musim tanam; Price tendency stabil untuk konsumsi, naik untuk segmen bibit; Risiko kelangkaan bibit berkualitas jika permintaan bibit tinggi; Peluang margin tinggi bagi penjual bibit.
- **Juli-Agustus:** Demand stabil normal (tidak ada HBKN besar); Price tendency stabil; Risiko minim dari sisi permintaan; Peluang permintaan industri olahan untuk kontrak volume reguler.
- **September-Oktober:** Demand stabil normal; Price tendency dipengaruhi lebih dominan oleh sisi pasokan (panen mulai masuk di sejumlah wilayah); Risiko dari sisi permintaan relatif rendah; Peluang kontrak distribusi reguler dengan pedagang antar-daerah.
- **November:** Demand mulai meningkat menjelang Nataru; Price tendency mulai terpengaruh kombinasi permintaan naik dan pasokan yang juga meningkat (panen raya mendekat); Risiko permintaan naik namun pasokan melimpah dapat saling menetralkan; Peluang kontrak volume menjelang periode liburan akhir tahun.
- **Desember:** Demand tinggi (Nataru); Supply juga tinggi (panen raya, sebagaimana tercatat di Nganjuk Desember 2025); Price tendency relatif stabil karena kedua sisi (permintaan dan pasokan) sama-sama tinggi, sesuai target pemerintah menjaga stabilitas harga hingga Lebaran tahun berikutnya; Risiko oversupply jika pasokan panen jauh melebihi kenaikan permintaan Nataru; Peluang stok cukup untuk menopang kebutuhan hingga Ramadan-Lebaran tahun berikutnya.

---

# Planting Season Relationship

Perencanaan waktu tanam di Nganjuk yang mengikuti kalender Fase Raya dan Labuhan 1-3 idealnya mempertimbangkan bukan hanya kondisi agronomis, tetapi juga kalender permintaan tahunan. Sinkronisasi antara jadwal panen dan periode permintaan tinggi (terutama Ramadan-Idul Fitri) merupakan strategi yang secara eksplisit disebutkan oleh pemerintah dan champion petani Nganjuk dalam upaya menjaga pasokan aman sekaligus harga menguntungkan menjelang Nataru, puasa, hingga Idul Fitri.

Karena kalender Hijriah bergeser setiap tahun Masehi, perencanaan penyesuaian antara Fase Raya/Labuhan dengan periode HBKN perlu dievaluasi ulang setiap musim tanam, bukan mengikuti pola tetap tahun-ke-tahun. Rincian teknis kalender tanam dijelaskan lebih lanjut pada dokumen `fase-raya.md` dan dokumen Labuhan terkait.

---

# Variety Relationship

Dari sisi permintaan, preferensi varietas dapat berbeda menurut segmen pembeli:

- **Bauji:** Diminati untuk segmen kualitas premium dan bibit, dengan permintaan yang cenderung stabil dari kalangan petani lain yang mencari bibit unggul.
- **Tajuk dan Manjung:** Diminati untuk segmen volume besar konsumsi rumah tangga dan industri olahan karena kontribusi volume produksi yang tinggi.

Detail agronomis tiap varietas dijelaskan pada dokumen `varietas-bauji.md` dan `varietas-tajuk.md` yang tercakup dalam dokumen `harga-bawang-merah.md`.

---

# Disease Impact

Dari sisi permintaan, dampak penyakit tanaman tidak secara langsung memengaruhi volume permintaan konsumen, namun memengaruhi kemampuan pasokan memenuhi permintaan yang ada:

- Penurunan kualitas panen akibat penyakit (busuk umbi, layu fusarium, antraknosa) dapat menyebabkan sebagian permintaan segmen premium (restoran, ekspor) tidak terpenuhi, meski permintaan segmen umum tetap dapat diserap dengan harga lebih rendah.
- Ketidaksesuaian kualitas dengan standar permintaan industri olahan dapat menyebabkan penolakan atau penurunan harga beli dari pembeli industri.

---

# Pest Impact

Serupa dengan dampak penyakit, serangan hama (ulat bawang, thrips) tidak mengubah volume permintaan pasar secara langsung, namun memengaruhi kemampuan petani memenuhi permintaan segmen kualitas tertentu:

- Umbi berukuran kecil akibat serangan hama kurang diminati segmen permintaan restoran/ekspor yang mensyaratkan keseragaman ukuran, meski tetap dapat diserap segmen rumah tangga umum.

---

# Weather Impact

Cuaca memengaruhi sisi permintaan secara tidak langsung melalui dampaknya terhadap pasokan (dibahas rinci di `harga-bawang-merah.md`). Namun cuaca ekstrem skala nasional (yang memengaruhi banyak sentra produksi sekaligus, tidak hanya Nganjuk) dapat menyebabkan kesenjangan permintaan-pasokan yang lebih luas, mendorong lonjakan harga nasional yang lebih tajam dibanding jika gangguan cuaca hanya bersifat lokal.

---

# Harvest Strategy

Strategi panen terkait permintaan berfokus pada penyesuaian waktu panen agar tersedia pada periode permintaan tinggi:

- **Menyesuaikan jadwal tanam mundur dari target HBKN:** Menghitung mundur sekitar 55-70 hari dari target periode permintaan tinggi (misalnya Idul Fitri) untuk menentukan waktu tanam optimal.
- **Diversifikasi jadwal panen antarpetak/kelompok tani:** Mengikuti pola pergiliran Fase Raya/Labuhan agar sebagian hasil panen dapat diarahkan ke periode permintaan tinggi, bukan hanya mengikuti panen raya massal yang berpotensi bertepatan dengan permintaan normal.

Detail strategi panen dari sisi kualitas dan teknis dibahas pada dokumen `harga-bawang-merah.md`.

---

# Storage Strategy

Dari sisi permintaan, strategi penyimpanan relevan untuk menjembatani periode pasokan tinggi (panen raya) dengan periode permintaan tinggi (HBKN) yang tidak selalu bertepatan:

- Jika panen terjadi jauh sebelum periode HBKN, penyimpanan yang baik memungkinkan petani menahan sebagian stok untuk dijual saat permintaan (dan harga) mencapai puncak.
- Ketersediaan cold storage atau gudang tradisional yang memadai menjadi penentu utama kemampuan petani "menjembatani" waktu antara panen dan puncak permintaan.

Detail teknis penyimpanan dibahas pada dokumen `harga-bawang-merah.md` dan `cold-storage-bawang-merah.md`.

---

# Distribution Chain

Rantai distribusi permintaan mengalir dari titik-titik konsumsi kembali ke sumber pasokan: **Konsumen/Restoran/Industri (permintaan) → Pengecer → Pedagang Grosir Kota → Pedagang Antar-Daerah → Pasar Induk Sukomoro → Pengepul → Petani (Nganjuk).** Sinyal permintaan (termasuk lonjakan menjelang HBKN) merambat melalui rantai ini dari konsumen akhir kembali ke petani, biasanya dengan jeda waktu tertentu tergantung kecepatan informasi pasar sampai ke tingkat petani.

---

# Marketing Strategy

- **Penjualan berbasis kalender permintaan:** Petani dapat merencanakan sebagian hasil panen untuk dijual mendekati periode HBKN alih-alih menjual seluruhnya saat panen raya.
- **Kontrak dengan industri olahan:** Menjamin permintaan stabil sepanjang tahun di luar musim HBKN, mengurangi ketergantungan pada fluktuasi permintaan musiman semata.
- **Kemitraan dengan pedagang antar-daerah:** Memperluas jangkauan permintaan ke Kediri, Jombang, Madiun, Magetan, dan Bojonegoro, tidak hanya mengandalkan permintaan lokal Nganjuk.
- **Pemasaran daring untuk segmen bibit:** Permintaan bibit dari petani daerah lain dapat dijangkau melalui platform e-commerce, membuka pasar permintaan di luar wilayah distribusi konvensional.

---

# Risk Analysis

1. **Permintaan lesu pasca HBKN:** Penurunan tajam permintaan setelah Idul Fitri dapat menyebabkan harga terkoreksi cepat bagi petani yang masih menyimpan stok.
2. **Lonjakan permintaan tanpa diimbangi pasokan:** Memicu kenaikan harga ekstrem yang justru dapat menekan volume pembelian rumah tangga akibat harga terlalu tinggi (self-correcting demand pada level harga ekstrem).
3. **Pergeseran preferensi konsumen:** Perubahan pola makan atau tren substitusi bumbu dapat menekan permintaan struktural jangka panjang, meski indikasi tren semacam ini belum terverifikasi kuat dalam data yang tersedia.
4. **Ketidaksesuaian waktu panen dengan periode permintaan tinggi:** Jika seluruh hasil panen jatuh pada periode permintaan normal (bukan HBKN), petani kehilangan peluang harga premium musiman.
5. **Ketergantungan pada satu segmen permintaan:** Petani yang hanya mengandalkan satu jalur penjualan (misalnya hanya pengepul lokal) berisiko lebih besar terhadap fluktuasi permintaan dibanding yang terdiversifikasi ke industri, ekspor, dan bibit.

---

# Opportunity Analysis

1. **Puncak permintaan Ramadan-Idul Fitri:** Peluang harga premium terbesar dalam kalender tahunan bagi petani dengan stok tersedia pada periode ini.
2. **Permintaan Nataru:** Peluang harga baik kedua terbesar setelah Lebaran, meski relatif lebih moderat.
3. **Kontrak volume industri olahan:** Peluang pendapatan stabil sepanjang tahun di luar periode HBKN, mengurangi risiko volatilitas harga spot.
4. **Segmen bibit:** Peluang margin tinggi dengan menjual hasil panen sebagai bibit menjelang musim tanam baru (~Juni), sebagaimana dibahas rinci pada `harga-bawang-merah.md`.
5. **Ekspor:** Peluang tambahan meski relatif kecil, terutama saat kondisi surplus produksi nasional membuka ruang penyerapan pasar luar negeri.
6. **Diversifikasi wilayah pemasaran:** Menjangkau permintaan di luar Nganjuk (Kediri, Jombang, Madiun, Magetan, Bojonegoro) untuk mengurangi risiko ketergantungan pada satu pasar lokal.

---

# Economic Analysis

Analisis biaya produksi, titik impas, potensi keuntungan, dan ROI usaha tani dibahas secara rinci pada dokumen `harga-bawang-merah.md`. Dari perspektif permintaan, poin ekonomi tambahan yang relevan:

- **Nilai ekonomi lonjakan permintaan HBKN:** Berdasarkan data historis nasional, lonjakan harga hingga puluhan persen dalam sebulan (seperti kenaikan 55,8 persen pada April 2024) menunjukkan potensi peningkatan pendapatan signifikan bagi petani yang berhasil menyesuaikan waktu jual dengan periode permintaan tinggi tersebut, dibanding menjual pada periode permintaan normal.
- **Risiko ekonomi ketergantungan pada satu momentum permintaan:** Petani yang hanya mengandalkan momentum HBKN untuk seluruh pendapatan tahunan menghadapi risiko konsentrasi tinggi; diversifikasi waktu jual dan segmen permintaan (industri, bibit, ekspor) dapat mengurangi risiko ini.
- **Keterbatasan data:** dokumen ini tidak memiliki data elastisitas harga-permintaan yang terukur secara kuantitatif spesifik untuk pasar Nganjuk; analisis di atas bersifat kualitatif berdasarkan pola umum yang teramati secara nasional.

---

# Decision Rules

1. IF Bulan Mendekati Ramadan (H-30 hingga H-1) MAKA Demand Diperkirakan Naik → Rekomendasi: Siapkan stok untuk dijual bertahap menjelang puncak permintaan.
2. IF Sedang Berlangsung Idul Fitri MAKA Demand Berada di Puncak Tahunan → Rekomendasi: Manfaatkan momentum jual jika masih memiliki stok berkualitas baik.
3. IF Pasca Idul Fitri (H+7 hingga H+30) MAKA Demand Turun Cepat → Rekomendasi: Percepat penjualan sisa stok sebelum harga terkoreksi lebih dalam.
4. IF Mendekati Nataru MAKA Demand Naik Moderat → Rekomendasi: Pertimbangkan menahan sebagian stok untuk periode ini jika panen bertepatan.
5. IF Panen Bertepatan Dengan Periode Non-HBKN MAKA Demand Normal → Rekomendasi: Prioritaskan penjualan ke industri olahan atau segmen bibit untuk harga lebih baik dibanding pasar spot konsumsi normal.
6. IF Terdapat Kontrak Industri Olahan Tersedia MAKA Rekomendasi: Alokasikan sebagian hasil panen untuk kontrak guna menstabilkan pendapatan, sisanya untuk pasar spot musiman.
7. IF Harga Melonjak Tajam Akibat Lonjakan Permintaan Mendadak MAKA Rekomendasi: Manfaatkan momentum jual namun waspadai potensi koreksi cepat setelah permintaan mereda.
8. IF Ramalan Kalender Hijriah Menunjukkan Ramadan Jatuh Lebih Awal Dari Tahun Sebelumnya MAKA Rekomendasi: Sesuaikan jadwal tanam lebih awal agar panen tetap mendekati periode Ramadan-Idul Fitri.
9. IF Permintaan Ekspor Dilaporkan Meningkat MAKA Rekomendasi: Jaga kualitas premium untuk peluang menembus segmen ekspor melalui mitra eksportir.
10. IF Permintaan Bibit Meningkat Menjelang Musim Tanam MAKA Rekomendasi: Alihkan sebagian hasil panen simpanan menjadi bibit untuk margin lebih tinggi.
11. IF Data Permintaan Lokal Nganjuk Tidak Tersedia MAKA Rekomendasi: Gunakan data konsumsi nasional/Jawa Timur sebagai proksi dengan penanda eksplisit keterbatasan data, jangan menyamakan langsung dengan kondisi lokal.
12. IF Terjadi Penurunan Harga Tajam Pasca HBKN MAKA Rekomendasi: Evaluasi opsi menyimpan sisa stok sebagai bibit alih-alih menjual pada harga rendah pasca-HBKN.
13. IF Permintaan Restoran/Katering Meningkat (musim liburan/wisata) MAKA Rekomendasi: Jajaki kerja sama penjualan volume kecil-menengah dengan pelaku usaha kuliner lokal.
14. IF Terdapat Indikasi Pergeseran Preferensi Konsumen (misalnya substitusi bumbu) MAKA Rekomendasi: Pantau perkembangan tren ini secara berkala, namun jangan mengambil keputusan besar tanpa data yang terverifikasi kuat.
15. IF Kondisi Permintaan dan Pasokan Sama-Sama Tinggi (seperti panen raya Desember bertepatan Nataru) MAKA Rekomendasi: Harga cenderung stabil, jual sesuai rencana normal tanpa perlu terburu-buru maupun menunda berlebihan.

---

# Recommendation Matrix

| Market Condition | Recommendation | Priority | Confidence | Reason |
|---|---|---|---|---|
| Mendekati Ramadan-Idul Fitri, stok tersedia | Jual bertahap menangkap tren naik | Tinggi | Tinggi | Data historis menunjukkan lonjakan permintaan dan harga signifikan pada periode ini |
| Pasca Idul Fitri, masih ada stok | Percepat penjualan | Tinggi | Tinggi | Demand turun cepat pasca HBKN menyebabkan risiko harga terkoreksi tajam |
| Panen bertepatan periode non-HBKN | Prioritaskan industri olahan/bibit | Sedang | Sedang | Permintaan konsumsi normal lebih rendah dibanding potensi segmen lain |
| Data permintaan lokal tidak tersedia | Gunakan data nasional sebagai proksi, nyatakan keterbatasan | Tinggi | Tinggi | Mencegah keputusan berbasis asumsi yang tidak terverifikasi |
| Permintaan ekspor meningkat | Jaga kualitas premium untuk peluang ekspor | Sedang | Sedang | Data menunjukkan permintaan ekspor relatif kecil namun bernilai tambah tinggi |
| Permintaan dan pasokan sama-sama tinggi (Nataru-panen raya) | Jual sesuai rencana normal | Sedang | Tinggi | Kedua sisi saling menyeimbangkan sehingga harga relatif stabil |

---

# Practical Farmer Scenarios

1. **Target menjual tepat saat permintaan Idul Fitri memuncak.** Analisis: perlu penyesuaian jadwal tanam mundur sekitar 55-70 hari dari target. Rekomendasi: hitung mundur dari kalender Hijriah tahun berjalan saat merencanakan tanam. Risiko: pergeseran cuaca dapat menggeser waktu panen dari target. Hasil yang diharapkan: menangkap harga puncak permintaan tahunan.
2. **Panen jatuh tepat setelah Idul Fitri, permintaan sudah menurun.** Analisis: momentum harga tinggi sudah terlewat. Rekomendasi: prioritaskan penjualan ke industri olahan atau simpan sebagai bibit alih-alih menjual di pasar spot yang sedang lesu. Risiko: harga bibit juga dapat bervariasi tergantung permintaan petani lain. Hasil yang diharapkan: pendapatan lebih baik dibanding menjual langsung pada periode permintaan rendah.
3. **Petani menerima tawaran kontrak volume dari industri bawang goreng.** Analisis: kontrak memberi kepastian permintaan namun mengunci harga di bawah potensi puncak HBKN. Rekomendasi: alokasikan sebagian hasil untuk kontrak, sisanya untuk pasar spot musiman. Risiko: proporsi yang salah dapat mengurangi potensi keuntungan pada salah satu sisi. Hasil yang diharapkan: pendapatan lebih stabil dengan tetap membuka peluang upside musiman.
4. **Muncul rumor kenaikan permintaan mendadak akibat isu kelangkaan.** Analisis: rumor dapat memicu perilaku panic-buy yang belum tentu mencerminkan permintaan riil. Rekomendasi: verifikasi ke sumber resmi (Bapanas, Dinas Pertanian) sebelum mengambil keputusan besar terkait waktu jual. Risiko: bertindak berdasarkan rumor dapat merugikan jika kondisi riil berbeda. Hasil yang diharapkan: keputusan berbasis data terverifikasi.
5. **Musim liburan panjang meningkatkan permintaan restoran lokal.** Analisis: peluang permintaan tambahan di luar jalur pasar induk konvensional. Rekomendasi: jajaki kerja sama langsung dengan pelaku usaha kuliner setempat untuk volume kecil-menengah dengan harga lebih baik. Risiko: volume permintaan restoran individual relatif kecil dibanding pasar grosir. Hasil yang diharapkan: diversifikasi kanal penjualan dengan margin tambahan.
6. **Data permintaan spesifik Nganjuk tidak tersedia saat petani ingin membuat keputusan.** Analisis: keterbatasan data lokal memerlukan pendekatan proksi. Rekomendasi: gunakan data konsumsi nasional/Jawa Timur sebagai referensi umum, dikombinasikan dengan observasi harga aktual di Pasar Sukomoro. Risiko: proksi nasional mungkin tidak sepenuhnya mencerminkan kondisi lokal. Hasil yang diharapkan: keputusan tetap terinformasi meski data tidak sempurna.
7. **Ekspor bawang merah dilaporkan meningkat ke Taiwan dan Malaysia.** Analisis: peluang tambahan bagi hasil panen berkualitas premium. Rekomendasi: jaga standar kualitas grading dan jajaki akses ke eksportir/pengepul mitra ekspor. Risiko: standar kualitas ekspor lebih ketat dibanding pasar domestik umum. Hasil yang diharapkan: margin tambahan dari segmen ekspor bagi hasil panen kualitas terbaik.

---

# FAQ

1. **Apa itu permintaan pasar bawang merah?** Jumlah bawang merah yang ingin dan mampu dibeli konsumen pada berbagai tingkat harga dan waktu tertentu.
2. **Kapan permintaan bawang merah paling tinggi?** Umumnya menjelang dan selama Ramadan-Idul Fitri, disusul periode Natal-Tahun Baru.
3. **Berapa rata-rata konsumsi bawang merah orang Indonesia per tahun?** Menurut Bapanas, sekitar 2,86 kilogram per kapita per tahun pada 2023.
4. **Apakah konsumsi bawang merah nasional naik atau turun dari tahun ke tahun?** Berfluktuasi; pada 2023 tercatat turun 5,3 persen dibanding 2022, namun secara historis jangka panjang cenderung meningkat perlahan sejalan pertumbuhan penduduk.
5. **Berapa total kebutuhan bawang merah rumah tangga nasional per tahun?** Sekitar 797,3 ribu ton pada 2023 menurut data yang tersedia.
6. **Mengapa harga bawang merah melonjak tajam menjelang Lebaran?** Karena permintaan rumah tangga meningkat signifikan untuk kebutuhan masakan hari raya, sementara pasokan tidak selalu meningkat pada laju yang sama.
7. **Apakah permintaan bawang merah bisa turun jika harga terlalu mahal?** Ya, pada level harga sangat tinggi sebagian konsumen mengurangi jumlah pembelian atau beralih sementara ke substitusi seperti bawang bombay.
8. **Apakah industri olahan bawang goreng memengaruhi harga pasar?** Ya, permintaan industri menambah permintaan agregat, meski umumnya berbasis kontrak volume yang lebih stabil dibanding pasar spot.
9. **Apakah Indonesia mengekspor bawang merah?** Ya, meski dengan volume relatif kecil dibanding konsumsi domestik, dengan negara tujuan seperti Taiwan dan Malaysia.
10. **Bagaimana cara petani menyesuaikan waktu tanam dengan permintaan Lebaran?** Menghitung mundur sekitar 55-70 hari (umur panen) dari perkiraan tanggal Idul Fitri sesuai kalender Hijriah tahun berjalan.
11. **Apakah permintaan bawang merah sama di setiap provinsi?** Tidak, terdapat variasi konsumsi antarprovinsi; sebagai contoh historis, konsumsi terendah pernah tercatat di Nusa Tenggara Timur.
12. **Apakah data permintaan Kabupaten Nganjuk secara spesifik tersedia?** Belum tersedia lengkap dalam dokumen ini; data yang tersedia sebagian besar bersifat nasional dan digunakan sebagai proksi.
13. **Apa yang terjadi pada permintaan setelah Idul Fitri?** Permintaan menurun cukup cepat kembali ke level normal, sering diikuti koreksi harga.
14. **Apakah permintaan bibit sama dengan permintaan konsumsi?** Tidak, permintaan bibit memiliki pola musiman berbeda, meningkat menjelang musim tanam baru (~Juni), bukan mengikuti kalender HBKN.
15. **Bagaimana cara memverifikasi kabar kelangkaan bawang merah?** Rujuk sumber resmi seperti Bapanas, Dinas Pertanian Kabupaten Nganjuk, atau Panel Harga Pangan, bukan hanya rumor pasar.

---

# AI Context

## Summary for AI

Dokumen ini adalah basis pengetahuan mengenai permintaan pasar (demand) bawang merah yang relevan bagi Kabupaten Nganjuk sebagai sentra produksi bawang merah terbesar di Jawa Timur. Sistem AI SIMANTRI harus memahami bahwa harga bawang merah terbentuk dari interaksi dua sisi: pasokan (dibahas rinci di `harga-bawang-merah.md` dan `panen-raya.md`) dan permintaan (dibahas dalam dokumen ini). Permintaan bawang merah bersifat relatif inelastis dalam jangka pendek karena statusnya sebagai bumbu dasar masakan Indonesia, namun menunjukkan sensitivitas signifikan pada level harga ekstrem.

Data konsumsi nasional menjadi rujukan utama dalam dokumen ini: rata-rata konsumsi 2,86 kilogram per kapita per tahun (Bapanas, 2023), setara 0,549 ons per kapita per minggu (BPS, 2023), dengan total kebutuhan rumah tangga nasional 797,3 ribu ton per tahun. Konsumsi ini berfluktuasi antar tahun, dengan variasi historis antara 2,06 hingga 3,01 kilogram per kapita per tahun dalam rentang 2002-2023. Data ini bersifat agregat nasional dan digunakan sebagai proksi untuk kondisi Nganjuk karena data lokal spesifik belum tersedia lengkap.

Pendorong permintaan paling signifikan adalah Hari Besar Keagamaan Nasional (HBKN), terutama Ramadan dan Idul Fitri, yang secara historis memicu lonjakan harga tajam — data nasional pernah menunjukkan kenaikan harga eceran 55,8 persen dalam sebulan (April 2024) akibat lonjakan permintaan musiman. Permintaan Natal-Tahun Baru juga meningkat namun relatif lebih moderat. Sumber permintaan lain meliputi restoran/katering, industri pengolahan makanan (bawang goreng, bumbu instan), pedagang antar-daerah ke Kediri, Jombang, Madiun, Magetan, dan Bojonegoro, segmen ekspor (meski relatif kecil, dengan tujuan seperti Taiwan dan Malaysia), serta segmen bibit yang memiliki pola musiman berbeda (meningkat menjelang musim tanam ~Juni, bukan mengikuti kalender HBKN).

Karena kalender Hijriah bergeser setiap tahun Masehi, sistem AI harus selalu memverifikasi tanggal spesifik Ramadan-Idul Fitri tahun berjalan saat memberikan rekomendasi waktu tanam atau waktu jual terkait momentum HBKN, bukan mengasumsikan bulan yang sama setiap tahun.

Untuk mendukung Decision Support System, dokumen ini menyediakan 15 aturan keputusan (decision rules) yang menghubungkan kondisi kalender permintaan (mendekati/selama/pasca HBKN, musim tanam bibit, ketersediaan kontrak industri) dengan rekomendasi tindakan bagi petani, serta 7 skenario praktis yang mencakup kondisi nyata seperti target menjual saat Idul Fitri, panen jatuh setelah HBKN, tawaran kontrak industri, dan verifikasi rumor kelangkaan.

Dokumen ini secara eksplisit mengakui keterbatasan data: tidak tersedia data permintaan harian/mingguan spesifik untuk Pasar Sukomoro atau Kabupaten Nganjuk; seluruh angka konsumsi yang dicantumkan bersumber dari data agregat nasional BPS dan Bapanas. Untuk kebutuhan model prediksi permintaan yang presisi tinggi di tingkat lokal, sistem AI disarankan mengintegrasikan data Susenas BPS tingkat provinsi/kabupaten serta observasi transaksi langsung di Pasar Sukomoro, alih-alih hanya mengandalkan data nasional sebagai proksi tunggal.

Ketika menjawab pertanyaan pengguna terkait permintaan, sistem AI harus: (1) membedakan secara jelas antara data nasional (yang tersedia) dan data lokal Nganjuk (yang terbatas), menyatakan proksi secara eksplisit; (2) selalu mengaitkan rekomendasi dengan posisi kalender Hijriah tahun berjalan untuk isu terkait HBKN; (3) membedakan segmen permintaan (rumah tangga, industri, ekspor, bibit) karena masing-masing memiliki pola musiman berbeda; dan (4) memberikan rekomendasi actionable yang jelas disertai tingkat keyakinan (confidence) dan alasan singkat berbasis pola yang telah didokumentasikan.

## Decision Keywords

Demand, Permintaan, Price, Harga, Market, Pasar, Supply, Pasokan, Konsumsi, Ramadan, Idul Fitri, Lebaran, Nataru, HBKN, Industri Olahan, Ekspor, Bibit, Musim Tanam, Fase Raya, Labuhan, Bulan (Januari-Desember), Konsumen, Rumah Tangga, Restoran, Katering.

## AI Recommendation Logic

**Rekomendasi strategi jual berbasis permintaan:** Sistem AI harus mengevaluasi posisi kalender Hijriah tahun berjalan relatif terhadap bulan berjalan untuk menentukan apakah sedang mendekati, berada di dalam, atau berada setelah periode puncak permintaan (Ramadan-Idul Fitri). Jika mendekati puncak permintaan dengan stok tersedia, sistem merekomendasikan penjualan bertahap untuk menangkap tren naik. Jika sudah melewati puncak, sistem merekomendasikan mempercepat penjualan sisa stok atau mengalihkannya ke segmen non-HBKN (industri, bibit).

**Rekomendasi diversifikasi segmen permintaan:** Sistem AI mengevaluasi ketersediaan kontrak industri, peluang ekspor (berdasarkan kualitas hasil panen), dan permintaan bibit musiman untuk merekomendasikan alokasi hasil panen ke berbagai segmen permintaan, mengurangi ketergantungan pada satu momentum penjualan tunggal.

**Estimasi peluang permintaan:** Sistem AI mengombinasikan data konsumsi nasional (sebagai baseline proksi), indikator kalender HBKN, dan sinyal harga aktual (jika tersedia dari Pasar Sukomoro atau sumber resmi) untuk mengestimasi peluang permintaan pada periode mendatang. Estimasi ini harus selalu disertai penanda tingkat keyakinan dan keterbatasan data yang eksplisit, terutama karena data lokal Nganjuk yang spesifik belum tersedia lengkap.

Dalam seluruh proses rekomendasi terkait permintaan, sistem AI wajib menyatakan secara eksplisit bila menggunakan data nasional sebagai proksi untuk kondisi lokal, sesuai prinsip tidak mengarang data yang dianut SIMANTRI.

---

# Knowledge Graph

```
Mendekati Ramadan-Idul Fitri
   ↓
Permintaan Rumah Tangga & Katering Naik Tajam
   ↓
Jika Pasokan Tidak Meningkat Sepadan
   ↓
Harga Melonjak Tajam (contoh: +55,8% dalam sebulan, data nasional)
   ↓
Peluang Pendapatan Tinggi Bagi Petani Bersisa Stok

Pasca Idul Fitri
   ↓
Permintaan Turun Cepat ke Level Normal
   ↓
Harga Terkoreksi Turun
   ↓
Petani Perlu Percepat Penjualan Sisa Stok atau Alihkan ke Bibit/Industri

Pertumbuhan Penduduk
   ↓
Kebutuhan Konsumsi Nasional Meningkat Struktural
   ↓
Permintaan Total Bawang Merah Cenderung Naik Jangka Panjang
   ↓
Tekanan Terhadap Keseimbangan Pasokan Musiman

Kontrak Volume dengan Industri Olahan
   ↓
Permintaan Stabil Sepanjang Tahun
   ↓
Pendapatan Petani Lebih Terprediksi
   ↓
Risiko Fluktuasi Harga Spot Musiman Terdiversifikasi

Permintaan Ekspor Meningkat
   ↓
Penyerapan Sebagian Produksi Nasional
   ↓
Tekanan Oversupply Domestik Berkurang
   ↓
Harga Domestik Lebih Stabil/Naik
```

---

# Rule Engine

1. IF Demand Naik (HBKN) MAKA Price Cenderung Naik.
2. IF Demand Turun (Pasca HBKN) MAKA Price Cenderung Turun.
3. IF Demand Naik DAN Supply Tetap/Turun MAKA Price Naik Tajam.
4. IF Demand Naik DAN Supply Juga Naik (panen raya bertepatan Nataru) MAKA Price Relatif Stabil.
5. IF Bulan Mendekati Ramadan MAKA Demand Mulai Naik.
6. IF Bulan = Idul Fitri MAKA Demand Berada di Puncak.
7. IF Bulan = Pasca Idul Fitri MAKA Demand Turun Cepat.
8. IF Bulan Mendekati Nataru MAKA Demand Naik Moderat.
9. IF Musim Tanam Baru Dimulai (~Juni) MAKA Demand Bibit Naik.
10. IF Demand Bibit Naik MAKA Harga Bibit Naik Melebihi Harga Konsumsi.
11. IF Kontrak Industri Olahan Tersedia MAKA Sebagian Demand Terpenuhi Melalui Jalur Kontrak, Bukan Pasar Spot.
12. IF Demand Ekspor Meningkat MAKA Sebagian Supply Domestik Terserap Pasar Luar Negeri.
13. IF Supply Domestik Terserap Ekspor MAKA Harga Domestik Berpotensi Naik/Stabil.
14. IF Harga Sangat Tinggi (ekstrem) MAKA Sebagian Demand Rumah Tangga Berkurang (substitusi/pengurangan porsi).
15. IF Data Permintaan Lokal Tidak Tersedia MAKA Sistem Menggunakan Data Nasional Sebagai Proksi Dengan Penanda Eksplisit.
16. IF Kalender Hijriah Bergeser Lebih Awal Dibanding Tahun Sebelumnya MAKA Jadwal Tanam Perlu Disesuaikan Lebih Awal.
17. IF Restoran/Katering Meningkatkan Permintaan (musim liburan) MAKA Peluang Penjualan Volume Kecil-Menengah dengan Harga Baik Terbuka.
18. IF Terjadi Rumor Kelangkaan Tanpa Verifikasi MAKA Sistem AI Tidak Menjadikannya Dasar Rekomendasi Utama.
19. IF Pertumbuhan Penduduk Terus Berlanjut MAKA Tren Permintaan Jangka Panjang Cenderung Naik Secara Struktural.
20. IF Terdapat Diversifikasi Segmen Permintaan (industri, ekspor, bibit, spot) MAKA Risiko Pendapatan Petani Terhadap Fluktuasi Permintaan Tunggal Berkurang.

---

# Search Intent Coverage

Permintaan bawang merah hari ini; Permintaan pasar bawang merah Nganjuk; Konsumsi bawang merah Indonesia; Konsumsi bawang merah per kapita; Berapa kg bawang merah dikonsumsi per tahun; Data konsumsi bawang merah BPS; Data konsumsi bawang merah Bapanas; Permintaan bawang merah menjelang Ramadan; Permintaan bawang merah Idul Fitri; Permintaan bawang merah Lebaran; Permintaan bawang merah Natal Tahun Baru; Permintaan bawang merah Nataru; Kenapa permintaan bawang merah naik saat Lebaran; Kenapa harga bawang merah naik menjelang puasa; Dampak permintaan terhadap harga bawang merah; Elastisitas permintaan bawang merah; Permintaan rumah tangga bawang merah; Permintaan restoran bawang merah; Permintaan industri bawang merah; Permintaan bawang goreng; Kontrak industri bawang merah; Permintaan ekspor bawang merah; Negara tujuan ekspor bawang merah; Permintaan bibit bawang merah; Kapan permintaan bibit bawang merah naik; Permintaan bawang merah antar daerah; Permintaan bawang merah Kediri; Permintaan bawang merah Jombang; Permintaan bawang merah Madiun; Permintaan bawang merah Magetan; Permintaan bawang merah Bojonegoro; Permintaan bawang merah Jawa Timur; Permintaan bawang merah nasional; Variasi konsumsi bawang merah antar provinsi; Konsumsi bawang merah tertinggi provinsi mana; Konsumsi bawang merah terendah provinsi mana; Total kebutuhan bawang merah nasional per tahun; Prediksi permintaan bawang merah; Model prediksi permintaan bawang merah; Strategi jual saat permintaan tinggi; Strategi jual saat permintaan rendah; Kapan sebaiknya panen untuk permintaan Lebaran; Cara menyesuaikan jadwal tanam dengan Ramadan; Perhitungan mundur waktu tanam Idul Fitri; Apakah permintaan bawang merah turun setelah Lebaran; Harga bawang merah pasca Lebaran; Substitusi bawang merah saat harga mahal; Bawang bombay pengganti bawang merah; Permintaan pasar induk Sukomoro; Data permintaan Pasar Sukomoro; Sumber permintaan bawang merah; Segmen pasar bawang merah; Diversifikasi permintaan bawang merah; Cara membaca sinyal permintaan pasar; Update permintaan bawang merah terbaru; Berita permintaan bawang merah.

---

# Machine Learning Features

```yaml
features:
  temporal:
    - month
    - week_of_year
    - days_to_ramadan
    - days_to_idul_fitri
    - is_ramadan_window
    - is_idul_fitri_window
    - is_nataru_window
    - hijri_calendar_shift_days  # pergeseran kalender Hijriah tahun berjalan vs tahun sebelumnya
  demand_side:
    - demand_index_household
    - demand_index_foodservice
    - demand_index_industrial
    - demand_index_export
    - demand_index_seed
    - national_consumption_per_capita_kg
    - national_household_demand_ton
    - population_growth_rate
  supply_side:
    - supply_volume_kg  # lihat harga-bawang-merah.md untuk detail lengkap
    - harvest_area_ha
    - variety
  price:
    - market_price_farmgate
    - market_price_retail_national  # acuan proksi nasional
    - price_change_mom_percent
  contract:
    - has_industrial_contract_flag
    - contract_volume_kg
    - contract_price
  location:
    - kabupaten
    - province
  target:
    - demand_index_next_period  # target prediksi permintaan periode berikutnya
```

---

# Related Documents

- harga-bawang-merah.md
- panen-raya.md
- supply-demand-bawang-merah.md
- hari-besar-nasional.md
- distribusi-bawang-merah.md
- pasar-induk-sukomoro.md
- ekspor-impor-bawang-merah.md
- cold-storage-bawang-merah.md
- fase-raya.md
- fase-labuhan-1.md
- fase-labuhan-2.md
- fase-labuhan-3.md
- varietas-bauji.md
- varietas-tajuk.md

**Catatan:** Sebagian dokumen di atas merupakan referensi silang yang direncanakan sebagai bagian dari basis pengetahuan SIMANTRI secara keseluruhan dan mungkin belum tersedia pada saat dokumen ini disusun; RAG pipeline sebaiknya memvalidasi ketersediaan file sebelum retrieval lintas dokumen.

---

# References

- Badan Pangan Nasional (Bapanas) — data konsumsi bawang merah per kapita nasional 2023, dikutip melalui Databoks/Katadata.
- Badan Pusat Statistik (BPS) — "Rata-Rata Konsumsi per Kapita Seminggu Beberapa Macam Bahan Makanan Penting" dan data Susenas 2002-2022 terkait konsumsi bawang merah.
- Dataindonesia.id — "Data Konsumsi Bawang Merah per Kapita Seminggu di Indonesia hingga 2023".
- Kompas.id — "Komoditas Bawang Merah: Sejarah, Manfaat, Sentra Produksi, Ekspor-Impor, dan Perkembangan Harga".
- Satu Data Pertanian, Kementerian Pertanian RI — "Outlook Bawang Merah 2023", mencakup data konsumsi per kapita dan ekspor-impor.
- RM.id — "Sentra Bawang Merah Jawa Timur Panen, Pasokan Nasional Terkendali" (28 April 2026), mencakup data Early Warning System Bawang Merah Nasional.
- Agronews.id / Pilar Pertanian — "Nganjuk Panen Raya, Pemerintah Yakin Stok dan Harga Bawang Merah Stabil Hingga Lebaran 2026".
- Jurnal Agri-SosioEkonomi Unsrat — "Analisis Faktor-Faktor yang Mempengaruhi Permintaan Bawang Merah di Pasar Inpres Matawai".
- Media Neliti — "Pengaruh Tingkat Produksi, Harga, dan Konsumsi terhadap Impor Bawang Merah di Indonesia".

**Catatan keterbatasan referensi:** Dokumen ini belum menyertakan data permintaan harian/mingguan spesifik Kabupaten Nganjuk atau transaksi langsung Pasar Sukomoro karena keterbatasan akses data pada saat penyusunan; data konsumsi yang digunakan bersifat agregat nasional dari BPS dan Bapanas sebagai proksi. Dokumen ini tidak mengarang angka permintaan lokal yang tidak didukung sumber yang tercantum di atas.
