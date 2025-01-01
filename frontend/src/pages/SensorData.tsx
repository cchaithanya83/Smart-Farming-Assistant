import  { useEffect, useState } from "react";
import axios from "axios";

const SensorData = () => {
  const [sensorData, setSensorData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(0);

  const ITEMS_PER_PAGE = 50;

  useEffect(() => {
    const fetchSensorData = async () => {
      const email = localStorage.getItem("userEmail");

      // Redirect to login if email is not found
      if (!email) {
        alert("Please log in to continue.");
        return;
      }

      try {
        // Include email as a query parameter
        const response = await axios.get(
          `http://localhost:8000/get-sensor-data/?email=${email}`
        );

        if (response.data?.sensor_data) {
          // Sort by timestamp in descending order
          const sortedData = response.data.sensor_data.sort(
            (a, b) =>
              new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          );
          setSensorData(sortedData);
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

  const handleLoadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  if (loading) {
    return <div className="text-center mt-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-red-500">{error}</div>;
  }

  // Paginate the data to show only the items for the current page
  const paginatedData = sensorData.slice(0, (page + 1) * ITEMS_PER_PAGE);

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
              {paginatedData.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="border border-gray-300 p-2 text-center">
                    {item.temperature }
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
          {paginatedData.length < sensorData.length && (
            <div className="text-center mt-4">
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
                onClick={handleLoadMore}
              >
                Load More
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SensorData;
