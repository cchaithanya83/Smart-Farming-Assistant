import joblib
import pandas as pd

# Load the trained model and label encoder
model = joblib.load('crop_recommendation_model.pkl')
label_encoder = joblib.load('label_encoder.pkl')

# Example input data
features = pd.DataFrame([[50, 30, 40, 25, 70, 6.5, 200]], 
                        columns=['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall'])

# Make a prediction
prediction = model.predict(features)
predicted_label = label_encoder.inverse_transform(prediction)

print(f"Recommended crop: {predicted_label[0]}")
