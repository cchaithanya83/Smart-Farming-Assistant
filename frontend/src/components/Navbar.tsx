import React, { useState, useEffect } from "react";
import { FaSun, FaMoon } from "react-icons/fa";
import { GiPlantRoots } from "react-icons/gi";

const Navbar: React.FC = () => {
  const [darkMode, setDarkMode] = useState<boolean>(
    localStorage.getItem("darkMode") === "true"
  );

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", String(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <nav className="bg-green-800 dark:bg-[#272b4a] text-white py-4 px-6 flex justify-between items-center shadow-md transition duration-300 ease-in-out">
      <div className="flex items-center space-x-2">
        <GiPlantRoots className="text-3xl" />
        <h1 className="text-lg font-bold tracking-wide">Bhoomi</h1>
      </div>

      <button
        onClick={toggleDarkMode}
        className="bg-gray-300 dark:bg-gray-700 px-4 py-2 rounded shadow flex items-center space-x-2 hover:bg-gray-400 dark:hover:bg-gray-600 transition duration-300 ease-in-out"
      >
        {darkMode ? <FaSun className="text-yellow-400" /> : <FaMoon />}
        <span>{darkMode ? "Light Mode" : "Dark Mode"}</span>
      </button>
    </nav>
  );
};

export default Navbar;
