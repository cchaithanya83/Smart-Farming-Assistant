# Smart Farming Assistant

## Overview
The Smart Farming Assistant is a comprehensive web platform designed to assist farmers in optimizing their agricultural practices. This project provides crop recommendations, personalized fertilizer advice, plant disease detection, and IoT-based environmental monitoring.

## Features

1. **Web Platform for Crop Recommendations**
   - Recommends suitable crops based on soil nutrients, pH levels, and environmental factors.

2. **Personalized Fertilizer Advice**
   - Offers customized fertilizer suggestions based on soil NPK (Nitrogen, Phosphorus, Potassium) levels and the specific crop being grown.

3. **Plant Disease Detection with Machine Learning**
   - Implements a machine learning model to detect plant diseases from images uploaded by users.

4. **IoT-Based Environmental Monitoring**
   - Creates an IoT system to monitor soil moisture, temperature, and humidity, providing users with real-time data.

## Technology Stack
- **Frontend:** HTML, Tailwind CSS, TypeScript
- **Backend:** Python
- **IoT:** C++

## Installation

### Prerequisites
- Node.js
- Python 3.x
- Arduino IDE (for IoT components)

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/cchaithanya83/Smart-Farming-Assistant.git
   ```
2. Navigate to the frontend directory and install dependencies:
   ```bash
   cd frontend
   npm install
   ```
3. Set up the backend:
   - Install required libraries:
   ```bash
   pip install -r requirements.txt
   ```

4. Upload the Arduino code to your microcontroller using the Arduino IDE.

5. Start the backend server:
   ```bash
   python app.py
   ```

6. Run the frontend application:
   ```bash
   npm run dev
   ```
## Usage
- Access the web platform through your browser at `http://localhost:5173`.
- Connect the hardware with the Internet and send the data through the API `https://{base_url}/get-sensor-data/`.

## Acknowledgments
- [TensorFlow](https://www.tensorflow.org/) for machine learning model implementation.
- [Arduino](https://www.arduino.cc/) for IoT components.
- All contributors and supporters of the project.

