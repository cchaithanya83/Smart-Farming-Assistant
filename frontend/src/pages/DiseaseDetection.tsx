import React, { useState } from "react";
import axios from "axios";

interface PredictionResponse {
  prediction: string;
}

const DiseaseDetection: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [prediction, setPrediction] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!file) {
      setError("Please upload an image.");
      return;
    }

    setError("");
    setLoading(true);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await axios.post<PredictionResponse>(
        "http://localhost:8000/predict-disease/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setPrediction(response.data.prediction);
      setShowModal(true);
    } catch (err) {
      setError("Failed to get a prediction. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setPrediction("");
  };

  return (
    <div className="p-6 bg-gray-100 dark:bg-[#1d203a] min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full bg-white dark:bg-[#272b4a] p-6 shadow-md rounded">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">
          Disease Detection
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="file-upload"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Upload Image
            </label>
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-[#272b4a] dark:text-gray-200"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 rounded text-white font-medium ${
              loading
                ? "bg-gray-400 dark:bg-gray-600"
                : "bg-blue-500 hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-600"
            }`}
          >
            {loading ? "Predicting..." : "Submit"}
          </button>
        </form>

        {error && (
          <p className="text-red-500 mt-4 text-sm font-medium">{error}</p>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
          onClick={closeModal}
        >
          <div
            className="bg-white dark:bg-[#1d203a] rounded p-6 shadow-lg max-w-sm w-full"
            onClick={(e) => e.stopPropagation()} // Prevent closing modal when clicking inside
          >
            <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
              Prediction Result
            </h3>
            <p className="text-lg text-gray-700 dark:text-gray-300">
              <strong>Prediction:</strong> {prediction}
            </p>
            <button
              onClick={closeModal}
              className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiseaseDetection;
