import dynamic from 'next/dynamic';
import { useState } from 'react'; // 'use client' के लिए
import { BottomNavBar } from '@/components/bottom-nav-bar';

// Chat Box dynamic load (client-side)
const AIChatBox = dynamic(() => import('@/components/ai-chat-box'), { ssr: false });

// 'use client' top पर डालो अगर जरूरी
'use client';

export default function InteriorAnalysisPage() {
  const [image, setImage] = useState(null); // Image upload state
  const [analysis, setAnalysis] = useState(null); // AI analysis result

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    setImage(URL.createObjectURL(file));
    // AI analysis call (Gemini या OpenAI API से real में करो)
    // Sample analysis
    setAnalysis({
      problems: ['Wall seepage detected', 'Cracked flooring', 'Faded paint'],
      suggestions: ['New vitrified tile flooring (₹50-₹150/sq ft)', 'Neutral beige wall color', 'Add modular shelves (₹2,000-₹5,000)'],
      steps: ['Step 1: Clean seepage area. Step 2: Apply waterproofing (₹1,000-₹2,000). Step 3: Repaint (₹10,000-₹20,000 for 1 room).'],
      costEstimate: 'Total: ₹15,000-₹40,000 (Mumbai 2026 rates)',
      workers: ['Urban Company Andheri', 'Justdial Contractors', 'NoBroker Handyman']
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Chat Icon ऊपर right corner */}
      <div className="fixed top-4 right-4 z-50">
        <button className="bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700">
          💬 AI Chat
        </button>
        {/* Chat box open on click – real में state से toggle करो */}
        {/* <AIChatBox /> */}
      </div>

      <main className="flex-1 p-6">
        <h1 className="text-4xl font-bold text-center mb-10 text-blue-800">
          Free AI Interior Analyst – Mumbai Active 📍
        </h1>

        {/* Image Upload */}
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-10 text-center mb-8">
          <div className="text-7xl mb-6">📸</div>
          <h2 className="text-2xl font-semibold mb-4">Upload Room/Flat Photo (Free Analysis)</h2>
          <p className="text-gray-600 mb-8">AI detect problems, suggest designs, guide repairs (local prices).</p>
          <input type="file" accept="image/*" onChange={handleUpload} className="mb-4" />
          {image && <img src={image} alt="Uploaded" className="w-full rounded-lg mb-4" />}
        </div>

        {/* Analysis Result */}
        {analysis && (
          <div className="max-w-lg mx-auto space-y-6">
            {/* Problems */}
            <div className="bg-red-100 p-6 rounded-xl">
              <h3 className="text-xl font-bold mb-4">Detected Problems:</h3>
              <ul className="list-disc pl-6 text-gray-700">
                {analysis.problems.map((p, i) => <li key={i}>{p}</li>)}
              </ul>
            </div>

            {/* Suggestions & New Design */}
            <div className="bg-green-100 p-6 rounded-xl">
              <h3 className="text-xl font-bold mb-4">Suggested New Design (Flooring, Colors, Items):</h3>
              <ul className="list-disc pl-6 text-gray-700">
                {analysis.suggestions.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
              <p className="mt-4 font-semibold">Visual Designs (Mumbai Style):</p>
              {/* Images render */}
            </div>

            {/* Step-by-Step Guide (Engineer जैसे) */}
            <div className="bg-blue-100 p-6 rounded-xl">
              <h3 className="text-xl font-bold mb-4">Repair Guide (Step-by-Step):</h3>
              <ol className="list-decimal pl-6 text-gray-700">
                {analysis.steps.map((step, i) => <li key={i}>{step}</li>)}
              </ol>
              <p className="mt-4">Local Mumbai Prices (2026): Painting ₹30-₹100/sq ft, Flooring ₹50-₹150/sq ft, Full 1BHK Repair ₹4.5L-₹7L.</p>
            </div>

            {/* Nearby Workers */}
            <div className="bg-yellow-100 p-6 rounded-xl">
              <h3 className="text-xl font-bold mb-4">Nearby Active Workers (Andheri/Mumbai):</h3>
              <ul className="list-disc pl-6 text-gray-700">
                <li>Urban Company – Handyman for repairs (Book online)</li>
                <li>Justdial Contractors – Andheri West (Call for quotes)</li>
                <li>NoBroker Renovation – Mumbai-wide (App से book)</li>
              </ul>
            </div>
          </div>
        )}
      </main>

      <div className="fixed bottom-0 left-0 right-0 z-50">
        <BottomNavBar />
      </div>
    </div>
  );
}
import dynamic from 'next/dynamic';
import { useState } from 'react'; // 'use client' के लिए
import { BottomNavBar } from '@/components/bottom-nav-bar';

// Chat Box dynamic load (client-side)
const AIChatBox = dynamic(() => import('@/components/ai-chat-box'), { ssr: false });

// 'use client' top पर डालो अगर जरूरी
'use client';

export default function InteriorAnalysisPage() {
  const [image, setImage] = useState(null); // Image upload state
  const [analysis, setAnalysis] = useState(null); // AI analysis result

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    setImage(URL.createObjectURL(file));
    // AI analysis call (Gemini या OpenAI API से real में करो)
    // Sample analysis
    setAnalysis({
      problems: ['Wall seepage detected', 'Cracked flooring', 'Faded paint'],
      suggestions: ['New vitrified tile flooring (₹50-₹150/sq ft)', 'Neutral beige wall color', 'Add modular shelves (₹2,000-₹5,000)'],
      steps: ['Step 1: Clean seepage area. Step 2: Apply waterproofing (₹1,000-₹2,000). Step 3: Repaint (₹10,000-₹20,000 for 1 room).'],
      costEstimate: 'Total: ₹15,000-₹40,000 (Mumbai 2026 rates)',
      workers: ['Urban Company Andheri', 'Justdial Contractors', 'NoBroker Handyman']
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Chat Icon ऊपर right corner */}
      <div className="fixed top-4 right-4 z-50">
        <button className="bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700">
          💬 AI Chat
        </button>
        {/* Chat box open on click – real में state से toggle करो */}
        {/* <AIChatBox /> */}
      </div>

      <main className="flex-1 p-6">
        <h1 className="text-4xl font-bold text-center mb-10 text-blue-800">
          Free AI Interior Analyst – Mumbai Active 📍
        </h1>

        {/* Image Upload */}
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-10 text-center mb-8">
          <div className="text-7xl mb-6">📸</div>
          <h2 className="text-2xl font-semibold mb-4">Upload Room/Flat Photo (Free Analysis)</h2>
          <p className="text-gray-600 mb-8">AI detect problems, suggest designs, guide repairs (local prices).</p>
          <input type="file" accept="image/*" onChange={handleUpload} className="mb-4" />
          {image && <img src={image} alt="Uploaded" className="w-full rounded-lg mb-4" />}
        </div>

        {/* Analysis Result */}
        {analysis && (
          <div className="max-w-lg mx-auto space-y-6">
            {/* Problems */}
            <div className="bg-red-100 p-6 rounded-xl">
              <h3 className="text-xl font-bold mb-4">Detected Problems:</h3>
              <ul className="list-disc pl-6 text-gray-700">
                {analysis.problems.map((p, i) => <li key={i}>{p}</li>)}
              </ul>
            </div>

            {/* Suggestions & New Design */}
            <div className="bg-green-100 p-6 rounded-xl">
              <h3 className="text-xl font-bold mb-4">Suggested New Design (Flooring, Colors, Items):</h3>
              <ul className="list-disc pl-6 text-gray-700">
                {analysis.suggestions.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
              <p className="mt-4 font-semibold">Visual Designs (Mumbai Style):</p>
              {/* Images render */}
            </div>

            {/* Step-by-Step Guide (Engineer जैसे) */}
            <div className="bg-blue-100 p-6 rounded-xl">
              <h3 className="text-xl font-bold mb-4">Repair Guide (Step-by-Step):</h3>
              <ol className="list-decimal pl-6 text-gray-700">
                {analysis.steps.map((step, i) => <li key={i}>{step}</li>)}
              </ol>
              <p className="mt-4">Local Mumbai Prices (2026): Painting ₹30-₹100/sq ft, Flooring ₹50-₹150/sq ft, Full 1BHK Repair ₹4.5L-₹7L.</p>
            </div>

            {/* Nearby Workers */}
            <div className="bg-yellow-100 p-6 rounded-xl">
              <h3 className="text-xl font-bold mb-4">Nearby Active Workers (Andheri/Mumbai):</h3>
              <ul className="list-disc pl-6 text-gray-700">
                <li>Urban Company – Handyman for repairs (Book online)</li>
                <li>Justdial Contractors – Andheri West (Call for quotes)</li>
                <li>NoBroker Renovation – Mumbai-wide (App से book)</li>
              </ul>
            </div>
          </div>
        )}
      </main>

      <div className="fixed bottom-0 left-0 right-0 z-50">
        <BottomNavBar />
      </div>
    </div>
  );
}
