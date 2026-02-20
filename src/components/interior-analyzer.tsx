"use client";

import { useState, useRef, ChangeEvent } from 'react';
import Image from 'next/image';
import { 
  Sparkles, RotateCw, AlertCircle, Loader2, ScanSearch, 
  ArrowLeft, History, Paintbrush, Wallet, CheckCircle2 
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

// --- Loading Overlay ---
function AnalysisStatusOverlay() {
  return (
    <div className="absolute inset-0 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center gap-6 text-white z-50 animate-in fade-in">
      <div className="relative w-24 h-24">
        <Loader2 className="h-24 w-24 animate-spin text-blue-500 opacity-20" />
        <Sparkles className="absolute inset-0 m-auto h-10 w-10 text-blue-500 animate-pulse" />
      </div>
      <div className="text-center space-y-2">
        <p className="font-black tracking-[0.2em] text-blue-500 text-xl uppercase">AI Analysis In Progress</p>
        <p className="text-sm text-gray-400 animate-pulse">दीवार की गहराई से जांच की जा रही है...</p>
      </div>
    </div>
  );
}

export function DefectAnalyzer() {
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

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    // AI Simulation
    setTimeout(() => {
      setAnalysisResult({
        defect: "दीवार के निचले हिस्से में नमी (Seepage) और पपड़ीदार पेंट पाया गया है।",
        recommendation: "वॉटरप्रूफिंग ट्रीटमेंट के साथ पुट्टी और प्राइमर का उपयोग अनिवार्य है।",
        bill: [
          { name: "वॉटरप्रूफ पुट्टी", cost: "₹1,200" },
          { name: "एंटी-फंगल प्राइमर", cost: "₹850" },
          { name: "प्रीमियम इमल्शन (Paint)", cost: "₹2,500" },
          { name: "लेबर और अन्य खर्च", cost: "₹1,800" },
        ],
        total: "₹6,350",
        designTips: "इस कमरे के लिए 'Ivory White' या 'Soft Mint Green' बेस्ट रहेगा। साथ ही लाइट वुडन फ्लोरिंग कमरे को लग्जरी लुक देगी।",
        afterImage: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800"
      });
      setIsAnalyzing(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 pb-20">
      {/* Navbar */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b p-4 flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={() => window.history.back()}><ArrowLeft /></Button>
        <div className="text-center">
          <h1 className="font-black text-lg tracking-tight">AI Interior Expert</h1>
          <p className="text-[10px] text-blue-600 font-bold uppercase tracking-widest">Ghar Ki Sevaai</p>
        </div>
        <Button variant="ghost" size="icon"><History /></Button>
      </div>

      <main className="max-w-md mx-auto p-5 space-y-6">
        {!analysisResult ? (
          <Card className="border-none shadow-2xl rounded-[32px] overflow-hidden bg-white">
            <div 
              className="relative aspect-[4/5] bg-slate-100 flex flex-col items-center justify-center cursor-pointer group"
              onClick={() => fileInputRef.current?.click()}
            >
              {media ? (
                <Image src={media.dataUrl} alt="Preview" fill className="object-cover" />
              ) : (
                <div className="text-center p-10 space-y-4">
                  <div className="w-20 h-20 bg-white rounded-3xl shadow-xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                    <ScanSearch className="w-10 h-10 text-blue-600" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-bold text-xl">फोटो अपलोड करें</p>
                    <p className="text-sm text-slate-500">दीवार की साफ फोटो लें</p>
                  </div>
                </div>
              )}
              {isAnalyzing && <AnalysisStatusOverlay />}
            </div>
            
            <CardContent className="p-6 space-y-4">
              <Textarea 
                placeholder="खराबी के बारे में कुछ बताएं..." 
                className="rounded-2xl border-slate-200 bg-slate-50"
              />
              <Button 
                onClick={handleAnalyze} 
                disabled={!media || isAnalyzing}
                className="w-full h-16 rounded-2xl text-lg font-bold shadow-xl bg-blue-600 hover:bg-blue-700"
              >
                जांच शुरू करें ✨
              </Button>
            </CardContent>
            <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
          </Card>
        ) : (
          <div className="space-y-6 animate-in slide-in-from-bottom-10 duration-500">
            {/* Analysis Result Card */}
            <div className="bg-red-50 border-2 border-red-100 p-5 rounded-[24px] space-y-2">
              <div className="flex items-center gap-2 text-red-600 font-bold">
                <AlertCircle size={20} />
                <span>दीवार में खराबी:</span>
              </div>
              <p className="text-slate-700 font-medium">{analysisResult.defect}</p>
            </div>

            {/* Bill Table */}
            <Card className="rounded-[32px] border-none shadow-xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-md flex items-center gap-2">
                  <Wallet className="text-blue-600" size={18}/> सामान और बजट
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
                <div className="bg-blue-50 p-4 rounded-2xl flex justify-between items-center">
                  <span className="font-black text-slate-900">कुल अनुमानित खर्चा</span>
                  <span className="text-2xl font-black text-blue-600">{analysisResult.total}</span>
                </div>
              </CardContent>
            </Card>

            {/* AI Suggestion Image */}
            <Card className="rounded-[32px] border-none shadow-xl overflow-hidden">
              <div className="p-6 space-y-4">
                <CardTitle className="text-md flex items-center gap-2">
                  <Paintbrush className="text-blue-600" size={18}/> AI डिज़ाइन सुझाव
                </CardTitle>
                <p className="text-sm text-slate-600 italic">"{analysisResult.designTips}"</p>
                <div className="relative aspect-video rounded-2xl overflow-hidden">
                  <Image src={analysisResult.afterImage} alt="After" fill className="object-cover" />
                  <Badge className="absolute top-3 right-3 bg-green-500">New Look ✨</Badge>
                </div>
              </div>
            </Card>

            <Button className="w-full h-16 rounded-[24px] text-xl font-black bg-green-600 hover:bg-green-700 shadow-lg">
              <CheckCircle2 className="mr-2" /> बुक करें (राजू पेंटर)
            </Button>
            <Button variant="ghost" className="w-full" onClick={() => setAnalysisResult(null)}>
              <RotateCw className="mr-2 h-4 w-4" /> दोबारा फोटो लें
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}