'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { MapPin, Loader2, CheckCircle, Upload } from 'lucide-react';

export default function InteriorAnalyzer() {
  const [locationActive, setLocationActive] = useState(true); // Mumbai hardcoded
  const [uploadStatus, setUploadStatus] = useState('idle');

  // Mumbai location - NO geolocation API
  useEffect(() => {
    setLocationActive(true);
  }, []);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    setUploadStatus('analyzing');
    setTimeout(() => setUploadStatus('complete'), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-emerald-50 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Mumbai Location - HARDCODED */}
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-6 text-center">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-green-800 mb-2">📍 Mumbai Location Active</h3>
            <p className="text-lg text-green-700">Local painters ready (Andheri, Mumbai)</p>
          </CardContent>
        </Card>

        {/* Upload Frame */}
        <Card className="border-4 border-blue-200 hover:border-blue-400 shadow-2xl hover:shadow-3xl transition-all">
          <CardContent className="p-12">
            <div className="text-center space-y-6">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent">
                📸 Capture the Defect
              </h2>
              <p className="text-xl text-gray-700 max-w-2xl mx-auto">
                Take a clear photo of peeling wall for instant AI analysis
              </p>
              <div className="border-4 border-dashed border-blue-300 hover:border-blue-500 rounded-3xl p-20 bg-blue-50 hover:bg-blue-100 transition-all cursor-pointer group">
                <Upload className="w-20 h-20 mx-auto mb-6 text-blue-500 group-hover:scale-110 transition-transform" />
                <h3 className="text-3xl font-bold text-gray-800 mb-2 group-hover:text-blue-700">Upload Wall Photo</h3>
                <p className="text-lg text-gray-600">Click or drag JPG/PNG (Max 5MB)</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer rounded-3xl"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Demo Results */}
        {uploadStatus === 'complete' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-5xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4">
                AI Analysis ✅ Complete
              </h2>
              <div className="bg-emerald-100 text-emerald-800 px-8 py-4 rounded-full inline-flex items-center gap-2 text-xl font-bold mx-auto">
                Mumbai Pricing • 2km Painter Available
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Damage List */}
              <Card className="bg-gradient-to-br from-red-50 to-pink-50 border-red-200 shadow-2xl">
                <CardContent className="p-10">
                  <h3 className="text-3xl font-bold text-red-700 mb-8 text-center">🔍 Damage Found</h3>
                  <div className="space-y-6">
                    <div className="flex items-center gap-6 p-6 bg-red-100/50 rounded-3xl border-l-8 border-red-400">
                      <div className="w-14 h-14 bg-red-500 text-white rounded-2xl flex items-center justify-center font-bold text-2xl">1</div>
                      <div>
                        <h4 className="text-2xl font-bold text-gray-900">Peeling Plaster</h4>
                        <p className="text-xl text-gray-700">Left wall section - 2m²</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 p-6 bg-blue-100/50 rounded-3xl border-l-8 border-blue-400">
                      <div className="w-14 h-14 bg-blue-500 text-white rounded-2xl flex items-center justify-center font-bold text-2xl">2</div>
                      <div>
                        <h4 className="text-2xl font-bold text-gray-900">Moisture Damage</h4>
                        <p className="text-xl text-gray-700">Bottom area - damp spots</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Repair Preview */}
              <Card className="shadow-2xl overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=500&fit=crop" 
                  alt="AI Generated Smooth Green Wall"
                  className="w-full h-96 object-cover"
                />
                <CardContent className="p-8 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-center -mt-12 relative z-10">
                  <h4 className="text-3xl font-bold mb-2">💚 Smooth Green Finish</h4>
                  <p className="text-xl opacity-90">AI Generated Repair Preview</p>
                </CardContent>
              </Card>
            </div>

            {/* Pricing */}
            <Card className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-2xl border-emerald-400">
              <CardContent className="p-12 text-center">
                <h3 className="text-5xl font-black mb-10">💰 Mumbai Pricing</h3>
                <div className="grid grid-cols-3 gap-8 mb-12">
                  <div className="space-y-2">
                    <div className="text-4xl font-black">₹800</div>
                    <div className="text-xl opacity-90">Wall Putty</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-4xl font-black">₹1,200</div>
                    <div className="text-xl opacity-90">Primer</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-4xl font-black">₹1,500</div>
                    <div className="text-xl opacity-90">Paint</div>
                  </div>
                </div>
                <div className="text-6xl font-black bg-white/20 rounded-4xl py-8 px-16 backdrop-blur-xl mb-8">
                  TOTAL ₹3,500
                </div>
                <Button className="w-full text-2xl py-10 bg-white/20 hover:bg-white/30 backdrop-blur-xl border-2 border-white/40 rounded-4xl font-black shadow-2xl hover:shadow-3xl h-auto px-12">
                  🚀 Book Raju Painter (2km away)
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {uploadStatus === 'analyzing' && (
          <Card className="text-center p-20">
            <CardContent className="p-12">
              <Loader2 className="w-20 h-20 mx-auto mb-8 animate-spin text-blue-500" />
              <h3 className="text-3xl font-bold text-blue-700 mb-4">AI Analyzing Photo...</h3>
              <p className="text-xl text-blue-600">Processing with Mumbai pricing</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
