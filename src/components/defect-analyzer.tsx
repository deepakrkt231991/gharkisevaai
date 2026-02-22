"use client";

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useFormState, useFormStatus } from 'react-dom';

// Actions and types
import { findNearbyWorkers, generateVideo } from '@/app/analyze/actions';

// UI Components
import { ArrowLeft, ScanSearch, Loader2, AlertCircle, Wrench, IndianRupee, Bot, Sparkles, Video, Users, RefreshCw, Clapperboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Input } from './ui/input';
import { ProfessionalCard, ProfessionalCardSkeleton } from './professional-card';

// This is the simulated output type, matching the expected structure
type AnalysisResult = {
  damage: string[];
  steps: string[];
  total_cost: string;
  recommendedWorkerType: string;
  painter: string;
  ai_design: string;
};

export function DefectAnalyzer() {
  const [media, setMedia] = useState<{ dataUrl: string; file: File } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [description, setDescription] = useState('');

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  
  const [videoState, videoAction] = useFormState(generateVideo, { success: false, message: '', data: null });
  const { pending: isGeneratingVideo } = useFormStatus();
  
  const [nearbyWorkers, setNearbyWorkers] = useState<any[]>([]);
  const [isLoadingWorkers, setIsLoadingWorkers] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMedia({ dataUrl: reader.result as string, file: file });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleScan = () => {
    if (!media) {
        setError('Please upload a photo first.');
        return;
    }
    setIsAnalyzing(true);
    setAnalysisResult(null);
    setNearbyWorkers([]);
    videoAction(new FormData()); // reset video state

    setTimeout(() => {
        const simulatedResult: AnalysisResult = {
            damage: ["Wall Dampness 🔴", "Minor Plaster Cracks"],
            steps: [
            "1. Scrape the affected area to remove loose paint.",
            "2. Apply 2 coats of 'Dr. Fixit Pidiproof LW+' waterproofing.",
            "3. Fill cracks with 'JK Wall Putty' and sand smooth.",
            "4. Apply 'Asian Paints Primer' and finish with 2 coats of 'Tractor Emulsion'."
            ],
            total_cost: "₹2,500 - ₹3,500",
            recommendedWorkerType: "painter",
            painter: 'Raju Painter - 9876543210',
            ai_design: 'smooth_green_wall.jpg'
        };
        setAnalysisResult(simulatedResult);
        setIsAnalyzing(false);
    }, 2500);
  };


  const handleFindWorkers = async (skill: string) => {
    setIsLoadingWorkers(true);
    setNearbyWorkers([]);
    const result = await findNearbyWorkers({ skill });
    if (result.success) {
        setNearbyWorkers(result.workers);
    }
    setIsLoadingWorkers(false);
  }
  
  const handleReset = () => {
    setMedia(null);
    setAnalysisResult(null);
    setNearbyWorkers([]);
    setError(null);
    if(fileInputRef.current) fileInputRef.current.value = "";
    videoAction(new FormData()); 
  }

  const result = analysisResult;

  return (
    <div className="dark bg-background text-foreground">
      <div className="sticky top-0 z-50 flex items-center justify-between bg-background/80 p-4 backdrop-blur-md border-b border-border">
        <Button variant="ghost" size="icon" onClick={result ? handleReset : () => window.history.back()}>
          {result ? <RefreshCw /> : <ArrowLeft />}
        </Button>
        <h1 className="font-bold text-lg font-headline">AI Defect Analyzer</h1>
        <div className="w-10"></div>
      </div>

      <main className="p-4 max-w-md mx-auto space-y-6 pb-24">
        {error && !media && (
             <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Input Required</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}

        {!result ? (
          <div className="space-y-6">
            <div 
                className="aspect-[4/5] bg-card border-2 border-dashed border-border rounded-3xl flex items-center justify-center relative overflow-hidden cursor-pointer group"
                onClick={() => fileInputRef.current?.click()}
            >
                {media ? (
                <Image src={media.dataUrl} alt="Preview" fill className="object-cover" />
                ) : (
                <div className="text-center text-muted-foreground p-8">
                    <ScanSearch className="mx-auto mb-4 text-primary" size={48} />
                    <h3 className="font-bold text-white">Upload Defect Photo</h3>
                    <p className="text-sm">फोटो अपलोड करें</p>
                </div>
                )}
            </div>

            {media && (
              <div className="space-y-4">
                <Input name="description" placeholder="Optional: Describe the problem... (e.g., 'leak near tap')" className="bg-card" onChange={(e) => setDescription(e.target.value)}/>
                <Button onClick={handleScan} disabled={isAnalyzing} className="w-full h-14 bg-primary text-primary-foreground rounded-2xl font-bold">
                    {isAnalyzing ? (
                    <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Analyzing...
                    </>
                    ) : (
                    <>
                        <ScanSearch className="mr-2" />
                        START SCAN
                    </>
                    )}
                </Button>
              </div>
            )}
            <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in-50">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="text-primary"/> AI Analysis Report
                </CardTitle>
                <CardDescription>Generated by GrihSeva AI</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-red-900/30 border border-red-500/30 rounded-lg">
                    <h4 className="font-bold text-red-400">Damages Detected:</h4>
                    <ul className="list-disc pl-5 text-red-400/90 text-sm">
                        {result.damage.map((d: string, i: number) => <li key={i}>{d}</li>)}
                    </ul>
                </div>
                
                <div className="flex justify-between items-center bg-card p-3 rounded-lg">
                    <div className="flex items-center gap-2"><IndianRupee className="text-green-400" /><span className="text-muted-foreground">Est. Cost</span></div>
                    <p className="text-2xl font-bold text-white">{result.total_cost}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Wrench /> Repair Steps</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    {result.steps.map((step: string, index: number) => (
                        <div key={index} className="flex items-start gap-3">
                            <div className="flex-shrink-0 mt-1 h-5 w-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">{index + 1}</div>
                            <p className="text-muted-foreground">{step}</p>
                        </div>
                    ))}
                </CardContent>
            </Card>

             <Card className="glass-card">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Sparkles className="text-yellow-400"/> AI Redesign Idea</CardTitle>
                    <CardDescription>Generate a video showing the before & after transformation.</CardDescription>
                </CardHeader>
                <CardContent>
                    {videoState.data?.videoDataUri ? (
                        <div className="space-y-3">
                             <div className="relative aspect-video rounded-lg overflow-hidden bg-black border border-border">
                                 <video 
                                    src={videoState.data.videoDataUri}
                                    controls
                                    autoPlay
                                    loop
                                    className="w-full h-full"
                                 >
                                    Your browser does not support the video tag.
                                 </video>
                            </div>
                            <Button asChild className="w-full" variant="outline">
                                <a href={videoState.data.videoDataUri} download="grihseva-transformation.mp4">Download Video</a>
                            </Button>
                        </div>
                    ) : (
                        <form action={videoAction}>
                            <input type="hidden" name="mediaDataUri" value={media?.dataUrl || ''} />
                            <input type="hidden" name="defect" value={result.damage.join(', ')} />
                            <Button type="submit" disabled={isGeneratingVideo} className="w-full h-12 text-base">
                                {isGeneratingVideo ? <Loader2 className="mr-2 animate-spin"/> : <Clapperboard className="mr-2"/>}
                                Generate Video
                            </Button>
                        </form>
                    )}
                    {videoState.message && !videoState.success && (
                        <p className="text-destructive text-sm mt-2 text-center">{videoState.message}</p>
                    )}
                </CardContent>
            </Card>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold font-headline text-white">Recommended Workers</h3>
                <Button variant="secondary" onClick={() => handleFindWorkers(result.recommendedWorkerType)}>
                    {isLoadingWorkers ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Users className="mr-2 h-4 w-4"/>}
                    Find Workers
                </Button>
              </div>

                {isLoadingWorkers && (
                    <div className="space-y-4">
                        <ProfessionalCardSkeleton />
                    </div>
                )}
                
                {nearbyWorkers.length > 0 ? (
                    <div className="space-y-4">
                        {nearbyWorkers.map(worker => <ProfessionalCard key={worker.workerId} worker={worker} />)}
                    </div>
                ) : !isLoadingWorkers && (
                    <p className="text-muted-foreground text-sm text-center py-4">Click "Find Workers" to see who's available.</p>
                )}
            </div>

            <Button onClick={handleReset} variant="outline" className="w-full">
                <RefreshCw className="mr-2 h-4 w-4" />
                Scan Another Item
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
