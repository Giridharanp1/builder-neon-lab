import React from 'react';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          🚀 Builder Neon Lab
        </h1>
        <p className="text-gray-600 text-center mb-6">
          Welcome to your fullstack application deployed on Render!
        </p>
        <div className="space-y-4">
          <div className="bg-green-50 p-4 rounded-lg">
            <h2 className="font-semibold text-green-800">✅ Frontend</h2>
            <p className="text-green-600 text-sm">React + TypeScript + Tailwind CSS</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h2 className="font-semibold text-blue-800">🔧 Backend</h2>
            <p className="text-blue-600 text-sm">Express.js + Node.js</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h2 className="font-semibold text-purple-800">☁️ Deployment</h2>
            <p className="text-purple-600 text-sm">Render Platform</p>
          </div>
        </div>
        <div className="mt-6 text-center">
          <a 
            href="/health" 
            className="inline-block bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Check API Health
          </a>
        </div>
      </div>
    </div>
  );
}

export default App;
