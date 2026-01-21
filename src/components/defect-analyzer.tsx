
"use client";

import { useState, useRef, ChangeEvent, useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import Image from 'next/image';
import Link from 'next/link';
import { UploadCloud, Sparkles, RotateCw, AlertCircle, Loader2, Wrench, IndianRupee, Hammer, Mic, MicOff, Settings2, Package, ArrowLeft, History, CheckCircle, Download, UserCheck, ScanSearch, Star, MessageSquare, Phone, Film } from 'lucide-react';

import { analyzeDefect, findNearbyWorkers, generateVideo } from '@/app/analyze/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from './ui/badge';
import type { AnalyzeDefectOutput } from '@/ai/flows/defect-analysis';
import type { TransformationVideoOutput } from '@/ai/flows/transformation-video-agent';


type Media = {
  dataUrl: string;
  type: 'image' | 'video';
}

const initialState: {
  success: boolean;
  message: string;
  data: AnalyzeDefectOutput | null;
} = { success: false, message: '', data: null };

const initialVideoState: {
  success: boolean;
  message: string;
  data: TransformationVideoOutput | null;
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

// Worker Card Component
const WorkerCard = ({ worker }: { worker: any }) => (
    <Card className="glass-card">
        <CardContent className="p-3">
            <div className="flex items-start gap-3">
                <Avatar className="h-12 w-12 border-2 border-primary">
                    <AvatarImage src={`https://i.pravatar.cc/150?u=${'\'\''}${worker.workerId}`} />
                    <AvatarFallback>{worker.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                    <h4 className="font-bold text-white">{worker.name}</h4>
                    <p className="text-xs text-muted-foreground capitalize">{worker.skills.join(', ')}</p>
                    <div className="flex items-center gap-1.5 text-yellow-400 text-xs">
                        <Star className="h-3 w-3 fill-current" />
                        <span className="font-bold text-white">4.8</span>
                        <span className="text-muted-foreground text-[10px]">(120 reviews)</span>
                    </div>
                </div>
                 <Badge variant="outline" className="text-green-400 border-green-500/50 bg-green-900/30">Verified</Badge>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
                <Button variant="secondary" size="sm" asChild>
                    <Link href={`/chat/job-temp-${'\'\''}${worker.workerId}`}>
                        <MessageSquare className="mr-2 h-4 w-4"/>Free Chat
                    </Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                    <a href={`tel:${'\'\''}${worker.phone || ''}`}>
                        <Phone className="mr-2 h-4 w-4"/>Free Call
                    </a>
                </Button>
            </div>
        </CardContent>
    </Card>
);

export function DefectAnalyzer() {
  const [analysisState, analysisAction, isAnalysisPending] = useActionState(analyzeDefect, initialState);
  const [videoState, videoAction, isVideoPending] = useActionState(generateVideo, initialVideoState);
  
  const [media, setMedia] = useState<Media | null>(null);
  const [description, setDescription] = useState('');
  const [workers, setWorkers] = useState<any[]>([]);
  const [isLoadingWorkers, setIsLoadingWorkers] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (analysisState.success && analysisState.data?.recommendedWorkerType) {
        setIsLoadingWorkers(true);
        findNearbyWorkers({ skill: analysisState.data.recommendedWorkerType })
            .then(result => {
                if (result.success) {
                    setWorkers(result.workers);
                }
            })
            .finally(() => setIsLoadingWorkers(false));
    }
  }, [analysisState.success, analysisState.data]);

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
    setWorkers([]);
    setIsLoadingWorkers(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    const emptyFormData = new FormData();
    analysisAction(emptyFormData);
    videoAction(emptyFormData);
  };

  const AnalysisResult = () => {
    if (isAnalysisPending) return null;

    if (analysisState.message && !analysisState.success) {
      return (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Analysis Failed</AlertTitle>
          <AlertDescription>{analysisState.message}</AlertDescription>
        </Alert>
      );
    }

    if (analysisState.success && analysisState.data) {
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
            <CardContent className="p-4">
                <p className="text-xs text-primary font-bold uppercase tracking-wider">Issue Identified</p>
                <h3 className="text-2xl font-bold font-headline text-white mt-1">{result.defect}</h3>
                <p className="text-sm text-muted-foreground mt-2">{result.analysisDetails}</p>
                 <div className="w-28 text-center mt-3">
                    <p className="text-[10px] font-bold text-green-400/80 tracking-wider">AI CONFIDENCE</p>
                    <Progress value={result.confidence} className="h-1.5 mt-1 [&>div]:bg-green-400" />
                    <p className="text-xs font-bold text-green-400 mt-0.5">{result.confidence}%</p>
                </div>
            </CardContent>
          </Card>

          {media?.type === 'image' && (
             <Card className="glass-card bg-gradient-to-br from-primary/10 to-transparent border-primary/20">
                <CardContent className="p-4 space-y-3">
                  <h3 className="font-bold font-headline text-white">AI Visual Reinvention</h3>
                  <p className="text-sm text-muted-foreground">
                    See how your space could look after the repair with a short cinematic video.
                  </p>
                  
                  {videoState.success && videoState.data ? (
                    <div className="aspect-video bg-black rounded-lg overflow-hidden">
                      <video src={videoState.data.videoDataUri} controls autoPlay loop className="w-full h-full" />
                    </div>
                  ) : (
                    <form action={videoAction}>
                      <input type="hidden" name="mediaDataUri" value={media.dataUrl} />
                      <input type="hidden" name="defect" value={result.defect} />
                      <Button type="submit" disabled={isVideoPending} className="w-full h-14 rounded-xl bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg shadow-accent/20">
                        {isVideoPending ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Generating Video (takes ~1 min)...
                          </>
                        ) : (
                          <>
                            <Film className="mr-2 h-5 w-5" />
                            See My New Home (AI Video)
                          </>
                        )}
                      </Button>
                    </form>
                  )}
                  {videoState.message && !videoState.success && (
                    <Alert variant="destructive" className="mt-2">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Video Generation Failed</AlertTitle>
                      <AlertDescription>{videoState.message}</AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="glass-card">
                  <CardContent className="p-4 text-center">
                      <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Est. Cost</p>
                      <p className="text-3xl font-bold text-accent mt-2">{result.estimatedCost.total}</p>
                       <div className="text-xs text-muted-foreground/70 mt-1 grid grid-cols-2 divide-x divide-border">
                        <p className="pr-2">Material: <span className="font-bold text-white/80">{result.estimatedCost.material}</span></p>
                        <p className="pl-2">Labor: <span className="font-bold text-white/80">{result.estimatedCost.labor}</span></p>
                    </div>
                  </CardContent>
              </Card>
              <Card className="glass-card">
                  <CardContent className="p-4">
                       <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-2">Parts & Materials</p>
                       <ul className="space-y-2">
                           {result.requiredParts.map((part, index) => (
                               <li key={`part-${'\'\''}${index}`} className="flex items-center gap-2 text-sm text-white">
                                   <CheckCircle size={16} className="text-accent"/>
                                   <span className="truncate">{part}</span>
                               </li>
                           ))}
                            {result.materialSuggestions.map((suggestion, index) => (
                                <li key={`mat-${'\'\''}${index}`} className="flex items-start gap-2 text-sm text-white">
                                    <Sparkles size={16} className="text-accent flex-shrink-0 mt-1"/>
                                    <span>{suggestion}</span>
                                </li>
                            ))}
                            {result.requiredParts.length === 0 && result.materialSuggestions.length === 0 && (
                                <p className="text-sm text-muted-foreground">No specific parts or materials recommended.</p>
                            )}
                       </ul>
                  </CardContent>
              </Card>
          </div>

          {result.diySteps && result.diySteps.length > 0 && (
            <div>
              <h3 className="text-lg font-bold font-headline mb-2">DIY Steps (आप इसे स्वयं ठीक कर सकते हैं)</h3>
              <Accordion type="single" collapsible className="w-full glass-card rounded-xl px-4">
                {result.diySteps.map((step, index) => (
                  <AccordionItem key={index} value={`item-${'\'\''}${index}`} className={index === result.diySteps.length -1 ? 'border-b-0' : ''}>
                    <AccordionTrigger className="text-white hover:no-underline text-left">{index+1}. {step.split(':')[0]}</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {step.split(': ')[1] || 'No further details.'}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          )}

           <div>
              <h3 className="text-lg font-bold font-headline mb-2">Connect with a Pro (Free)</h3>
              {isLoadingWorkers && (
                  <div className="flex items-center justify-center gap-2 text-muted-foreground py-4">
                      <Loader2 className="animate-spin h-5 w-5"/>
                      <span>Finding best workers near you...</span>
                  </div>
              )}
              {!isLoadingWorkers && workers.length > 0 && (
                  <div className="space-y-3">
                      {workers.map(worker => <WorkerCard key={worker.workerId} worker={worker} />)}
                  </div>
              )}
              {!isLoadingWorkers && workers.length === 0 && (
                   <p className="text-muted-foreground text-sm">No recommended workers found for this issue.</p>
              )}
           </div>

        </div>
      );
    }
    
    return null;
  };

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
      
      <main className="flex-1 space-y-6 overflow-y-auto p-4 pb-32">
        <form action={analysisAction}>
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
                        <p className="mt-4 text-lg font-semibold font-headline">Capture the Defect</p>
                        <p className="text-sm text-muted-foreground">Align item inside the frame for best results.</p>
                    </div>
                  </>
                )}
                 <Input
                    ref={fileInputRef}
                    type="file"
                    name="imageFile"
                    className="hidden"
                    accept="image/png, image/jpeg, image/webp, video/mp4, video/quicktime"
                    onChange={handleFileChange}
                 />

                {isAnalysisPending && (
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center gap-4 text-white overflow-hidden">
                        <div className="scan-line"></div>
                        <Loader2 className="h-8 w-8 animate-spin text-accent/80" />
                        <p className="font-bold tracking-widest text-accent">LIVE SCAN IN PROGRESS...</p>
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
          <AnalysisResult />
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
