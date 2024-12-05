import React, { useEffect, useState } from "react";
import axios from "axios";

const SensorData = () => {
  const [sensorData, setSensorData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch data from API
    const fetchSensorData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/get-sensor-data/"
        );
        if (response.data?.data) {
          setSensorData(response.data.data);
        } else {
          setSensorData([]);
        }
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch sensor data.");
        setLoading(false);
      }
    };
    fetchSensorData();
  }, []);

  if (loading) {
    return <div className="text-center mt-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-4">Sensor Data</h1>
      {sensorData.length === 0 ? (
        <p className="text-center">No data available</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-300 p-2">Temperature (°C)</th>
                <th className="border border-gray-300 p-2">Humidity (%)</th>
                <th className="border border-gray-300 p-2">Soil Moisture</th>
                <th className="border border-gray-300 p-2">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {sensorData.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="border border-gray-300 p-2 text-center">
                    {item.temperature}
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    {item.humidity}
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    {item.soil_moisture}
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    {new Date(item.timestamp).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SensorData;
