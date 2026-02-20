'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { MapPin, Loader2, CheckCircle, AlertTriangle, Upload, Image, Zap, DollarSign } from 'lucide-react';

interface Location {
  lat: number;
  lng: number;
  address: string;
}

interface LocationTrackerProps {
  onLocationChange: (location: Location | null) => void;
}

function LocationTracker({ onLocationChange }: LocationTrackerProps) {
  const [location, setLocation] = useState<Location | null>(null);
  const [status, setStatus] = useState<'prompt' | 'loading' | 'granted' | 'denied'>('prompt');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const storedLocation = localStorage.getItem('userLocation');
    if (storedLocation) {
      try {
        const parsedLocation = JSON.parse(storedLocation);
        setLocation(parsedLocation);
        setStatus('granted');
        onLocationChange(parsedLocation);
      } catch (e) {
        localStorage.removeItem('userLocation');
      }
    }
  }, [onLocationChange]);

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setErrorMsg("Geolocation is not supported by your browser.");
      setStatus('denied');
      return;
    }

    setStatus('loading');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          address: "Mumbai, MH"
        };
        setLocation(userLocation);
        setStatus('granted');
        localStorage.setItem('userLocation', JSON.stringify(userLocation));
        onLocationChange(userLocation);
      },
      (error) => {
        setErrorMsg("Location access denied: " + error.message);
        setStatus('denied');
        onLocationChange(null);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  if (status === 'granted' && location) {
    return (
      <Card className="glass-card border-green-500/50 bg-green-50/50 backdrop-blur-sm">
        <CardContent className="p-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <CheckCircle className="h-8 w-8 text-green-500" />
            <h3 className="text-2xl font-bold text-green-800">Location Active</h3>
          </div>
          <p className="text-xl font-semibold text-green-700">{location.address}</p>
        </CardContent>
      </Card>
    );
  }

  if (status === 'denied') {
    return (
      <Card className="glass-card border-red-500/50 bg-red-50/50 backdrop-blur-sm">
        <CardContent className="p-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <AlertTriangle className="h-8 w-8 text-red-500" />
            <h3 className="text-xl font-bold text-red-800">Location Denied</h3>
          </div>
          <p className="text-sm text-red-700">{errorMsg}</p>
          <Button onClick={requestLocation} className="mt-4 w-full" variant="outline">
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card hover:shadow-xl transition-shadow">
      <CardContent className="p-6">
        <Button onClick={requestLocation} className="w-full group" disabled={status === 'loading'}>
          {status === 'loading' ? (
            <>
              <Loader2 className="mr-3 h-5 w-5 animate-spin" />
              Detecting Location...
            </>
          ) : (
            <>
              <MapPin className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform" />
              Enable Live Location
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}

// MAIN ANALYZER COMPONENT
export default function InteriorAnalyzer() {
  const [location, setLocation] = useState<Location | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'analyzed'>('idle');
  const [analysis, setAnalysis] = useState(null);

  const handleLocationChange = (loc: Location | null) => {
    setLocation(loc);
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadStatus('uploading');
      // Simulate AI analysis
      setTimeout(() => {
        setAnalysis({
          damage: ['Peeling plaster', 'Moisture stains'],
          repairCost: 3500,
          materials: ['JK WallPutty ₹800', 'Primer ₹1200', 'Paint ₹1500'],
          painter: 'Raju Painter (2km away)'
        });
        setUploadStatus('analyzed');
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-emerald-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-gray-900 via-blue-900 to-emerald-700 bg-clip-text text-transparent mb-6">
            AI Home Consultant
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Analyze wall defects, get instant repair quotes & book local Mumbai painters
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {/* Location Tracker */}
          <LocationTracker onLocationChange={handleLocationChange} />
          
          {/* Upload Area */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-xl shadow-2xl rounded-4xl p-12 border-4 border-blue-200/50 hover:border-blue-300/70 transition-all">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-black text-gray-900 mb-6">📸 Capture the Defect</h2>
                <p className="text-xl text-gray-700 mb-12 max-w-2xl mx-auto">
                  Take a clear, well-lit photo of your wall for accurate AI analysis
                </p>
              </div>
              
              <div className="border-4 border-dashed border-blue-300 hover:border-blue-500 rounded-4xl p-20 bg-gradient-to-br from-blue-50 to-indigo-50 hover:bg-blue-100 transition-all cursor-pointer group hover:shadow-2xl">
                <div className="text-center">
                  <Upload className="w-24 h-24 mx-auto mb-8 text-blue-500 group-hover:scale-110 transition-transform duration-300" />
                  <h3 className="text-3xl font-bold text-gray-800 mb-4 group-hover:text-blue-700 transition-colors">Upload Wall Photo</h3>
                  <p className="text-xl text-gray-600">JPG, PNG (Max 5MB) • Drag & drop or click</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Analysis Results */}
        {uploadStatus === 'analyzed' && analysis && (
          <div className="space-y-12">
            {/* Header */}
            <div className="text-center">
              <h2 className="text-5xl font-black bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 bg-clip-text text-transparent mb-6">
                Analysis Complete ✅
              </h2>
              <div className="inline-flex items-center gap-3 bg-emerald-100 text-emerald-800 px-8 py-4 rounded-full text-xl font-bold">
                <Zap className="w-6 h-6" />
                AI Processing: 2 seconds
              </div>
            </div>

            {/* Results Grid */}
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              {/* Damage Breakdown */}
              <div className="bg-gradient-to-br from-red-50 to-pink-50 backdrop-blur-xl p-12 rounded-4xl shadow-2xl border-4 border-red-200/50">
                <h3 className="text-4xl font-bold text-red-700 mb-10 text-center">🔍 Damage Detected</h3>
                <div className="space-y-6">
                  {analysis.damage.map((issue, i) => (
                    <div key={i} className="flex items-start gap-6 p-8 bg-white/60 rounded-3xl shadow-md hover:shadow-xl transition-all">
                      <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-500 text-white rounded-3xl flex items-center justify-center font-bold text-2xl flex-shrink-0 mt-1">
                        {i + 1}
                      </div>
                      <div>
                        <h4 className="text-2xl font-bold text-gray-900 mb-2">{issue}</h4>
                        <p className="text-lg text-gray-700">Ready for repair</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Repair Preview */}
              <div>
                <div className="relative mb-8">
                  <img 
                    src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=500&fit=crop" 
                    alt="AI Generated Repair Preview"
                    className="w-full h-96 object-cover rounded-4xl shadow-2xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-4xl" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="bg-white/90 backdrop-blur-xl p-6 rounded-3xl shadow-2xl">
                      <h4 className="text-2xl font-bold text-gray-900 mb-2">💚 Smooth Green Finish</h4>
                      <p className="text-lg text-gray-700">AI Generated Preview</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing & Booking */}
            <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 text-white p-16 rounded-5xl shadow-2xl text-center">
              <h3 className="text-6xl font-black mb-12">💰 Mumbai Pricing</h3>
              <div className="grid grid-cols-3 gap-12 mb-16 text-3xl">
                <div className="space-y-2">
                  <DollarSign className="mx-auto w-16 h-16 text-yellow-300" />
                  <div className="text-5xl font-black">₹800</div>
                  <div>Wall Putty</div>
                </div>
                <div className="space-y-2">
                  <DollarSign className="mx-auto w-16 h-16 text-yellow-300" />
                  <div className="text-5xl font-black">₹1,200</div>
                  <div>Primer</div>
                </div>
                <div className="space-y-2">
                  <DollarSign className="mx-auto w-16 h-16 text-yellow-300" />
                  <div className="text-5xl font-black">₹1,500</div>
                  <div>Green Paint</div>
                </div>
              </div>
              <div className="text-7xl font-black bg-white/30 rounded-5xl py-12 px-20 backdrop-blur-xl shadow-2xl mb-12">
                TOTAL ₹3,500
              </div>
              <button className="bg-white/20 backdrop-blur-xl hover:bg-white/30 text-white text-4xl font-black py-16 px-24 rounded-5xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 border-4 border-white/30">
                🚀 Book Raju Painter<br className="md:hidden" />
                <span className="text-2xl block md:inline opacity-90">(2km away)</span>
              </button>
            </div>
          </div>
        )}

        {uploadStatus === 'uploading' && (
          <div className="text-center py-24">
            <div className="inline-flex items-center gap-4 bg-blue-100 text-blue-800 px-12 py-8 rounded-4xl text-2xl font-bold">
              <Loader2 className="w-10 h-10 animate-spin" />
              AI Analyzing your photo...
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
