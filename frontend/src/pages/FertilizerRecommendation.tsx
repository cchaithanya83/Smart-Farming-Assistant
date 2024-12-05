import React, { useState } from "react";
import axios from "axios";

const FertilizerRecommendation: React.FC = () => {
  const [inputs, setInputs] = useState({
    temperature: "",
    humidity: "",
    moisture: "",
    soilType: "",
    cropType: "",
    nitrogen: "",
    potassium: "",
    phosphorous: "",
  });
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const queryParams = new URLSearchParams({
      temperature: inputs.temperature,
      humidity: inputs.humidity,
      moisture: inputs.moisture,
      soil_type: inputs.soilType,
      crop_type: inputs.cropType,
      nitrogen: inputs.nitrogen,
      potassium: inputs.potassium,
      phosphorous: inputs.phosphorous,
    }).toString();

    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/recommend-fertilizer/?${queryParams}`
      );
      setResult(response.data.recommended_fertilizer);
      setShowModal(true); // Show modal on successful response
    } catch (err) {
      setError("Failed to fetch recommendation. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-800 justify-center shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
        Fertilizer Recommendation
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {Object.keys(inputs).map((key) => (
          <div key={key}>
            <label
              htmlFor={key}
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              {key
                .replace(/([A-Z])/g, " $1")
                .replace(/^./, (str) => str.toUpperCase())}
            </label>
            {key === "soilType" || key === "cropType" ? (
              <select
                id={key}
                name={key}
                value={inputs[key]}
                onChange={handleChange}
                className="w-full border border-gray-300 dark:border-gray-700 p-2 rounded focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                required
              >
                <option value="">Select {key}</option>
                {key === "soilType" ? (
                  <>
                    <option value="loamy">Loamy</option>
                    <option value="sandy">Sandy</option>
                    <option value="clay">Clay</option>
                    <option value="saline">Saline</option>
                    <option value="peaty">Peaty</option>
                    <option value="chalky">Chalky</option>
                  </>
                ) : (
                  <>
                    <option value="wheat">Wheat</option>
                    <option value="rice">Rice</option>
                    <option value="corn">Corn</option>
                    <option value="soybean">Soybean</option>
                    <option value="potato">Potato</option>
                    <option value="tomato">Tomato</option>
                    <option value="barley">Barley</option>
                    <option value="cotton">Cotton</option>
                    <option value="sugarcane">Sugarcane</option>
                  </>
                )}
              </select>
            ) : (
              <input
                id={key}
                type="number"
                name={key}
                value={inputs[key]}
                onChange={handleChange}
                className="w-full border border-gray-300 dark:border-gray-700 p-2 rounded focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                required
              />
            )}
          </div>
        ))}
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        >
          {loading ? "Loading..." : "Submit"}
        </button>
      </form>

      {error && (
        <p className="mt-4 text-sm text-red-500 dark:text-red-400">{error}</p>
      )}

      {/* Modal for Result */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded p-6 w-96">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Recommended Fertilizer
            </h3>
            <p className="text-gray-700 dark:text-gray-300">{result}</p>
            <button
              onClick={() => setShowModal(false)}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FertilizerRecommendation;
