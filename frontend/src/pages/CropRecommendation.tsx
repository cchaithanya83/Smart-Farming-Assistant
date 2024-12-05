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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const queryParams = new URLSearchParams(inputs).toString();

    try {
      const response = await axios.post(
        `http://localhost:8000/recommend-crop/?${queryParams}`
      );
      setResult(response.data.recommended_crop);
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
    <div className="p-6 bg-gray-100 dark:bg-gray-800 shadow-md">
      <h2 className="text-2xl font-bold text-gray-700 dark:text-white mb-4">
        Crop Recommendation
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {Object.keys(inputs).map((key) => (
          <div key={key}>
            <label className="block text-gray-700 dark:text-white mb-1">
              {key}
            </label>
            <input
              type="number"
              name={key}
              value={inputs[key]}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500"
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
          <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg w-96">
            <h3 className="text-lg font-bold text-gray-700 dark:text-white mb-4">
              Recommended Crop
            </h3>
            <p className="text-green-500 font-semibold text-lg mb-6">
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
