import joblib
import pandas as pd

# Load the trained pipeline and label encoder
pipeline = joblib.load('fertilizer_recommendation_model.pkl')
label_encoder = joblib.load('fertilizer_label_encoder.pkl')

# Example input data
features = pd.DataFrame([[25, 70, 40, 'Clay', 'Wheat', 50, 30, 20]], 
                        columns=['Temperature', 'Humidity', 'Moisture', 'Soil Type', 'Crop Type', 'Nitrogen', 'Potassium', 'Phosphorous'])

# Make a prediction
prediction = pipeline.predict(features)
predicted_label = label_encoder.inverse_transform(prediction)

print(f"Recommended fertilizer: {predicted_label[0]}")
