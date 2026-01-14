"use client";

import { useState, useRef, ChangeEvent, FormEvent } from 'react';
import Image from 'next/image';
import { UploadCloud, Sparkles, RotateCw, AlertCircle, Loader2, Wrench, IndianRupee } from 'lucide-react';

import { analyzeDefect } from '@/app/analyze/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

type AnalysisData = {
  defect: string;
  estimatedCost: string;
};

export function DefectAnalyzer() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleReset();
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleReset = () => {
    setImagePreview(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!imagePreview) return;

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
          {!imagePreview ? (
            <div
              className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-accent/10 transition-colors"
              onClick={() => fileInputRef.current?.click()}
              onDrop={(e) => { e.preventDefault(); handleImageChange({ target: { files: e.dataTransfer.files } } as any); }}
              onDragOver={(e) => e.preventDefault()}
            >
              <UploadCloud className="w-12 h-12 text-muted-foreground" />
              <p className="mt-4 text-lg font-semibold font-headline">Click to upload or drag and drop</p>
              <p className="text-sm text-muted-foreground">PNG, JPG, or WEBP of the appliance/defect</p>
              <Input
                ref={fileInputRef}
                type="file"
                name="imageFile"
                className="hidden"
                accept="image/png, image/jpeg, image/webp"
                onChange={handleImageChange}
              />
            </div>
          ) : (
            <div className="space-y-6">
              <div className="relative w-full max-w-md mx-auto aspect-video rounded-lg overflow-hidden border bg-muted/20">
                <Image src={imagePreview} alt="Defect preview" fill objectFit="contain" />
                <input type="hidden" name="photoDataUri" value={imagePreview} />
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
                    Use Another Image
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
