"use client";

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { 
  ArrowLeft, ScanSearch, Loader2, AlertCircle, 
  History, CheckCircle2, MapPin, Star, ShieldCheck, 
  Paintbrush
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

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
    
    setTimeout(() => {
      setResult({
        issue: "Wall Seepage & Paint Bubbles (दीवार में सीलन)",
        details: "दीवार के अंदर नमी के कारण पेंट खराब हो रहा है। वॉटरप्रूफिंग की जरूरत है।",
        estimate: "₹3,800 - ₹5,200",
        worker: {
          name: "Raju Painter",
          rating: "4.8",
          distance: "1.5 km"
        },
        realisticAfter: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80"
      });
      setIsAnalyzing(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100">
      <div className="sticky top-0 z-50 bg-slate-900/60 backdrop-blur-xl border-b border-white/5 p-4 flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={() => window.history.back()}><ArrowLeft /></Button>
        <div className="text-center">
          <h1 className="text-xs font-black tracking-[0.3em] text-blue-500">GharKiSeva AI</h1>
        </div>
        <History className="w-5 h-5 opacity-40" />
      </div>

      <main className="max-w-md mx-auto p-5 space-y-6">
        {!result ? (
          <div className="space-y-6 animate-in fade-in duration-700">
            <div 
              className="relative aspect-[4/5] rounded-[40px] overflow-hidden border-2 border-dashed border-slate-800 bg-slate-900/40 flex items-center justify-center cursor-pointer group"
              onClick={() => fileInputRef.current?.click()}
            >
              {media ? (
                <Image src={media.dataUrl} alt="Room" fill className="object-cover" />
              ) : (
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto">
                    <ScanSearch className="text-blue-500 w-10 h-10" />
                  </div>
                  <p className="font-bold text-slate-300">दीवार या फर्श की फोटो लें</p>
                </div>
              )}
              {isAnalyzing && (
                <div className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center z-20">
                  <Loader2 className="w-14 h-14 animate-spin text-blue-500 mb-4" />
                  <p className="text-blue-500 font-black animate-pulse uppercase tracking-widest text-xs">Scanning...</p>
                </div>
              )}
            </div>
            <Button onClick={startAnalysis} disabled={!media || isAnalyzing} className="w-full h-16 bg-blue-600 rounded-[24px] text-lg font-black">
              START AI ANALYSIS ✨
            </Button>
          </div>
        ) : (
          <div className="space-y-6 animate-in slide-in-from-bottom-10 duration-700">
            <Card className="bg-red-500/5 border-red-500/20 rounded-[30px]">
              <CardContent className="p-5 flex gap-4">
                <AlertCircle className="text-red-500 shrink-0" />
                <div>
                  <h3 className="font-bold text-red-400">{result.issue}</h3>
                  <p className="text-xs text-slate-400 mt-1">{result.details}</p>
                </div>
              </CardContent>
            </Card>

            <div className="relative aspect-video rounded-[30px] overflow-hidden border border-white/10 shadow-2xl">
              <Image src={result.realisticAfter} alt="AI Look" fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                <p className="text-xs font-bold text-white italic flex items-center gap-2">
                  <Paintbrush size={14} className="text-blue-400" /> AI Suggested Modern Finish
                </p>
              </div>
            </div>

            <Card className="bg-slate-900/40 border-white/5 rounded-[30px] p-6 shadow-2xl">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <p className="text-sm font-bold flex items-center gap-1">{result.worker.name} <CheckCircle2 size={12} className="text-blue-500" /></p>
                  <p className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5"><MapPin size={10} /> {result.worker.distance} away</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-slate-500 font-bold uppercase">Estimate</p>
                  <p className="text-2xl font-black text-green-500">{result.estimate}</p>
                </div>
              </div>
              <Button className="w-full h-14 bg-green-600 rounded-2xl font-black transition-all active:scale-95">
                PAY & BOOK SERVICE <CheckCircle2 className="ml-2 w-5 h-5" />
              </Button>
            </Card>
            
            <button onClick={() => setResult(null)} className="w-full py-4 text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">
              ← Start New Scan
            </button>
          </div>
        )}
      </main>
      <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
    </div>
  );
}