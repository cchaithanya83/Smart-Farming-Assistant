import React, { useEffect, useState } from "react";
import axios from "axios";

// Utility function for setting and getting dark mode from localStorage
const setDarkMode = (value: boolean) => {
  localStorage.setItem("darkMode", value ? "true" : "false");
  document.documentElement.classList.toggle("dark", value); // Toggles dark mode on the root element
};

const Dashboard: React.FC = () => {
  const [sensorData, setSensorData] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [darkMode, setDarkModeState] = useState<boolean>(false);

  const userEmail = localStorage.getItem("userEmail");

  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode");
    setDarkModeState(savedDarkMode === "true");

    // Fetch Sensor Data every second
    const fetchSensorData = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/get-sensor-data/?email=${userEmail}`,
          { headers: { accept: "application/json" } }
        );
        const sortedData = response.data.sensor_data.sort(
          (a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
        setSensorData(sortedData.slice(0, 6)); // Keep only the latest 6
      } catch (error) {
        console.error("Error fetching sensor data", error);
      }
    };

    const fetchRecommendations = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/get-recommendations/?email=${userEmail}`,
          { headers: { accept: "application/json" } }
        );
        const sortedRecommendations = response.data.recommendations.sort(
          (a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
        setRecommendations(sortedRecommendations); // Keep only the latest 6
      } catch (error) {
        console.error("Error fetching recommendations", error);
      }
    };

    if (userEmail) {
      fetchRecommendations();
      setInterval(fetchSensorData, 1000); // Fetch sensor data every second
    }
  }, [userEmail]);


  // Recommendations by type (grouping)
  const groupedRecommendations = {
    plantDisease: recommendations
      .filter((rec) => rec.type === "plant_disease")
      .slice(0, 6), // Keep only the latest 6
    crop: recommendations.filter((rec) => rec.type === "crop").slice(0, 6), // Keep only the latest 6
    fertilizer: recommendations
      .filter((rec) => rec.type === "fertilizer")
      .slice(0, 6), // Keep only the latest 6
  };

  const moistureLevel =
    sensorData.length > 0 ? sensorData[sensorData.length - 1].soil_moisture : 0;
  const moistureRecommendation = moistureLevel < 30 ? "Water your plant" : "";

  return (
    <div className="p-6 bg-gray-100 dark:bg-[#1d203a] min-h-screen dark:text-white">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Sensor Data */}
        <div className="bg-white dark:bg-[#272b4a] p-6 shadow-md rounded">
          <h2 className="text-2xl font-semibold mb-4">Sensor Data</h2>
          {sensorData.length === 0 ? (
            <p>No sensor data available</p>
          ) : (
            <div>
              {sensorData.map((data, index) => (
                <div key={index} className="mb-4">
                  <div>
                    <strong>Temperature:</strong> {data.temperature}°C
                  </div>
                  <div>
                    <strong>Humidity:</strong> {data.humidity}%
                  </div>
                  <div>
                    <strong>Soil Moisture:</strong> {data.soil_moisture}%
                  </div>
                  <div>
                    <strong>Time:</strong>{" "}
                    {new Date(data.timestamp).toLocaleString()}
                  </div>
                </div>
              ))}
              <div className="text-red-500 mt-4">
                {moistureRecommendation && <p>{moistureRecommendation}</p>}
              </div>
            </div>
          )}
        </div>

        {/* Other recommendation sections remain the same */}
        {Object.entries(groupedRecommendations).map(([key, recs]) => (
          <div
            key={key}
            className="bg-white dark:bg-[#272b4a] p-6 shadow-md rounded"
          >
            <h2 className="text-2xl font-semibold mb-4">
              {key.replace(/([A-Z])/g, " $1").trim()} Recommendations
            </h2>
            {recs.length === 0 ? (
              <p>No {key} recommendations available</p>
            ) : (
              <ul>
                {recs.map((rec, index) => (
                  <li key={index} className="mb-4">
                    <div>
                      <strong>Recommendation:</strong> {rec.recommendation}
                    </div>
                    <div>
                      <strong>Recommended on:</strong>{" "}
                      {new Date(rec.timestamp).toLocaleString()}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
