import React, { useState, useEffect } from "react";

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
    <nav className="bg-blue-500 dark:bg-gray-800 text-white py-4 px-6 flex justify-between items-center shadow-md">
      <h1 className="text-lg font-bold tracking-wide">Bhoomi</h1>
      <button
        onClick={toggleDarkMode}
        className="bg-gray-300 dark:bg-gray-700 px-4 py-2 rounded shadow hover:bg-gray-400 dark:hover:bg-gray-600 transition"
      >
        {darkMode ? "Light Mode" : "Dark Mode"}
      </button>
    </nav>
  );
};

export default Navbar;
