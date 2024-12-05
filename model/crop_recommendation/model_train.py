import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
import joblib

# Step 1: Load your dataset
# Replace 'your_dataset.csv' with the path to your actual dataset file
data = pd.read_csv('crop_recommendation.csv')

# Step 2: Prepare the features (X) and target (y)
X = data[['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']]
y = data['label']

# Step 3: Encode the target labels if they are categorical
label_encoder = LabelEncoder()
y_encoded = label_encoder.fit_transform(y)

# Step 4: Split the data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y_encoded, test_size=0.2, random_state=42)

# Step 5: Train a RandomForestClassifier (or any other model you prefer)
model = RandomForestClassifier(random_state=42)
model.fit(X_train, y_train)

# Step 6: Evaluate the model (optional)
print(f"Training accuracy: {model.score(X_train, y_train):.2f}")
print(f"Testing accuracy: {model.score(X_test, y_test):.2f}")

# Step 7: Save the model to a file
joblib.dump(model, 'crop_recommendation_model.pkl')
joblib.dump(label_encoder, 'label_encoder.pkl')
