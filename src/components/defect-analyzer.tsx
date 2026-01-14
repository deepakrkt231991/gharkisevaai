"use client";

import { useState, useRef, ChangeEvent, FormEvent } from 'react';
import Image from 'next/image';
import { UploadCloud, Sparkles, RotateCw, AlertCircle, Loader2, Wrench, IndianRupee } from 'lucide-react';

import { analyzeDefect } from '@/app/analyze/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

type AnalysisData = {
  defect: string;
  estimatedCost: string;
};

type Media = {
  dataUrl: string;
  type: 'image' | 'video';
}

export function DefectAnalyzer() {
  const [media, setMedia] = useState<Media | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    setResult(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!media) return;

    setIsLoading(true);
    setResult(null);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const actionResult = await analyzeDefect({ success: false, message: '', data: null }, formData);

    if (actionResult.success && actionResult.data) {
      setResult(actionResult.data);
    } else {
      setError(actionResult.message);
    }
    setIsLoading(false);
  };
  
  const AnalysisResult = () => {
    if (isLoading) {
      return (
        <div className="grid md:grid-cols-2 gap-8">
          <Card><CardContent className="p-6 space-y-4"><h3 className="font-headline text-lg font-semibold flex items-center gap-2"><Wrench /> Defect Identified</h3><Skeleton className="h-4 w-4/5" /></CardContent></Card>
          <Card><CardContent className="p-6 space-y-4"><h3 className="font-headline text-lg font-semibold flex items-center gap-2"><IndianRupee /> Estimated Cost (Hindi)</h3><Skeleton className="h-4 w-3/5" /></CardContent></Card>
        </div>
      )
    }

    if (error) {
      return (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Analysis Failed</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      );
    }

    if (result) {
      return (
        <div className="grid md:grid-cols-2 gap-8 text-center">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-headline text-lg font-semibold mb-2 flex items-center justify-center gap-2"><Wrench /> Defect Identified</h3>
              <p className="text-foreground text-xl">{result.defect}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <h3 className="font-headline text-lg font-semibold mb-2 flex items-center justify-center gap-2"><IndianRupee /> Estimated Cost (Hindi)</h3>
              <p className="text-foreground text-xl">{result.estimatedCost}</p>
            </CardContent>
          </Card>
        </div>
      );
    }
    
    return null;
  };

  return (
    <Card className="max-w-4xl mx-auto shadow-lg bg-card">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit}>
          {!media ? (
            <div
              className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-accent/10 transition-colors"
              onClick={() => fileInputRef.current?.click()}
              onDrop={(e) => { e.preventDefault(); handleFileChange({ target: { files: e.dataTransfer.files } } as any); }}
              onDragOver={(e) => e.preventDefault()}
            >
              <UploadCloud className="w-12 h-12 text-muted-foreground" />
              <p className="mt-4 text-lg font-semibold font-headline">Click to upload or drag and drop</p>
              <p className="text-sm text-muted-foreground">PNG, JPG, WEBP, MP4, or MOV</p>
              <Input
                ref={fileInputRef}
                type="file"
                name="imageFile"
                className="hidden"
                accept="image/png, image/jpeg, image/webp, video/mp4, video/quicktime"
                onChange={handleFileChange}
              />
            </div>
          ) : (
            <div className="space-y-6">
              <div className="relative w-full max-w-md mx-auto aspect-video rounded-lg overflow-hidden border bg-muted/20">
                {media.type === 'image' ? (
                  <Image src={media.dataUrl} alt="Defect preview" fill objectFit="contain" />
                ) : (
                  <video src={media.dataUrl} controls autoPlay muted className="w-full h-full object-contain" />
                )}
                <input type="hidden" name="mediaDataUri" value={media.dataUrl} />
              </div>
              
              <div className="grid w-full max-w-md mx-auto items-center gap-1.5">
                  <Label htmlFor="description">Problem Description (Optional)</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Describe the problem in detail (e.g., 'AC is not cooling', 'There is a leak under the sink')."
                    className="bg-background"
                  />
              </div>

              <div className="flex flex-col md:flex-row justify-center items-center gap-4">
                 <Button type="submit" disabled={isLoading} className="w-full md:w-auto bg-accent text-accent-foreground hover:bg-accent/90">
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Analyze Defect
                      </>
                    )}
                  </Button>
                 <Button variant="outline" onClick={handleReset} type="button" disabled={isLoading}>
                    <RotateCw className="mr-2 h-4 w-4" />
                    Use Another File
                  </Button>
              </div>

              <div className="mt-8">
                <AnalysisResult />
              </div>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
