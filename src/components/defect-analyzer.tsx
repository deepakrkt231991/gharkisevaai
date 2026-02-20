"use client";

import { useState, useRef, ChangeEvent } from 'react';
import { useFormStatus } from 'react-dom';
import Image from 'next/image';
import { 
  Sparkles, RotateCw, AlertCircle, Loader2, ScanSearch, 
  ArrowLeft, History, Ruler, Paintbrush, Wallet, CheckCircle2 
} from 'lucide-react';

import { analyzeDefect } from '@/app/analyze/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

// --- UI Components ---

function AnalysisStatusOverlay() {
  const { pending } = useFormStatus();
  if (!pending) return null;
  return (
    <div className="absolute inset-0 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center gap-6 text-white z-50 animate-in fade-in">
      <div className="relative w-24 h-24">
        <Loader2 className="h-24 w-24 animate-spin text-primary opacity-20" />
        <Sparkles className="absolute inset-0 m-auto h-10 w-10 text-primary animate-pulse" />
      </div>
      <div className="text-center space-y-2">
        <p className="font-black tracking-[0.2em] text-primary text-xl uppercase">AI Analysis in Progress</p>
        <p className="text-sm text-muted-foreground animate-pulse">दीवार की गहराई से जांच की जा रही है...</p>
      </div>
      <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden">
        <div className="h-full bg-primary animate-progress-loading"></div>
      </div>
    </div>
  );
}

export function DefectAnalyzer() {
  const [media, setMedia] = useState<{ dataUrl: string } | null>(null);
  const [analysisResult, setAnalysisResult] = useState<any>(null); // Real data from AI
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

  // सिम्युलेटेड प्रोफेशनल रिस्पॉन्स (इसे आप अपनी AI Action से कनेक्ट करेंगे)
  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    // यहां असली API कॉल होगी, अभी के लिए हम 2.5 सेकंड का डिले दे रहे हैं
    setTimeout(() => {
      setAnalysisResult({
        defect: "दीवार के निचले हिस्से में नमी (Seepage) और पपड़ीदार पेंट पाया गया है।",
        recommendation: "वॉटरप्रूफिंग ट्रीटमेंट के साथ पुट्टी और प्राइमर का उपयोग अनिवार्य है।",
        bill: [
          { name: "वॉटरप्रूफ पुट्टी", cost: "₹1,200" },
          { name: "एंटी-फंगल प्राइमर", cost: "₹850" },
          { name: "प्रीमियम इमल्शन (Paint)", cost: "₹2,500" },
          { name: "लेबर और अन्य खर्च", cost: "₹1,800" },
        ],
        total: "₹6,350",
        designTips: "इस कमरे के लिए 'Ivory White' या 'Soft Mint Green' बेस्ट रहेगा। साथ ही लाइट वुडन फ्लोरिंग (Wooden Floor) कमरे को लग्जरी लुक देगी।",
        afterImage: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800"
      });
      setIsAnalyzing(false);
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 pb-20">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b p-4 flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={() => window.history.back()}><ArrowLeft /></Button>
        <div className="text-center">
          <h1 className="font-black text-lg tracking-tight">AI Interior Expert</h1>
          <p className="text-[10px] text-primary font-bold uppercase tracking-widest">Ghar Ki Sevaai</p>
        </div>
        <Button variant="ghost" size="icon"><History /></Button>
      </div>

      <main className="max-w-md mx-auto p-5 space-y-6">
        
        {!analysisResult ? (
          <Card className="border-none shadow-2xl shadow-blue-100 rounded-[32px] overflow-hidden bg-white">
            <div 
              className="relative aspect-[4/5] bg-slate-100 flex flex-col items-center justify-center cursor-pointer group"
              onClick={() => fileInputRef.current?.click()}
            >
              {media ? (
                <Image src={media.dataUrl} alt="Preview" fill className="object-cover" />
              ) : (
                <div className="text-center p-10 space-y-4">
                  <div className="w-20 h-20 bg-white rounded-3xl shadow-xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                    <ScanSearch className="w-10 h-10 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-bold text-xl">फोटो अपलोड करें</p>
                    <p className="text-sm text-slate-500">दीवार की साफ फोटो लें ताकि AI सही जांच कर सके</p>
                  </div>
                </div>
              )}
              {isAnalyzing && <AnalysisStatusOverlay />}
            </div>
            
            <CardContent className="p-6 space-y-4">
              <Textarea 
                placeholder="खराबी के बारे में कुछ बताएं (वैकल्पिक)..." 
                className="rounded-2xl border-slate-200 bg-slate-50 focus:bg-white transition-all"
              />
              <Button 
                onClick={handleAnalyze} 
                disabled={!media || isAnalyzing}
                className="w-full h-16 rounded-2xl text-lg font-bold shadow-xl shadow-blue-200"
              >
                जांच शुरू करें ✨
              </Button>
            </CardContent>
            <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
          </Card>
        ) : (
          /* --- Analysis Result View --- */
          <div className="space-y-6 animate-in slide-in-from-bottom-10 duration-500">
            
            {/* Defect Alert */}
            <div className="bg-red-50 border-2 border-red-100 p-5 rounded-[24px] space-y-2">
              <div className="flex items-center gap-2 text-red-600 font-bold">
                <AlertCircle size={20} />
                <span>खराबी की पहचान:</span>
              </div>
              <p className="text-slate-700 font-medium leading-relaxed">{analysisResult.defect}</p>
            </div>

            {/* Bill Summary */}
            <Card className="rounded-[32px] border-none shadow-xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-md flex items-center gap-2">
                  <Wallet className="text-primary" size={18}/> बजट और सामान
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {analysisResult.bill.map((item: any, i: number) => (
                    <div key={i} className="flex justify-between text-sm py-1 border-b border-slate-50 last:border-none">
                      <span className="text-slate-500">{item.name}</span>
                      <span className="font-bold text-slate-800">{item.cost}</span>
                    </div>
                  ))}
                </div>
                <div className="bg-primary/5 p-4 rounded-2xl flex justify-between items-center">
                  <span className="font-black text-slate-900">कुल अनुमानित खर्चा</span>
                  <span className="text-2xl font-black text-primary">{analysisResult.total}</span>
                </div>
              </CardContent>
            </Card>

            {/* AI Suggestion */}
            <Card className="rounded-[32px] border-none shadow-xl overflow-hidden">
              <div className="p-6 space-y-4">
                <CardTitle className="text-md flex items-center gap-2">
                  <Paintbrush className="text-primary" size={18}/> AI का सुझाव (Color & Floor)
                </CardTitle>
                <p className="text-sm text-