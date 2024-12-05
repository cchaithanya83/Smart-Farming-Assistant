#include <Adafruit_Sensor.h>
#include <DHT.h>
#include <DHT_U.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <time.h>

// WiFi credentials
const char* ssid = "test";
const char* password = "12345678";

// Server URL
const char* serverUrl = "https://edd3-2405-201-d00e-d0da-e5e0-69d7-a0f0-ac7c.ngrok-free.app/send-sensor-data/";

// Define pin connections
#define DHTPIN 4         // GPIO pin connected to the DATA pin of the DHT11
#define SOIL_PIN 34      // Analog pin connected to the soil moisture sensor

// Define sensor types
#define DHTTYPE DHT11    // DHT11 sensor type

// Initialize the DHT sensor
DHT dht(DHTPIN, DHTTYPE);

// NTP settings
const char* ntpServer = "pool.ntp.org";
const long gmtOffset_sec = 19800; // GMT+5:30 for IST
const int daylightOffset_sec = 0;

void setup() {
  // Initialize Serial Monitor
  Serial.begin(115200);
  
  // Initialize the DHT sensor
  dht.begin();
  Serial.println("DHT11 and Soil Moisture Sensor Test");

  // Connect to WiFi
  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.print(".");
  }
  Serial.println("Connected to WiFi!");

  // Initialize NTP
  configTime(gmtOffset_sec, daylightOffset_sec, ntpServer);
}

void loop() {
  // Read temperature and humidity from the DHT11
  float humidity = dht.readHumidity();
  float temperature = dht.readTemperature();
  
  // Read the soil moisture sensor value
  int soilValue = analogRead(SOIL_PIN);

  // Check if DHT11 readings are valid
  if (isnan(humidity) || isnan(temperature)) {
    Serial.println("Failed to read from DHT sensor!");
    delay(2000);
    return; // Skip sending data if sensor fails
  }

  // Convert soil moisture reading to percentage
  float soilMoisturePercent = map(soilValue, 4095, 0, 0, 100); // Adjust mapping as needed

  Serial.print("Temperature: ");
  Serial.print(temperature);
  Serial.print("°C, Humidity: ");
  Serial.print(humidity);
  Serial.println("%");

  Serial.print("Soil Moisture: ");
  Serial.print(soilMoisturePercent);
  Serial.println("%");

  // Get the current timestamp
  String timestamp = getTimeStamp();

  // Send data to the server
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;

    http.begin(serverUrl);
    http.addHeader("Content-Type", "application/json");

    // Create JSON payload
    String jsonPayload = String("{\"temperature\":") + temperature +
                         ",\"humidity\":" + humidity +
                         ",\"soil_moisture\":" + soilMoisturePercent +
                         ",\"timestamp\":\"" + timestamp + "\"}";

    int httpResponseCode = http.POST(jsonPayload);

    if (httpResponseCode > 0) {
      String response = http.getString();
      Serial.println("Response: " + response);
    } else {
      Serial.println("Error sending data: " + String(httpResponseCode));
    }

    http.end();
  } else {
    Serial.println("WiFi not connected");
  }

  delay(10000); // Send data every 10 seconds
}

String getTimeStamp() {
  // Get the current time
  time_t now;
  struct tm timeinfo;
  if (!getLocalTime(&timeinfo)) {
    Serial.println("Failed to obtain time");
    return "1970-01-01T00:00:00"; // Fallback timestamp
  }
  char timeString[25];
  strftime(timeString, sizeof(timeString), "%Y-%m-%dT%H:%M:%S", &timeinfo);
  return String(timeString);
}
