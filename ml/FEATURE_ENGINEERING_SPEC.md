# Spesifikasi Feature Engineering Model Prediksi Harga SIMANTRI

Model: XGBoost Regressor (`xgboost_price_forecast.json` / `.pkl`)  
Dataset Target: Harga Bawang Merah (IDR)  
Evaluasi: MAPE ~3.0%

## 23 Urutan Fitur Input Wajib (Exact Order)

| Indeks | Nama Fitur | Deskripsi | Formula / Sumber |
|---|---|---|---|
| 0 | `Temperature` | Suhu udara harian (°C) | Open-Meteo API / cache `weather_data` |
| 1 | `Rainfall` | Curah hujan harian (mm) | Open-Meteo API / cache `weather_data` |
| 2 | `Rain7` | Akumulasi curah hujan 7 hari terakhir (mm) | Sum(Rainfall hari t s.d. t-6) |
| 3 | `WindSpeed` | Kecepatan angin harian (km/h) | Open-Meteo API / cache `weather_data` |
| 4 | `Month` | Bulan target (1–12) | Tanggal target .month |
| 5 | `Day` | Hari target (1–31) | Tanggal target .day |
| 6 | `Weekday` | Hari dalam minggu (0=Senin, 6=Minggu) | Tanggal target .weekday() |
| 7 | `WeekOfYear` | Nomor minggu dalam tahun (1–53) | Tanggal target .isocalendar().week |
| 8 | `Lag1` | Harga bawang merah 1 hari sebelumnya | Harga pada t-1 |
| 9 | `Lag3` | Harga bawang merah 3 hari sebelumnya | Harga pada t-3 |
| 10 | `Lag7` | Harga bawang merah 7 hari sebelumnya | Harga pada t-7 |
| 11 | `Lag14` | Harga bawang merah 14 hari sebelumnya | Harga pada t-14 |
| 12 | `Lag30` | Harga bawang merah 30 hari sebelumnya | Harga pada t-30 |
| 13 | `MA7` | Rata-rata bergerak harga 7 hari terakhir | Mean(Harga t-1 s.d. t-7) |
| 14 | `MA14` | Rata-rata bergerak harga 14 hari terakhir | Mean(Harga t-1 s.d. t-14) |
| 15 | `MA30` | Rata-rata bergerak harga 30 hari terakhir | Mean(Harga t-1 s.d. t-30) |
| 16 | `STD7` | Standar deviasi harga 7 hari terakhir | StdDev(Harga t-1 s.d. t-7) |
| 17 | `STD14` | Standar deviasi harga 14 hari terakhir | StdDev(Harga t-1 s.d. t-14) |
| 18 | `EMA7` | Exponential Moving Average 7 hari | Span 7 EMA dari deret harga historis |
| 19 | `EMA14` | Exponential Moving Average 14 hari | Span 14 EMA dari deret harga historis |
| 20 | `Max7` | Harga tertinggi dalam 7 hari terakhir | Max(Harga t-1 s.d. t-7) |
| 21 | `Min7` | Harga terendah dalam 7 hari terakhir | Min(Harga t-1 s.d. t-7) |
| 22 | `Range7` | Rentang fluktuasi harga 7 hari | Max7 - Min7 |
