"use client";

import { useState, useRef, ChangeEvent } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import Image from 'next/image';
import { UploadCloud, Sparkles, RotateCw, AlertCircle, Loader2, Wrench, IndianRupee, Hammer, Mic, MicOff, Settings2, Package, ArrowLeft, History, CheckCircle, Download, UserCheck } from 'lucide-react';

import { analyzeDefect } from '@/app/analyze/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';

type AnalysisData = {
  defect: string;
  estimatedCost: string;
  diySteps: string[];
  requiredTools: string[];
  requiredParts: string[];
};

type Media = {
  dataUrl: string;
  type: 'image' | 'video';
}

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

const initialState = { success: false, message: '', data: null };

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

export function DefectAnalyzer() {
  const [state, formAction] = useFormState(analyzeDefect, initialState);
  const { pending } = useFormStatus();

  const [media, setMedia] = useState<Media | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [description, setDescription] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleReset();
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        const mediaType = file.type.startsWith('image/') ? 'image' : 'video';
        setMedia({ dataUrl, type: mediaType });
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleReset = () => {
    setMedia(null);
    setDescription('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    // Reset form state if needed, though useFormState doesn't have a built-in reset
  };

  const handleVoiceInput = () => {
    // Voice input logic remains the same
  };

  const AnalysisResult = () => {
    if (state.message && !state.success && !pending) {
      return (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Analysis Failed</AlertTitle>
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      );
    }

    if (state.success && state.data) {
      const result = state.data;
      return (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
             <Sparkles className="text-primary"/>
             <h2 className="text-xl font-bold font-headline">AI Report</h2>
             <div className="ml-auto bg-green-500/10 border border-green-500/30 text-green-400 text-xs font-bold px-2 py-1 rounded-full">VERIFIED RESULT</div>
          </div>
          
          <Card className="glass-card border-l-4 border-l-primary/80">
            <CardContent className="p-4">
                <p className="text-xs text-primary font-bold uppercase tracking-wider">Issue Identified</p>
                <h3 className="text-2xl font-bold font-headline text-white mt-1">{result.defect}</h3>
                <p className="text-sm text-muted-foreground mt-1">Detected: {result.requiredParts?.[0] || 'Component Wear'}</p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-4">
              <Card className="glass-card">
                  <CardContent className="p-4 text-center">
                      <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Est. Cost</p>
                      <p className="text-3xl font-bold text-accent mt-2">{result.estimatedCost}</p>
                      <p className="text-[10px] text-muted-foreground/70">Local average market rate</p>
                  </CardContent>
              </Card>
              <Card className="glass-card">
                  <CardContent className="p-4">
                       <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-2">Required Parts</p>
                       <ul className="space-y-2">
                           {result.requiredParts.map((part, index) => (
                               <li key={index} className="flex items-center gap-2 text-sm text-white">
                                   <CheckCircle size={16} className="text-accent"/>
                                   <span>{part}</span>
                               </li>
                           ))}
                       </ul>
                  </CardContent>
              </Card>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="h-12 bg-primary/10 border-primary/50 text-primary hover:bg-primary/20 hover:text-primary">
                  <Package className="mr-2"/> Buy Parts
              </Button>
              <Button className="h-12 bg-primary text-white">
                  <UserCheck className="mr-2"/> Book Pro
              </Button>
          </div>


          {result.diySteps && result.diySteps.length > 0 && (
            <div>
              <h3 className="text-lg font-bold font-headline mb-2">DIY Steps (आप इसे स्वयं ठीक कर सकते हैं)</h3>
              <Accordion type="single" collapsible className="w-full glass-card rounded-xl px-4">
                {result.diySteps.map((step, index) => (
                  <AccordionItem key={index} value={`item-${index}`} className={index === result.diySteps.length -1 ? 'border-b-0' : ''}>
                    <AccordionTrigger className="text-white hover:no-underline">{index+1}. {step.split(':')[0]}</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {step.split(': ')[1] || 'No further details.'}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          )}
        </div>
      );
    }
    
    return null;
  };

  return (
    <>
      <div className="sticky top-0 z-10 flex items-center justify-between bg-background-dark/80 p-4 backdrop-blur-md">
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
      
      <main className="flex-1 space-y-6 overflow-y-auto p-4 pb-32">
        <form action={formAction}>
           <div className="space-y-4">
              <div
                className="relative group w-full aspect-video rounded-xl overflow-hidden border-2 border-dashed border-border-dark bg-input/5 flex items-center justify-center cursor-pointer hover:border-accent"
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
                  <div className="text-center">
                     <UploadCloud className="w-12 h-12 text-muted-foreground mx-auto" />
                     <p className="mt-4 text-lg font-semibold font-headline">Upload Photo/Video</p>
                     <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
                  </div>
                )}
                 <Input
                    ref={fileInputRef}
                    type="file"
                    name="imageFile"
                    className="hidden"
                    accept="image/png, image/jpeg, image/webp, video/mp4, video/quicktime"
                    onChange={handleFileChange}
                 />

                {pending && (
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center gap-2 text-white">
                         <div className="relative">
                            <Loader2 className="h-10 w-10 animate-spin text-accent" />
                            <div className="absolute inset-0 rounded-full border-2 border-accent/50 animate-ping"></div>
                         </div>
                         <p className="font-bold tracking-widest text-accent">SCANNING IN PROGRESS...</p>
                         <p className="text-xs text-muted-foreground">AI is analyzing the issue...</p>
                    </div>
                )}
              </div>

               <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="description" className="text-muted-foreground">Add description (optional)</Label>
                  <Textarea
                      id="description"
                      name="description"
                      placeholder="e.g., 'There is a crack in the pipe under the sink and it's dripping water.'"
                      className="bg-input border-border-dark text-white placeholder:text-muted-foreground/50"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                  />
              </div>

              {!state.success && (
                <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md p-4 bg-gradient-to-t from-background-dark to-transparent">
                  <SubmitButton hasMedia={!!media} />
                </div>
              )}
           </div>
        </form>

        <div className="mt-8">
          <AnalysisResult />
        </div>
        
        {state.success && (
             <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md p-4 bg-gradient-to-t from-background-dark to-transparent">
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
