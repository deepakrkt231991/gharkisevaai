"use client";

import { useState, useRef, ChangeEvent } from 'react';
import Image from 'next/image';
import { 
  Sparkles, RotateCw, AlertCircle, Loader2, ScanSearch, 
  ArrowLeft, History, Paintbrush, Wallet, CheckCircle2, 
  ShoppingBag, Hammer, MapPin, Star 
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function DefectAnalyzer() {
  const [media, setMedia] = useState<{ dataUrl: string } | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
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
        issue: "Dampness & Efflorescence (नमी और सोरा)",
        details: "दीवार के प्लास्टर में नमी की वजह से पेंट खराब हो रहा है।",
        marketProducts: [
          { name: "Dr. Fixit LW+", price: "₹180", img: "https://m.media-amazon.com/images/I/61S7R1D-x9L._SL1000_.jpg" },
          { name: "Asian Paints Putty", price: "₹950", img: "https://m.media-amazon.com/images/I/51p6K6N1ZHL._SL1000_.jpg" }
        ],
        totalEstimate: "₹4,200 - ₹5,500",
        aiDesign: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=80",
        expert: { name: "Raju Mistri", rating: "4.8", distance: "1.2 km" }
      });
      setIsAnalyzing(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-white pb-10">
      <div className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-white/10 p-4 flex items-center justify-between">
        <Button variant="ghost" className="text-white" onClick={() => window.history.back()}><ArrowLeft /></Button>
        <div className="text-center">
          <h1 className="text-xl font-black tracking-tighter text-blue-400">DEFECT SCANNER</h1>
          <p className="text-[9px] uppercase tracking-[0.3em] text-slate-400 font-bold">AI Powered</p>
        </div>
        <Button variant="ghost" className="text-white"><History /></Button>
      </div>

      <main className="max-w-xl mx-auto p-4 space-y-6">
        {!result ? (
          <div className="space-y-6">
            <div 
              className="relative aspect-[3/4] rounded-[40px] overflow-hidden border-2 border-white/10 bg-slate-800 flex items-center justify-center cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              {media ? (
                <>
                  <Image src={media.dataUrl} alt="Target" fill className="object-cover" />
                  {isAnalyzing && (
                    <div className="absolute inset-0 z-10 bg-blue-500/10 backdrop-blur-[2px] flex items-center justify-center">
                       <Loader2 className="h-12 w-12 animate-spin text-blue-400" />
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center space-y-4">
                  <ScanSearch className="w-12 h-12 text-blue-400 mx-auto" />
                  <p className="text-lg font-bold text-slate-300">फोटो अपलोड करें</p>
                </div>
              )}
            </div>

            <Button 
              onClick={startAnalysis} 
              disabled={!media || isAnalyzing}
              className="w-full h-16 rounded-3xl text-xl font-black bg-blue-600 shadow-lg"
            >
              {isAnalyzing ? "Scanning..." : "START AI SCAN ✨"}
            </Button>
          </div>
        ) : (
          <div className="space-y-6 animate-in zoom-in-95 duration-500">
            <Card className="bg-slate-900 border-red-500/50 border-2 rounded-[32px] overflow-hidden">
              <div className="bg-red-500 text-white px-6 py-2 flex items-center gap-2 font-bold uppercase text-xs">
                <AlertCircle size={14} /> Problem Detected
              </div>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-white mb-2">{result.issue}</h2>
                <p className="text-slate-400 text-sm">{result.details}</p>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <h3 className="flex items-center gap-2 font-bold text-slate-300 ml-2 text-sm">
                <ShoppingBag size={16} className="text-blue-400" /> Recommended Products:
              </h3>
              <div className="flex gap-4 overflow-x-auto pb-2">
                {result.marketProducts.map((p: any, i: number) => (
                  <div key={i} className="min-w-[140px] bg-white rounded-2xl p-3 flex flex-col items-center">
                    <img src={p.img} alt={p.name} className="h-16 object-contain mb-2" />
                    <p className="text-[10px] text-black font-bold text-center line-clamp-1">{p.name}</p>
                    <p className="text-blue-600 font-black text-sm">₹{p.price}</p>
                  </div>
                ))}
              </div>
            </div>

            <Card className="bg-slate-900 border-white/10 rounded-[32px] overflow-hidden">
               <div className="p-4 bg-white/5 flex justify-between items-center">
                  <span className="text-slate-400 text-sm">Total Estimate:</span>
                  <span className="text-xl font-black text-green-400">{result.totalEstimate}</span>
               </div>
               <div className="p-4">
                  <Image src={result.aiDesign} alt="Design" width={400} height={200} className="rounded-xl object-cover" />
               </div>
            </Card>

            <Button className="w-full h-16 rounded-3xl text-xl font-black bg-green-600">
              BOOK RAJU MISTRI
            </Button>
            
            <Button variant="ghost" className="w-full text-slate-500" onClick={() => setResult(null)}>
              SCAN AGAIN
            </Button>
          </div>
        )}
      </main>
      <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
    </div>
  );
}