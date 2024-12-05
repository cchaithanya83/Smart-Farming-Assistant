import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
import joblib

# Step 1: Load your dataset
# Replace 'fertilizer_dataset.csv' with the path to your actual dataset file
data = pd.read_csv('fertilizer_dataset.csv')

# Step 2: Prepare the features (X) and target (y)
X = data[['Temperature', 'Humidity', 'Moisture', 'Soil Type', 'Crop Type', 'Nitrogen', 'Potassium', 'Phosphorous']]
y = data['Fertilizer Name']

# Step 3: Encode the target labels if they are categorical
label_encoder = LabelEncoder()
y_encoded = label_encoder.fit_transform(y)

# Step 4: Preprocess the data
# Use OneHotEncoder for categorical features and pass through for numerical features
categorical_features = ['Soil Type', 'Crop Type']
numerical_features = ['Temperature', 'Humidity', 'Moisture', 'Nitrogen', 'Potassium', 'Phosphorous']

preprocessor = ColumnTransformer(
    transformers=[
        ('cat', OneHotEncoder(), categorical_features),
        ('num', 'passthrough', numerical_features)
    ]
)

# Step 5: Create a pipeline with preprocessing and the RandomForestClassifier model
model = RandomForestClassifier(n_estimators=100, random_state=42, n_jobs=-1)
pipeline = Pipeline(steps=[
    ('preprocessor', preprocessor),
    ('classifier', model)
])

# Step 6: Split the data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y_encoded, test_size=0.2, random_state=42)

# Step 7: Train the model
pipeline.fit(X_train, y_train)

# Step 8: Evaluate the model (optional)
print(f"Training accuracy: {pipeline.score(X_train, y_train):.2f}")
print(f"Testing accuracy: {pipeline.score(X_test, y_test):.2f}")

# Step 9: Save the pipeline and label encoder to files
joblib.dump(pipeline, 'fertilizer_recommendation_model.pkl')
joblib.dump(label_encoder, 'fertilizer_label_encoder.pkl')
