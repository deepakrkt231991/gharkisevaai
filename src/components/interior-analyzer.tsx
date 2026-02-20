
"use client";

import { useState, useRef, ChangeEvent, useTransition } from 'react';
import { useFormState } from 'react-dom';
import Image from 'next/image';
import { ArrowLeft, Share, Heart, Sparkles, Compass, Paintbrush, Lightbulb, CheckCircle, Loader2, UploadCloud, ScanSearch, RotateCw, Sofa } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from './ui/badge';
import { analyzeInterior, generate3dRender } from '@/app/interior-analysis/actions';
import type { InteriorDesignOutput } from '@/ai/flows/interior-design-agent';
import type { InteriorRenderOutput } from '@/ai/flows/interior-render-agent';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { AlertCircle } from 'lucide-react';
import { LocationTracker } from './location-tracker';

const initialAnalysisState: {
  success: boolean;
  message: string;
  data: InteriorDesignOutput | null;
} = { success: false, message: '', data: null };

const initialRenderState: {
  success: boolean;
  message: string;
  renderData: InteriorRenderOutput | null;
} = { success: false, message: '', renderData: null };


export function InteriorAnalyzer() {
  const [analysisState, analysisAction] = useFormState(analyzeInterior, initialAnalysisState);
  const [renderState, renderAction] = useFormState(generate3dRender, initialRenderState);
  
  const [isAnalysisPending, startAnalysisTransition] = useTransition();
  const [isRenderPending, startRenderTransition] = useTransition();

  const [image, setImage] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState('Modern');
  const moodboardStyles = ['Modern', 'Classic', 'Minimalist', 'Industrial', 'Bohemian'];
  const [userLocation, setUserLocation] = useState<{ city: string } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const analysisFormRef = useRef<HTMLFormElement>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleResetStates();
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        setImage(dataUrl);

        if (analysisFormRef.current) {
          const formData = new FormData(analysisFormRef.current);
          formData.set('roomPhotoUri', dataUrl);
           startAnalysisTransition(() => {
            analysisAction(formData);
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResetStates = () => {
      setImage(null);
      const emptyFormData = new FormData();
      startAnalysisTransition(() => analysisAction(emptyFormData));
      startRenderTransition(() => renderAction(emptyFormData));
  }

  const handleStartOver = () => {
      handleResetStates();
      if(fileInputRef.current) {
          fileInputRef.current.value = "";
      }
  };

  function RenderSubmitButton() {
      return (
        <Button type="submit" size="lg" className="w-full h-14 bg-primary text-lg" disabled={isRenderPending}>
            {isRenderPending ? (
                <>
                    <Loader2 className="mr-2 animate-spin"/>
                    Generating...
                </>
            ) : (
                <>
                    <Sparkles className="mr-2"/>
                    Generate 3D Render
                </>
            )}
            <Badge className="ml-2 bg-accent text-accent-foreground">AI</Badge>
        </Button>
      )
  }

  const AnalysisResults = () => {
    if (!analysisState.data) return null;
  
    const vastuInsights = analysisState.data.suggestions.filter(s => s.category === 'Vastu');
    const aestheticUpgrades = analysisState.data.suggestions.filter(s => s.category === 'Aesthetic');
    const lightingInsights = analysisState.data.suggestions.filter(s => s.category === 'Lighting');

    const InsightCard = ({ title, description, impact }: { title: string, description: string, impact: string }) => (
        <Card className="glass-card">
            <CardContent className="p-4 space-y-2">
                <div className="flex items-center gap-2">
                    {title.toLowerCase().includes('direction') && <Compass className="text-primary" />}
                    {title.toLowerCase().includes('contrast') && <Paintbrush className="text-primary" />}
                     {title.toLowerCase().includes('lighting') && <Lightbulb className="text-primary" />}
                    <h4 className="font-bold text-white">{title}</h4>
                </div>
                <p className="text-sm text-muted-foreground">{description}</p>
                <Badge variant="outline" className="border-green-500/50 text-green-400 bg-green-900/30">
                    <CheckCircle className="mr-2 h-3 w-3" />
                    {impact.toUpperCase()} IMPACT
                </Badge>
            </CardContent>
        </Card>
    );

    const handleRenderSubmit = (formData: FormData) => {
        startRenderTransition(() => {
            renderAction(formData);
        });
    }

    return (
        <div className="bg-background rounded-t-3xl p-4 -mt-8 relative z-10 space-y-6 pb-24">
            <div className="w-12 h-1.5 bg-border rounded-full mx-auto" />
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold font-headline">AI Analysis</h2>
                    <p className="text-sm text-muted-foreground">{analysisState.data.suggestions.length} Hotspots detected</p>
                </div>
                 <Badge className="bg-accent/20 text-accent border-accent/40 font-bold tracking-widest animate-pulse">FREE AI CONSULTATION</Badge>
            </div>

             <Tabs defaultValue="vastu" className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-card">
                    <TabsTrigger value="vastu">Vastu</TabsTrigger>
                    <TabsTrigger value="aesthetic">Aesthetics</TabsTrigger>
                    <TabsTrigger value="lighting">Lighting</TabsTrigger>
                </TabsList>
                <TabsContent value="vastu" className="space-y-4 pt-4">
                    {vastuInsights.map((item, i) => <InsightCard key={i} {...item} />)}
                </TabsContent>
                <TabsContent value="aesthetic" className="space-y-4 pt-4">
                     {aestheticUpgrades.map((item, i) => <InsightCard key={i} {...item} />)}
                </TabsContent>
                <TabsContent value="lighting" className="space-y-4 pt-4">
                     {lightingInsights.map((item, i) => <InsightCard key={i} {...item} />)}
                </TabsContent>
            </Tabs>
            
            <div className="space-y-3">
              <h3 className="text-lg font-bold font-headline text-white">Select a Mood</h3>
              <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
                {moodboardStyles.map(style => (
                  <Button
                    key={style}
                    variant={selectedStyle === style ? 'default' : 'secondary'}
                    onClick={() => setSelectedStyle(style)}
                    className="rounded-full h-10 whitespace-nowrap bg-card text-white data-[variant=default]:bg-primary"
                  >
                    {style}
                  </Button>
                ))}
              </div>
            </div>


            <form action={handleRenderSubmit}>
                <input type="hidden" name="roomPhotoUri" value={image!} />
                <input type="hidden" name="suggestions" value={JSON.stringify(analysisState.data?.suggestions)} />
                <input type="hidden" name="style" value={selectedStyle} />
                <div className="fixed bottom-20 left-1/2 -translate-x-1/2 w-full max-w-md p-4 z-20">
                    <RenderSubmitButton />
                </div>
            </form>
        </div>
    )
  }

  return (
    <>
      <header className="absolute top-0 left-0 w-full z-10 flex items-center justify-between p-4 bg-gradient-to-b from-black/50 to-transparent">
        <Button variant="ghost" size="icon" onClick={() => window.history.back()}>
          <ArrowLeft />
        </Button>
        <h1 className="text-lg font-bold font-headline text-white">AI Home Consultant</h1>
        <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon"><Share /></Button>
            <Button variant="ghost" size="icon"><Heart /></Button>
        </div>
      </header>

      <main className="flex-1">
        <form ref={analysisFormRef} className="hidden">
             <input type="hidden" name="userLocation" value={userLocation?.city || ''} />
             <input
                ref={fileInputRef}
                type="file"
                name="roomPhotoUri"
                className="hidden"
                accept="image/png, image/jpeg, image/webp"
                onChange={handleFileChange}
             />
        </form>
        <div className="relative w-full aspect-video rounded-xl overflow-hidden">
            {renderState.success && renderState.renderData?.renderDataUri ? (
                <Image src={renderState.renderData.renderDataUri} alt="3D Render of improved room" fill className="object-cover" />
            ) : image ? (
                <Image src={image} alt="Room for analysis" fill className="object-cover" />
            ) : (
                <div
                    className="relative group w-full h-full flex flex-col items-center justify-center cursor-pointer border-2 border-dashed border-border bg-input/5 hover:border-primary scan-glow"
                    onClick={() => fileInputRef.current?.click()}
                    >
                    <div className="absolute inset-6 border-2 border-dashed border-white/20 rounded-lg opacity-50 pointer-events-none"></div>
                    <div className="text-center p-4">
                        <Sofa className="w-12 h-12 text-muted-foreground mx-auto" />
                        <p className="mt-4 text-lg font-semibold font-headline">📸 Capture Your Room</p>
                        <p className="text-sm text-muted-foreground">Take a photo of your room for AI design ideas and a 3D render.</p>
                    </div>
                </div>
            )}
             {(isAnalysisPending || isRenderPending) && (
                <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center gap-2 text-white z-20">
                    <div className="relative">
                        <Loader2 className="h-10 w-10 animate-spin text-accent" />
                        <div className="absolute inset-0 rounded-full border-2 border-accent/50 animate-ping"></div>
                    </div>
                    <p className="font-bold tracking-widest text-accent">
                        {isRenderPending ? 'GENERATING 3D RENDER...' : 'AI IS THINKING...'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                        {isRenderPending ? 'AI is re-imagining your space...' : 'Please wait while we process the image.'}
                    </p>
                </div>
            )}
        </div>

        <div className="p-4">
          {!analysisState.success && 
              <LocationTracker onLocationChange={(loc) => setUserLocation(loc ? { city: loc.address.split(',')[0] } : null)} />
          }
        </div>
        
        {analysisState.success && !renderState.success && <AnalysisResults />}
        
        {analysisState.message && !analysisState.success && image && (
             <div className="p-4">
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Analysis Failed</AlertTitle>
                    <AlertDescription>{analysisState.message}</AlertDescription>
                </Alert>
             </div>
        )}
        
        {renderState.message && !renderState.success && analysisState.success && (
            <div className="p-4">
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Render Failed</AlertTitle>
                    <AlertDescription>{renderState.message}</AlertDescription>
                </Alert>
            </div>
        )}

        {renderState.success && (
            <div className="bg-background rounded-t-3xl p-4 -mt-8 relative z-10 space-y-4 pb-24">
                <div className="w-12 h-1.5 bg-border rounded-full mx-auto" />
                 <h2 className="text-2xl font-bold font-headline text-center">Your 3D Render is Ready!</h2>
                 <p className="text-muted-foreground text-center">The AI has re-imagined your space based on the suggestions.</p>
                 <Button onClick={handleStartOver} variant="outline" className="w-full h-12">
                    <RotateCw className="mr-2" />
                    Analyze Another Room
                 </Button>
            </div>
        )}
      </main>
    </>
  );
}
