import React, { useState, useEffect } from "react";
import { FaSun, FaMoon } from "react-icons/fa";
import { GiPlantRoots } from "react-icons/gi";
import { jwtDecode } from "jwt-decode";

const Navbar: React.FC = () => {
  const [darkMode, setDarkMode] = useState<boolean>(
    localStorage.getItem("darkMode") === "true"
  );
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(
    Boolean(localStorage.getItem("jwtToken"))
  );
  const [showPopup, setShowPopup] = useState<string | null>(null);

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

  const handleLogin = async (email: string, password: string) => {
    try {
      const response = await fetch("http://127.0.0.1:8000/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();

      // Decode the JWT token
      const decodedToken: any = jwtDecode(data.access_token);

      // Store data from the token
      localStorage.setItem("jwtToken", data.access_token);
      localStorage.setItem("userEmail", decodedToken.email); // Use email from the token
      localStorage.setItem("userName", decodedToken.name); // Use name from the token

      setIsLoggedIn(true);
      setShowPopup(null);
    } catch (error) {
      console.error(error);
      alert("Failed to login. Please try again.");
    }
  };

  const handleSignup = async (
    name: string,
    email: string,
    password: string
  ) => {
    try {
      const response = await fetch("http://127.0.0.1:8000/signup/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (!response.ok) {
        throw new Error("Signup failed");
      }

      setShowPopup(null);
      alert("Signup successful! You can now log in.");
    } catch (error) {
      console.error(error);
      alert("Failed to signup. Please try again.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    setIsLoggedIn(false);
  };

  const Popup = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (showPopup === "login") {
        handleLogin(email, password);
      } else if (showPopup === "signup") {
        handleSignup(name, email, password);
      }
    };

    return (
      <div className="fixed inset-0 text-black bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 dark:text-white rounded-lg p-6 w-96 relative">
          <button
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            onClick={() => setShowPopup(null)}
          >
            ✖
          </button>
          <h2 className="text-xl font-bold mb-4">
            {showPopup === "login" ? "Login" : "Sign Up"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {showPopup === "signup" && (
              <div>
                <label className="block text-sm font-medium">Name</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium">Email</label>
              <input
                type="email"
                className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Password</label>
              <input
                type="password"
                className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
            >
              {showPopup === "login" ? "Login" : "Sign Up"}
            </button>
          </form>
        </div>
      </div>
    );
  };

  return (
    <nav className="bg-green-800 dark:bg-[#272b4a] text-white py-4 px-6 flex justify-between items-center shadow-md transition duration-300 ease-in-out">
      <div className="flex items-center space-x-2">
        <GiPlantRoots className="text-3xl" />
        <h1 className="text-lg font-bold tracking-wide">Bhoomi</h1>
      </div>

      <div className="flex items-center space-x-4">
        <button
          onClick={toggleDarkMode}
          className="bg-gray-300 dark:bg-gray-700 px-4 py-2 rounded shadow flex items-center space-x-2 hover:bg-gray-400 dark:hover:bg-gray-600 transition duration-300 ease-in-out"
        >
          {darkMode ? <FaSun className="text-yellow-400" /> : <FaMoon />}
          <span>{darkMode ? "Light Mode" : "Dark Mode"}</span>
        </button>

        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded shadow text-white transition duration-300 ease-in-out"
          >
            Logout
          </button>
        ) : (
          <>
            <button
              onClick={() => setShowPopup("login")}
              className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded shadow text-white transition duration-300 ease-in-out"
            >
              Login
            </button>
            <button
              onClick={() => setShowPopup("signup")}
              className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded shadow text-white transition duration-300 ease-in-out"
            >
              Signup
            </button>
          </>
        )}
      </div>

      {showPopup && <Popup />}
    </nav>
  );
};

export default Navbar;
