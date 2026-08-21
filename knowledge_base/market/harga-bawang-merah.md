---
doc_id: "simantri-harga-bawang-merah-001"
title: "Harga Bawang Merah Kabupaten Nganjuk: Analisis Pasar, Pola Musiman, dan Sistem Pendukung Keputusan"
category: "Market Intelligence"
subcategory: "Harga Komoditas"
topic: "Harga Bawang Merah (Shallot Price)"
summary: >
  Dokumen ini menjelaskan struktur, pola, dan pendorong harga bawang merah (bawang brambang)
  di Kabupaten Nganjuk, Jawa Timur, sebagai sentra produksi bawang merah terbesar di Jawa Timur
  sekaligus barometer pasokan nasional. Dokumen mencakup analisis penawaran-permintaan, kalender
  musiman, hubungan dengan fase tanam lokal (Fase Raya dan Labuhan), varietas unggulan (Bauji,
  Tajuk, Manjung), strategi panen-simpan-jual, aturan keputusan (decision rules), skenario petani,
  serta struktur data untuk model machine learning dan sistem RAG.
keywords:
  - harga bawang merah
  - bawang merah Nganjuk
  - harga brambang
  - pasar bawang merah
  - fluktuasi harga bawang
  - panen raya bawang merah
  - Pasar Sukomoro
  - HAP bawang merah
semantic_keywords:
  - dinamika harga komoditas hortikultura
  - volatilitas harga pertanian
  - siklus penawaran permintaan bawang merah
  - harga acuan pembelian pemerintah
  - stabilisasi harga pangan strategis
synonyms:
  - "brambang"
  - "bawang abang"
  - "shallot price"
  - "onion price (red shallot)"
entity_type: "Market_Topic"
location:
  primary: "Kabupaten Nganjuk, Jawa Timur, Indonesia"
  sentra_kecamatan: ["Sukomoro", "Rejoso", "Gondang", "Bagor", "Wilangan", "Berbek"]
  related_region: ["Kediri", "Jombang", "Madiun", "Magetan", "Bojonegoro", "Probolinggo", "Malang", "Sampang"]
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
related_varieties: ["Bauji", "Tajuk", "Manjung", "Bima Brebes (pembanding luar daerah)"]
related_planting_seasons: ["Fase Raya", "Labuhan 1", "Labuhan 2", "Labuhan 3"]
related_weather: ["curah hujan", "kemarau", "kelembapan tinggi", "suhu udara", "anomali cuaca La Nina/El Nino"]
related_documents:
  - "fase-raya.md"
  - "fase-labuhan-1.md"
  - "fase-labuhan-2.md"
  - "fase-labuhan-3.md"
  - "varietas-bauji.md"
  - "varietas-tajuk.md"
  - "curah-hujan.md"
  - "post-harvest.md"
  - "pasar-induk-sukomoro.md"
  - "distribusi-bawang-merah.md"
  - "ekspor-impor-bawang-merah.md"
  - "cold-storage-bawang-merah.md"
market_type: "Pasar komoditas hortikultura semi-terbuka dengan mekanisme harga dinamis (spot market, dipengaruhi HAP pemerintah)"
language: "id-ID"
evidence_level: "Campuran: data kualitatif terverifikasi dari sumber berita dan instansi resmi (tingkat tinggi); data time-series harga harian/bulanan lengkap belum tersedia dalam dokumen ini (tingkat rendah, ditandai eksplisit)"
review_status: "draft-reviewed"
created_at: "2026-07-14"
last_updated: "2026-07-14"
---

# Executive Summary

Harga bawang merah (brambang) merupakan salah satu indikator ekonomi pertanian paling penting di Kabupaten Nganjuk, Jawa Timur. Nganjuk dikenal sebagai sentra produksi bawang merah terbesar di Jawa Timur sekaligus salah satu barometer pasokan bawang merah nasional, bersama Probolinggo, Malang, Sampang, dan Bojonegoro yang bersama-sama menyumbang sekitar 75 persen produksi bawang merah Jawa Timur. Karena posisi strategis ini, pergerakan harga di Pasar Sukomoro dan sentra-sentra produksi di Nganjuk memiliki dampak yang jauh melampaui batas kabupaten, memengaruhi harga di Kediri, Jombang, Madiun, Magetan, Bojonegoro, hingga pasar-pasar besar di Jawa Timur dan nasional.

Topik harga bawang merah penting dipahami karena bawang merah adalah komoditas hortikultura dengan karakteristik harga yang sangat fluktuatif dibandingkan komoditas pangan pokok lain seperti beras. Fluktuasi ini terjadi dalam hitungan hari, minggu, maupun musim, dipengaruhi oleh faktor penawaran (luas tanam, cuaca, serangan hama-penyakit, waktu panen) dan faktor permintaan (hari besar keagamaan nasional, kebutuhan rumah tangga, kebutuhan industri olahan, serta permintaan ekspor). Sebagai contoh nyata, pada awal Maret 2026 harga bawang merah di tingkat petani Nganjuk sempat naik dari Rp 20.000 menjadi Rp 23.000 per kilogram karena permintaan meningkat dan cuaca memengaruhi produksi, namun hanya beberapa hari kemudian harga justru turun ke kisaran Rp 16.000-17.000 per kilogram di tingkat petani karena pasokan panen melimpah, mendorong sebagian petani menahan hasil panen untuk dijadikan bibit yang harganya lebih tinggi (Rp 57.000-60.000 per kilogram).

Bagi petani, pemahaman terhadap pola harga bukan sekadar informasi pasif, melainkan dasar pengambilan keputusan produksi dan penjualan yang menentukan keberlanjutan usaha tani. Keputusan kapan menanam, kapan memanen, apakah menjual segera atau menyimpan, serta apakah mengalihkan hasil panen menjadi bibit, semuanya bergantung pada pembacaan yang tepat terhadap tren harga dan faktor-faktor pendorongnya.

Harga bawang merah di Nganjuk juga sangat terkait dengan kalender fase tanam lokal, yaitu Fase Raya dan tiga periode Labuhan (Labuhan 1, Labuhan 2, Labuhan 3), yang menjadi acuan waktu tanam-panen di kalangan petani setempat. Musim tanam utama umumnya dimulai sekitar bulan Juni, dengan panen raya besar sering terjadi menjelang akhir tahun hingga awal tahun berikutnya, bertepatan dengan periode Natal, Tahun Baru, dan menjelang bulan puasa-Lebaran.

Pemerintah, melalui Kementerian Pertanian dan Badan Pangan Nasional (Bapanas), menetapkan Harga Acuan Pembelian (HAP) di tingkat petani sebagai instrumen stabilisasi. Sebagai gambaran, HAP bawang merah rogol kering panen di tingkat petani pernah dipatok pada kisaran Rp 25.000-30.000 per kilogram, sementara harga aktual di lapangan dapat berada di bawah maupun mendekati level tersebut tergantung kondisi pasokan.

Dari sisi struktur pasar, harga bawang merah terbentuk melalui rantai yang melibatkan petani, pengepul/tengkulak desa, pedagang pasar induk (seperti Pasar Sukomoro), pedagang antar-daerah, pedagang grosir kota besar, hingga pengecer dan konsumen akhir. Setiap simpul dalam rantai ini mengambil margin, sehingga harga di tingkat petani selalu lebih rendah dibandingkan harga di tingkat konsumen akhir.

Volatilitas harga bawang merah juga berakar pada karakteristik biologis tanaman: umur tanam sekitar 55-70 hari, sifat umbi yang mudah rusak jika disimpan tanpa penanganan tepat, serta ketergantungan tinggi pada cuaca (curah hujan berlebih memicu penyakit umbi dan busuk pangkal, sementara kekeringan menekan produktivitas).

Bagi Sistem Pendukung Keputusan (DSS) dan model prediksi harga berbasis AI, pemahaman menyeluruh terhadap topik ini menjadi fondasi untuk membangun rekomendasi yang akurat mengenai waktu jual, waktu simpan, potensi risiko oversupply, serta peluang menangkap harga puncak menjelang hari besar keagamaan nasional.

Penting dicatat bahwa dokumen ini tidak memiliki akses terhadap data historis harga harian/bulanan yang lengkap dan terverifikasi dalam rentang waktu panjang (misalnya deret waktu 5-10 tahun dari PIHPS Nasional atau Bapanas). Sumber data yang tersedia dalam penyusunan dokumen ini bersifat titik-waktu (snapshot) dari pemberitaan media resmi dan publikasi instansi pemerintah. Oleh karena itu, seluruh angka historis yang dicantumkan diberi konteks tanggal secara eksplisit, dan model prediksi harga di masa depan disarankan mengintegrasikan sumber data time-series resmi seperti SISKAPERBAPO Jawa Timur, PIHPS Nasional, dan Panel Harga Bapanas untuk akurasi lebih tinggi.

Bagi petani awam, memahami harga bawang merah berarti memahami "napas" dari usaha tani mereka. Harga yang baik pada saat panen dapat memberikan keuntungan besar dalam waktu singkat, namun harga yang anjlok pada waktu yang sama dapat menyebabkan kerugian signifikan meskipun hasil panen melimpah secara fisik. Karena itu, dokumen ini disusun untuk menjadi rujukan pengetahuan yang membantu petani, penyuluh, dan sistem AI dalam membaca sinyal pasar secara lebih sistematis dan berbasis data.

Secara ringkas, dokumen ini membahas struktur pasar, sumber pasokan dan permintaan, karakteristik dan pendorong harga, kalender musiman bulanan, keterkaitan dengan fase tanam dan varietas lokal, dampak hama-penyakit-cuaca, strategi panen dan penyimpanan, analisis risiko dan peluang, analisis ekonomi usaha tani, serta aturan keputusan dan skenario praktis yang dapat langsung digunakan oleh petani maupun sistem AI SIMANTRI.

---

# Quick Facts

| Aspek | Keterangan |
|---|---|
| Topik | Harga Bawang Merah (Shallot Price) |
| Jenis Pasar | Pasar komoditas hortikultura, spot market, dipengaruhi HAP pemerintah |
| Pasokan (Supply) | Sangat dipengaruhi musim tanam (Fase Raya, Labuhan 1-3), cuaca, dan luas tanam |
| Permintaan (Demand) | Stabil sepanjang tahun dari rumah tangga, naik tajam menjelang Ramadan, Idul Fitri, Nataru |
| Tren Harga | Fluktuatif jangka pendek (harian-mingguan), pola musiman jangka menengah |
| Musiman (Seasonality) | Harga cenderung turun saat panen raya (umumnya Desember-Maret), naik saat masa tanam/paceklik |
| Risiko Utama | Oversupply saat panen bersamaan, gagal panen akibat hujan ekstrem, serangan hama-penyakit umbi |
| Peluang Utama | Harga tinggi menjelang Ramadan-Idul Fitri, harga bibit yang jauh lebih tinggi dari harga konsumsi |

---

# Definition

Harga bawang merah adalah nilai tukar (dalam Rupiah per kilogram) dari komoditas umbi bawang merah (Allium cepa var. aggregatum atau Allium ascalonicum) yang terbentuk melalui interaksi penawaran dan permintaan pada tingkat pelaku pasar tertentu, yaitu tingkat petani (harga produsen), tingkat pedagang pasar induk/kolektor, dan tingkat konsumen (harga eceran).

Tujuan pemahaman harga bawang merah adalah memberi petani dan pelaku rantai pasok informasi yang cukup untuk mengambil keputusan optimal tentang waktu tanam, waktu panen, waktu jual, serta keputusan menyimpan hasil sebagai bibit atau konsumsi.

Secara ekonomi, bawang merah adalah salah satu dari sembilan bahan pangan strategis yang dipantau ketat oleh pemerintah Indonesia melalui Bapanas dan Kementerian Pertanian karena kontribusinya terhadap inflasi bahan pangan bergejolak (volatile food). Nganjuk, sebagai salah satu sentra produksi terbesar, memiliki peran signifikan terhadap stabilitas harga bawang merah di tingkat regional Jawa Timur maupun nasional.

---

# Market Structure

- **Petani (Farmer):** Produsen utama, umumnya lahan skala kecil-menengah (rata-rata beberapa ribu meter persegi hingga 1-2 hektar per rumah tangga tani), menjual hasil panen dalam bentuk rogol kering panen (umbi kering dengan daun dipotong) kepada pengepul atau langsung ke pasar.
- **Pengepul/Tengkulak Desa (Village Collector):** Membeli langsung dari petani di lahan atau rumah, menyortir kualitas, mengumpulkan volume untuk dijual ke pasar induk.
- **Pedagang Pasar Induk (Wholesale Market Trader):** Beroperasi di sentra seperti Pasar Sukomoro, menjadi titik temu harga antara wilayah produksi dan wilayah konsumsi, sering menjadi acuan harga regional.
- **Pedagang Antar-Daerah (Interregional Trader):** Mendistribusikan bawang merah dari Nganjuk ke Kediri, Jombang, Madiun, Magetan, Bojonegoro, Surabaya, dan luar Jawa Timur.
- **Pedagang Grosir Kota (Urban Wholesaler):** Menyalurkan ke pasar tradisional dan modern di kota-kota besar.
- **Pengecer (Retailer):** Menjual langsung ke konsumen akhir di pasar tradisional, warung, dan pasar modern.
- **Konsumen (Consumer):** Rumah tangga, rumah makan, industri pengolahan makanan (bumbu instan, keripik bawang), dan katering.
- **Eksportir/Importir (Exporter/Importer):** Berperan pada level nasional, memengaruhi keseimbangan pasokan domestik saat terjadi surplus (potensi ekspor) atau defisit (kebutuhan impor, jarang terjadi untuk bawang merah dibanding bawang putih).

Rantai distribusi ini menyebabkan disparitas harga yang signifikan: harga di tingkat petani biasanya 20-40 persen lebih rendah dibanding harga di tingkat konsumen akhir, tergantung panjang rantai dan biaya transportasi.

---

# Supply Analysis

**Sumber pasokan utama** berasal dari kecamatan sentra di Kabupaten Nganjuk, terutama Sukomoro, Rejoso, Gondang, Bagor, Wilangan, dan Berbek. Berdasarkan data ASEM BPS tahun 2022, produksi bawang merah Nganjuk mencapai 193.988 ton dengan luas panen 17.345 hektar, menjadikannya kontributor utama dari total produksi Jawa Timur sebesar 478.393 ton pada luas panen 51.607 hektar. Data lain menunjukkan luas tanam Nganjuk sempat tercatat lebih dari 19.500 hektar pada November periode tertentu, dengan tren peningkatan dibanding tahun sebelumnya.

**Wilayah produksi pendukung** di Jawa Timur meliputi Probolinggo, Malang, Sampang, dan Bojonegoro, yang bersama Nganjuk menyumbang sekitar 75 persen produksi bawang merah provinsi. Di luar Jawa Timur, Brebes (Jawa Tengah) tetap menjadi sentra produksi nasional terbesar, sehingga kondisi pasokan Brebes turut memengaruhi harga acuan nasional yang berdampak pada harga di Nganjuk.

**Musim tanam (seasonality of supply)** di Nganjuk umumnya dimulai sekitar bulan Juni untuk sebagian wilayah, dengan pola tanam bergilir antar wilayah timur (Gondang, Sukomoro) dan barat (Bagor, Wilangan, Rejoso) sehingga panen tidak selalu terjadi serentak di seluruh kabupaten. Pola pergiliran ini disebut dalam kalender lokal sebagai Fase Raya dan Labuhan 1-3.

**Faktor yang memengaruhi pasokan:**
1. Curah hujan — hujan berlebih saat pembentukan umbi menurunkan kualitas dan memicu penyakit busuk umbi.
2. Ketersediaan air irigasi saat kemarau — kekurangan air menekan produktivitas.
3. Luas tanam aktual musim berjalan, dipengaruhi harga bibit dan ekspektasi harga jual.
4. Serangan hama (ulat bawang/Spodoptera exigua) dan penyakit (antraknosa, layu fusarium, busuk umbi).
5. Ketersediaan tenaga kerja panen.
6. Kebijakan harga bibit — saat harga bibit tinggi, sebagian petani menahan hasil panen sehingga pasokan konsumsi berkurang sementara.

---

# Demand Analysis

- **Permintaan Rumah Tangga (Household Demand):** Konsumsi harian relatif stabil sebagai bumbu dasar masakan Indonesia, namun volume per kapita dapat meningkat saat musim hajatan dan liburan.
- **Permintaan Rumah Makan/Restoran (Foodservice Demand):** Cenderung stabil dengan sedikit kenaikan pada musim liburan dan akhir pekan panjang.
- **Permintaan Industri (Industrial Demand):** Industri bumbu instan, bawang goreng, dan produk olahan menyerap volume signifikan secara kontinu, cenderung kurang sensitif terhadap fluktuasi harga jangka pendek dibanding rumah tangga.
- **Permintaan Hari Besar Keagamaan Nasional (HBKN Demand):** Lonjakan permintaan paling signifikan terjadi menjelang Ramadan dan Idul Fitri, serta periode Natal dan Tahun Baru (Nataru), karena peningkatan konsumsi rumah tangga dan katering massal.
- **Permintaan Antar-Wilayah:** Kediri, Jombang, Madiun, Magetan, dan Bojonegoro sebagian bergantung pasokan dari Nganjuk sehingga permintaan antar-daerah turut memengaruhi harga di tingkat pasar induk Sukomoro.
- **Permintaan Bibit (Seed Demand):** Permintaan bawang merah untuk dijadikan bibit tanam musim berikutnya menciptakan segmen pasar tersendiri dengan harga jauh lebih tinggi dari harga konsumsi, biasanya meningkat menjelang musim tanam (mendekati bulan Juni).

---

# Price Characteristics

**Fluktuasi harian:** Harga di tingkat petani dapat berubah dalam hitungan hari akibat perubahan volume pasokan yang masuk ke pasar induk. Contoh nyata: kenaikan dari Rp 20.000 menjadi Rp 23.000 per kilogram dalam tiga hari (awal Maret 2026) akibat permintaan meningkat dan cuaca memengaruhi produksi.

**Fluktuasi mingguan:** Pergerakan harga mingguan umumnya mengikuti volume panen yang masuk pasar; minggu dengan panen serentak dari beberapa kecamatan cenderung menekan harga turun tajam, seperti kasus penurunan harga di Pasar Sukomoro selama dua minggu berturut-turut yang dilaporkan pada awal Juni 2026.

**Fluktuasi bulanan:** Bulan-bulan panen raya (umumnya sekitar Desember-Maret, tergantung pola tanam tahun berjalan) cenderung menekan harga karena pasokan melimpah, sementara bulan-bulan menjelang masa tanam atau pasca-panen raya cenderung mengalami kenaikan harga karena pasokan menipis.

**Fluktuasi musiman:** Pola musiman berulang setiap tahun mengikuti siklus Fase Raya dan Labuhan, dengan puncak harga tinggi biasanya terjadi pada periode pasokan rendah menjelang Ramadan-Idul Fitri jika bertepatan dengan masa tanam, namun pemerintah dan champion petani biasanya berupaya menjaga stok aman menjelang HBKN melalui pengaturan pola tanam bergilir.

**Tren historis:** Berdasarkan pemberitaan yang tersedia, harga di tingkat petani pada tahun 2025-2026 bergerak dalam rentang luas, dari serendah Rp 16.000-17.000 per kilogram saat panen melimpah hingga Rp 22.000-25.000 per kilogram pada kondisi normal, dengan HAP pemerintah pada kisaran Rp 25.000-30.000 per kilogram sebagai acuan harga wajar di tingkat petani. **Keterbatasan data:** dokumen ini tidak memiliki akses ke deret data harga harian/bulanan lengkap dan tervalidasi selama beberapa tahun; untuk analisis time-series yang presisi, model prediksi harga disarankan mengambil data langsung dari SISKAPERBAPO Jawa Timur, PIHPS Nasional, dan Panel Harga Pangan Bapanas.

---

# Price Drivers

1. **Curah hujan/cuaca** — hujan berlebih memicu penyakit umbi dan gagal panen, menekan pasokan dan mendorong harga naik; kemarau panjang menekan produktivitas.
2. **Musim panen (harvest season)** — panen raya serentak menyebabkan oversupply dan harga turun.
3. **Musim tanam (planting season)** — awal masa tanam menyebabkan pasokan konsumsi menipis (banyak hasil ditahan untuk bibit) sehingga harga cenderung naik.
4. **Penawaran (supply)** — volume yang masuk ke pasar induk secara langsung berbanding terbalik dengan harga.
5. **Permintaan (demand)** — lonjakan permintaan HBKN mendorong harga naik meski pasokan normal.
6. **Biaya transportasi** — jarak distribusi ke Kediri, Jombang, Madiun, Magetan, Bojonegoro, dan kota besar memengaruhi disparitas harga antarwilayah.
7. **Kebijakan pemerintah (HAP, operasi pasar, champion petani)** — intervensi HAP dan operasi pasar menahan harga agar tidak terlalu rendah bagi petani atau terlalu tinggi bagi konsumen.
8. **Harga bahan bakar (fuel price)** — memengaruhi biaya distribusi dan biaya produksi (pompa irigasi, alat pertanian).
9. **Ekspor** — permintaan ekspor saat surplus nasional dapat menyerap kelebihan pasokan dan menopang harga petani.
10. **Impor** — jarang terjadi untuk bawang merah dibanding bawang putih, namun kebijakan impor komoditas substitusi dapat memengaruhi ekspektasi pasar.
11. **Harga bibit** — saat harga bibit tinggi, petani menahan hasil panen dari pasar konsumsi, mengurangi pasokan jual dan mendorong harga konsumsi naik.
12. **Serangan hama dan penyakit** — menurunkan kualitas dan volume panen, menekan pasokan berkualitas baik ke pasar.

---

# Seasonal Market Calendar

Catatan: pola bulanan berikut bersifat tendensi umum berdasarkan siklus tanam-panen yang lazim di Nganjuk (musim tanam utama mulai sekitar Juni, panen raya besar sekitar Desember-Maret) dan pemberitaan yang tersedia. Pola aktual dapat bergeser antar-tahun tergantung cuaca dan pola tanam bergilir antarkecamatan (Fase Raya, Labuhan 1-3).

- **Januari:** Supply umumnya tinggi (masa panen raya berlanjut dari Desember); Demand stabil-tinggi (pasca Nataru, menuju awal tahun); Price tendency cenderung tertekan/turun; Risiko oversupply; Peluang bagi pembeli/industri olahan untuk stok murah.
- **Februari:** Supply masih tinggi di sejumlah kecamatan; Demand stabil, mulai bersiap Ramadan (jika kalender Hijriah jatuh awal); Price tendency stabil-cenderung rendah; Risiko harga terus tertekan jika panen serentak; Peluang menahan sebagian hasil untuk bibit.
- **Maret:** Supply bervariasi, dapat terjadi kenaikan harga singkat akibat permintaan meningkat menjelang Ramadan (sesuai pola tahun 2026), namun juga dapat terjadi penurunan tajam jika panen serentak; Demand meningkat mendekati Ramadan; Price tendency fluktuatif tajam; Risiko tinggi karena dua arah kemungkinan; Peluang menangkap harga naik menjelang Ramadan.
- **April:** Supply mulai menipis di sejumlah wilayah pasca panen raya; Demand tinggi (Ramadan-Idul Fitri, tergantung kalender Hijriah tahun berjalan); Price tendency cenderung naik; Risiko pasokan tidak merata antarwilayah; Peluang harga puncak tahun bagi petani yang masih memiliki stok.
- **Mei:** Supply rendah-sedang (masa transisi menuju tanam baru); Demand kembali normal pasca Lebaran; Price tendency stabil-menurun dari puncak; Risiko penurunan harga cepat pasca HBKN; Peluang menjual sisa stok sebelum harga turun lebih jauh.
- **Juni:** Awal masa tanam utama di banyak wilayah Nganjuk; Supply konsumsi menipis karena hasil ditahan untuk bibit; Demand bibit tinggi; Price tendency harga bibit naik tajam, harga konsumsi cenderung stabil-naik; Risiko kelangkaan bibit berkualitas; Peluang penjualan bibit dengan margin tinggi.
- **Juli:** Fase pertumbuhan tanaman awal musim tanam Juni; Supply pasar mengandalkan sisa stok dan daerah lain; Demand stabil; Price tendency stabil-cenderung tinggi karena pasokan segar terbatas; Risiko serangan hama pada fase vegetatif; Peluang harga baik bagi yang masih punya stok simpanan.
- **Agustus:** Tanaman memasuki fase pembentukan umbi; Supply masih terbatas; Demand stabil; Price tendency stabil-tinggi; Risiko cuaca kemarau memengaruhi kebutuhan irigasi; Peluang persiapan strategi panen berikutnya.
- **September:** Mendekati panen sebagian wilayah tanam awal; Supply mulai bertambah bertahap; Demand stabil; Price tendency mulai melunak; Risiko harga mulai tertekan seiring panen mulai masuk; Peluang menjual di awal masa panen sebelum puncak pasokan.
- **Oktober:** Panen bertahap meluas ke beberapa kecamatan; Supply meningkat; Demand stabil; Price tendency menurun bertahap; Risiko oversupply mulai terasa; Peluang bagi industri olahan untuk kontrak volume besar dengan harga lebih rendah.
- **November:** Luas tanam dan panen meningkat signifikan (berdasarkan pemberitaan, luas tanam Nganjuk pernah tercatat lebih dari 19.500 hektar pada periode November); Supply tinggi; Demand stabil menuju Nataru; Price tendency stabil-cenderung turun; Risiko penumpukan pasokan; Peluang kontrak distribusi menjelang Nataru.
- **Desember:** Panen raya besar (sesuai laporan panen raya Nganjuk bulan Desember dari wilayah timur seperti Gondang dan Sukomoro); Supply sangat tinggi; Demand tinggi (Nataru); Price tendency HAP dan pasar berusaha dijaga stabil oleh pemerintah; Risiko oversupply meski demand tinggi karena volume panen sangat besar; Peluang stok cukup untuk menopang kebutuhan hingga Ramadan-Lebaran tahun berikutnya.

---

# Planting Season Relationship

Kalender tanam lokal Nganjuk terbagi dalam periode yang dikenal petani setempat sebagai **Fase Raya** dan tiga periode **Labuhan** (Labuhan 1, Labuhan 2, Labuhan 3). Pembagian fase ini mengatur pergiliran tanam antarwilayah (misalnya wilayah timur seperti Gondang dan Sukomoro dipanen lebih dahulu, disusul penanaman ulang di wilayah barat seperti Bagor, Wilangan, dan Rejoso) sehingga pasokan bawang merah ke pasar tidak seluruhnya jatuh pada satu titik waktu, melainkan tersebar mengikuti giliran panen antarkecamatan.

- **Fase Raya** berkaitan dengan periode tanam-panen utama dan biasanya menghasilkan volume produksi terbesar dalam satu siklus tahunan, berkontribusi besar terhadap kondisi panen raya yang menekan harga.
- **Labuhan 1, Labuhan 2, dan Labuhan 3** merupakan periode tanam susulan/bergilir yang membantu menjaga kesinambungan pasokan sepanjang tahun, termasuk menjelang periode permintaan tinggi seperti Ramadan dan Idul Fitri.

Pemahaman terhadap fase-fase ini penting bagi model prediksi harga karena pergerakan harga sangat dipengaruhi oleh fase mana yang sedang berlangsung di sebagian besar wilayah sentra. Rincian teknis tiap fase dijelaskan lebih detail pada dokumen terkait: `fase-raya.md`, `fase-labuhan-1.md`, `fase-labuhan-2.md`, dan `fase-labuhan-3.md`.

---

# Variety Relationship

Varietas yang dominan ditanam petani Nganjuk meliputi **Tajuk**, **Manjung**, dan **Bauji**, sebagaimana disebutkan dalam laporan pemantauan panen raya oleh Kementerian Pertanian. Ketiga varietas ini memiliki karakteristik agronomis dan preferensi pasar yang berbeda:

- **Bauji:** Varietas lokal unggulan Nganjuk, dikenal memiliki daya simpan dan rasa yang disukai pasar, sering menjadi rujukan kualitas premium di tingkat pedagang.
- **Tajuk:** Varietas yang banyak ditanam petani, berkontribusi besar terhadap volume produksi total.
- **Manjung:** Varietas lokal lain yang turut mendominasi luas tanam di sejumlah kecamatan sentra.

Perbedaan varietas dapat memengaruhi harga di tingkat pedagang karena preferensi kualitas (ukuran umbi, warna, daya simpan, tingkat kepedasan/aroma) yang berbeda-beda menurut permintaan pasar tujuan (konsumsi rumah tangga vs. industri olahan vs. bibit). Detail agronomis tiap varietas dijelaskan pada dokumen terkait: `varietas-bauji.md` dan `varietas-tajuk.md`.

---

# Disease Impact

Penyakit utama pada bawang merah di Nganjuk meliputi busuk umbi (disebabkan kelembapan berlebih saat musim hujan), layu fusarium, dan antraknosa (trotol/embun). Dampaknya terhadap pasar:

- **Terhadap Supply:** Serangan penyakit menurunkan volume panen yang layak jual, terutama saat curah hujan tinggi bertepatan dengan fase pembentukan umbi.
- **Terhadap Price:** Penurunan pasokan berkualitas baik dapat mendorong harga naik untuk umbi berkualitas, namun harga umbi berkualitas rendah/rusak justru anjlok karena kurang diminati pedagang.
- **Terhadap Market Quality:** Umbi yang terserang penyakit memiliki daya simpan lebih rendah, memaksa petani menjual segera dengan harga lebih rendah daripada menyimpan untuk menunggu harga lebih baik.

---

# Pest Impact

Hama utama meliputi ulat bawang (Spodoptera exigua) dan thrips. Dampak terhadap pasar:

- **Terhadap Production:** Serangan hama pada fase vegetatif dan pembentukan umbi dapat menurunkan hasil panen per hektar secara signifikan.
- **Terhadap Quality:** Umbi yang terserang hama cenderung berukuran lebih kecil dan kurang seragam, menurunkan kelas kualitas jual.
- **Terhadap Selling Price:** Kualitas rendah akibat serangan hama menyebabkan harga jual di tingkat pengepul lebih rendah dibanding umbi kualitas premium, meskipun harga pasar umum sedang tinggi.

---

# Weather Impact

- **Hujan lebat/berkepanjangan:** Meningkatkan risiko busuk umbi, menghambat proses pengeringan pascapanen, dan dapat menunda jadwal panen — berpotensi menekan pasokan jangka pendek namun juga menurunkan kualitas hasil panen yang tetap dipaksakan dijual.
- **Kekeringan/kemarau panjang:** Menekan produktivitas jika irigasi tidak memadai, terutama pada fase pembentukan umbi yang membutuhkan pasokan air stabil namun tidak berlebih.
- **Cuaca ekstrem (anomali iklim seperti La Nina/El Nino):** Dapat menyebabkan pergeseran jadwal tanam-panen di luar pola normal Fase Raya/Labuhan, meningkatkan ketidakpastian pasokan dan harga secara nasional, tidak hanya di Nganjuk.

---

# Harvest Strategy

- **Waktu panen optimal:** Umumnya bawang merah dipanen pada umur 55-70 hari setelah tanam, ditandai sebagian besar daun tanaman menguning dan rebah; panen pada umur yang tepat menghasilkan umbi dengan daya simpan terbaik.
- **Panen tertunda (delayed harvest):** Dapat meningkatkan risiko busuk umbi di lahan jika cuaca basah, namun dalam kondisi tertentu petani sengaja menunda panen sedikit untuk menghindari puncak pasokan pasar dan menunggu harga membaik.
- **Panen dini (early harvest):** Dapat dilakukan saat harga sedang tinggi meski umbi belum optimal, namun berisiko menurunkan bobot dan kualitas jual serta daya simpan.
- **Dampak terhadap kualitas:** Ketepatan waktu panen memengaruhi daya simpan, yang pada gilirannya menentukan fleksibilitas petani untuk menahan hasil panen menunggu harga lebih baik atau menjualnya segera.

---

# Storage Strategy

- **Durasi penyimpanan:** Umbi bawang merah kering panen (rogol kering) dapat disimpan selama beberapa minggu hingga beberapa bulan dalam kondisi gudang yang kering dan bersirkulasi baik, sebagaimana tercermin dari praktik petani Nganjuk yang menyimpan hasil panen untuk dijadikan bibit selama beberapa bulan.
- **Metode penyimpanan:** Penyimpanan tradisional menggunakan para-para/rak bambu di ruang beratap dengan sirkulasi udara baik; penyimpanan modern dapat memanfaatkan cold storage untuk memperpanjang masa simpan dan menjaga kualitas, meski adopsi cold storage di tingkat petani kecil Nganjuk masih terbatas.
- **Retensi kualitas:** Penyimpanan yang baik menjaga kadar air umbi tetap rendah dan mencegah pertumbuhan tunas dini serta serangan jamur gudang.
- **Strategi penjualan terkait simpan:** Petani dapat memilih menahan hasil panen untuk dijadikan bibit (harga jauh lebih tinggi dari harga konsumsi, seperti kisaran Rp 57.000-60.000 per kilogram dibanding harga konsumsi Rp 16.000-17.000 per kilogram pada periode yang sama) atau menyimpan untuk dijual saat harga konsumsi membaik.

---

# Distribution Chain

**Farm → Collector → Wholesale (Pasar Induk Sukomoro) → Retail (pasar antar-kota: Kediri, Jombang, Madiun, Magetan, Bojonegoro, dan seterusnya) → Consumer.**

Setiap tahap distribusi menambah biaya (transportasi, penyortiran, pengemasan, margin pedagang) yang terakumulasi menjadi selisih harga antara tingkat petani dan tingkat konsumen akhir. Pasar Sukomoro berfungsi sebagai titik kumpul utama yang menjadi acuan harga regional sebelum bawang merah didistribusikan lebih lanjut ke luar Nganjuk.

---

# Marketing Strategy

- **Penjualan langsung (direct selling):** Petani menjual langsung ke pengepul atau pasar induk tanpa perantara panjang, memberi margin lebih baik namun membutuhkan akses transportasi dan informasi harga.
- **Lelang/tawar di pasar (auction-like bargaining):** Mekanisme tawar-menawar di pasar induk seperti Sukomoro yang menentukan harga harian berdasarkan volume pasokan yang masuk.
- **Koperasi/kelompok tani (cooperative):** Kelompok tani seperti Gapoktan Luru Luhur di Kecamatan Rejoso berperan sebagai champion yang mengoordinasikan pola tanam dan pasokan untuk mendukung stabilisasi harga.
- **Penjualan grosir (wholesale):** Menjual dalam volume besar langsung ke pedagang antar-daerah atau industri olahan.
- **Penjualan eceran (retail):** Biasanya dilakukan oleh pedagang pasar tradisional, bukan petani secara langsung.
- **Penjualan daring (online):** Sebagian pelaku usaha di Nganjuk mulai memasarkan bawang merah dan bibit bawang melalui platform e-commerce, membuka akses pasar yang lebih luas di luar rantai distribusi konvensional.

---

# Risk Analysis

1. **Price crash (harga anjlok):** Terjadi saat panen serentak dalam volume besar melampaui daya serap pasar, seperti kasus penurunan harga di Pasar Sukomoro selama dua minggu berturut-turut.
2. **Oversupply:** Risiko struktural saat Fase Raya/Labuhan menghasilkan panen di banyak kecamatan secara bersamaan.
3. **Permintaan rendah (low demand):** Terjadi pada periode di luar HBKN, terutama pasca Lebaran saat konsumsi kembali normal.
4. **Cuaca ekstrem:** Hujan berkepanjangan atau kekeringan dapat merusak kualitas dan kuantitas panen.
5. **Gangguan transportasi:** Kerusakan infrastruktur jalan atau kenaikan biaya bahan bakar dapat menghambat distribusi ke Kediri, Jombang, Madiun, Magetan, dan Bojonegoro.
6. **Penutupan/gangguan pasar:** Gangguan operasional pasar induk (misalnya renovasi, bencana, atau force majeure) dapat mengganggu mekanisme pembentukan harga acuan regional.
7. **Serangan hama-penyakit skala luas:** Dapat menurunkan produksi regional secara signifikan, meningkatkan volatilitas harga secara tidak terduga.

---

# Opportunity Analysis

1. **Harga puncak musiman:** Periode menjelang Ramadan dan Idul Fitri secara historis menunjukkan potensi kenaikan harga akibat lonjakan permintaan.
2. **Musim liburan Nataru:** Permintaan meningkat menjelang Natal dan Tahun Baru turut mendorong harga naik dari level panen raya.
3. **Pasar bibit:** Harga bibit bawang merah secara konsisten jauh lebih tinggi daripada harga konsumsi, membuka peluang margin lebih besar bagi petani yang memilih menyimpan hasil panen sebagai bibit.
4. **Potensi ekspor:** Saat kondisi surplus produksi nasional, terbuka peluang ekspor yang dapat menopang harga di tingkat petani.
5. **Kemitraan champion petani dan pemerintah:** Program champion bawang merah (seperti yang dijalankan Gapoktan Luru Luhur) membuka akses informasi pasar dan dukungan stabilisasi harga yang menguntungkan petani anggota.
6. **Industri olahan:** Permintaan kontinu dari industri bawang goreng dan bumbu instan memberi peluang kontrak volume yang lebih stabil dibanding pasar spot harian.

---

# Economic Analysis

**Biaya produksi (production cost):** Meliputi biaya bibit, pupuk (NPK, Urea, SP-36, KCl, pupuk kandang/organik), pestisida, tenaga kerja (termasuk sistem borongan yang umum digunakan petani Nganjuk), serta sewa/pengolahan lahan. Referensi penelitian menunjukkan luas lahan dan pupuk NPK memiliki peran signifikan terhadap produktivitas, dengan produktivitas rata-rata di kisaran 8-15 ton per hektar tergantung teknik budidaya dan kondisi lahan.

**Titik impas (break-even point):** Bergantung pada kombinasi biaya input dan harga jual; pada kondisi harga jual mendekati atau di bawah biaya produksi per kilogram, petani berisiko rugi meski volume panen tinggi. **Keterbatasan data:** dokumen ini tidak memiliki rincian biaya produksi terkini yang tervalidasi secara menyeluruh (per hektar, per musim tanam terbaru) untuk menghitung titik impas secara presisi; disarankan merujuk data terbaru dari Dinas Pertanian Kabupaten Nganjuk atau BPS untuk perhitungan akurat.

**Potensi keuntungan (potential profit):** Sangat bervariasi tergantung harga jual saat panen. Sebagai ilustrasi historis yang pernah dipublikasikan, potensi hasil panen bawang merah di Jawa Timur pernah dilaporkan mencapai puluhan hingga ratusan juta Rupiah per hektar pada kondisi harga baik, namun angka ini sangat tergantung tahun dan kondisi pasar sehingga tidak dapat dijadikan patokan tetap tanpa verifikasi data terbaru.

**Return on Investment (ROI):** Dipengaruhi langsung oleh volatilitas harga jual; ROI usaha tani bawang merah cenderung lebih tinggi dibanding banyak komoditas hortikultura lain namun juga memiliki risiko kerugian yang lebih besar akibat fluktuasi harga tajam dan risiko produksi (hama, penyakit, cuaca).

**Risiko usaha:** Penelitian akademis di Desa Sukorejo, Kecamatan Rejoso, Nganjuk menunjukkan tingkat risiko produksi bawang merah tergolong tinggi (koefisien variasi 2,73), menegaskan pentingnya manajemen risiko melalui diversifikasi waktu tanam dan strategi penjualan yang tepat.

---

# Decision Rules

1. IF Bulan = Desember DAN Supply = Tinggi (panen raya) MAKA Price cenderung Turun → Rekomendasi: Jual bertahap, jangan jual seluruh stok sekaligus.
2. IF Bulan = Maret DAN mendekati Ramadan MAKA Demand cenderung Naik → Rekomendasi: Pertimbangkan menahan sebagian stok untuk dijual menjelang Ramadan.
3. IF Panen Bersamaan DENGAN Kecamatan Lain MAKA Risiko Oversupply Tinggi → Rekomendasi: Percepat penjualan sebagian hasil sebelum harga turun lebih jauh.
4. IF Harga Bibit > 2x Harga Konsumsi MAKA Rekomendasi: Pertimbangkan menyimpan sebagian hasil panen sebagai bibit, bukan dijual untuk konsumsi.
5. IF Curah Hujan Tinggi Saat Pembentukan Umbi MAKA Risiko Busuk Umbi Naik → Rekomendasi: Percepat rencana panen dan perbaiki drainase lahan.
6. IF Gudang Penyimpanan Tersedia DAN Harga Sedang Rendah MAKA Rekomendasi: Simpan hasil panen, jual bertahap saat harga membaik.
7. IF Gudang Penyimpanan Tidak Tersedia DAN Harga Rendah MAKA Rekomendasi: Jual segera untuk menghindari kerugian akibat penyusutan kualitas.
8. IF Harga Naik Tajam Dalam Waktu Singkat (contoh: 3 hari) MAKA Rekomendasi: Manfaatkan momentum jual sebelum kemungkinan koreksi harga.
9. IF Musim Tanam Baru Dimulai (sekitar Juni) MAKA Permintaan Bibit Naik → Rekomendasi: Petani dengan stok simpan dapat menjual sebagai bibit dengan margin lebih tinggi.
10. IF Serangan Hama Terdeteksi Dini MAKA Rekomendasi: Lakukan pengendalian segera untuk menjaga kualitas jual, hindari penundaan panen berlebihan.
11. IF Kualitas Umbi Rendah Akibat Penyakit MAKA Rekomendasi: Jual segera ke segmen harga lebih rendah, jangan simpan karena daya simpan buruk.
12. IF Harga Pasar Mendekati Atau Di Bawah HAP MAKA Rekomendasi: Pertimbangkan opsi jual ke program stabilisasi/champion petani jika tersedia.
13. IF Bulan = Januari-Februari DAN Supply Tinggi MAKA Rekomendasi: Prioritaskan penjualan ke industri olahan yang menyerap volume besar dengan harga kontrak.
14. IF Mendekati Idul Fitri DAN Stok Petani Terbatas MAKA Rekomendasi: Manfaatkan peluang harga tinggi untuk stok yang tersisa.
15. IF Pasca Idul Fitri (Mei) MAKA Permintaan Turun → Rekomendasi: Percepat penjualan sisa stok sebelum harga turun lebih dalam.
16. IF Cuaca Diprediksi Kemarau Panjang MAKA Rekomendasi: Pastikan irigasi tersedia, waspadai penurunan produktivitas dan potensi kenaikan harga di masa depan akibat pasokan berkurang.
17. IF Cuaca Diprediksi Hujan Ekstrem Berkepanjangan MAKA Rekomendasi: Percepat panen jika umur tanaman sudah mendekati matang, meski sedikit lebih awal dari optimal.
18. IF Harga Konsumsi Turun Drastis MAKA Rekomendasi: Evaluasi opsi menyimpan sebagai bibit jika harga bibit tetap tinggi.
19. IF Biaya Transportasi Naik (harga BBM naik) MAKA Rekomendasi: Prioritaskan penjualan ke pembeli terdekat (Pasar Sukomoro) untuk menghindari margin tergerus biaya distribusi jauh.
20. IF Terdapat Program Champion/Kemitraan Pemerintah MAKA Rekomendasi: Bergabung untuk akses informasi pasar dan dukungan stabilisasi harga.
21. IF Panen Terjadi Di Luar Jadwal Normal (akibat cuaca) MAKA Rekomendasi: Waspadai potensi harga tidak sesuai ekspektasi karena pasokan tidak sinkron dengan pola musiman umum.
22. IF Varietas = Bauji DAN Permintaan Kualitas Premium Tinggi MAKA Rekomendasi: Targetkan segmen pasar premium/bibit unggul untuk margin lebih baik.
23. IF Varietas = Tajuk/Manjung DENGAN Volume Besar MAKA Rekomendasi: Prioritaskan penjualan volume ke pedagang grosir/industri.
24. IF Umur Tanaman Mendekati 55-70 Hari DAN Harga Sedang Tinggi MAKA Rekomendasi: Pertimbangkan panen sedikit lebih awal untuk menangkap harga baik, dengan tetap memperhatikan kualitas minimal.
25. IF Umur Tanaman Belum Mencapai 55 Hari MAKA Rekomendasi: Jangan panen dini kecuali darurat, karena bobot dan kualitas belum optimal.
26. IF Ada Indikasi Panen Raya Regional (Jawa Timur/Jawa Tengah) MAKA Rekomendasi: Waspadai tekanan harga nasional meski panen lokal belum tinggi.
27. IF Stok Nasional Dilaporkan Surplus MAKA Rekomendasi: Waspadai risiko harga rendah berkepanjangan, pertimbangkan diversifikasi waktu jual.
28. IF Stok Nasional Dilaporkan Defisit/Menipis MAKA Rekomendasi: Manfaatkan peluang harga tinggi, jual secara bertahap untuk optimalkan pendapatan.
29. IF Petani Tidak Memiliki Akses Informasi Harga Real-Time MAKA Rekomendasi: Manfaatkan sistem SIMANTRI atau sumber resmi (SISKAPERBAPO, Bapanas) sebelum memutuskan menjual.
30. IF Harga Antar-Pengepul Bervariasi Signifikan MAKA Rekomendasi: Bandingkan minimal 2-3 pengepul/pasar sebelum menjual untuk mendapat harga terbaik.
31. IF Kualitas Penyimpanan Gudang Buruk (lembap) MAKA Rekomendasi: Jangan simpan lama, jual dalam waktu dekat untuk menghindari kerugian akibat kerusakan.
32. IF Ramalan Cuaca BMKG Menunjukkan Anomali (La Nina/El Nino) MAKA Rekomendasi: Sesuaikan jadwal tanam dan waspadai potensi pergeseran pola harga musiman.
33. IF Bulan = Juni-Agustus (fase awal tanam pasca Juni) MAKA Pasokan Segar Terbatas → Rekomendasi: Bagi yang punya stok simpan, ini periode potensial menjual dengan harga baik.
34. IF Terjadi Serangan Hama Skala Regional MAKA Rekomendasi: Waspadai potensi kenaikan harga akibat penurunan produksi regional, evaluasi ulang waktu jual.
35. IF Kebijakan Pemerintah Menetapkan HAP Baru MAKA Rekomendasi: Gunakan HAP sebagai referensi negosiasi harga minimum dengan pengepul.
36. IF Permintaan Ekspor Meningkat MAKA Rekomendasi: Prioritaskan kualitas premium untuk menangkap peluang harga ekspor yang lebih baik.
37. IF Petani Berencana Menjual Ke Luar Kabupaten (Kediri/Jombang/Madiun) MAKA Rekomendasi: Hitung selisih harga dikurangi biaya transportasi sebelum memutuskan, karena tidak selalu lebih menguntungkan dari menjual lokal.
38. IF Harga Turun Namun Diprediksi Sementara (misalnya akibat panen singkat satu kecamatan) MAKA Rekomendasi: Tahan sebagian stok jika daya simpan memungkinkan, tunggu normalisasi harga.
39. IF Harga Turun Dan Diprediksi Berkepanjangan (oversupply regional besar) MAKA Rekomendasi: Jual segera, evaluasi opsi diversifikasi ke bibit atau olahan.
40. IF Petani Baru/Belum Berpengalaman Membaca Sinyal Pasar MAKA Rekomendasi: Bergabung kelompok tani/Gapoktan untuk akses informasi kolektif dan kekuatan tawar lebih baik.
41. IF Target Penjualan = Idul Fitri DAN Saat Ini Bulan Januari MAKA Rekomendasi: Rencanakan jadwal tanam agar panen jatuh mendekati periode permintaan tinggi, bukan bertepatan dengan panen raya nasional.
42. IF Data Harga Real-Time Tidak Tersedia Untuk Wilayah Tertentu MAKA Rekomendasi: Sistem AI harus menyatakan keterbatasan data secara eksplisit, bukan menduga angka.

---

# Recommendation Matrix

| Market Condition | Recommendation | Priority | Confidence | Reason |
|---|---|---|---|---|
| Panen raya serentak, harga turun tajam | Jual bertahap, simpan sebagian jika gudang tersedia | Tinggi | Tinggi | Menghindari kerugian akibat menjual seluruh stok saat harga terendah |
| Mendekati Ramadan/Idul Fitri, stok terbatas | Manfaatkan harga tinggi, jual bertahap | Tinggi | Tinggi | Pola historis menunjukkan permintaan HBKN mendorong harga naik |
| Harga bibit jauh lebih tinggi dari harga konsumsi | Simpan sebagian panen sebagai bibit | Sedang | Tinggi | Margin bibit secara konsisten lebih tinggi berdasarkan data lapangan |
| Curah hujan tinggi saat umbi terbentuk | Percepat panen, perbaiki drainase | Tinggi | Sedang | Risiko busuk umbi meningkat signifikan pada kondisi basah berlebih |
| Harga naik tajam dalam waktu singkat | Manfaatkan momentum jual | Sedang | Sedang | Kenaikan cepat berpotensi terkoreksi jika pasokan menyusul masuk |
| Gudang tidak tersedia, harga rendah | Jual segera | Tinggi | Tinggi | Risiko penyusutan kualitas lebih besar dari potensi kenaikan harga |
| Serangan hama/penyakit terdeteksi | Kendalikan segera, evaluasi ulang waktu jual | Tinggi | Sedang | Kualitas menurun mempercepat kebutuhan menjual segera dengan harga lebih rendah |
| Data harga real-time tidak tersedia | Rujuk sumber resmi (SISKAPERBAPO/Bapanas), jangan berasumsi | Tinggi | Tinggi | Mencegah keputusan berbasis data yang tidak terverifikasi |

---

# Practical Farmer Scenarios

1. **Harga turun drastis saat panen raya.** Analisis: pasokan regional melimpah menekan harga tingkat petani. Rekomendasi: jual bertahap, simpan sebagian jika gudang memadai. Risiko: harga terus turun jika panen susulan besar. Hasil yang diharapkan: kerugian minim dibanding menjual seluruh stok sekaligus di titik terendah.
2. **Panen bersamaan dengan banyak petani lain di kecamatan yang sama.** Analisis: risiko oversupply lokal tinggi. Rekomendasi: distribusikan penjualan ke lebih dari satu pengepul/pasar. Risiko: harga tetap tertekan meski distribusi diperluas. Hasil yang diharapkan: harga rata-rata lebih baik dibanding menjual di satu titik saja.
3. **Harga sedang tinggi menjelang Idul Fitri.** Analisis: permintaan HBKN mendorong harga naik. Rekomendasi: jual bertahap untuk menangkap tren naik tanpa melewatkan puncak. Risiko: harga bisa turun cepat pasca Lebaran jika terlalu lama menahan. Hasil yang diharapkan: pendapatan optimal pada periode permintaan tinggi.
4. **Gudang penyimpanan tersedia dan harga sedang rendah.** Analisis: penyimpanan memungkinkan menunggu harga membaik. Rekomendasi: simpan sebagian, jual bertahap. Risiko: penyusutan kualitas jika penyimpanan tidak optimal. Hasil yang diharapkan: harga jual rata-rata lebih tinggi dari harga saat panen.
5. **Hujan panjang menjelang waktu panen.** Analisis: risiko busuk umbi meningkat signifikan. Rekomendasi: percepat panen meski sedikit lebih awal dari optimal. Risiko: bobot dan kualitas sedikit menurun. Hasil yang diharapkan: menghindari kerugian total akibat umbi membusuk di lahan.
6. **Target menjual tepat saat Idul Fitri.** Analisis: perlu perencanaan waktu tanam mundur agar panen jatuh sebelum atau bertepatan dengan periode tersebut. Rekomendasi: sesuaikan jadwal tanam mengacu kalender Fase Raya/Labuhan. Risiko: pergeseran cuaca dapat menggeser waktu panen dari target. Hasil yang diharapkan: menangkap harga puncak musiman.
7. **Harga bibit sangat tinggi, harga konsumsi rendah.** Analisis: disparitas harga menguntungkan opsi penyimpanan sebagai bibit. Rekomendasi: alihkan sebagian hasil panen menjadi bibit untuk musim tanam berikutnya. Risiko: permintaan bibit bisa berubah, perlu pembeli yang jelas. Hasil yang diharapkan: margin lebih tinggi dibanding menjual sebagai konsumsi.
8. **Serangan ulat bawang pada fase vegetatif.** Analisis: berisiko menurunkan hasil panen jika tidak dikendalikan. Rekomendasi: aplikasikan pengendalian hama terpadu segera. Risiko: keterlambatan penanganan memperbesar kerugian produksi. Hasil yang diharapkan: hasil panen tetap mendekati potensi normal.
9. **Harga anjlok akibat panen raya nasional (bukan hanya lokal).** Analisis: tekanan harga berasal dari luar Nganjuk (misalnya Brebes). Rekomendasi: tahan sebagian stok jika daya simpan memungkinkan, pantau perkembangan pasokan nasional. Risiko: harga bisa tertekan lebih lama dari perkiraan. Hasil yang diharapkan: menghindari menjual di titik terendah siklus nasional.
10. **Petani baru pertama kali menanam bawang merah.** Analisis: minim pengalaman membaca sinyal pasar. Rekomendasi: bergabung kelompok tani/Gapoktan untuk akses informasi dan kekuatan tawar kolektif. Risiko: keputusan individual tanpa data dapat berujung kerugian. Hasil yang diharapkan: pengambilan keputusan lebih terinformasi sejak musim tanam pertama.
11. **Harga di pasar induk Sukomoro berbeda jauh dengan harga di kecamatan asal.** Analisis: disparitas harga antar-titik jual. Rekomendasi: hitung selisih harga dikurangi biaya transportasi sebelum memutuskan menjual ke Sukomoro. Risiko: biaya transportasi dapat mengurangi margin tambahan. Hasil yang diharapkan: keputusan jual di titik yang benar-benar lebih menguntungkan.
12. **Cuaca kemarau panjang saat fase pembentukan umbi.** Analisis: risiko produktivitas turun jika irigasi tidak memadai. Rekomendasi: pastikan sumber air cadangan, pertimbangkan pengaturan jadwal penyiraman. Risiko: biaya irigasi tambahan menekan margin. Hasil yang diharapkan: produktivitas tetap terjaga mendekati potensi normal.
13. **Ada indikasi kebijakan HAP baru dari pemerintah.** Analisis: perubahan acuan harga memengaruhi negosiasi dengan pengepul. Rekomendasi: gunakan HAP sebagai dasar negosiasi harga minimum yang wajar. Risiko: harga pasar riil bisa berada di bawah HAP jika pasokan sangat tinggi. Hasil yang diharapkan: posisi tawar petani lebih kuat.
14. **Permintaan industri olahan (bawang goreng) meningkat.** Analisis: peluang kontrak volume besar dengan harga relatif stabil. Rekomendasi: jajaki kerja sama volume dengan industri untuk mengurangi ketergantungan pada pasar spot harian. Risiko: harga kontrak bisa lebih rendah dari puncak harga pasar spot musiman. Hasil yang diharapkan: pendapatan lebih stabil sepanjang tahun.
15. **Harga naik tajam dalam tiga hari terakhir.** Analisis: lonjakan permintaan mendadak atau gangguan pasokan sementara. Rekomendasi: manfaatkan momentum untuk menjual sebagian stok. Risiko: harga berpotensi terkoreksi turun jika lonjakan bersifat sementara. Hasil yang diharapkan: menangkap keuntungan sebelum kemungkinan koreksi harga.
16. **Pasokan dari kecamatan barat (Bagor, Wilangan, Rejoso) mulai masuk pasar menyusul panen wilayah timur.** Analisis: pola pergiliran Fase Raya/Labuhan sedang berjalan, pasokan akan terus bertambah dalam beberapa minggu ke depan. Rekomendasi: percepat penjualan stok yang ada sebelum pasokan susulan besar masuk. Risiko: harga terus tertekan dalam periode transisi ini. Hasil yang diharapkan: menghindari menjual saat pasokan gabungan mencapai puncak.
17. **Petani ingin menjual langsung ke konsumen/online tanpa perantara.** Analisis: berpotensi margin lebih tinggi namun butuh akses pasar dan logistik sendiri. Rekomendasi: mulai dengan volume kecil melalui platform daring sambil mempertahankan jalur pengepul untuk volume besar. Risiko: biaya pengemasan dan pengiriman individual lebih tinggi per kilogram. Hasil yang diharapkan: diversifikasi kanal penjualan mengurangi ketergantungan pada satu pembeli.
18. **Harga sangat rendah dan diprediksi bertahan lama (oversupply nasional).** Analisis: kondisi struktural sulit dihindari dengan strategi individual. Rekomendasi: evaluasi opsi pengalihan sebagian hasil ke produk olahan (bawang goreng skala rumahan) untuk menambah nilai. Risiko: membutuhkan keterampilan dan modal pengolahan tambahan. Hasil yang diharapkan: mengurangi kerugian dibanding menjual mentah pada harga sangat rendah.
19. **Terdapat program champion petani/Gapoktan yang aktif di wilayah petani.** Analisis: akses informasi dan koordinasi pasokan lebih baik melalui program tersebut. Rekomendasi: bergabung dan aktif mengikuti arahan pola tanam bergilir. Risiko: keputusan kolektif mungkin tidak selalu sesuai preferensi individu. Hasil yang diharapkan: stabilitas harga kolektif lebih terjaga dibanding bertindak sendiri-sendiri.
20. **Petani mendengar kabar rencana ekspor bawang merah meningkat.** Analisis: potensi penyerapan surplus produksi nasional. Rekomendasi: jaga kualitas premium (grading baik) untuk peluang menembus segmen ekspor melalui pengepul/eksportir mitra. Risiko: standar kualitas ekspor lebih ketat dari pasar domestik. Hasil yang diharapkan: margin tambahan dari segmen kualitas premium.
21. **Harga di kecamatan tetangga (Kediri/Jombang) lebih tinggi dari harga lokal Nganjuk.** Analisis: disparitas harga antarwilayah mungkin memberi peluang. Rekomendasi: verifikasi harga riil dan biaya transportasi sebelum memutuskan menjual keluar wilayah. Risiko: informasi harga dari sumber tidak resmi bisa tidak akurat. Hasil yang diharapkan: keputusan jual berbasis perbandingan harga bersih setelah biaya.
22. **Musim tanam baru akan dimulai dan petani mempertimbangkan varietas apa yang ditanam.** Analisis: pilihan varietas (Bauji/Tajuk/Manjung) memengaruhi segmen pasar tujuan. Rekomendasi: pertimbangkan permintaan pasar tujuan (konsumsi massal vs bibit vs kualitas premium) saat memilih varietas. Risiko: preferensi pasar dapat berubah antar musim. Hasil yang diharapkan: hasil panen lebih sesuai permintaan pasar saat panen tiba.
23. **Petani mengalami gagal panen sebagian akibat banjir lahan.** Analisis: kerugian produksi langsung, kualitas sisa panen mungkin menurun. Rekomendasi: jual segera sisa hasil yang masih layak untuk meminimalkan kerugian lanjutan, evaluasi klaim asuransi pertanian jika terdaftar. Risiko: harga jual darurat cenderung lebih rendah dari harga pasar normal. Hasil yang diharapkan: pemulihan sebagian modal untuk musim tanam berikutnya.
24. **Ada kabar kenaikan harga BBM yang memengaruhi biaya distribusi.** Analisis: biaya transportasi ke luar kabupaten meningkat, margin jual jarak jauh berkurang. Rekomendasi: prioritaskan penjualan ke pembeli terdekat (Pasar Sukomoro) selama periode kenaikan BBM. Risiko: harga di pasar terdekat mungkin lebih rendah dari pasar jauh meski setelah dikurangi biaya transportasi baru. Hasil yang diharapkan: margin bersih tetap terjaga meski biaya distribusi naik.
25. **Petani ingin memperkirakan waktu jual terbaik untuk musim tanam yang baru dimulai Juni.** Analisis: perlu proyeksi kondisi pasar 55-70 hari ke depan (saat panen tiba, sekitar Agustus). Rekomendasi: pantau perkembangan luas tanam regional dan prakiraan cuaca BMKG selama masa tanam untuk estimasi kondisi pasokan saat panen. Risiko: proyeksi jangka menengah tetap memiliki ketidakpastian tinggi. Hasil yang diharapkan: keputusan jual/simpan yang lebih terinformasi saat panen tiba.
26. **Harga pasar tiba-tiba naik akibat isu kelangkaan yang belum terverifikasi.** Analisis: potensi rumor pasar dapat memicu perilaku panic-buy/panic-sell yang tidak berdasar data riil. Rekomendasi: verifikasi ke sumber resmi (Dinas Pertanian, Pasar Sukomoro, SISKAPERBAPO) sebelum mengambil keputusan besar. Risiko: bertindak berdasarkan rumor dapat merugikan jika kondisi riil berbeda. Hasil yang diharapkan: keputusan berbasis data terverifikasi, bukan spekulasi.
27. **Petani mempertimbangkan investasi cold storage bersama kelompok tani.** Analisis: cold storage dapat memperpanjang masa simpan dan fleksibilitas waktu jual. Rekomendasi: evaluasi kelayakan investasi bersama melalui koperasi/Gapoktan mengingat biaya investasi individual tinggi. Risiko: biaya operasional cold storage perlu tertutup oleh margin harga yang diperoleh dari fleksibilitas waktu jual. Hasil yang diharapkan: pengurangan risiko jual paksa saat harga rendah pascapanen.
28. **Musim panen raya bertepatan dengan hari libur nasional panjang sehingga distribusi terhambat.** Analisis: pasokan menumpuk di tingkat petani/pengepul karena keterbatasan operasional pasar/distribusi selama libur. Rekomendasi: rencanakan jadwal panen menghindari bentrok langsung dengan libur panjang jika memungkinkan, atau siapkan penyimpanan sementara. Risiko: penundaan penjualan meningkatkan risiko penurunan kualitas. Hasil yang diharapkan: pasokan terserap lebih merata setelah operasional pasar normal kembali.
29. **Petani menerima tawaran kontrak jual dari industri olahan dengan harga tetap sebelum musim panen.** Analisis: kontrak memberi kepastian harga namun mengunci potensi upside jika harga pasar spot naik lebih tinggi. Rekomendasi: pertimbangkan kontrak untuk sebagian hasil panen (bukan seluruhnya) guna menyeimbangkan kepastian dan potensi keuntungan pasar spot. Risiko: jika harga pasar spot naik jauh di atas harga kontrak, potensi keuntungan tambahan hilang untuk porsi yang dikontrak. Hasil yang diharapkan: pendapatan lebih stabil dengan risiko terdiversifikasi.
30. **Petani ingin mengetahui apakah tahun ini termasuk kategori panen baik atau kurang baik dibanding tahun sebelumnya.** Analisis: perbandingan memerlukan data luas tanam, produktivitas, dan harga tahun berjalan versus tahun sebelumnya. Rekomendasi: bandingkan dengan data resmi BPS Kabupaten Nganjuk dan laporan Dinas Pertanian terbaru, bukan hanya persepsi lapangan semata. Risiko: persepsi individual bisa bias oleh pengalaman lahan sendiri yang tidak mewakili kondisi regional. Hasil yang diharapkan: keputusan strategi musim berikutnya berbasis data pembanding yang lebih objektif.

---

# FAQ

1. **Kapan harga bawang merah biasanya naik?** Umumnya menjelang Ramadan dan Idul Fitri, serta pada periode pasokan menipis pasca panen raya.
2. **Kapan harga bawang merah biasanya turun?** Saat panen raya berlangsung serentak, umumnya sekitar Desember-Maret tergantung pola tanam tahun berjalan.
3. **Lebih baik jual sekarang atau simpan?** Tergantung kondisi gudang, kualitas umbi, dan tren harga saat itu; jika gudang memadai dan harga sedang rendah, menyimpan sebagian bisa lebih menguntungkan.
4. **Panen bulan Juli, apakah menguntungkan?** Tergantung kondisi pasokan saat itu; Juli umumnya masa awal pasca-tanam Juni dengan pasokan segar relatif terbatas, berpotensi harga lebih baik, namun perlu verifikasi kondisi pasar riil saat itu.
5. **Kenapa harga bawang merah turun?** Biasanya karena pasokan melimpah akibat panen serentak melebihi daya serap pasar.
6. **Mengapa panen raya membuat harga jatuh?** Karena volume yang masuk pasar jauh melebihi permintaan harian normal, sehingga pedagang menekan harga beli dari petani.
7. **Apa itu HAP bawang merah?** Harga Acuan Pembelian, yaitu harga acuan yang ditetapkan pemerintah di tingkat petani sebagai instrumen stabilisasi.
8. **Berapa HAP bawang merah saat ini?** Berdasarkan data yang tersedia, HAP rogol kering panen pernah dipatok Rp 25.000-30.000 per kilogram; namun angka ini dapat berubah, sebaiknya verifikasi ke Bapanas/Kementan untuk angka terkini.
9. **Apakah harga bawang merah di Nganjuk sama dengan di Kediri?** Tidak selalu; ada disparitas harga akibat biaya transportasi dan margin distribusi antarwilayah.
10. **Apa penyebab harga bawang merah naik tajam dalam beberapa hari?** Bisa karena permintaan mendadak naik atau pasokan yang masuk pasar berkurang akibat cuaca atau jadwal panen.
11. **Apakah menyimpan bawang merah sebagai bibit lebih menguntungkan?** Berdasarkan data historis, harga bibit sering jauh lebih tinggi dari harga konsumsi, sehingga bisa lebih menguntungkan tergantung kebutuhan modal jangka pendek petani.
12. **Berapa lama bawang merah bisa disimpan?** Umbi kering panen yang disimpan dengan baik (kering, bersirkulasi udara) dapat bertahan beberapa minggu hingga beberapa bulan.
13. **Apa risiko menyimpan bawang merah terlalu lama?** Risiko penyusutan bobot, tumbuh tunas, dan serangan jamur gudang jika kondisi penyimpanan tidak optimal.
14. **Kapan waktu tanam bawang merah di Nganjuk?** Musim tanam utama umumnya dimulai sekitar bulan Juni, dengan pola tanam bergilir mengikuti Fase Raya dan Labuhan 1-3.
15. **Apa itu Fase Raya?** Periode tanam-panen utama yang menghasilkan volume produksi terbesar dalam siklus tahunan.
16. **Apa itu Labuhan 1, 2, dan 3?** Periode tanam susulan/bergilir setelah Fase Raya yang membantu menjaga kesinambungan pasokan sepanjang tahun.
17. **Varietas apa yang paling banyak ditanam di Nganjuk?** Tajuk, Manjung, dan Bauji adalah varietas dominan berdasarkan laporan pemantauan panen raya.
18. **Varietas mana yang punya daya simpan terbaik?** Bauji dikenal sebagai varietas lokal unggulan dengan daya simpan dan kualitas yang disukai pasar.
19. **Apa penyebab utama penyakit busuk umbi?** Kelembapan berlebih akibat curah hujan tinggi saat fase pembentukan umbi.
20. **Bagaimana cara mengurangi risiko busuk umbi?** Perbaiki drainase lahan dan percepat panen jika cuaca basah berkepanjangan mendekati waktu panen optimal.
21. **Hama apa yang paling sering menyerang bawang merah di Nganjuk?** Ulat bawang (Spodoptera exigua) dan thrips.
22. **Apakah serangan hama memengaruhi harga jual?** Ya, umbi berkualitas rendah akibat hama biasanya dihargai lebih rendah oleh pengepul.
23. **Apa dampak kekeringan terhadap harga bawang merah?** Produktivitas menurun jika irigasi tidak memadai, berpotensi menekan pasokan dan mendorong harga naik.
24. **Berapa lama umur panen bawang merah?** Umumnya sekitar 55-70 hari setelah tanam.
25. **Apakah panen lebih awal dari 55 hari disarankan?** Umumnya tidak disarankan kecuali darurat, karena bobot dan kualitas belum optimal.
26. **Apa yang dimaksud rogol kering panen?** Umbi bawang merah yang telah dikeringkan dengan daun dipotong, bentuk jual standar di tingkat petani.
27. **Di mana pusat perdagangan bawang merah Nganjuk?** Pasar Sukomoro merupakan salah satu pasar khusus/pasar induk yang menjadi acuan harga regional.
28. **Apakah harga di Pasar Sukomoro menjadi acuan harga se-Jawa Timur?** Pasar Sukomoro berperan penting sebagai barometer pasokan dan harga karena Nganjuk adalah sentra produksi terbesar di Jawa Timur, namun harga akhir di tiap daerah tetap dipengaruhi faktor lokal masing-masing.
29. **Apakah Nganjuk mengekspor bawang merah?** Ekspor bergantung pada kondisi surplus produksi nasional; Nganjuk berkontribusi terhadap stok nasional yang berpotensi diekspor saat surplus.
30. **Apakah Indonesia mengimpor bawang merah?** Impor bawang merah relatif jarang dibanding bawang putih, karena produksi domestik umumnya mampu memenuhi kebutuhan nasional.
31. **Apa dampak kenaikan harga BBM terhadap harga bawang merah?** Meningkatkan biaya distribusi dan biaya produksi (irigasi, alat pertanian), berpotensi menekan margin petani atau mendorong harga jual naik.
32. **Bagaimana cara mengetahui harga bawang merah hari ini?** Rujuk sumber resmi seperti SISKAPERBAPO Jawa Timur, Panel Harga Bapanas, atau informasi langsung dari Pasar Sukomoro/Dinas Pertanian Nganjuk.
33. **Apakah harga bawang merah selalu sama di seluruh Indonesia?** Tidak, harga bervariasi antarwilayah tergantung jarak dari sentra produksi dan biaya distribusi.
34. **Kapan permintaan bawang merah paling tinggi dalam setahun?** Umumnya menjelang Ramadan, Idul Fitri, dan periode Natal-Tahun Baru.
35. **Apakah harga bawang merah dipengaruhi hari besar keagamaan selain Idul Fitri?** Ya, permintaan juga meningkat pada periode Natal dan Tahun Baru, meski umumnya tidak setinggi Ramadan-Idul Fitri.
36. **Apa yang menyebabkan disparitas harga antara petani dan konsumen?** Margin di setiap simpul rantai distribusi (pengepul, pedagang pasar induk, grosir, pengecer) serta biaya transportasi dan penyortiran.
37. **Apakah menjual langsung ke konsumen lebih menguntungkan bagi petani?** Berpotensi margin lebih tinggi, namun membutuhkan akses logistik dan pemasaran mandiri yang tidak semua petani miliki.
38. **Bagaimana pengaruh kelompok tani terhadap harga jual petani?** Kelompok tani/Gapoktan dapat meningkatkan kekuatan tawar kolektif dan akses informasi pasar yang lebih baik.
39. **Apa itu champion bawang merah?** Petani penggerak yang menjadi mitra pemerintah dalam mendukung stabilisasi pasokan dan harga nasional.
40. **Apakah ada risiko menanam bawang merah dibanding komoditas lain?** Ya, penelitian menunjukkan risiko produksi bawang merah tergolong tinggi akibat sensitivitas terhadap cuaca, hama, dan penyakit.
41. **Bagaimana cara mengetahui apakah tahun ini panen raya atau bukan?** Pantau laporan luas tanam dan estimasi panen dari Dinas Pertanian Kabupaten Nganjuk serta pemberitaan resmi terkait kondisi lapangan terkini.
42. **Apakah cold storage tersedia untuk petani kecil di Nganjuk?** Adopsi cold storage di tingkat petani kecil masih terbatas; sebagian besar penyimpanan masih menggunakan metode tradisional.
43. **Apa manfaat cold storage bagi harga jual?** Memperpanjang masa simpan berkualitas, memberi fleksibilitas waktu jual untuk menghindari harga rendah saat panen raya.
44. **Berapa produktivitas rata-rata bawang merah di Nganjuk?** Berdasarkan referensi penelitian, produktivitas berkisar sekitar 8-15 ton per hektar tergantung teknik budidaya dan kondisi lahan; angka pasti bervariasi antar musim dan lokasi.
45. **Apakah harga bawang merah dipengaruhi kondisi ekonomi makro (inflasi)?** Ya, bawang merah termasuk komoditas volatile food yang dipantau ketat karena kontribusinya terhadap inflasi bahan pangan.
46. **Apa yang dimaksud dengan volatile food?** Kelompok bahan pangan dengan harga yang cenderung sangat fluktuatif, termasuk bawang merah, cabai, dan beberapa komoditas hortikultura lain.
47. **Apakah petani bisa memprediksi harga jauh sebelum panen?** Prediksi jangka menengah memiliki ketidakpastian tinggi, namun dapat diperkirakan berdasarkan pola musiman, kondisi luas tanam regional, dan prakiraan cuaca.
48. **Apakah sistem AI dapat memberi rekomendasi harga yang pasti?** Sistem AI dapat memberi rekomendasi berbasis pola dan data historis, namun tidak dapat menjamin kepastian harga karena banyak faktor eksternal yang dinamis.
49. **Bagaimana jika data harga terbaru tidak tersedia dalam sistem?** Sistem harus menyatakan keterbatasan data secara eksplisit dan menyarankan verifikasi ke sumber resmi, bukan menduga angka.
50. **Apakah harga bawang merah Nganjuk memengaruhi harga nasional?** Ya, karena Nganjuk adalah salah satu barometer pasokan bawang merah nasional, kondisi pasokan di Nganjuk turut memengaruhi tren harga regional dan nasional.
51. **Apa perbedaan harga bawang merah rogol basah dan rogol kering?** Rogol kering (setelah proses pengeringan) umumnya menjadi standar jual dengan harga berbeda dari kondisi basah langsung panen karena perbedaan bobot air dan daya simpan.
52. **Apakah harga bawang merah dipengaruhi nilai tukar Rupiah?** Secara tidak langsung, terutama melalui biaya input impor (pupuk, pestisida) dan potensi ekspor-impor komoditas terkait.
53. **Bagaimana strategi terbaik menghadapi harga yang sangat fluktuatif?** Diversifikasi waktu jual (tidak menjual seluruh stok sekaligus), menjaga kualitas simpan, dan memanfaatkan informasi pasar terkini.
54. **Apakah bergabung koperasi membantu menghadapi fluktuasi harga?** Ya, koperasi/kelompok tani dapat membantu koordinasi pola tanam, akses informasi, dan kekuatan tawar kolektif.
55. **Apa dampak libur panjang nasional terhadap distribusi bawang merah?** Dapat menghambat operasional pasar dan distribusi, menyebabkan penumpukan pasokan sementara di tingkat petani/pengepul.
56. **Apakah harga bawang merah bibit selalu lebih tinggi dari harga konsumsi?** Berdasarkan data yang tersedia cenderung demikian, terutama menjelang musim tanam baru, namun perbedaan harga dapat bervariasi tergantung kondisi pasar tahun berjalan.
57. **Bagaimana cara memastikan kualitas umbi tetap baik selama distribusi?** Penyortiran yang tepat, pengemasan yang menjaga sirkulasi udara, dan menghindari kelembapan berlebih selama transportasi.
58. **Apakah harga bawang merah di pasar modern berbeda dengan pasar tradisional?** Umumnya berbeda karena standar kualitas, kemasan, dan margin rantai pasok pasar modern yang lebih kompleks.
59. **Apa yang harus dilakukan jika harga jual dari pengepul dirasa terlalu rendah?** Bandingkan harga dengan pengepul lain atau pasar induk, dan verifikasi terhadap HAP/harga acuan resmi sebagai dasar negosiasi.
60. **Apakah data yang digunakan SIMANTRI selalu real-time?** Tidak selalu; dokumen ini menyusun data berdasarkan sumber yang tersedia pada saat penyusunan, dan menyarankan verifikasi ke sumber resmi untuk data harga real-time.
61. **Apa yang membuat Nganjuk disebut barometer nasional bawang merah?** Karena skala produksinya yang besar dan konsistensi pasokannya turut memengaruhi kondisi pasokan dan harga bawang merah secara regional maupun nasional.
62. **Apakah ada risiko gagal panen total di Nganjuk?** Risiko ada, terutama akibat banjir lahan, kekeringan ekstrem, atau serangan hama-penyakit skala luas, meski tidak terjadi di setiap musim tanam.

---

# AI Context

## Summary for AI

Dokumen ini adalah basis pengetahuan pasar mengenai harga bawang merah (brambang) di Kabupaten Nganjuk, Jawa Timur, yang berfungsi sebagai sentra produksi bawang merah terbesar di Jawa Timur sekaligus barometer pasokan nasional. Sistem AI (SIMANTRI) harus memahami bahwa harga bawang merah dibentuk oleh interaksi dinamis antara penawaran (supply) dan permintaan (demand) yang sangat dipengaruhi oleh pola musiman lokal yang disebut Fase Raya dan tiga periode Labuhan (Labuhan 1, 2, 3). Musim tanam utama umumnya dimulai sekitar bulan Juni, dengan umur panen 55-70 hari, dan panen raya besar sering terjadi pada periode akhir tahun hingga awal tahun berikutnya (sekitar Desember-Maret), meski pola ini dapat bergeser tergantung cuaca dan giliran tanam antarkecamatan (Sukomoro, Rejoso, Gondang di wilayah timur; Bagor, Wilangan di wilayah barat).

Harga bergerak sangat fluktuatif dalam hitungan hari hingga minggu. Data konkret yang tersedia menunjukkan harga di tingkat petani pernah naik dari Rp 20.000 menjadi Rp 23.000 per kilogram dalam tiga hari akibat permintaan meningkat dan cuaca memengaruhi produksi (Maret 2026), namun pada periode lain harga justru turun ke Rp 16.000-17.000 per kilogram saat panen melimpah, mendorong petani menahan hasil sebagai bibit yang harganya jauh lebih tinggi (Rp 57.000-60.000 per kilogram). Pemerintah menetapkan Harga Acuan Pembelian (HAP) pada kisaran Rp 25.000-30.000 per kilogram untuk rogol kering panen sebagai instrumen stabilisasi, meski angka ini dapat berubah dan perlu diverifikasi terhadap sumber terbaru.

Struktur pasar melibatkan petani, pengepul desa, pedagang pasar induk (terutama Pasar Sukomoro), pedagang antar-daerah ke Kediri, Jombang, Madiun, Magetan, dan Bojonegoro, pedagang grosir kota, pengecer, konsumen akhir, serta segmen ekspor-impor pada level nasional. Setiap simpul distribusi menambah margin sehingga harga di tingkat petani selalu lebih rendah daripada harga konsumen akhir.

Pendorong harga utama meliputi curah hujan dan cuaca, musim tanam-panen, volume pasokan yang masuk pasar, permintaan musiman (terutama menjelang Ramadan, Idul Fitri, dan Natal-Tahun Baru), biaya transportasi, kebijakan HAP dan operasi pasar pemerintah, harga bahan bakar, potensi ekspor, harga bibit, serta serangan hama dan penyakit tanaman (terutama ulat bawang, thrips, busuk umbi, layu fusarium, dan antraknosa). Varietas dominan yang ditanam adalah Tajuk, Manjung, dan Bauji, dengan Bauji dikenal sebagai varietas lokal premium dengan daya simpan terbaik.

Untuk mendukung Decision Support System, dokumen ini menyediakan lebih dari 40 aturan keputusan (decision rules) berbasis logika IF-THEN yang menghubungkan kondisi bulan, cuaca, status panen, ketersediaan gudang, dan tren harga dengan rekomendasi tindakan bagi petani (jual segera, tahan sebagian, alihkan ke bibit, percepat panen, dan seterusnya), serta lebih dari 50 aturan mesin (rule engine) tambahan dan lebih dari 30 skenario praktis petani yang mencakup kondisi nyata seperti harga anjlok, panen bersamaan, gudang tersedia, hujan panjang, dan target penjualan menjelang Idul Fitri.

Dokumen ini secara eksplisit mengakui keterbatasan data: tidak tersedia deret waktu harga harian/bulanan yang lengkap dan tervalidasi dalam rentang panjang di dalam dokumen ini. Data konkret yang dicantumkan bersifat titik-waktu (snapshot) dari pemberitaan resmi dan publikasi instansi pemerintah (BPS, Direktorat Jenderal Hortikultura Kementan, ANTARA, detikJatim, Tempo, Radar Nganjuk, satudata.pertanian.go.id). Untuk kebutuhan prediksi harga presisi tinggi berbasis machine learning, sistem AI disarankan mengintegrasikan sumber data time-series resmi seperti SISKAPERBAPO Jawa Timur, PIHPS Nasional, dan Panel Harga Pangan Bapanas, alih-alih hanya mengandalkan dokumen kualitatif ini.

Ketika menjawab pertanyaan pengguna, sistem AI harus: (1) memprioritaskan informasi Kabupaten Nganjuk sebelum wilayah lain sesuai urutan geografis prioritas (Nganjuk, Kediri, Jombang, Madiun, Magetan, Bojonegoro, Jawa Timur, Indonesia, internasional); (2) menyatakan secara eksplisit apabila data harga real-time atau angka pasti tidak tersedia, tanpa mengarang angka; (3) mengaitkan rekomendasi dengan konteks bulan, fase tanam (Fase Raya/Labuhan), dan kondisi cuaca yang relevan; dan (4) memberikan rekomendasi actionable yang jelas, seperti jual segera, tahan/simpan, atau alihkan ke bibit, disertai alasan singkat berbasis pola yang telah didokumentasikan.

## Decision Keywords

Price, Harga, Market, Pasar, Supply, Pasokan, Demand, Permintaan, Harvest, Panen, Storage, Simpan/Gudang, Weather, Cuaca, Festival/HBKN, Ramadan, Idul Fitri, Nataru, Planting Season, Musim Tanam, Fase Raya, Labuhan, Bulan (Januari-Desember), Varietas (Bauji, Tajuk, Manjung), HAP, Pasar Sukomoro, Bibit, Rogol Kering Panen.

## AI Recommendation Logic

**Rekomendasi strategi jual:** Sistem AI harus mengevaluasi kombinasi bulan berjalan, status panen (raya/bukan raya), tren harga jangka pendek (naik/turun/stabil), dan kedekatan dengan HBKN (Ramadan, Idul Fitri, Nataru). Jika kondisi menunjukkan panen raya serentak dengan tren harga turun, sistem merekomendasikan penjualan bertahap dan menghindari penjualan seluruh stok sekaligus. Jika mendekati HBKN dengan pasokan menipis, sistem merekomendasikan menahan sebagian stok untuk menangkap harga puncak, dengan tetap mempertimbangkan risiko penyusutan kualitas.

**Rekomendasi strategi simpan:** Sistem AI harus mengevaluasi ketersediaan gudang/fasilitas simpan, kualitas umbi (dipengaruhi cuaca dan serangan hama-penyakit), dan selisih harga bibit versus harga konsumsi. Jika gudang tersedia dan kualitas baik serta harga bibit jauh lebih tinggi dari harga konsumsi, sistem merekomendasikan menyimpan sebagian hasil sebagai bibit. Jika gudang tidak tersedia atau kualitas umbi buruk (akibat penyakit/hama), sistem merekomendasikan penjualan segera untuk menghindari kerugian lebih besar akibat penyusutan.

**Estimasi peluang pasar:** Sistem AI mengestimasi peluang pasar dengan menggabungkan kalender musiman (bulan, Fase Raya/Labuhan), indikator cuaca (curah hujan, prakiraan BMKG), dan kedekatan dengan periode permintaan tinggi (HBKN). Peluang dinilai tinggi ketika pasokan diperkirakan rendah namun permintaan diperkirakan tinggi (misalnya menjelang Idul Fitri dengan pasokan lokal menipis), dan dinilai berisiko ketika terdapat indikasi panen raya serentak regional (Nganjuk dan sentra lain seperti Brebes) yang berpotensi menekan harga secara luas.

Dalam seluruh proses rekomendasi, sistem AI wajib menyertakan tingkat keyakinan (confidence) dan menyatakan secara eksplisit ketika data pendukung tidak lengkap atau tidak terverifikasi, sesuai prinsip tidak mengarang data yang dianut SIMANTRI.

---

# Knowledge Graph

```
Curah Hujan Tinggi
   ↓
Risiko Busuk Umbi Naik
   ↓
Kualitas & Volume Panen Turun
   ↓
Pasokan ke Pasar Berkurang
   ↓
Harga Naik (untuk kualitas baik) / Harga Anjlok (untuk kualitas rendah)
   ↓
Pendapatan Petani Tidak Pasti

Panen Raya Serentak (Fase Raya)
   ↓
Volume Pasokan Melimpah
   ↓
Harga di Tingkat Petani Turun
   ↓
Petani Menahan Hasil Sebagai Bibit
   ↓
Harga Bibit Naik / Pasokan Konsumsi Berkurang Sementara

Mendekati Ramadan-Idul Fitri
   ↓
Permintaan Rumah Tangga & Katering Naik
   ↓
Jika Pasokan Terbatas Pada Periode Sama
   ↓
Harga Naik Signifikan
   ↓
Peluang Pendapatan Tinggi Bagi Petani Bersisa Stok

Kenaikan Harga BBM
   ↓
Biaya Distribusi & Produksi (Irigasi) Naik
   ↓
Margin Petani/Pedagang Tertekan
   ↓
Potensi Harga Jual Naik Untuk Menutup Biaya

Serangan Hama/Penyakit Skala Regional
   ↓
Produksi Regional Turun
   ↓
Pasokan Nasional/Regional Berkurang
   ↓
Harga Cenderung Naik Meski Permintaan Tetap
```

---

# Rule Engine

1. IF Supply Tinggi MAKA Price Turun.
2. IF Supply Rendah MAKA Price Naik.
3. IF Demand Naik (Holiday/HBKN) MAKA Price Naik.
4. IF Demand Turun (Pasca HBKN) MAKA Price Turun.
5. IF Bulan = Panen Raya MAKA Supply = Tinggi.
6. IF Bulan = Awal Musim Tanam MAKA Supply Konsumsi = Rendah.
7. IF Curah Hujan Tinggi Saat Umbi Terbentuk MAKA Risiko Penyakit Naik.
8. IF Risiko Penyakit Naik MAKA Kualitas Panen Turun.
9. IF Kualitas Panen Turun MAKA Harga Segmen Premium Naik, Harga Segmen Rendah Turun.
10. IF Kemarau Panjang MAKA Produktivitas Berpotensi Turun.
11. IF Produktivitas Turun MAKA Supply Regional Turun.
12. IF Serangan Hama Terdeteksi MAKA Kualitas Panen Berisiko Turun.
13. IF Harga Bibit Tinggi MAKA Petani Cenderung Menahan Hasil Panen.
14. IF Petani Menahan Hasil Panen MAKA Supply Konsumsi Turun Sementara.
15. IF Supply Konsumsi Turun Sementara MAKA Harga Konsumsi Berpotensi Naik.
16. IF HAP Ditetapkan Naik MAKA Harga Acuan Minimum Petani Naik.
17. IF Harga Pasar < HAP MAKA Petani Berisiko Rugi Dibanding Acuan Pemerintah.
18. IF Biaya BBM Naik MAKA Biaya Distribusi Naik.
19. IF Biaya Distribusi Naik MAKA Disparitas Harga Antarwilayah Melebar.
20. IF Panen Terjadi di Banyak Kecamatan Bersamaan MAKA Oversupply Lokal Terjadi.
21. IF Oversupply Lokal Terjadi MAKA Harga Tingkat Petani Turun Tajam.
22. IF Permintaan Ekspor Naik MAKA Sebagian Supply Domestik Terserap Pasar Ekspor.
23. IF Supply Domestik Terserap Ekspor MAKA Harga Domestik Berpotensi Naik/Stabil.
24. IF Stok Nasional Surplus MAKA Harga Nasional Cenderung Tertekan.
25. IF Stok Nasional Defisit MAKA Harga Nasional Cenderung Naik.
26. IF Gudang Tersedia DAN Harga Rendah MAKA Rekomendasi Simpan.
27. IF Gudang Tidak Tersedia DAN Harga Rendah MAKA Rekomendasi Jual Segera.
28. IF Umur Tanaman < 55 Hari MAKA Panen Belum Direkomendasikan.
29. IF Umur Tanaman 55-70 Hari MAKA Panen Direkomendasikan (kondisi normal).
30. IF Umur Tanaman > 70 Hari DAN Cuaca Basah MAKA Risiko Kualitas Turun, Percepat Panen.
31. IF Varietas = Bauji MAKA Potensi Segmen Harga Premium/Bibit Lebih Tinggi.
32. IF Varietas = Tajuk/Manjung MAKA Cocok Untuk Volume Besar/Segmen Umum.
33. IF Champion Petani Aktif di Wilayah MAKA Akses Informasi Pasar Lebih Baik.
34. IF Akses Informasi Pasar Lebih Baik MAKA Keputusan Jual Lebih Terinformasi.
35. IF Kelompok Tani/Gapoktan Aktif MAKA Kekuatan Tawar Petani Meningkat.
36. IF Data Harga Real-Time Tidak Tersedia MAKA Sistem Menyatakan Keterbatasan Data.
37. IF Terjadi Anomali Cuaca (La Nina/El Nino) MAKA Pola Musiman Standar Berpotensi Bergeser.
38. IF Pola Musiman Bergeser MAKA Prediksi Harga Berbasis Kalender Standar Perlu Disesuaikan.
39. IF Industri Olahan Menawarkan Kontrak Volume MAKA Opsi Diversifikasi Penjualan Tersedia.
40. IF Petani Mengontrakkan Sebagian Hasil MAKA Risiko Fluktuasi Harga Spot Terdiversifikasi.
41. IF Jarak Distribusi ke Pasar Tujuan Jauh MAKA Margin Bersih Berpotensi Berkurang.
42. IF Margin Bersih Berkurang Akibat Jarak MAKA Prioritaskan Pasar/Pengepul Terdekat.
43. IF Libur Nasional Panjang Bertepatan Panen MAKA Distribusi Berpotensi Terhambat Sementara.
44. IF Distribusi Terhambat MAKA Pasokan Menumpuk di Tingkat Petani/Pengepul.
45. IF Pasokan Menumpuk MAKA Tekanan Harga Turun Sementara Meningkat.
46. IF Cold Storage Tersedia MAKA Fleksibilitas Waktu Jual Meningkat.
47. IF Fleksibilitas Waktu Jual Meningkat MAKA Risiko Jual Paksa Saat Harga Rendah Berkurang.
48. IF Rumor Kelangkaan Beredar Tanpa Verifikasi MAKA Sistem AI Tidak Boleh Menjadikannya Dasar Rekomendasi.
49. IF Data Terverifikasi dari Sumber Resmi Tersedia MAKA Sistem AI Memprioritaskan Data Tersebut Dibanding Persepsi Lapangan Individual.
50. IF Kondisi Pasar Ambigu (sinyal naik dan turun bersamaan) MAKA Sistem AI Memberikan Rekomendasi Bertingkat (jual sebagian, simpan sebagian) Alih-Alih Rekomendasi Ekstrem Tunggal.
51. IF Musim Tanam Baru Dimulai (~Juni) MAKA Permintaan Bibit Naik Signifikan.
52. IF Permintaan Bibit Naik Signifikan MAKA Harga Bibit Naik Melebihi Harga Konsumsi.

---

# Search Intent Coverage

Harga bawang hari ini; Harga bawang merah hari ini Nganjuk; Harga bawang minggu ini; Harga bawang merah bulan ini; Harga bawang merah bulan Januari; Harga bawang merah bulan Februari; Harga bawang merah bulan Maret; Harga bawang merah bulan April; Harga bawang merah bulan Mei; Harga bawang merah bulan Juni; Harga bawang merah bulan Juli; Harga bawang merah bulan Agustus; Harga bawang merah bulan September; Harga bawang merah bulan Oktober; Harga bawang merah bulan November; Harga bawang merah bulan Desember; Harga bawang merah Nganjuk; Harga bawang merah Kediri; Harga bawang merah Jombang; Harga bawang merah Madiun; Harga bawang merah Magetan; Harga bawang merah Bojonegoro; Harga bawang merah Jawa Timur; Harga bawang merah nasional; Harga Pasar Induk Sukomoro; Harga pasar induk bawang merah; Harga panen raya bawang merah; Harga bawang merah saat panen raya; Lebih baik jual kapan; Kapan waktu jual terbaik bawang merah; Kapan harga bawang merah naik; Kapan harga bawang merah turun; Kenapa harga bawang merah turun; Kenapa harga bawang merah naik; Penyebab harga bawang merah anjlok; Penyebab harga bawang merah melonjak; Harga bawang merah menjelang Ramadan; Harga bawang merah saat Idul Fitri; Harga bawang merah Lebaran; Harga bawang merah Natal Tahun Baru; Harga bawang merah Nataru; Harga acuan pembelian bawang merah; HAP bawang merah terbaru; Harga bibit bawang merah; Harga bibit bawang merah Nganjuk; Selisih harga bibit dan konsumsi bawang merah; Harga bawang merah rogol kering; Harga bawang merah rogol basah; Strategi jual bawang merah; Strategi simpan bawang merah; Kapan sebaiknya panen bawang merah; Umur panen bawang merah; Cara menyimpan bawang merah agar tahan lama; Cara menghindari busuk umbi bawang merah; Penyebab busuk umbi bawang merah; Hama bawang merah Nganjuk; Ulat bawang merah; Penyakit bawang merah; Cara mengatasi ulat bawang; Dampak hujan terhadap harga bawang merah; Dampak kemarau terhadap harga bawang merah; Prakiraan cuaca bawang merah Nganjuk; Musim tanam bawang merah Nganjuk; Fase Raya bawang merah; Labuhan 1 bawang merah; Labuhan 2 bawang merah; Labuhan 3 bawang merah; Varietas bawang merah Nganjuk; Varietas Bauji; Varietas Tajuk; Varietas Manjung; Perbandingan varietas Bauji dan Tajuk; Luas panen bawang merah Nganjuk; Produksi bawang merah Nganjuk; Produktivitas bawang merah Nganjuk; Data BPS bawang merah Nganjuk; Sentra produksi bawang merah Jawa Timur; Kabupaten penghasil bawang merah terbesar Jawa Timur; Ekspor bawang merah Indonesia; Impor bawang merah Indonesia; Kebijakan pemerintah harga bawang merah; Operasi pasar bawang merah; Champion bawang merah Nganjuk; Gapoktan bawang merah Nganjuk; Kelompok tani bawang merah; Koperasi bawang merah; Distribusi bawang merah Nganjuk; Rantai pasok bawang merah; Pengepul bawang merah Nganjuk; Pedagang pasar bawang merah; Margin harga bawang merah; Disparitas harga bawang merah antarwilayah; Biaya produksi bawang merah; Break even point usaha tani bawang merah; Keuntungan usaha tani bawang merah; ROI usaha tani bawang merah; Risiko usaha tani bawang merah; Analisis risiko produksi bawang merah; Cold storage bawang merah; Manfaat cold storage bawang merah; Penjualan online bawang merah; Pasar bawang merah online; Industri olahan bawang merah; Bawang goreng Nganjuk; Kontrak jual bawang merah; Inflasi bawang merah; Volatile food bawang merah; Prediksi harga bawang merah; Model prediksi harga bawang merah; Data time series harga bawang merah; SISKAPERBAPO bawang merah; PIHPS bawang merah; Panel harga Bapanas bawang merah; Sumber data resmi harga bawang merah; Berita harga bawang merah terbaru; Update harga bawang merah Nganjuk; Grafik harga bawang merah; Tren harga bawang merah tahun ini; Perbandingan harga bawang merah tahun lalu.

---

# Machine Learning Features

```yaml
features:
  temporal:
    - month  # 1-12, representasi bulan berjalan
    - week_of_year
    - is_ramadan  # boolean
    - is_idul_fitri_window  # boolean, +/- 14 hari
    - is_nataru_window  # boolean
    - planting_phase  # kategori: fase_raya, labuhan_1, labuhan_2, labuhan_3
    - days_since_planting
    - days_to_expected_harvest
  weather:
    - rainfall_mm
    - humidity_percent
    - temperature_celsius
    - anomaly_flag  # La Nina / El Nino indikator
  supply_side:
    - supply_volume_kg
    - harvest_area_ha
    - production_volume_ton
    - productivity_ton_per_ha
    - variety  # kategori: bauji, tajuk, manjung, lainnya
    - pest_disease_incidence_flag
    - quality_grade  # premium, standar, rendah
  demand_side:
    - demand_index
    - holiday_flag
    - industrial_demand_volume
    - export_demand_flag
  price:
    - market_price_farmgate  # Rp/kg tingkat petani
    - market_price_wholesale  # Rp/kg pasar induk
    - market_price_retail  # Rp/kg konsumen
    - hap_reference_price  # Rp/kg acuan pemerintah
    - seed_price  # Rp/kg harga bibit
  cost_logistics:
    - fuel_price_index
    - transportation_cost_per_km
    - storage_duration_days
    - storage_method  # tradisional, cold_storage
  location:
    - kecamatan  # Sukomoro, Rejoso, Gondang, Bagor, Wilangan, Berbek, dll.
    - kabupaten  # Nganjuk, Kediri, Jombang, Madiun, Magetan, Bojonegoro
    - distance_to_pasar_induk_km
  target:
    - market_price_farmgate_next_period  # target prediksi harga periode berikutnya
```

---

# Related Documents

- fase-raya.md
- fase-labuhan-1.md
- fase-labuhan-2.md
- fase-labuhan-3.md
- varietas-bauji.md
- varietas-tajuk.md
- curah-hujan.md
- post-harvest.md
- pasar-induk-sukomoro.md
- distribusi-bawang-merah.md
- ekspor-impor-bawang-merah.md
- cold-storage-bawang-merah.md
- permintaan-pasar.md
- panen-raya.md
- supply-demand-bawang-merah.md
- hari-besar-nasional.md

**Catatan:** Dokumen-dokumen di atas merupakan referensi silang yang direncanakan sebagai bagian dari basis pengetahuan SIMANTRI secara keseluruhan. Sebagian dokumen mungkin belum tersedia pada saat dokumen ini disusun; RAG pipeline sebaiknya memvalidasi ketersediaan file sebelum melakukan retrieval lintas dokumen.

---

# References

- Badan Pusat Statistik (BPS) Kabupaten Nganjuk — data luas panen dan produksi bawang merah menurut kecamatan (nganjukkab.bps.go.id).
- Direktorat Jenderal Hortikultura, Kementerian Pertanian RI — "Champion Bawang Merah Nganjuk Siap Bantu Amankan Pasokan untuk Ramadhan dan Idul Fitri" (hortikultura.pertanian.go.id).
- Satu Data Pertanian, Kementerian Pertanian RI — "Outlook Bawang Merah 2023" (satudata.pertanian.go.id).
- Agronews.id — "Nganjuk Panen Raya, Pemerintah Yakin Stok dan Harga Bawang Merah Stabil Hingga Lebaran 2026".
- detikJatim — "Harga Bawang Merah di Nganjuk Turun, Petani Pilih Simpan Jadi Bibit" (10 Maret 2026).
- ANTARA News Jawa Timur — "Kenaikan harga bawang merah di Nganjuk" (9 Maret 2026).
- Tempo.co — "Harga Bawang Merah Melonjak di Nganjuk" (9 Maret 2026).
- Radar Nganjuk (Jawa Pos) — "Harga Bawang Merah di Nganjuk Anjlok" (3 Juni 2026).
- SISKAPERBAPO Provinsi Jawa Timur — Tabel Harga Produsen dan Konsumen (siskaperbapo.jatimprov.go.id).
- Pemerintah Kabupaten Nganjuk — "Brambang Kemenangan Nganjuk Menjadi Sentra Tanaman Hortikultura Bawang Merah Terbesar di Jatim" (nganjukkab.go.id).
- Mimbar Agribisnis: Jurnal Pemikiran Masyarakat Ilmiah Berwawasan Agribisnis — penelitian risiko dan faktor produksi bawang merah di Kecamatan Rejoso dan Sukomoro, Kabupaten Nganjuk.
- Jurnal Efisiensi Teknis Usahatani Bawang Merah di Kabupaten Nganjuk (2025) — data produksi Jawa Timur dan analisis efisiensi teknis.
- Agrika Journal — "Produksi Bawang Merah dengan Pemberian Pembenah Tanah di Kabupaten Nganjuk".

**Catatan keterbatasan referensi:** Dokumen ini belum menyertakan data langsung dari Panel Harga Pangan Bapanas dan PIHPS Nasional karena keterbatasan akses data time-series dalam proses penyusunan; kedua sumber tersebut sangat direkomendasikan sebagai pelengkap untuk pembaruan data harga harian/bulanan secara berkala. Dokumen ini tidak mengarang angka atau tren yang tidak didukung sumber yang tercantum di atas.
