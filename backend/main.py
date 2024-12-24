from fastapi import FastAPI, File, UploadFile, HTTPException, Depends
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import numpy as np
import tensorflow as tf
import joblib
import pandas as pd
import os
import json
from pydantic import BaseModel, EmailStr
from datetime import datetime, timedelta
from zoneinfo import ZoneInfo
from sqlalchemy import create_engine, Column, String, Integer, Float, DateTime, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext

# Initialize FastAPI app
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Directory setup
working_dir = os.path.dirname(os.path.abspath(__file__))

# Model paths
plant_disease_model = tf.keras.models.load_model(f"{working_dir}/models/plant_disease_prediction_model.h5")
class_indices = json.load(open(f"{working_dir}/models/class_indices.json"))

crop_model = joblib.load(f"{working_dir}/models/crop_recommendation_model.pkl")
crop_label_encoder = joblib.load(f"{working_dir}/models/label_encoder.pkl")

fertilizer_model = joblib.load(os.path.join(working_dir, "models", "fertilizer_recommendation_model.pkl"))
fertilizer_label_encoder = joblib.load(os.path.join(working_dir, "models", "fertilizer_label_encoder.pkl"))

# Database setup
DATABASE_URL = "sqlite:///./data.db"
Base = declarative_base()
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Password hashing and token generation setup
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta if expires_delta else datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def decode_access_token(token: str):
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

# Database models
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    hashed_password = Column(String, nullable=False)

class SensorData(Base):
    __tablename__ = "sensor_data"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, ForeignKey("users.email"))
    temperature = Column(Float, nullable=False)
    humidity = Column(Float, nullable=False)
    soil_moisture = Column(Integer, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)

class Recommendation(Base):
    __tablename__ = "recommendations"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, ForeignKey("users.email"))
    recommendation_type = Column(String, nullable=False)  # "plant_disease", "crop", "fertilizer"
    recommendation = Column(String, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)

Base.metadata.create_all(bind=engine)

# Models for API requests and responses
class UserSignup(BaseModel):
    email: EmailStr
    name: str
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class SensorDataModel(BaseModel):
    temperature: float
    humidity: float
    soil_moisture: int

# Prediction and storage utilities
def preprocess_image(image_file, target_size=(224, 224)):
    img = Image.open(image_file)
    img = img.resize(target_size)
    img_array = np.array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array = img_array.astype('float32') / 255.0
    return img_array

def save_recommendation(db, email, recommendation_type, recommendation):
    record = Recommendation(
        email=email, 
        recommendation_type=recommendation_type, 
        recommendation=recommendation
    )
    db.add(record)
    db.commit()

@app.post("/signup/")
async def signup(user: UserSignup, db: SessionLocal = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed_password = get_password_hash(user.password)
    new_user = User(email=user.email, name=user.name, hashed_password=hashed_password)
    db.add(new_user)
    db.commit()
    return {"message": "User created successfully"}

@app.post("/login/")
async def login(user: UserLogin, db: SessionLocal = Depends(get_db)):
    try:
        # Fetch the user from the database
        db_user = db.query(User).filter(User.email == user.email).first()
        if not db_user:
            raise HTTPException(status_code=404, detail="User not found")

        # Verify password
        if not verify_password(user.password, db_user.hashed_password):
            raise HTTPException(status_code=401, detail="Invalid password")

        # Generate access token
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(data={"email": db_user.email, "name": db_user.name}, expires_delta=access_token_expires)

        return {"access_token": access_token, "token_type": "bearer"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error during login: {str(e)}")


@app.post("/predict-disease/")
async def predict_disease(email: str, image: UploadFile = File(...), db: SessionLocal = Depends(get_db)):
    try:
        img_array = preprocess_image(image.file)
        predictions = plant_disease_model.predict(img_array)
        predicted_index = np.argmax(predictions, axis=1)[0]
        result = class_indices[str(predicted_index)]

        save_recommendation(db, email, "plant_disease", result)
        return {"prediction": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/recommend-crop/")
async def recommend_crop(
    email: str,
    N: int,
    P: int,
    K: int,
    temperature: float,
    humidity: float,
    ph: float,
    rainfall: float,
    db: SessionLocal = Depends(get_db)
):
    try:
        features = pd.DataFrame([[N, P, K, temperature, humidity, ph, rainfall]], 
                                columns=['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall'])
        prediction = crop_model.predict(features)
        predicted_label = crop_label_encoder.inverse_transform(prediction)[0]

        save_recommendation(db, email, "crop", predicted_label)
        return {"recommended_crop": predicted_label}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/recommend-fertilizer/")
async def recommend_fertilizer(
    email: str,
    temperature: float,
    humidity: float,
    moisture: float,
    soil_type: str,
    crop_type: str,
    nitrogen: int,
    potassium: int,
    phosphorous: int,
    db: SessionLocal = Depends(get_db)
):
    try:
        features = pd.DataFrame([[temperature, humidity, moisture, soil_type, crop_type, nitrogen, potassium, phosphorous]],
                                columns=['Temperature', 'Humidity', 'Moisture', 'Soil Type', 'Crop Type', 'Nitrogen', 'Potassium', 'Phosphorous'])
        prediction = fertilizer_model.predict(features)
        predicted_label = fertilizer_label_encoder.inverse_transform(prediction)[0]

        save_recommendation(db, email, "fertilizer", predicted_label)
        return {"recommended_fertilizer": predicted_label}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/send-sensor-data/")
async def receive_sensor_data(email: str, data: SensorDataModel, db: SessionLocal = Depends(get_db)):
    try:
        sensor_entry = SensorData(
            email=email,
            temperature=data.temperature,
            humidity=data.humidity,
            soil_moisture=data.soil_moisture
        )
        db.add(sensor_entry)
        db.commit()
        return {"message": "Sensor data saved successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error saving sensor data: {str(e)}")

@app.get("/get-recommendations/")
async def get_recommendations(email: str, db: SessionLocal = Depends(get_db)):
    try:
        recommendations = db.query(Recommendation).filter(Recommendation.email == email).all()
        return {"recommendations": [
            {
                "type": rec.recommendation_type,
                "recommendation": rec.recommendation,
                "timestamp": rec.timestamp
            }
            for rec in recommendations
        ]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching recommendations: {str(e)}")



@app.get("/get-sensor-data/")
async def get_sensor_data(email: str, db: SessionLocal = Depends(get_db)):
    try:
        sensor_data_entries = db.query(SensorData).filter(SensorData.email == email).all()
        if not sensor_data_entries:
            raise HTTPException(status_code=404, detail="No sensor data found for the specified email")

        # Format the response
        return {"sensor_data": [
            {
                "temperature": entry.temperature,
                "humidity": entry.humidity,
                "soil_moisture": entry.soil_moisture,
                "timestamp": entry.timestamp
            }
            for entry in sensor_data_entries
        ]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching sensor data: {str(e)}")
