'use client';
import { useState } from 'react';
import Image from 'next/image';

export function InteriorAnalyzer() {
  const [location, setLocation] = useState<{lat: number, lng: number, city: string} | null>(null);
  const [loading, setLoading] = useState(false);

  const getLocation = () => {
    setLoading(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            city: 'Mumbai'
          };
          setLocation(loc);
          setLoading(false);
          console.log('✅ Location:', loc);
        },
        (error) => {
          console.error('❌ Location error:', error);
          setLoading(false);
          // Mumbai default
          setLocation({ lat: 19.0760, lng: 72.8777, city: 'Mumbai' });
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      // Fallback Mumbai
      setLocation({ lat: 19.0760, lng: 72.8777, city: 'Mumbai' });
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* ✅ LOCATION BUTTON */}
      <div className="mb-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-center">
        <button 
          onClick={getLocation}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-bold transition-all"
        >
          {loading ? '⏳ Detecting...' : '📍 Enable Live Location'}
        </button>
        {location && (
          <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <p className="font-bold text-green-700 dark:text-green-300">✅ Location Active</p>
            <p className="text-sm text-green-600 dark:text-green-400">{location.city}</p>
          </div>
        )}
      </div>

      {/* ✅ UPLOAD FRAME */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 p-6 md:p-12 rounded-3xl text-center shadow-2xl">
        <h1 className="text-4xl font-black mb-6 text-gray-800 dark:text-white">📸 Capture the Defect</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
          Take a clear, well-lit photo for the most accurate AI analysis.
        </p>
        <div className="border-4 border-dashed border-blue-300 dark:border-blue-700 rounded-2xl p-10 md:p-20 bg-white/50 dark:bg-black/20 hover:border-blue-400 dark:hover:border-blue-500 transition-all cursor-pointer">
          <p className="text-2xl font-semibold text-gray-500 dark:text-gray-400 mb-2">Upload Wall Photo</p>
          <p className="text-sm text-gray-400 dark:text-gray-500">JPG, PNG up to 5MB</p>
        </div>
      </div>

      {/* ✅ AI ANALYSIS DEMO */}
      {location && (
        <div className="mt-12 space-y-6">
          <h2 className="text-3xl font-bold text-center text-white">AI Analysis Complete ✅</h2>
          <img 
            src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800" 
            alt="Smooth green wall" 
            className="w-full h-96 object-cover rounded-3xl shadow-2xl"
          />
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-red-50 dark:bg-red-900/20 p-8 rounded-2xl">
              <h3 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">🔴 Damage Detected</h3>
              <ul className="space-y-2 text-lg text-gray-700 dark:text-gray-300">
                <li>• Peeling plaster (left wall)</li>
                <li>• Moisture stains (bottom)</li>
              </ul>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 p-8 rounded-2xl">
              <h3 className="text-2xl font-bold text-green-600 dark:text-green-400 mb-4">💰 Mumbai Pricing</h3>
              <div className="space-y-3 text-gray-700 dark:text-gray-300">
                <div>JK WallPutty: ₹800</div>
                <div>Primer: ₹1200</div>
                <div>Green Paint: ₹1500</div>
                <div className="text-3xl font-black text-green-700 dark:text-green-300 mt-4">Total: ₹3500</div>
              </div>
            </div>
          </div>
          <button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-6 rounded-3xl text-xl font-bold shadow-xl hover:shadow-2xl transition-all">
            📞 Book Local Painter (2km away)
          </button>
        </div>
      )}
    </div>
  );
}