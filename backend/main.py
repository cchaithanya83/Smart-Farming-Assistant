from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import numpy as np
import tensorflow as tf
import joblib
import pandas as pd
import os
import json
from pydantic import BaseModel
from datetime import datetime
import pandas as pd
from zoneinfo import ZoneInfo

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)
# Paths
working_dir = os.path.dirname(os.path.abspath(__file__))

# Load models and related resources
plant_disease_model = tf.keras.models.load_model(f"{working_dir}\models\plant_disease_prediction_model.h5")
class_indices = json.load(open(f"{working_dir}\models\class_indices.json"))

crop_model = joblib.load(f"{working_dir}\models\crop_recommendation_model.pkl")
crop_label_encoder = joblib.load(f"{working_dir}\models\label_encoder.pkl")

fertilizer_model = joblib.load(os.path.join(working_dir, "models", "fertilizer_recommendation_model.pkl"))
fertilizer_label_encoder = joblib.load(os.path.join(working_dir, "models", "fertilizer_label_encoder.pkl"))


# Utility Functions
def preprocess_image(image_file, target_size=(224, 224)):
    try:
        img = Image.open(image_file)
        img = img.resize(target_size)
        img_array = np.array(img)
        img_array = np.expand_dims(img_array, axis=0)
        img_array = img_array.astype('float32') / 255.0
        return img_array
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid image format. Error: {str(e)}")

def predict_plant_disease(image_file):
    img_array = preprocess_image(image_file)
    predictions = plant_disease_model.predict(img_array)
    predicted_index = np.argmax(predictions, axis=1)[0]
    return class_indices[str(predicted_index)]

# Routes
@app.post("/predict-disease/")
async def predict_disease(image: UploadFile = File(...)):
    try:
        prediction = predict_plant_disease(image.file)
        return {"prediction": prediction}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/recommend-crop/")
async def recommend_crop(N: int, P: int, K: int, temperature: float, humidity: float, ph: float, rainfall: float):
    try:
        features = pd.DataFrame([[N, P, K, temperature, humidity, ph, rainfall]], 
                                columns=['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall'])
        prediction = crop_model.predict(features)
        predicted_label = crop_label_encoder.inverse_transform(prediction)
        return {"recommended_crop": predicted_label[0]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/recommend-fertilizer/")
async def recommend_fertilizer(temperature: float, humidity: float, moisture: float, soil_type: str, crop_type: str, 
                                nitrogen: int, potassium: int, phosphorous: int):
    try:
        features = pd.DataFrame([[temperature, humidity, moisture, soil_type, crop_type, nitrogen, potassium, phosphorous]],
                                columns=['Temperature', 'Humidity', 'Moisture', 'Soil Type', 'Crop Type', 'Nitrogen', 'Potassium', 'Phosphorous'])
        prediction = fertilizer_model.predict(features)
        predicted_label = fertilizer_label_encoder.inverse_transform(prediction)
        return {"recommended_fertilizer": predicted_label[0]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

sensor_data = []

# Models
class SensorData(BaseModel):
    temperature: float
    humidity: float
    soil_moisture: int
    timestamp: datetime

# Routes
@app.post("/send-sensor-data/")
async def receive_sensor_data(data: SensorData):
    try:
        # Get the current time in India Standard Time (IST)
        current_time = datetime.now(ZoneInfo("Asia/Kolkata"))  # IST timezone

        # Replace the incoming timestamp with the server's current time in IST
        data_with_server_timestamp = data.dict()
        data_with_server_timestamp["timestamp"] = current_time

        # Append the data to the in-memory list
        sensor_data.append(data_with_server_timestamp)

        return {"message": "Data received successfully", "server_timestamp": current_time}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error saving data: {str(e)}")

@app.get("/get-sensor-data/")
async def get_sensor_data():
    try:
        if not sensor_data:
            return {"message": "No data available"}
        return {"data": sensor_data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching data: {str(e)}")