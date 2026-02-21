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
        issue: "नमी और सोरा (Dampness Detected)",
        details: "सीपेज की वजह से पेंट और प्लास्टर झड़ रहा है।",
        marketProducts: [
          { name: "Dr. Fixit LW+", price: "180", img: "https://m.media-amazon.com/images/I/61S7R1D-x9L._SL1000_.jpg" },
          { name: "Asian Paints Putty", price: "950", img: "https://m.media-amazon.com/images/I/51p6K6N1ZHL._SL1000_.jpg" }
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
      <div className="sticky top-0 z-50 bg-slate-900 border-b border-white/10 p-4 flex items-center justify-between">
        <Button variant="ghost" onClick={() => window.history.back()} className="text-white">
          <ArrowLeft size={24} />
        </Button>
        <div className="text-center">
          <h1 className="text-lg font-bold text-blue-400">DEFECT SCANNER</h1>
        </div>
        <Button variant="ghost" className="text-white">
          <History size={24} />
        </Button>
      </div>

      <main className="max-w-md mx-auto p-4 space-y-6">
        {!result ? (
          <div className="space-y-6">
            <div 
              className="relative aspect-[3/4] rounded-[30px] overflow-hidden border-2 border-dashed border-white/20 bg-slate-800 flex items-center justify-center cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              {media ? (
                <Image src={media.dataUrl} alt="Target" fill className="object-cover" />
              ) : (
                <div className="text-center">
                  <ScanSearch size={48} className="mx-auto text-blue-500 mb-2" />
                  <p className="text-sm">फोटो अपलोड करें</p>
                </div>
              )}
              {isAnalyzing && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <Loader2 className="animate-spin text-blue-500 h-10 w-10" />
                </div>
              )}
            </div>

            <Button 
              onClick={startAnalysis} 
              disabled={!media || isAnalyzing}
              className="w-full h-14 rounded-2xl bg-blue-600 font-bold"
            >
              {isAnalyzing ? "Scanning..." : "START AI SCAN ✨"}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-red-500/20 border border-red-500/50 p-4 rounded-2xl">
              <h2 className="font-bold text-red-400 flex items-center gap-2">
                <AlertCircle size={18} /> {result.issue}
              </h2>
              <p className="text-sm text-slate-300 mt-1">{result.details}</p>
            </div>

            <div className="flex gap-4 overflow-x-auto py-2">
              {result.marketProducts.map((p: any, i: number) => (
                <div key={i} className="min-w-[140px] bg-white rounded-xl p-3 text-black">
                  <img src={p.img} alt={p.name} className="h-16 mx-auto mb-2" />
                  <p className="text-[10px] font-bold line-clamp-1">{p.name}</p>
                  <p className="text-blue-600 font-bold text-xs">₹{p.price}</p>
                </div>
              ))}
            </div>

            <Card className="bg-slate-900 border-white/10 p-4 rounded-2xl">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm">Estimate:</span>
                <span className="text-lg font-bold text-green-400">{result.totalEstimate}</span>
              </div>
              <div className="relative aspect-video rounded-xl overflow-hidden">
                <Image src={result.aiDesign} alt="Design" fill className="object-cover" />
              </div>
            </Card>

            <Button className="w-full h-14 rounded-2xl bg-green-600 font-bold">
              BOOK MISTRI NOW
            </Button>
            <Button variant="ghost" onClick={() => setResult(null)} className="w-full">
              SCAN AGAIN
            </Button>
          </div>
        )}
      </main>
      <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
    </div>
  );
}