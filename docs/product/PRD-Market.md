# SIMANTRI — Market Intelligence Agent (PRD)

## 1. Overview

SIMANTRI Market Agent adalah modul dalam platform SIMANTRI yang menyediakan informasi harga bawang merah secara real-time serta prediksi harga hingga 7 hari ke depan menggunakan model Machine Learning berbasis XGBoost.

Modul ini dirancang untuk membantu petani dalam mengambil keputusan terkait penjualan, distribusi, dan waktu panen berdasarkan tren harga pasar.

---

## 2. Objectives

- Menyediakan harga pasar bawang merah terkini
- Memberikan prediksi harga jangka pendek (1–7 hari)
- Mengintegrasikan data cuaca sebagai faktor eksternal
- Meningkatkan akurasi pengambilan keputusan petani

---

## 3. Problem Statement

- Petani tidak memiliki akses mudah terhadap informasi harga harian
- Tidak tersedia sistem prediksi harga berbasis data
- Data harga dan cuaca tidak terintegrasi
- Keputusan masih berbasis asumsi, bukan data

---

## 4. Solution

SIMANTRI Market Agent menyediakan:

1. Input harga harian oleh admin
2. Integrasi data cuaca dari Open-Meteo
3. Feature engineering otomatis
4. Prediksi harga menggunakan model XGBoost
5. Penyimpanan hasil ke database
6. Tampilan harga dan prediksi untuk user

---

## 5. Key Features

### 5.1 Input Harga Harian

- Admin dapat memasukkan harga bawang merah setiap hari
- Data disimpan ke database (market_price)
- Mendukung update (overwrite) berdasarkan tanggal

### 5.2 Forecast Engine (XGBoost)

- Menggunakan model `.pkl` hasil training
- Input:
  - Harga historis
  - Data cuaca
  - Time-based features
- Output:
  - Prediksi harga 7 hari ke depan

### 5.3 Integrasi Cuaca (Open-Meteo)

Data yang digunakan:
- Temperature
- Rainfall
- Wind Speed

Digunakan sebagai feature dalam model ML

### 5.4 Scheduler (Otomatis)

- Sistem berjalan otomatis setiap hari
- Menghasilkan prediksi terbaru berdasarkan data terbaru
- Alternatif: trigger langsung setelah input admin

### 5.5 Tampilan User

User dapat melihat:
- Harga hari ini
- Prediksi besok
- Prediksi 7 hari
- Grafik tren harga

---

## 6. System Architecture

```
Admin Input Harga
      ↓
Database (market_price)
      ↓
Fetch Weather (Open-Meteo)
      ↓
Feature Engineering
      ↓
Model XGBoost
      ↓
Forecast 7 Hari
      ↓
Database (market_forecast)
      ↓
Frontend (Web SIMANTRI)
```

---

## 7. Data Model

### 7.1 market_price

| Field       | Type     | Description              |
|-------------|----------|---------------------------|
| id          | integer  | Primary key               |
| tanggal     | date     | Unique date                |
| harga       | float    | Harga bawang merah        |
| source      | string   | manual / scraping         |
| created_at  | datetime | Timestamp                  |

### 7.2 market_forecast

| Field           | Type     | Description              |
|-----------------|----------|---------------------------|
| id              | integer  | Primary key               |
| tanggal         | date     | Tanggal prediksi          |
| prediksi_harga  | float    | Hasil prediksi            |
| created_at      | datetime | Timestamp                  |

### 7.3 weather_data (optional)

| Field       | Type   | Description      |
|-------------|--------|-------------------|
| id          | int    | Primary key       |
| tanggal     | date   | Tanggal           |
| temperature | float  | Suhu              |
| rainfall    | float  | Curah hujan       |
| wind_speed  | float  | Kecepatan angin   |

---

## 8. API Endpoints

### POST /api/market/price

Input harga harian

Request:
```json
{
  "tanggal": "2026-07-27",
  "harga": 19400
}
```

### GET /api/market/forecast

Mengambil hasil prediksi

Response:
```json
[
  {
    "tanggal": "2026-07-28",
    "harga": 19620
  }
]
```

---

## 9. Machine Learning Pipeline

**Model:**
- XGBoost Regressor

**Features:**
- Lag (1, 3, 7, 14, 30)
- Moving Average (MA7, MA14, MA30)
- EMA (EMA7, EMA14)
- STD (STD7, STD14)
- Rain7 (akumulasi hujan)
- Time Features (Month, Day, Weekday, WeekOfYear)
- Weather (Temperature, Rainfall, WindSpeed)

---

## 10. Workflow

1. Admin input harga
2. Data masuk ke database
3. Backend fetch data cuaca
4. Feature engineering dilakukan
5. Model menghasilkan prediksi
6. Hasil disimpan ke database
7. Frontend menampilkan data

---

## 11. Constraints

- Tidak tersedia API resmi untuk harga (manual input)
- Ketergantungan pada Open-Meteo API
- Model perlu retraining secara berkala

---

## 12. Edge Cases

- Data harga tidak tersedia → forecast tidak dijalankan
- API cuaca gagal → fallback ke data sebelumnya
- Input duplikat → overwrite

---

## 13. Success Metrics

- MAPE < 10%
- Data update harian 100%
- Response API < 500ms
- User retention meningkat

---

## 14. Future Improvements

- Integrasi scraping otomatis (PIHPS)
- Retraining model otomatis
- Multi-region forecasting
- Notifikasi harga naik/turun
- Integrasi chatbot AI

---

## 15. Tech Stack

- **Backend:** FastAPI
- **Database:** PostgreSQL
- **ML Model:** XGBoost
- **Weather API:** Open-Meteo
- **Deployment:** Railway / VPS

---

## 16. Conclusion

SIMANTRI Market Agent adalah sistem AI berbasis data yang menggabungkan harga historis dan data cuaca untuk menghasilkan prediksi harga yang akurat dan actionable bagi petani.
