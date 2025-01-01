import React from "react";
import { Link } from "react-router-dom";

const Sidebar: React.FC = () => {
  return (
    <aside className="fixed top-0 left-0 h-screen w-64 bg-green-900 dark:bg-[#272b4a] p-6 shadow-lg flex flex-col justify-between overflow-y-auto transition-colors duration-300">
      <h2 className="text-2xl font-bold text-white text-center mb-6">
        Navigation
      </h2>

      <ul className="flex-1 flex flex-col justify-center space-y-6">
        {[
          { to: "/", label: "Home" },
          { to: "/Info", label: "Info" },
          { to: "/Dashboard", label: "Dashboard" },
          

          { to: "/crop-recommendation", label: "Crop Recommendation" },
          {
            to: "/fertilizer-recommendation",
            label: "Fertilizer Recommendation",
          },
          { to: "/disease-detection", label: "Disease Detection" },
          { to: "/sensor-data", label: "Sensor Data" },
          { to: "/about", label: "About" },
        ].map((item) => (
          <li key={item.to}>
            <Link
              to={item.to}
              className="block py-3 px-4 rounded-lg bg-green-700 dark:bg-[#272b4a] text-white text-center font-medium shadow-md hover:bg-green-600 dark:hover:bg-[#1f2239] hover:shadow-lg transition duration-200"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>

      <footer className="text-sm text-gray-300 text-center mt-6">
        &copy; 2024 Bhoomi
      </footer>
    </aside>
  );
};

export default Sidebar;
