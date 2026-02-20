"use client";

import { useState, useRef, ChangeEvent } from 'react';
import Image from 'next/image';
import { 
  Sparkles, AlertCircle, Loader2, ScanSearch, 
  ArrowLeft, History, Paintbrush, Wallet, CheckCircle2 
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LocationTracker } from './location-tracker';

export default function InteriorAnalyzer() {
  const [media, setMedia] = useState<{ dataUrl: string } | null>(null);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setMedia({ dataUrl: reader.result as string });
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setAnalysisResult({
        defect: "दीवार में नमी (Seepage) और पपड़ी पाई गई है।",
        total: "₹6,350",
        bill: [
          { name: "वॉटरप्रूफ पुट्टी", cost: "₹1,200" },
          { name: "एंटी-फंगल प्राइमर", cost: "₹850" },
          { name: "प्रीमियम पेंट", cost: "₹2,500" },
          { name: "लेबर चार्ज", cost: "₹1,800" }
        ],
        designTips: "Off-white कलर चुनें जो लग्जरी लुक देगा।",
        afterImage: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800"
      });
      setIsAnalyzing(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="p-4 border-b border-white/10 flex items-center justify-between sticky top-0 bg-slate-950 z-50">
        <Button variant="ghost" size="icon" onClick={() => window.history.back()}><ArrowLeft className="text-white" /></Button>
        <h1 className="font-bold text-blue-500 tracking-widest text-sm uppercase">AI INTERIOR SCAN</h1>
        <History className="opacity-40" />
      </div>

      <main className="max-w-md mx-auto p-4 space-y-6">
        {/* Browser based Location Tracker */}
        <LocationTracker onLocationChange={() => {}} />

        {!analysisResult ? (
          <Card className="bg-white/5 border-white/10 overflow-hidden rounded-[40px]">
            <div 
              className="aspect-[4/5] relative flex items-center justify-center cursor-pointer group"
              onClick={() => fileInputRef.current?.click()}
            >
              {media ? (
                <Image src={media.dataUrl} alt="Preview" fill className="object-cover" />
              ) : (
                <div className="text-center">
                  <ScanSearch size={60} className="mx-auto mb-4 text-blue-500" />
                  <p className="text-xl font-bold">खराबी की फोटो लें</p>
                  <p className="text-sm text-gray-500">AI तुरंत जांच करेगा</p>
                </div>
              )}
              {isAnalyzing && (
                <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center">
                  <Loader2 className="animate-spin text-blue-500 mb-2 h-10 w-10" />
                  <p className="text-blue-500 font-black animate-pulse">Scanning...</p>
                </div>
              )}
            </div>
            <CardContent className="p-6">
               <Button onClick={handleAnalyze} disabled={!media || isAnalyzing} className="w-full bg-blue-600 hover:bg-blue-700 h-16 rounded-2xl text-xl font-black">
                 जांच शुरू करें ✨
               </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6 pb-20 animate-in fade-in slide-in-from-bottom-10">
             <div className="bg-red-500/10 border border-red-500/50 p-6 rounded-3xl">
                <p className="text-red-400 font-bold flex items-center gap-2"><AlertCircle /> {analysisResult.defect}</p>
             </div>
             
             <Card className="bg-white/5 border-white/10 rounded-[30px] p-6 shadow-2xl">
                <h3 className="font-bold mb-4 flex items-center gap-2 text-blue-400"><Wallet size={18} /> खर्च का विवरण (Bill)</h3>
                <div className="space-y-3">
                  {analysisResult.bill.map((item: any, i: number) => (
                    <div key={i} className="flex justify-between text-sm border-b border-white/5 pb-2">
                      <span className="text-gray-400">{item.name}</span>
                      <span className="font-bold">{item.cost}</span>
                    </div>
                  ))}
                  <div className="pt-4 flex justify-between font-black text-2xl text-blue-500">
                    <span>Total Bill</span>
                    <span>{analysisResult.total}</span>
                  </div>
                </div>
             </Card>

             <Card className="bg-white/5 border-white/10 rounded-[30px] overflow-hidden">
                <div className="p-6">
                  <h3 className="font-bold flex items-center gap-2 mb-4 text-green-400"><Paintbrush size={18} /> AI Modern Look</h3>
                  <div className="relative aspect-video rounded-2xl overflow-hidden mb-4">
                    <Image src={analysisResult.afterImage} alt="After" fill className="object-cover" />
                  </div>
                  <p className="text-sm text-gray-400 italic">"{analysisResult.designTips}"</p>
                </div>
             </Card>

             <Button className="w-full bg-green-600 hover:bg-green-700 h-16 rounded-2xl text-2xl font-black shadow-lg">
               <CheckCircle2 className="mr-2" /> राजू पेंटर को बुक करें
             </Button>
          </div>
        )}
      </main>
      <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
    </div>
  );
}