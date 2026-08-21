import os
import datetime
import numpy as np
import pandas as pd
import xgboost as xgb
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any

app = FastAPI(
    title="SIMANTRI Price Forecast Engine",
    description="XGBoost price forecasting engine for shallot market in Nganjuk",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Feature names in exact order
FEATURE_NAMES = [
    "Temperature", "Rainfall", "Rain7", "WindSpeed",
    "Month", "Day", "Weekday", "WeekOfYear",
    "Lag1", "Lag3", "Lag7", "Lag14", "Lag30",
    "MA7", "MA14", "MA30", "STD7", "STD14",
    "EMA7", "EMA14", "Max7", "Min7", "Range7"
]

# Load model
MODEL_JSON_PATH = os.path.join(os.path.dirname(__file__), "xgboost_price_forecast.json")
MODEL_PKL_PATH = os.path.join(os.path.dirname(__file__), "xgboost_price_forecast.pkl")

booster = xgb.Booster()
if os.path.exists(MODEL_JSON_PATH):
    booster.load_model(MODEL_JSON_PATH)
elif os.path.exists(MODEL_PKL_PATH):
    import pickle
    model_obj = pickle.load(open(MODEL_PKL_PATH, "rb"))
    if hasattr(model_obj, "get_booster"):
        booster = model_obj.get_booster()
    else:
        booster = model_obj
else:
    raise FileNotFoundError("Model file not found!")

class DirectFeaturesRequest(BaseModel):
    features: List[float]

class PriceHistoryItem(BaseModel):
    tanggal: str
    harga: float

class ForecastFromHistoryRequest(BaseModel):
    target_date: str
    history: List[PriceHistoryItem] # Historical prices sorted ascending or descending
    temperature: Optional[float] = 27.5
    rainfall: Optional[float] = 0.5
    wind_speed: Optional[float] = 18.0
    rain7: Optional[float] = 3.5

@app.get("/health")
def health_check():
    return {"status": "ok", "model": "xgboost-v1", "mape": 3.0}

@app.post("/predict")
def predict_direct(payload: DirectFeaturesRequest):
    if len(payload.features) != len(FEATURE_NAMES):
        raise HTTPException(
            status_code=400,
            detail=f"Expected {len(FEATURE_NAMES)} features, got {len(payload.features)}"
        )
    
    dmatrix = xgb.DMatrix(np.array([payload.features]), feature_names=FEATURE_NAMES)
    pred = float(booster.predict(dmatrix)[0])
    return {
        "predicted_price": round(pred, 2),
        "mape_at_training": 3.0,
        "model_version": "xgboost-v1"
    }

@app.post("/predict-from-history")
def predict_from_history(payload: ForecastFromHistoryRequest):
    if not payload.history:
        raise HTTPException(status_code=400, detail="Riwayat harga tidak boleh kosong")
    
    # Sort history by date ascending
    sorted_history = sorted(payload.history, key=lambda x: x.tanggal)
    prices = [item.harga for item in sorted_history]
    
    if len(prices) == 0:
        raise HTTPException(status_code=400, detail="Data harga tidak mencukupi")

    # Target date parsing
    try:
        t_date = datetime.datetime.strptime(payload.target_date, "%Y-%m-%d")
    except ValueError:
        raise HTTPException(status_code=400, detail="Format tanggal target salah. Gunakan YYYY-MM-DD")

    month = t_date.month
    day = t_date.day
    weekday = t_date.weekday()
    week_of_year = t_date.isocalendar()[1]

    # Calculate Lags (fallback to latest available if fewer data points)
    lag1 = prices[-1] if len(prices) >= 1 else 0.0
    lag3 = prices[-3] if len(prices) >= 3 else prices[0]
    lag7 = prices[-7] if len(prices) >= 7 else prices[0]
    lag14 = prices[-14] if len(prices) >= 14 else prices[0]
    lag30 = prices[-30] if len(prices) >= 30 else prices[0]

    # Rolling statistics
    p_series = pd.Series(prices)
    ma7 = float(p_series.tail(7).mean())
    ma14 = float(p_series.tail(14).mean())
    ma30 = float(p_series.tail(30).mean())

    std7 = float(p_series.tail(7).std(ddof=0)) if len(p_series) >= 2 else 0.0
    std14 = float(p_series.tail(14).std(ddof=0)) if len(p_series) >= 2 else 0.0

    ema7 = float(p_series.ewm(span=7, adjust=False).mean().iloc[-1])
    ema14 = float(p_series.ewm(span=14, adjust=False).mean().iloc[-1])

    max7 = float(p_series.tail(7).max())
    min7 = float(p_series.tail(7).min())
    range7 = float(max7 - min7)

    features_dict = {
        "Temperature": payload.temperature,
        "Rainfall": payload.rainfall,
        "Rain7": payload.rain7,
        "WindSpeed": payload.wind_speed,
        "Month": float(month),
        "Day": float(day),
        "Weekday": float(weekday),
        "WeekOfYear": float(week_of_year),
        "Lag1": lag1,
        "Lag3": lag3,
        "Lag7": lag7,
        "Lag14": lag14,
        "Lag30": lag30,
        "MA7": ma7,
        "MA14": ma14,
        "MA30": ma30,
        "STD7": std7,
        "STD14": std14,
        "EMA7": ema7,
        "EMA14": ema14,
        "Max7": max7,
        "Min7": min7,
        "Range7": range7
    }

    feature_array = [features_dict[name] for name in FEATURE_NAMES]
    dmatrix = xgb.DMatrix(np.array([feature_array]), feature_names=FEATURE_NAMES)
    pred = float(booster.predict(dmatrix)[0])

    return {
        "predicted_price": round(pred, 2),
        "prediction_date": payload.target_date,
        "mape_at_training": 3.0,
        "model_version": "xgboost-v1",
        "input_features": features_dict
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
