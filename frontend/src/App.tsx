import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import DiseaseDetection from "./pages/DiseaseDetection";
import FertilizerRecommendation from "./pages/FertilizerRecommendation";
import CropRecommendation from "./pages/CropRecommendation";
import SensorData from "./pages/SensorData";

const App: React.FC = () => {
  return (
    <div className="flex">
      <Router>
        <Sidebar />
        <div className="flex-grow">
          <Navbar />
          <Routes>
            <Route
              path="/crop-recommendation"
              element={<CropRecommendation />}
            />
            <Route path="/disease-detection" element={<DiseaseDetection />} />
            <Route
              path="/fertilizer-recommendation"
              element={<FertilizerRecommendation />}
            />
            <Route path="/sensor-data" element={<SensorData />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
};

export default App;
