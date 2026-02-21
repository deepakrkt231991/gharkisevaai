"use client";

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { 
  ArrowLeft, ScanSearch, Loader2, AlertCircle, 
  History, Wallet, CheckCircle2, MapPin, Star, ShieldCheck, 
  Paintbrush, Construction 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

// ✅ 'export default' का उपयोग किया है ताकि 'page.tsx' में कोई एरर न आए
export default function InteriorAnalyzer() {
  const [media, setMedia] = useState<{ dataUrl: string } | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setMedia({ dataUrl: reader.result as string });
      reader.readAsDataURL(file);
    }
  };

  const startAnalysis = () => {
    if (!media) return;
    setIsAnalyzing(true);
    
    // Realistic AI Simulation (3 सेकंड का टाइमर)
    setTimeout(() => {
      setResult({
        issue: "Wall Seepage & Paint Bubbles (दीवार में सीलन)",
        details: "दीवार के अंदर पाइप लीक या नमी के कारण पेंट खराब हो रहा है।",
        recommendation: "वॉटरप्रूफ कोटिंग और एंटी-डैम्प प्राइमर की जरूरत है।",
        estimate: "₹3,800 - ₹5,200",
        worker: {
          name: "Raju Painter",
          rating: "4.8",
          distance: "1.5 km",
          verified: true
        },
        realisticAfter: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80"
      });
      setIsAnalyzing(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans">
      {/* --- Premium Glass Header --- */}
      <div className="sticky top-0 z-50 bg-slate-900/60 backdrop-blur-xl border-b border-white/5 p-4 flex items-center justify-between">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => window.history.back()}
          className="rounded-full hover:bg-white/10"
        >
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <div className="flex flex-col items-center">
          <h1 className="text-xs font-black tracking-[0.3em] text-blue-500 uppercase">GharKiSeva AI</h1>
          <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Interior Expert</span>
        </div>
        <History className="w-5 h-5 opacity-40 hover:opacity-100 cursor-pointer transition-opacity" />
      </div>

      <main className="max-w-md mx-auto p-5 space-y-6">
        {!result ? (
          <div className="space-y-6 animate-in fade-in duration-700">
            {/* --- Upload Area --- */}
            <div 
              className="relative aspect-[4/5] rounded-[40px] overflow-hidden border-2 border-dashed border-slate-800 bg-slate-900/40 flex items-center justify-center cursor-pointer group hover:border-blue-500/50 transition-all duration-300 shadow-2xl"
              onClick={() => fileInputRef.current?.click()}
            >
              {media ? (
                <Image src={media.dataUrl} alt="Room" fill className="object-cover transition-transform group-hover:scale-105" />
              ) : (
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto group-hover:bg-blue-500/20 transition-colors">
                    <ScanSearch className="text-blue-500 w-10 h-10" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-300">दीवार या फर्श की फोटो लें</p>
                    <p className="text-xs text-slate-500 mt-1 uppercase tracking-tighter">AI तुरंत जांच करेगा</p>
                  </div>
                </div>
              )}

              {isAnalyzing && (
                <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center z-20">
                  <Loader2 className="w-14 h-14 animate-spin text-blue-500 mb-6" />
                  <div className="text-center space-y-2">
                    <p className="text-blue-500 font-black animate-pulse uppercase tracking-[0.2em] text-sm">AI Deep Scanning...</p>
                    <p className="text-[10px] text-slate-500 italic">Analyzing surface texture & humidity</p>
                  </div>
                </div>
              )}
            </div>

            <Button 
              onClick={startAnalysis} 
              disabled={!media || isAnalyzing} 
              className="w-full h-16 bg-blue-600 hover:bg-blue-700 rounded-[24px] text-lg font-black shadow-2xl shadow-blue-900/30 transition-all active:scale-95 disabled:opacity-30"
            >
              START AI ANALYSIS ✨
            </Button>
          </div>
        ) : (
          <div className="space-y-6 pb-12 animate-in slide-in-from-bottom-10 fade-in duration-700">
            {/* --- Issue Report Card --- */}
            <Card className="bg-red-500/5 border-red-500/20 rounded-[30px] overflow-hidden backdrop-blur-sm">
              <CardContent className="p-5 flex items-start gap-4">
                <div className="bg-red-500/20 p-3 rounded-2xl">
                  <AlertCircle className="text-red-500 w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-red-400 text-lg leading-tight">{result.issue}</h3>
                  <p className="text-xs text-slate-400 mt-2 font-medium">{result.details}</p>
                </div>
              </CardContent>
            </Card>

            {/* --- Realistic AI Look --- */}
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">AI Design Preview</h4>
                <div className="flex items-center gap-1 text-[10px] font-bold text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded-full">
                  <ShieldCheck size={10} /> VERIFIED
                </div>
              </div>
              <div className="relative aspect-video rounded-[30px] overflow-hidden border border-white/10 shadow-2xl">
                <Image src={result.realisticAfter} alt="AI Look" fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                  <p className="text-xs font-bold text-white/90 italic flex items-center gap-2">
                    <Paintbrush size={14} className="text-blue-400" /> AI Suggested Modern Finish
                  </p>
                </div>
              </div>
            </div>

            {/* --- Near Worker & Payment --- */}
            <Card className="bg-slate-900/40 border-white/5 rounded-[30px] p-6 shadow-2xl">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                   <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center font-black text-white shadow-lg">
                     {result.worker.name[0]}
                   </div>
                   <div>
                     <div className="flex items-center gap-1">
                       <p className="text-sm font-bold">{result.worker.name}</p>
                       <CheckCircle2 size={12} className="text-blue-500" />
                     </div>
                     <p className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5 font-medium">
                       <MapPin size={10} className="text-red-500" /> {result.worker.distance} from your location
                     </p>
                   </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">Budget Estimate</p>
                  <p className="text-2xl font-black text-green-500 tracking-tighter">{result.estimate}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6">
                 <div className="bg-white/5 p-3 rounded-2xl border border-white/5">
                    <p className="text-[10px] text-slate-500 uppercase font-bold">Rating</p>
                    <p className="text-sm font-bold flex items-center gap-1 mt-1 text-yellow-500">
                      <Star size={14} fill="currentColor" /> {result.worker.rating}
                    </p>
                 </div>
                 <div className="bg-white/5 p-3 rounded-2xl border border-white/5">
                    <p className="text-[10px] text-slate-500 uppercase font-bold">Fix Method</p>
                    <p className="text-[10px] font-bold mt-1 text-slate-300">Surface Coating</p>
                 </div>
              </div>

              <Button className="w-full h-14 bg-green-600 hover:bg-green-700 rounded-2xl font-black text-base shadow-xl shadow-green-900/20 transition-all hover:scale-[1.02] active:scale-95">
                PAY & BOOK SERVICE <CheckCircle2 className="ml-2 w-5 h-5" />
              </Button>
            </Card>

            <button 
              onClick={() => setResult(null)} 
              className="w-full py-4 text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] hover:text-slate-300 transition-colors"
            >
              ← Start New Scan
            </button>
          </div>
        )}
      </main>

      <input 
        ref={fileInputRef} 
        type="file" 
        className="hidden" 
        accept="image/*" 
        onChange={handleFileChange} 
      />
    </div>
  );
}