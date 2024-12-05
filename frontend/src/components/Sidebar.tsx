import React from "react";
import { Link } from "react-router-dom";

const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-gray-100 dark:bg-gray-900 p-6 shadow-md">
      <h2 className="text-xl font-semibold text-gray-700 dark:text-white mb-6">
        Navigation
      </h2>
      <ul className="space-y-4">
        {[
          { to: "/crop-recommendation", label: "Crop Recommendation" },
          {
            to: "/fertilizer-recommendation",
            label: "Fertilizer Recommendation",
          },
          { to: "/disease-detection", label: "Disease Detection" },
          { to: "/sensor-data", label: "Sensor Data" },
        ].map((item) => (
          <li key={item.to}>
            <Link
              to={item.to}
              className="block py-2 px-4 rounded bg-blue-500 text-white text-center hover:bg-blue-600 transition"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
