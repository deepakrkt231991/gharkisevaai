"use client";
import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { ArrowLeft, ScanSearch, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function DefectAnalyzer() {
  const [media, setMedia] = useState<{ dataUrl: string } | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startScan = () => {
    if (!media) return;
    setIsAnalyzing(true);
    setTimeout(() => setIsAnalyzing(false), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="p-4 border-b border-white/10 flex items-center gap-4">
        <Button variant="ghost" onClick={() => window.history.back()}><ArrowLeft /></Button>
        <h1 className="font-bold">AI DEFECT ANALYZER</h1>
      </div>

      <main className="p-6 max-w-md mx-auto space-y-6">
        <div 
          className="aspect-square bg-slate-900 border-2 border-dashed border-slate-700 rounded-3xl flex items-center justify-center relative overflow-hidden"
          onClick={() => fileInputRef.current?.click()}
        >
          {media ? (
            <Image src={media.dataUrl} alt="Preview" fill className="object-cover" />
          ) : (
            <div className="text-center text-slate-500">
              <ScanSearch className="mx-auto mb-2" size={40} />
              <p>Upload Photo</p>
            </div>
          )}
          {isAnalyzing && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <Loader2 className="animate-spin text-blue-500" size={40} />
            </div>
          )}
        </div>

        <Button onClick={startScan} className="w-full h-14 bg-blue-600 rounded-2xl font-bold">
          {isAnalyzing ? "Analyzing..." : "START SCAN"}
        </Button>
      </main>
      <input 
        ref={fileInputRef} 
        type="file" 
        className="hidden" 
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setMedia({ dataUrl: reader.result as string });
            reader.readAsDataURL(file);
          }
        }} 
      />
    </div>
  );
}