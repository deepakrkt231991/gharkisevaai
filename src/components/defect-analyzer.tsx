"use client";

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { 
  RotateCw, AlertCircle, Loader2, ScanSearch, 
  ArrowLeft, History, ShoppingBag, MapPin, Star 
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export function DefectAnalyzer() {
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
    setTimeout(() => {
      setResult({
        issue: "Dampness & Seepage (दीवार में सीलन)",
        details: "पेंट के पीछे नमी जमा होने से पपड़ी बन रही है।",
        marketProducts: [
          { name: "Dr. Fixit LW+", price: "180", img: "https://m.media-amazon.com/images/I/61S7R1D-x9L._SL1000_.jpg" },
          { name: "Asian Paints Putty", price: "950", img: "https://m.media-amazon.com/images/I/51p6K6N1ZHL._SL1000_.jpg" }
        ],
        totalEstimate: "₹4,500",
        aiDesign: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800",
        expert: { name: "Raju Mistri", rating: "4.8" }
      });
      setIsAnalyzing(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-10">
      <div className="sticky top-0 z-50 bg-slate-900 p-4 flex items-center justify-between border-b border-white/10">
        <Button variant="ghost" onClick={() => window.history.back()} className="text-white">
          <ArrowLeft size={24} />
        </Button>
        <h1 className="text-lg font-bold">AI SCANNER</h1>
        <Button variant="ghost" className="text-white">
          <History size={24} />
        </Button>
      </div>

      <main className="max-w-md mx-auto p-4 space-y-6">
        {!result ? (
          <div className="space-y-6">
            <div 
              className="relative aspect-square rounded-3xl overflow-hidden border-2 border-dashed border-slate-700 bg-slate-900 flex items-center justify-center cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              {media ? (
                <Image src={media.dataUrl} alt="Target" fill className="object-cover" />
              ) : (
                <div className="text-center">
                  <ScanSearch size={48} className="mx-auto text-blue-500 mb-2" />
                  <p className="text-sm text-slate-400">फोटो चुनें</p>
                </div>
              )}
              {isAnalyzing && (
                <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                  <Loader2 className="animate-spin text-blue-500 h-10 w-10" />
                </div>
              )}
            </div>

            <Button 
              onClick={startAnalysis} 
              disabled={!media || isAnalyzing}
              className="w-full h-14 rounded-2xl bg-blue-600 hover:bg-blue-700 font-bold text-lg"
            >
              {isAnalyzing ? "Scanning..." : "START AI SCAN"}
            </Button>
          </div>
        ) : (
          <div className="space-y-4 animate-in fade-in duration-500">
            <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-2xl">
              <h2 className="font-bold text-red-400 flex items-center gap-2">
                <AlertCircle size={18} /> {result.issue}
              </h2>
              <p className="text-sm text-slate-300 mt-1">{result.details}</p>
            </div>

            <div className="flex gap-4 overflow-x-auto py-2">
              {result.marketProducts.map((p: any, i: number) => (
                <div key={i} className="min-w-[140px] bg-white rounded-xl p-3 text-black">
                  <img src={p.img} alt={p.name} className="h-14 mx-auto mb-2" />
                  <p className="text-[10px] font-bold text-center line-clamp-1">{p.name}</p>
                  <p className="text-blue-600 font-bold text-center">₹{p.price}</p>
                </div>
              ))}
            </div>

            <Card className="bg-slate-900 border-white/10 p-4 rounded-2xl overflow-hidden">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm text-slate-400">AI Estimate:</span>
                <span className="text-lg font-bold text-green-400">{result.totalEstimate}</span>
              </div>
              <div className="relative aspect-video rounded-lg overflow-hidden">
                <Image src={result.aiDesign} alt="Design" fill className="object-cover" />
              </div>
            </Card>

            <Button className="w-full h-14 rounded-2xl bg-green-600 font-bold shadow-lg">
              BOOK RAJU MISTRI
            </Button>
            <Button variant="ghost" onClick={() => setResult(null)} className="w-full text-slate-500">
              <RotateCw className="mr-2 h-4 w-4" /> SCAN AGAIN
            </Button>
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