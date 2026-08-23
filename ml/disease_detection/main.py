from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from ultralytics import YOLO
from PIL import Image
import io
import os
from pathlib import Path

app = FastAPI(title="SIMANTRI YOLOv8 Disease Detection API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Resolve path to best.pt relative to this file
MODEL_PATH = Path(__file__).parent / "best.pt"
if not MODEL_PATH.exists():
    raise FileNotFoundError(f"Model file not found at {MODEL_PATH}")

# Load model once at startup
model = YOLO(str(MODEL_PATH))

# Mapping index kelas ke nama dan kategori (sesuai CLASS_REFERENCE.md)
CLASS_REFERENCE = {
    "Antranoksa": {"category": "disease", "display_name": "Antraknosa"},
    "Antraknosa": {"category": "disease", "display_name": "Antraknosa"},
    "Daun-Bawang": {"category": "anatomy", "display_name": None},
    "Moler": {"category": "disease", "display_name": "Moler"},
    "Moleh": {"category": "disease", "display_name": "Moler"},
    "Pucuk-Daun": {"category": "anatomy", "display_name": None},
    "Sehat": {"category": "healthy", "display_name": "Sehat"},
    "Trotol": {"category": "disease", "display_name": "Trotol"},
}

@app.post("/detect")
async def detect_disease(file: UploadFile = File(...)):
    image_bytes = await file.read()
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")

    results = model(image)[0]
    detections = []

    for box in results.boxes:
        class_name = model.names[int(box.cls)]
        confidence = float(box.conf)
        ref = CLASS_REFERENCE.get(class_name, {})

        detections.append({
            "predicted_class": class_name,
            "display_name": ref.get("display_name", class_name),
            "category": ref.get("category", "unknown"),
            "confidence": round(confidence * 100, 2),
            "bbox": {
                "x": float(box.xywhn[0][0]),
                "y": float(box.xywhn[0][1]),
                "width": float(box.xywhn[0][2]),
                "height": float(box.xywhn[0][3]),
            }
        })

    # Urutkan dari confidence tertinggi
    detections.sort(key=lambda x: x["confidence"], reverse=True)

    return {
        "detections": detections,
        "total_objects": len(detections),
        "has_disease": any(d["category"] == "disease" for d in detections),
        "all_healthy": all(d["category"] in ["healthy", "anatomy"] for d in detections) if detections else False
    }

@app.get("/health")
def health():
    return {"status": "ok", "model": "yolov8-simantri"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
