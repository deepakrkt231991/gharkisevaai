'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useFormState, useFormStatus } from 'react-dom';
import { analyzeInterior, generate3dRender } from '@/app/interior-analysis/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import {
  Loader2,
  AlertCircle,
  Bot,
  Sparkles,
  RefreshCw,
  Palette,
  CameraIcon
} from 'lucide-react';

// Main UI Component
function UploadStep({ onFileSelect }: { onFileSelect: (file: File) => void }) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  return (
    <Card 
      className="glass-card aspect-[4/5] flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-border cursor-pointer group hover:border-primary transition-all"
      onClick={() => fileInputRef.current?.click()}
    >
      <CameraIcon className="w-16 h-16 text-primary/70 mb-4 transition-transform group-hover:scale-110" />
      <h3 className="font-bold text-lg text-white">Upload Room Photo</h3>
      <p className="text-sm text-muted-foreground">या कमरे का फोटो अपलोड करें</p>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </Card>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full h-14 bg-primary text-primary-foreground rounded-2xl font-bold text-lg">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Analyzing with AI...
        </>
      ) : (
        <>
          <Sparkles className="mr-2" />
          Get Design Ideas
        </>
      )}
    </Button>
  );
}

function RenderSubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Generating Render...
        </>
      ) : (
        <>
          <Palette className="mr-2 h-4 w-4" />
          Generate 3D Render
        </>
      )}
    </Button>
  )
}

// Main component
export default function InteriorAnalyzer() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [location, setLocation] = useState('Mumbai');

  const [analysisState, analysisAction] = useFormState(analyzeInterior, { success: false, message: '', data: null });
  const [renderState, renderAction] = useFormState(generate3dRender, { success: false, message: '', renderData: null });

  useEffect(() => {
    if (file) {
      const dataUrl = URL.createObjectURL(file);
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
         setPreviewUrl(reader.result as string);
      };
      return () => URL.revokeObjectURL(dataUrl);
    }
  }, [file]);

  const handleReset = () => {
    setFile(null);
    setPreviewUrl(null);
    analysisAction(new FormData()); // Resets the form state
    renderAction(new FormData());
  };
  
  if (!previewUrl) {
    return <UploadStep onFileSelect={setFile} />;
  }

  return (
    <div className="space-y-6">
      <div className="relative aspect-[4/5] rounded-3xl overflow-hidden border-2 border-border">
        {previewUrl && <Image src={previewUrl} alt="Room preview" layout="fill" objectFit="cover" />}
        <Button onClick={handleReset} variant="ghost" size="icon" className="absolute top-3 right-3 bg-black/50 hover:bg-black/70 text-white rounded-full">
          <RefreshCw className="w-5 h-5"/>
        </Button>
      </div>
      
      {analysisState.success && analysisState.data ? (
        // Results View
        <div className="space-y-6 animate-in fade-in-50">
           <Card className="glass-card border-l-4 border-primary">
                <CardHeader>
                     <CardTitle className="flex items-center gap-2 font-headline text-white">
                        <Bot className="text-primary"/> AI Design Suggestions
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                      {analysisState.data.suggestions.map((item, index) => (
                        <AccordionItem value={`item-${index}`} key={index}>
                          <AccordionTrigger>{item.title} ({item.category})</AccordionTrigger>
                          <AccordionContent className="text-muted-foreground">
                            {item.description}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-headline text-white">
                  <Palette/> Generate 3D Render
                </CardTitle>
                <CardDescription>Visualize the suggested changes in a photorealistic render.</CardDescription>
              </CardHeader>
              <CardContent>
                {renderState.renderData?.renderDataUri ? (
                   <div className="space-y-3">
                        <div className="relative aspect-video rounded-lg overflow-hidden bg-black border border-border">
                             <Image src={renderState.renderData.renderDataUri} alt="Generated 3D Render" fill className="object-contain p-1" />
                        </div>
                        <Button asChild className="w-full" variant="secondary">
                            <a href={renderState.renderData.renderDataUri} download="grihseva_render.png">Download Render</a>
                        </Button>
                    </div>
                ) : (
                  <form action={renderAction} className="space-y-3">
                      <input type="hidden" name="roomPhotoUri" value={previewUrl || ''} />
                      <input type="hidden" name="suggestions" value={JSON.stringify(analysisState.data.suggestions)} />
                      <Select name="style">
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a Style (Optional)" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Modern">Modern</SelectItem>
                          <SelectItem value="Minimalist">Minimalist</SelectItem>
                          <SelectItem value="Classic Indian">Classic Indian</SelectItem>
                          <SelectItem value="Bohemian">Bohemian</SelectItem>
                        </SelectContent>
                      </Select>
                      <RenderSubmitButton />
                  </form>
                )}
                 {renderState.message && !renderState.success && (
                    <Alert variant="destructive" className="mt-4">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Render Failed</AlertTitle>
                      <AlertDescription>{renderState.message}</AlertDescription>
                    </Alert>
                )}
              </CardContent>
            </Card>

             <Card className="glass-card">
                <CardHeader>
                    <CardTitle className="font-headline text-white">Required Professionals</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                    {analysisState.data.requiredWorkerTypes.map(workerType => (
                        <Badge key={workerType} variant="secondary" className="text-base">{workerType}</Badge>
                    ))}
                </CardContent>
            </Card>

        </div>
      ) : (
        // Initial Uploaded View
        <form action={analysisAction} className="space-y-4">
          <input type="hidden" name="roomPhotoUri" value={previewUrl || ''} />
          
          <Card className="glass-card">
            <CardContent className="p-4">
              <Label htmlFor="location">Your Location (for localized results)</Label>
              <Input
                id="location"
                name="userLocation"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., Mumbai"
              />
            </CardContent>
          </Card>
          
          <SubmitButton />

          {analysisState.message && !analysisState.success && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Analysis Failed</AlertTitle>
              <AlertDescription>{analysisState.message}</AlertDescription>
            </Alert>
          )}
        </form>
      )}
    </div>
  );
}
