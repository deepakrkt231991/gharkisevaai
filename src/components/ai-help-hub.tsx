
'use client';

import { useState, useRef, ChangeEvent } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Bot, Home, Video, Sparkles, Loader2, UploadCloud } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { suggestInteriorImprovements } from '@/ai/flows/interior-design-agent';
import { analyzeHomeForVastu } from '@/ai/flows/home-vastu-agent';
import { createVideoPost } from '@/ai/flows/video-creator-agent';

type AiTask = 'interior' | 'vastu' | 'video';

export function AiHelpHub() {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<any | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [activeTask, setActiveTask] = useState<AiTask | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRunAI = async (task: AiTask) => {
        if ((task === 'interior' || task === 'vastu') && !selectedImage) {
            setError('Please upload an image first.');
            return;
        }
        if (task === 'video' && !prompt) {
            setError('Please enter a prompt for the video.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setResult(null);
        setActiveTask(task);

        try {
            let res;
            if (task === 'interior') {
                res = await suggestInteriorImprovements({ roomPhotoUri: selectedImage! });
            } else if (task === 'vastu') {
                res = await analyzeHomeForVastu({ homeLayoutImageUri: selectedImage!, userInstructions: prompt || 'Check Vastu and give me video verification instructions.' });
            } else if (task === 'video') {
                res = await createVideoPost({ prompt });
            }
            setResult(res);
        } catch (e: any) {
            setError(e.message || 'An unexpected error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    const renderResult = () => {
        if (!result) return null;

        if (activeTask === 'interior' && result.suggestions) {
            return (
                <div className="space-y-4">
                    <h4 className="font-bold">Design Suggestions:</h4>
                    <ul className="list-disc list-inside text-muted-foreground">
                        {result.suggestions.map((s: string, i: number) => <li key={i}>{s}</li>)}
                    </ul>
                     <h4 className="font-bold mt-4">Workers Needed:</h4>
                    <p className="text-muted-foreground">{result.requiredWorkerTypes.join(', ')}</p>
                </div>
            );
        }

        if (activeTask === 'vastu' && result.vastuSuggestions) {
            return (
                <div className="space-y-4">
                    <h4 className="font-bold">Vastu Suggestions:</h4>
                    <ul className="list-disc list-inside text-muted-foreground">
                        {result.vastuSuggestions.map((s: string, i: number) => <li key={i}>{s}</li>)}
                    </ul>
                    <h4 className="font-bold mt-4">Property Verification Video Guide:</h4>
                    <ol className="list-decimal list-inside text-muted-foreground">
                        {result.videoInstructions.map((s: string, i: number) => <li key={i}>{s}</li>)}
                    </ol>
                </div>
            );
        }

        if (activeTask === 'video' && result.videoDataUri) {
            return (
                <div>
                    <h4 className="font-bold">Your video is ready!</h4>
                    <video src={result.videoDataUri} controls className="w-full mt-2 rounded-lg" />
                     <Button asChild className="mt-4 w-full">
                        <a href={result.videoDataUri} download="grihseva-ai-video.mp4">Download Video</a>
                    </Button>
                </div>
            );
        }

        return null;
    };


    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
           
            {/* Column 1: AI Tasks */}
            <Card className="lg:col-span-1">
                <CardHeader>
                    <CardTitle>Choose an AI Task</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                     <Button onClick={() => handleRunAI('interior')} disabled={isLoading} className="w-full justify-start gap-3">
                        <Home size={18}/> Interior Vastu & Design
                     </Button>
                     <Button onClick={() => handleRunAI('vastu')} disabled={isLoading} className="w-full justify-start gap-3">
                        <Bot size={18}/> Property Verification Help
                     </Button>
                      <Button onClick={() => handleRunAI('video')} disabled={isLoading} className="w-full justify-start gap-3">
                        <Video size={18}/> Video Ad Creator
                     </Button>
                </CardContent>
            </Card>

            {/* Column 2: Inputs */}
            <Card className="lg:col-span-1">
                <CardHeader>
                    <CardTitle>Provide Inputs</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Image Upload */}
                    <div>
                         <Label htmlFor="image-upload">Upload Image (For Design/Vastu)</Label>
                        <div
                            className="mt-2 flex flex-col items-center justify-center p-4 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-accent/10 transition-colors"
                            onClick={() => fileInputRef.current?.click()}
                            >
                            {selectedImage ? (
                                <Image src={selectedImage} alt="Preview" width={150} height={150} className="rounded-md object-contain" />
                            ) : (
                                <>
                                 <UploadCloud className="w-12 h-12 text-muted-foreground" />
                                 <p className="mt-2 text-sm text-muted-foreground">Click to upload</p>
                                </>
                            )}
                            <Input ref={fileInputRef} id="image-upload" type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                        </div>
                    </div>
                     {/* Prompt Input */}
                    <div>
                        <Label htmlFor="prompt">Enter Prompt (For Video/Vastu)</Label>
                        <Textarea id="prompt" value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="e.g., Create a 5-second video of a plumber fixing a sink." className="mt-2"/>
                    </div>
                </CardContent>
            </Card>

            {/* Column 3: Results */}
            <Card className="lg:col-span-1">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Sparkles size={18} className="text-primary"/> AI Result</CardTitle>
                </CardHeader>
                <CardContent className="min-h-[200px]">
                    {isLoading && (
                        <div className="flex flex-col items-center justify-center h-full">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            <p className="mt-4 text-muted-foreground">AI is thinking...</p>
                        </div>
                    )}
                    {error && (
                         <Alert variant="destructive">
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                    {!isLoading && !error && (
                        renderResult() || <p className="text-muted-foreground text-center pt-8">Your results will appear here.</p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

