import React from 'react';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-400 to-red-500">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-white mb-4">
            🌶️ CHACHA STREET EATS 🍟
          </h1>
          <p className="text-xl text-white mb-8">
            Welcome to your frontend! Tailwind CSS is working if this looks styled.
          </p>
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Ready to Build!
            </h2>
            <p className="text-gray-600">
              Your React + Tailwind frontend is set up. Let's start building components!
            </p>
            <button className="mt-6 bg-yellow-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-yellow-600 transition duration-300">
              Get Started
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;