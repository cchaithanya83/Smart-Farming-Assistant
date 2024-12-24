import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import DiseaseDetection from "./pages/DiseaseDetection";
import FertilizerRecommendation from "./pages/FertilizerRecommendation";
import CropRecommendation from "./pages/CropRecommendation";
import SensorData from "./pages/SensorData";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import About from "./pages/About";

const App: React.FC = () => {
  return (
    <div className="flex">
      <Router>
        <Sidebar />
        <div className="flex-grow ml-64  transition-all">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/Dashboard" element={<Dashboard />} />
            <Route path="/About" element={<About />} />

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
