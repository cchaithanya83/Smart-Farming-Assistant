import React from "react";

const About: React.FC = () => {
  return (
    <div className="bg-white dark:bg-[#1d203a]">
      {/* Header Section */}
      <header className="bg-green-600 dark:bg-[#271b4a] text-white py-6">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-bold">Smart Farming Assistant</h1>
          <p className="text-lg mt-2">
            Leveraging technology for sustainable and efficient farming.
          </p>
        </div>
      </header>

      {/* About the Project */}
      <section className="bg-gray-100 dark:bg-[#272b4a] py-12">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-green-800 dark:text-white mb-4">
            About the Project
          </h2>
          <p className="text-gray-700 dark:text-gray-200 mb-4">
            The Smart Farming Assistant is an innovative platform designed to
            empower farmers by providing advanced tools and insights for
            sustainable agriculture. It includes features such as crop and
            fertilizer recommendations, plant disease detection, and
            climate-based farming insights tailored to regional needs.
          </p>
        </div>
      </section>

      {/* Student Details */}
      <section className="bg-white dark:bg-[#1d203a] py-12">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-green-800 dark:text-white mb-6">
            Submitted By
          </h2>
          <ul className="space-y-4">
            <li className="text-gray-700 dark:text-gray-200">
              <strong>Khushi R. Haldankar</strong> - 4SO21CS074
            </li>
            <li className="text-gray-700 dark:text-gray-200">
              <strong>Prathiksha S Poojari</strong> - 4SO21CS114
            </li>
            <li className="text-gray-700 dark:text-gray-200">
              <strong>Ria Dsouza</strong> - 4SO21CS125
            </li>
            <li className="text-gray-700 dark:text-gray-200">
              <strong>Ritesh</strong> - 4SO21CS126
            </li>
          </ul>
        </div>
      </section>

      {/* Guide Details */}
      <section className="bg-gray-100 dark:bg-[#272b4a] py-12">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-green-800 dark:text-white mb-6">
            Under the Guidance Of
          </h2>
          <p className="text-gray-700 dark:text-gray-200">
            <strong>Ms. Supriya Salian</strong>
          </p>
          <p className="text-gray-700 dark:text-gray-200">
            Assistant Professor, Department of CSE
          </p>
        </div>
      </section>
    </div>
  );
};

export default About;
