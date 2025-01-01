import React, { useState } from "react";
import axios from "axios";

const CropRecommendation: React.FC = () => {
  const [inputs, setInputs] = useState({
    N: "",
    P: "",
    K: "",
    temperature: "",
    humidity: "",
    ph: "",
    rainfall: "",
  });
  const [result, setResult] = useState("");
  const [showModal, setShowModal] = useState(false);

  // Labels with full forms
  const fieldLabels: { [key: string]: string } = {
    N: "Nitrogen (N)",
    P: "Phosphorus (P)",
    K: "Potassium (K)",
    temperature: "Temperature (°C)",
    humidity: "Humidity (%)",
    ph: "Soil pH",
    rainfall: "Rainfall (mm)",
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Fetch email from local storage
    const email = localStorage.getItem("userEmail");

    if (!email) {
      alert("Please log in to access crop recommendations.");
      return;
    }

    const queryParams = new URLSearchParams({ ...inputs, email }).toString();

    try {
      const response = await axios.post(
        `http://localhost:8000/recommend-crop/?${queryParams}`
      );
      const recommendedCrop = response.data.recommended_crop;
      setResult(
        `Based on the inputs, the best crop to grow is "${recommendedCrop}".`
      );
      setShowModal(true); // Show the modal with the result
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className="p-6 bg-gray-100 dark:bg-[#1d203a] shadow-md min-h-screen flex flex-col items-center">
      <h2 className="text-2xl font-bold text-gray-700 dark:text-white mb-6 text-center">
        Crop Recommendation
      </h2>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg space-y-4 bg-white dark:bg-[#1d203a] p-6 rounded-lg shadow-lg"
      >
        {Object.keys(inputs).map((key) => (
          <div key={key}>
            <label className="block text-gray-700 dark:text-white mb-1">
              {fieldLabels[key]}
            </label>
            <input
              type="number"
              name={key}
              value={inputs[key]}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded dark:bg-[#1d203a] dark:text-white focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        ))}
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition w-full"
        >
          Submit
        </button>
      </form>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white dark:bg-[#1d203a] p-6 rounded shadow-lg w-11/12 max-w-md">
            <h3 className="text-lg font-bold text-gray-700 dark:text-white mb-4 text-center">
              Recommended Crop
            </h3>
            <p className="text-green-500 font-semibold text-lg mb-6 text-center">
              {result}
            </p>
            <button
              onClick={closeModal}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CropRecommendation;
