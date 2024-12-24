import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const FertilizerRecommendation: React.FC = () => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({
    temperature: "",
    humidity: "",
    moisture: "",
    soil_type: "",
    crop_type: "",
    nitrogen: "",
    potassium: "",
    phosphorous: "",
  });
  const [result, setResult] = useState("");
  const [showModal, setShowModal] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Get the email from local storage
    const email = localStorage.getItem("userEmail");
    if (!email) {
      alert("Please log in to submit the data.");
      return;
    }

    // Add the email to the API request
    const queryParams = new URLSearchParams({
      ...inputs,
      email, // Append email to form data
    }).toString();

    try {
      const response = await axios.post(
        `http://localhost:8000/recommend-fertilizer/?${queryParams}`
      );
      setResult(response.data.recommended_fertilizer);
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
        Fertilizer Recommendation
      </h2>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg space-y-4 bg-white dark:bg-[#1d203a] p-6 rounded-lg shadow-lg"
      >
        {Object.keys(inputs).map((key) => (
          <div key={key}>
            <label className="block text-gray-700 dark:text-white mb-1">
              {key
                .replace(/([A-Z])/g, " $1")
                .replace(/^./, (str) => str.toUpperCase())}
            </label>
            {key === "soil_type" || key === "crop_type" ? (
              <select
                name={key}
                value={inputs[key]}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded dark:bg-[#1d203a] dark:text-white focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select {key}</option>
                {key === "soil_type" ? (
                  <>
                    <option value="Loamy">Loamy</option>
                    <option value="Sandy">Sandy</option>
                    <option value="Clayey">Clay</option>
                    <option value="Saline">Saline</option>
                    <option value="Peaty">Peaty</option>
                    <option value="Chalky">Chalky</option>
                  </>
                ) : (
                  <>
                    <option value="Barley">Barley</option>
                    <option value="Maize">Maize</option>
                    <option value="Oil seeds">Oil seeds</option>
                    <option value="Tobacco">Tobacco</option>
                    <option value="Ground Nuts">Ground Nuts</option>
                    <option value="Sugarcane">Sugarcane</option>
                    <option value="Wheat">Wheat</option>
                    <option value="Cotton">Cotton</option>
                    <option value="Pulses">Pulses</option>
                  </>
                )}
              </select>
            ) : (
              <input
                type="number"
                name={key}
                value={inputs[key]}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded dark:bg-[#1d203a] dark:text-white focus:ring-2 focus:ring-blue-500"
                required
              />
            )}
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
              Recommended Fertilizer
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

export default FertilizerRecommendation;
