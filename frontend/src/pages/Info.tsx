import React from "react";

const Info: React.FC = () => {
  return (
    <div className="p-6 bg-gray-100 dark:bg-[#1d203a] min-h-screen dark:text-white">
      <div className="bg-white dark:bg-[#272b4a] p-6 shadow-md rounded">
      <h2 className="text-2xl font-bold text-gray-700 dark:text-white mb-6 text-center">
        Soil Types in Coastal Karnataka
      </h2>
      <p className="dark:text-white mb-6 text-center">Coastal Karnataka has unique soil types that support a variety of crops, from paddy fields to coconut plantations. Understanding these soil types helps optimize agricultural productivity.</p>
        
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200 dark:bg-[#1d203a]">
              <th className="border px-4 py-2">District</th>
              <th className="border px-4 py-2">Soil Types</th>
              <th className="border px-4 py-2">Major Crops</th>
              <th className="border px-4 py-2">NPK Value</th>
              <th className="border px-4 py-2">Rainfall (mm/year)</th>
              <th className="border px-4 py-2">Temperature (°C)</th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-gray-100 dark:bg-[#2c3054]">
              <td className="border px-4 py-2">Udupi</td>
              <td className="border px-4 py-2">Coastal Sand</td>
              <td className="border px-4 py-2">Coconut, Cashew</td>
              <td className="border px-4 py-2">Low N, P, High K</td>
              <td className="border px-4 py-2">3000-4000</td>
              <td className="border px-4 py-2">22-32</td>
            </tr>
            <tr className="bg-white dark:bg-[#272b4a]">
              <td className="border px-4 py-2">Mangalore</td>
              <td className="border px-4 py-2">Laterite</td>
              <td className="border px-4 py-2">Rice, Arecanut</td>
              <td className="border px-4 py-2">Medium N, Low P, K</td>
              <td className="border px-4 py-2">3500-4500</td>
              <td className="border px-4 py-2">24-24</td>
            </tr>
            <tr className="bg-gray-100 dark:bg-[#2c3054]">
              <td className="border px-4 py-2">Karwar</td>
              <td className="border px-4 py-2">Red Sandy</td>
              <td className="border px-4 py-2">Coconut, Spices</td>
              <td className="border px-4 py-2">Medium N, High K</td>
              <td className="border px-4 py-2">3000-3500</td>
              <td className="border px-4 py-2">23-30</td>
            </tr>
            <tr className="bg-gray-100 dark:bg-[#2c3054]">
              <td className="border px-4 py-2">Kundapur</td>
              <td className="border px-4 py-2">Alluvial</td>
              <td className="border px-4 py-2">Paddy, Sugarcane</td>
              <td className="border px-4 py-2">High N, Low K</td>
              <td className="border px-4 py-2">4000-5000</td>
              <td className="border px-4 py-2">22-30</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Info;
