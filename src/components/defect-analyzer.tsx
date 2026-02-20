"use client";

import { useState, useRef, ChangeEvent } from 'react';
import Image from 'next/image';
import { 
  Sparkles, RotateCw, AlertCircle, Loader2, ScanSearch, 
  ArrowLeft, History, Paintbrush, Wallet, CheckCircle2, 
  ShoppingBag, hammer, MapPin, Star
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
    // Realistic AI Simulation
    setTimeout(() => {
      setResult({
        issue: "Major Dampness & Efflorescence (सोरा लगना)",
        details: "दीवार के प्लास्टर में नमी की वजह से नमक बाहर आ रहा है। अगर इसे अभी नहीं रोका गया तो ईंटें कमजोर हो सकती हैं।",
        marketProducts: [
          { name: "Dr. Fixit LW+", price: "₹180", img: "https://m.media-amazon.com/images/I/61S7R1D-x9L._SL1000_.jpg" },
          { name: "Asian Paints Wall Putty", price: "₹950", img: "https://m.media-amazon.com/images/I/51p6K6N1ZHL._SL1000_.jpg" },
          { name: "Waterproofing Brush", price: "₹120", img: "https://m.media-amazon.com/images/I/71X8k8-i98L._SL1500_.jpg" }
        ],
        totalEstimate: "₹4,200 - ₹5,500",
        aiDesign: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=80",
        expert: { name: "Raju Mistri", rating: "4.8", distance: "1.2 km" }
      });
      setIsAnalyzing(false);
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-white pb-10">
      {/* Premium Glass Header */}
      <div className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-white/10 p-4 flex items-center justify-between">
        <Button variant="ghost" className="text-white" onClick={() => window.history.back()}><ArrowLeft /></Button>
        <div className="text-center">
          <h1 className="text-xl font-black tracking-tighter text-blue-400">DEFECT SCANNER 2.0</h1>
          <p className="text-[9px] uppercase tracking-[0.3em] text-slate-400 font-bold">Powered by Gemini AI</p>
        </div>
        <Button variant="ghost" className="text-white"><History /></Button>
      </div>

      <main className="max-w-xl mx-auto p-4 space-y-6">
        {!result ? (
          <div className="space-y-6">
            {/* Realistic Scanner View */}
            <div 
              className="relative aspect-[3/4] rounded-[40px] overflow-hidden border-2 border-white/10 bg-slate-800 shadow-2xl flex items-center justify-center cursor-pointer group"
              onClick={() => fileInputRef.current?.click()}
            ></div>