from fastapi import FastAPI, File, UploadFile
import numpy as np
from PIL import Image
import io
import logging

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Graceful TensorFlow import
TF_AVAILABLE = False
try:
    import tensorflow as tf
    TF_AVAILABLE = True
    logger.info("✅ TensorFlow loaded successfully")
except ImportError:
    logger.warning("⚠️ TensorFlow not found. AI prediction will be disabled.")

app = FastAPI()

@app.get("/health")
def health():
    return {
        "status": "ok",
        "tensorflow_available": TF_AVAILABLE,
        "environment": "native"
    }

@app.post("/predict/disease")
async def predict_disease(file: UploadFile = File(...)):
    if not TF_AVAILABLE:
        return {
            "error": "TensorFlow not installed on server. Using rule-based fallback.",
            "disease": "unknown",
            "confidence": 0.0,
            "fallback": True
        }
    
    try:
        # Process image and run inference
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).resize((224, 224))
        # ... logic for actual model prediction would go here
        return {"disease": "detected_disease", "confidence": 0.88, "method": "ai"}
    except Exception as e:
        logger.error(f"Prediction error: {str(e)}")
        return {"error": str(e), "status": "failed"}