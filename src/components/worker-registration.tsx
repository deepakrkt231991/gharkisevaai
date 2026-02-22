"use client";
import React, { useState } from 'react';

export default function WorkerRegistration() {
  const [status, setStatus] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setStatus("Submitting to GharKiSeva...");
    const formData = new FormData(e.target);

    // आपकी स्क्रीनशॉट वाली Key यहाँ है
    formData.append("access_key", "e525df7c-17f3-4153-9d6a-7e09c3463079"); 

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });

      const data = await response.json();
      if (data.success) {
        setStatus("✅ Success! Your profile is sent to GharKiSeva team.");
        e.target.reset();
      } else {
        setStatus("❌ Error: Something went wrong.");
      }
    } catch (err) {
      setStatus("❌ Network Error. Please check your internet.");
    }
  };

  return (
    <div className="max-w-md mx-auto my-10 p-8 bg-white rounded-[40px] shadow-2xl border border-blue-50">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-black text-slate-800 tracking-tight">WORKER REGISTER</h2>
        <p className="text-sm text-slate-500 font-medium">Get verified jobs in Mumbai 📍</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-400 ml-2 uppercase">Full Name</label>
          <input type="text" name="name" required placeholder="Ex: Raju Sharma" 
            className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-400 ml-2 uppercase">Mobile Number</label>
          <input type="number" name="phone" required placeholder="91XXXXXXXX" 
            className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-400 ml-2 uppercase">Work City / Area</label>
          <input type="text" name="city" required placeholder="Ex: Andheri, Mumbai" 
            className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-400 ml-2 uppercase">Expertise</label>
          <select name="specialty" className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none appearance-none cursor-pointer">
            <option value="Painter">Wall Painter</option>
            <option value="Seepage Expert">Seepage/Waterproofing</option>
            <option value="Flooring">Tiles & Flooring</option>
            <option value="Full Home Decor">Full Home Renovation</option>
          </select>
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white p-5 rounded-2xl font-black text-lg shadow-lg hover:bg-blue-700 active:scale-95 transition-all mt-4">
          SUBMIT PROFILE 🚀
        </button>
      </form>

      {status && (
        <div className={`mt-6 p-4 rounded-2xl text-center font-bold text-sm ${status.includes('✅') ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600 animate-pulse'}`}>
          {status}
        </div>
      )}
    </div>
  );
}
