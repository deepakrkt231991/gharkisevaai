"use client";

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { 
  ArrowLeft, ScanSearch, Loader2, AlertCircle, 
  History, Wallet, CheckCircle2, MapPin, Star, ShieldCheck 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

// ✅ 'default' export का उपयोग करें ताकि page.tsx में एरर न आए
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
    setIsAnalyzing(true);
    // AI Realistic Simulation
    setTimeout(() => {
      setResult({
        issue: "Wall Seepage & Surface Cracks",
        severity: "Medium",
        fix: "Waterproof Putty + Primer Coat",
        estimate: "₹4,200",
        nearWorker: { name: "Raju Mistri", rating: "4.9", distance: "0.8 km", jobs: 120 },
        realisticAfter: "https://images.unsplash.com/photo-1615529182904-14819c35db37?w=800&q=80"
      });
      setIsAnalyzing(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100">
      {/* Premium Header */}
      <div className="sticky top-0 z-50 bg-slate-900/50 backdrop-blur-xl border-b border-white/5 p-4 flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={() => window.history.back()}><ArrowLeft /></Button>
        <div className="text-center">
          <h1 className="text-sm font-black tracking-[0.2em] text-blue-500 uppercase">GharKiSeva AI</h1>
        </div>
        <History className="w-5 h-5 opacity-40" />
      </div>

      <main className="max-w-md mx-auto p-5 space-y-6">
        {!result ? (
          <div className="space-y-6">
            <div 
              className="relative aspect-[4/5] rounded-[40px] overflow-hidden border-2 border-dashed border-slate-800 bg-slate-900/50 flex items-center justify-center cursor-pointer group hover:border-blue-500/50 transition-all"
              onClick={() => fileInputRef.current?.click()}
            >
              {media ? (
                <Image src={media.dataUrl} alt="Room" fill className="object-cover" />
              ) : (
                <div className="text-center space-y-3">
                  <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                    <ScanSearch className="text-blue-500 w-8 h-8" />
                  </div>
                  <p className="font-bold text-slate-400 text-sm">Scan Wall, Floor or Room</p>
                </div>
              )}
              {isAnalyzing && (
                <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md flex flex-col items-center justify-center z-20">
                  <Loader2 className="w-12 h-12 animate-spin text-blue-500 mb-4" />
                  <p className="text-blue-500 font-black animate-pulse uppercase tracking-widest text-xs">AI Deep Analysis...</p>
                </div>
              )}
            </div>
            <Button onClick={startAnalysis} disabled={!media || isAnalyzing} className="w-full h-16 bg-blue-600 hover:bg-blue-700 rounded-3xl text-lg font-black shadow-xl shadow-blue-900/20">
              ANALYZE NOW ✨
            </Button>
          </div>
        ) : (
          <div className="space-y-6 pb-10 animate-in fade-in slide-in-from-bottom-5">
            {/* Defect Card */}
            <Card className="bg-red-500/5 border-red-500/20 rounded-[30px] overflow-hidden">
              <CardContent className="p-5 flex items-start gap-4">
                <div className="bg-red-500/20 p-2 rounded-xl"><AlertCircle className="text-red-500" /></div>
                <div>
                  <h3 className="font-bold text-red-400">{result.issue}</h3>
                  <p className="text-xs text-slate-400 mt-1">{result.fix}</p>
                </div>
              </CardContent>
            </Card>

            {/* Realistic AI Suggestion */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">AI Recommended Look</h4>
              <div className="relative aspect-video rounded-[30px] overflow-hidden border border-white/5">
                <Image src={result.realisticAfter} alt="Realistic Look" fill className="object-cover" />
                <div className="absolute top-3 right-3 bg-blue-600 text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1">
                  <ShieldCheck size={10} /> AI VERIFIED
                </div>
              </div>
            </div>

            {/* Worker & Payment */}
            <Card className="bg-slate-900/50 border-white/5 rounded-[30px] p-5">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center font-bold text-blue-400">R</div>
                   <div>
                     <p className="text-sm font-bold">{result.nearWorker.name}</p>
                     <p className="text-[10px] text-slate-500 flex items-center gap-1"><MapPin size={10}/> {result.nearWorker.distance} away</p>
                   </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500">Total Quote</p>
                  <p className="text-xl font-black text-green-500">{result.estimate}</p>
                </div>
              </div>
              <Button className="w-full h-14 bg-green-600 hover:bg-green-700 rounded-2xl font-black text-base shadow-lg shadow-green-900/20">
                PAY & BOOK NOW <CheckCircle2 className="ml-2 w-5 h-5" />
              </Button>
            </Card>

            <Button variant="ghost" onClick={() => setResult(null)} className="w-full text-slate-500 text-xs font-bold">RE-SCAN AREA</Button>
          </div>
        )}
      </main>
      <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
    </div>
  );
}