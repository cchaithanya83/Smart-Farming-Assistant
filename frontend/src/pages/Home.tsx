import React from "react";

const Home: React.FC = () => {
  return (
    <div className="bg-white">
      {/* Header Section */}
      <header className="bg-green-600 text-white py-6">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-bold">Welcome to Bhoomi</h1>
          <p className="text-lg mt-2">
            Your Smart Farming Assistant for sustainable and efficient
            agriculture.
          </p>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gray-100 py-12">
        <div className="container mx-auto px-6 md:flex md:items-center">
          <div className="md:w-1/2">
            <h2 className="text-3xl font-bold text-green-800 mb-4">
              Smart Tools for Smarter Farming
            </h2>
            <p className="text-gray-700 mb-6">
              Bhoomi provides tools like crop and fertilizer recommendations,
              plant disease detection, and climate-based farming insights
              tailored for your region.
            </p>
            <div className="space-x-4">
              <button className="bg-green-600 text-white px-6 py-3 rounded shadow hover:bg-green-700">
                Get Started
              </button>
              <button className="bg-gray-200 text-green-600 px-6 py-3 rounded shadow hover:bg-gray-300">
                Learn More
              </button>
            </div>
          </div>
          <div className="md:w-1/2 mt-6 md:mt-0">
            <img
              src="/images/hero-agriculture.jpg"
              alt="Smart Farming"
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Did You Know Section */}
      <section className="bg-gray-100 py-12">
        <div className="container mx-auto px-6">
          <h4 className="text-xl font-bold text-green-800 mb-4">
            Did You Know?
          </h4>
          <p className="text-gray-700">
            Farmers in the Konkan region can grow over 15 types of crops due to
            the unique climate conditions!
          </p>
        </div>
      </section>


    </div>
  );
};

export default Home;