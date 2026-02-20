
"use client";

import { useState, useRef, ChangeEvent, useEffect } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import Image from 'next/image';
import Link from 'next/link';
import { UploadCloud, Sparkles, RotateCw, AlertCircle, Loader2, Wrench, IndianRupee, Hammer, Mic, MicOff, Settings2, Package, ArrowLeft, History, CheckCircle, Download, UserCheck, ScanSearch, Star, MessageSquare, Phone, Film } from 'lucide-react';

import { analyzeDefect, findNearbyWorkers } from '@/app/analyze/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from './ui/badge';
import type { AnalyzeDefectOutput } from '@/ai/flows/defect-analysis';
import { LocationTracker } from './location-tracker';
import { cn } from '@/lib/utils';

// Image compression function
const compressImage = (file: File): Promise<string> => {
    const MAX_IMAGE_SIZE = 1080; // pixels
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = document.createElement('img');
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let { width, height } = img;
                if (width > height) {
                    if (width > MAX_IMAGE_SIZE) {
                        height *= MAX_IMAGE_SIZE / width;
                        width = MAX_IMAGE_SIZE;
                    }
                } else {
                    if (height > MAX_IMAGE_SIZE) {
                        width *= MAX_IMAGE_SIZE / height;
                        height = MAX_IMAGE_SIZE;
                    }
                }
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                if (!ctx) return reject(new Error('Could not get canvas context'));
                ctx.drawImage(img, 0, 0, width, height);
                const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
                resolve(dataUrl);
            };
            img.onerror = reject;
            if (event.target?.result) {
                img.src = event.target.result as string;
            } else {
                reject(new Error("FileReader did not provide a result."));
            }
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};


type Media = {
  dataUrl: string;
  type: 'image' | 'video';
}

const initialState: {
  success: boolean;
  message: string;
  data: AnalyzeDefectOutput | null;
} = { success: false, message: '', data: null };

function SubmitButton({ hasMedia }: { hasMedia: boolean }) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending || !hasMedia} className="w-full bg-primary text-white font-extrabold py-4 h-14 rounded-xl shadow-lg shadow-primary/20 active:scale-[0.98] transition-all">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Analyzing...
        </>
      ) : (
        <>
          <Sparkles className="mr-2 h-5 w-5" />
          Analyze Now
        </>
      )}
    </Button>
  );
}

function AnalysisStatusOverlay() {
    const { pending } = useFormStatus();
    if(!pending) return null;
    return (
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center gap-4 text-white overflow-hidden z-20">
            <div className="scan-line"></div>
            <Loader2 className="h-8 w-8 animate-spin text-accent/80" />
            <p className="font-bold tracking-widest text-accent">AI IS THINKING...</p>
            <p className="text-xs text-muted-foreground">Please wait while we process the image.</p>
        </div>
    )
}

export function DefectAnalyzer() {
  const [analysisState, analysisAction] = useFormState(analyzeDefect, initialState);
  
  const [media, setMedia] = useState<Media | null>(null);
  const [description, setDescription] = useState('');
  const [userLocation, setUserLocation] = useState<{ city: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
          const compressedDataUrl = await compressImage(file);
          setMedia({ dataUrl: compressedDataUrl, type: 'image' });
      } catch (error) {
          console.error("Image compression failed:", error);
          const reader = new FileReader();
          reader.onloadend = () => {
              setMedia({ dataUrl: reader.result as string, type: 'image' });
          };
          reader.readAsDataURL(file);
      }
    }
  };
  
  const handleReset = () => {
    setMedia(null);
    setDescription('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    const emptyFormData = new FormData();
    analysisAction(emptyFormData);
  };

  const AnalysisResult = () => {
    if (!analysisState.success || !analysisState.data) {
      return null;
    }

    const result = analysisState.data;
    return (
        <div className="space-y-6">
          <div className="flex items-start justify-between">
             <div className="flex items-center gap-3">
                 <Sparkles className="text-primary"/>
                 <h2 className="text-xl font-bold font-headline">AI Home Consultant Report</h2>
             </div>
             <Badge className="bg-accent/20 text-accent border-accent/40 font-bold tracking-widest animate-pulse">FREE CONSULTATION</Badge>
          </div>
          
          <Card className="glass-card border-l-4 border-l-primary/80">
            <CardHeader><CardTitle>Issues Identified</CardTitle></CardHeader>
            <CardContent className="p-4 pt-0 space-y-3">
                 <ul className="list-disc list-inside mt-1 text-white/90">
                    {result.damage?.map((d, i) => <li key={i}>{d}</li>)}
                </ul>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="glass-card">
                  <CardHeader><CardTitle className="text-sm">Total Est. Cost</CardTitle></CardHeader>
                  <CardContent className="p-4 pt-0">
                      <p className="text-3xl font-bold text-accent">{result?.total_cost}</p>
                  </CardContent>
              </Card>
               <Card className="glass-card">
                   <CardHeader><CardTitle className="text-sm">Recommended Painter</CardTitle></CardHeader>
                  <CardContent className="p-4 pt-0">
                       <p className="font-bold text-white">{result?.painter}</p>
                  </CardContent>
              </Card>
          </div>

          {result?.steps && result.steps.length > 0 && (
              <Accordion type="single" collapsible className="w-full glass-card rounded-xl px-4">
                <AccordionItem value="steps" className="border-b-0">
                    <AccordionTrigger className="text-white hover:no-underline text-left font-bold">DIY Repair Steps (आप इसे स्वयं ठीक कर सकते हैं)</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground space-y-2">
                      {result.steps.map((step, index) => (
                         <p key={index}>{step}</p>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
              </Accordion>
          )}

        </div>
      );
  };
  
  const showInitialView = !media && !analysisState.success;

  return (
    <>
      <div className="sticky top-0 z-10 flex items-center justify-between bg-background/80 p-4 backdrop-blur-md">
        <Button variant="ghost" size="icon" onClick={() => window.history.back()}>
          <ArrowLeft />
        </Button>
        <div className="text-center">
            <p className="text-xs text-muted-foreground">GRIHSEVA AI</p>
            <h1 className="font-bold text-white font-headline">Defect Analysis</h1>
        </div>
        <Button variant="ghost" size="icon">
          <History />
        </Button>
      </div>
      
      <main className={cn(
          "flex-1 flex flex-col p-4 pb-32",
          showInitialView ? "justify-center" : "overflow-y-auto"
      )}>
        
        <form action={analysisAction} ref={formRef} className={cn("w-full space-y-6", showInitialView ? "max-w-md mx-auto" : "")}>
           <input type="hidden" name="userLocation" value={userLocation?.city || ''} />
           
           {!analysisState.success && 
                <LocationTracker onLocationChange={(loc) => setUserLocation(loc ? { city: loc.address.split(',')[0] } : null)} />
           }

            <div className="space-y-4">
              <div
                className="relative group w-full aspect-video rounded-xl overflow-hidden border-2 border-dashed border-border bg-input/5 flex flex-col items-center justify-center cursor-pointer hover:border-accent scan-glow"
                onClick={() => fileInputRef.current?.click()}
              >
                {media ? (
                  <>
                   {media.type === 'image' ? (
                      <Image src={media.dataUrl} alt="Defect preview" fill className="object-contain" />
                    ) : (
                      <video src={media.dataUrl} controls autoPlay muted className="w-full h-full object-contain" />
                    )}
                     <input type="hidden" name="mediaDataUri" value={media.dataUrl} />
                  </>
                ) : (
                  <>
                    <div className="absolute inset-6 border-2 border-dashed border-white/20 rounded-lg opacity-50 pointer-events-none"></div>
                    <div className="text-center p-4">
                        <ScanSearch className="w-12 h-12 text-muted-foreground mx-auto" />
                        <p className="mt-4 text-lg font-semibold font-headline">📸 Capture the Defect</p>
                        <p className="text-sm text-muted-foreground">Take a clear, well-lit photo for the most accurate AI analysis.</p>
                    </div>
                  </>
                )}
                 <Input
                    ref={fileInputRef}
                    type="file"
                    name="imageFile"
                    className="hidden"
                    accept="image/*"
                    capture="environment"
                    onChange={handleFileChange}
                 />
                <AnalysisStatusOverlay/>
              </div>

               <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="description" className="text-muted-foreground">Add description (optional)</Label>
                  <Textarea
                      id="description"
                      name="description"
                      placeholder="e.g., 'There is a crack in the pipe under the sink and it's dripping water.'"
                      className="bg-input border-border text-white placeholder:text-muted-foreground/50"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                  />
              </div>

              {!analysisState.success && (
                <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md p-4 bg-gradient-to-t from-background to-transparent">
                  <SubmitButton hasMedia={!!media} />
                </div>
              )}
           </div>
        </form>

        <div className="mt-8">
          {analysisState.message && !analysisState.success && !media ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Analysis Failed</AlertTitle>
              <AlertDescription>{analysisState.message}</AlertDescription>
            </Alert>
          ) : (
             <AnalysisResult />
          )}
        </div>
        
        {analysisState.success && (
             <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md p-4 bg-gradient-to-t from-background to-transparent">
                <Button onClick={handleReset} variant="outline" className="w-full h-14 rounded-xl">
                    <RotateCw className="mr-2 h-4 w-4" />
                    Scan Another Item
                </Button>
            </div>
        )}

      </main>
    </>
  );
}
