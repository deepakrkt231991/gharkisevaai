'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { AlertCircle, Bot, Film, Loader2, Sparkles } from 'lucide-react';
import { generateVideoAd } from '@/app/create-video/actions';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const defaultPrompt = `"Aapki Deal, AI ki Suraksha"

Scene 1: Agreement Generation
Visual: A user's finger taps a glowing 'Generate Agreement' button on a sleek, futuristic interface of a real estate app.
Audio/Text: "GrihSeva AI के साथ कानूनी झंझट खत्म! बस एक क्लिक में अपनी डील के लिए ड्राफ्ट तैयार करें"।

Scene 2: AI Verification
Visual: A close-up on a stylish 'AI Document Verifier' progress bar, rapidly filling from 85% to 100%. A verification shield icon appears.
Audio/Text: "हमारा स्मार्ट AI आपके दस्तावेज़ों को तुरंत स्कैन और वेरिफाई करता है, ताकि स्कैम की कोई गुंजाइश न रहे"।

Scene 3: Digital Vault
Visual: An animated sequence showing a digital PDF document flying into a secure, glowing 'Legal Vault' icon.
Audio/Text: "आपकी हर डील 'Legal Vault' में हमेशा के लिए सुरक्षित है। इसे कभी भी, कहीं भी डाउनलोड करें"।`;

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <Button type="submit" disabled={pending} className="w-full h-14 bg-primary text-white">
            {pending ? (
                <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Generating Video (can take a minute)...
                </>
            ) : (
                <>
                    <Sparkles className="mr-2 h-5 w-5" />
                    Generate Video Ad
                </>
            )}
        </Button>
    );
}

export function VideoGenerator() {
    const initialState = { success: false, message: '', data: null };
    const [state, formAction] = useActionState(generateVideoAd, initialState);

    return (
        <Card className="glass-card">
            <CardHeader>
                <CardTitle className="font-headline text-white flex items-center gap-2">
                    <Bot/>
                    AI Video Prompt
                </CardTitle>
                <CardDescription>
                    Describe the video you want to create. The AI will generate a short promotional video based on your script. Be as descriptive as possible!
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <form action={formAction} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="prompt">Video Script / Prompt</Label>
                        <Textarea 
                            id="prompt"
                            name="prompt"
                            rows={15}
                            defaultValue={defaultPrompt}
                            className="bg-input border-border-dark text-white text-sm"
                        />
                    </div>
                    <SubmitButton/>
                </form>

                 {state.message && !state.success && !state.data && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Generation Failed</AlertTitle>
                        <AlertDescription>{state.message}</AlertDescription>
                    </Alert>
                )}

                {state.success && state.data?.videoDataUri && (
                    <div className="space-y-4">
                        <h3 className="font-bold font-headline text-white">Your Video is Ready!</h3>
                        <div className="relative aspect-video rounded-lg overflow-hidden bg-black border border-border">
                             <video 
                                src={state.data.videoDataUri}
                                controls
                                autoPlay
                                loop
                                className="w-full h-full"
                             >
                                Your browser does not support the video tag.
                             </video>
                        </div>
                         <Button asChild className="w-full">
                            <a href={state.data.videoDataUri} download="grihseva-promo-video.mp4">
                                Download Video
                            </a>
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
