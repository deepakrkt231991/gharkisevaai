
"use client";

import { useState, useRef, ChangeEvent, useActionState } from 'react';
import Image from 'next/image';
import { ArrowLeft, Share, Heart, Sparkles, Compass, Paintbrush, Lightbulb, CheckCircle, Loader2, UploadCloud, ScanSearch } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from './ui/badge';
import { analyzeInterior } from '@/app/interior-analysis/actions';
import type { InteriorDesignOutput } from '@/ai/flows/interior-design-agent';

const initialState: {
  success: boolean;
  message: string;
  data: InteriorDesignOutput | null;
} = { success: false, message: '', data: null };


export function InteriorAnalyzer() {
  const [state, formAction, isPending] = useActionState(analyzeInterior, initialState);
  const [image, setImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        setImage(dataUrl);

        // Automatically trigger form submission
        const formData = new FormData();
        formData.append('roomPhotoUri', dataUrl);
        formAction(formData);
      };
      reader.readAsDataURL(file);
    }
  };

  const AnalysisResults = () => {
    if (!state.data) return null;
  
    const vastuInsights = state.data.suggestions.filter(s => s.category === 'Vastu');
    const aestheticUpgrades = state.data.suggestions.filter(s => s.category === 'Aesthetic');
    const lightingInsights = state.data.suggestions.filter(s => s.category === 'Lighting');

    const InsightCard = ({ title, description, impact }: { title: string, description: string, impact: string }) => (
        <Card className="glass-card">
            <CardContent className="p-4 space-y-2">
                <div className="flex items-center gap-2">
                    {title.toLowerCase().includes('direction') && <Compass className="text-primary" />}
                    {title.toLowerCase().includes('contrast') && <Paintbrush className="text-primary" />}
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

    return (
        <div className="bg-background rounded-t-3xl p-4 -mt-8 relative z-10 space-y-4 pb-24">
            <div className="w-12 h-1.5 bg-border rounded-full mx-auto" />
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold font-headline">AI Analysis</h2>
                    <p className="text-sm text-muted-foreground">{state.data.suggestions.length} Hotspots detected in your space</p>
                </div>
                <Badge className="bg-primary/20 text-primary border-primary/40">PREMIUM</Badge>
            </div>

             <Tabs defaultValue="vastu" className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-card">
                    <TabsTrigger value="vastu">Vastu Insights</TabsTrigger>
                    <TabsTrigger value="aesthetic">Aesthetic Upgrades</TabsTrigger>
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

            <div className="fixed bottom-20 left-1/2 -translate-x-1/2 w-full max-w-md p-4 z-20">
                <Button size="lg" className="w-full h-14 bg-primary text-lg">
                    <Sparkles className="mr-2"/>
                    Generate 3D Render
                    <Badge className="ml-2 bg-accent text-accent-foreground">AI</Badge>
                </Button>
            </div>
        </div>
    )
  }

  return (
    <>
      <header className="absolute top-0 left-0 w-full z-10 flex items-center justify-between p-4 bg-gradient-to-b from-black/50 to-transparent">
        <Button variant="ghost" size="icon" onClick={() => window.history.back()}>
          <ArrowLeft />
        </Button>
        <h1 className="text-lg font-bold font-headline text-white">GrihSeva AI</h1>
        <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon"><Share /></Button>
            <Button variant="ghost" size="icon"><Heart /></Button>
        </div>
      </header>

      <main className="flex-1">
        <form>
            <input
                ref={fileInputRef}
                type="file"
                name="imageFile"
                className="hidden"
                accept="image/png, image/jpeg, image/webp"
                onChange={handleFileChange}
             />
        </form>
        <div className="relative w-full aspect-[9/10] bg-muted">
            {image && <Image src={image} alt="Room for analysis" fill className="object-cover" />}
            {!image && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-8 text-center">
                    <div className="p-4 bg-primary/10 rounded-full">
                        <ScanSearch className="w-16 h-16 text-primary" />
                    </div>
                    <h2 className="text-xl font-bold font-headline">Analyze Your Space</h2>
                    <p className="text-muted-foreground">Upload a photo of your room to get Vastu and aesthetic suggestions from our AI.</p>
                     <Button onClick={() => fileInputRef.current?.click()} size="lg">
                        <UploadCloud className="mr-2" />
                        Upload Photo
                    </Button>
                </div>
            )}
             {isPending && (
                <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center gap-2 text-white">
                    <div className="relative">
                        <Loader2 className="h-10 w-10 animate-spin text-accent" />
                        <div className="absolute inset-0 rounded-full border-2 border-accent/50 animate-ping"></div>
                    </div>
                    <p className="font-bold tracking-widest text-accent">ANALYZING SPACE...</p>
                    <p className="text-xs text-muted-foreground">AI is identifying hotspots...</p>
                </div>
            )}
        </div>
        
        {state.success && <AnalysisResults />}
      </main>
    </>
  );
}
