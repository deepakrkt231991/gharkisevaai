"use client";

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { useToast } from "@/hooks/use-toast";
import { generateSocialAd, type AdState } from "@/app/admin/actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader2, Copy, Bot, AlertTriangle } from 'lucide-react';

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending} className="w-full h-14">
            {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Bot className="mr-2 h-4 w-4"/>}
            Generate Ad Copy
        </Button>
    )
}

export function SocialAdGenerator() {
    const initialState: AdState = { success: false, message: '', data: null };
    const [state, formAction] = useActionState(generateSocialAd, initialState);
    const { toast } = useToast();

    const handleCopy = () => {
        if (state.data?.adCopy) {
            navigator.clipboard.writeText(state.data.adCopy);
            toast({ title: "Copied!", description: "Ad copy copied to clipboard." });
        }
    }

    return (
        <Card className="max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>Social Media Ad Generator</CardTitle>
                <CardDescription>Generate ad copy for LinkedIn, Facebook, and Instagram to hire workers or promote your services.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 <form action={formAction} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="topic">Ad Topic</Label>
                        <Input id="topic" name="topic" defaultValue="Hiring verified plumbers in Delhi" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="platform">Platform</Label>
                         <Select name="platform" defaultValue="Facebook">
                            <SelectTrigger>
                                <SelectValue placeholder="Select a platform" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Facebook">Facebook</SelectItem>
                                <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                                <SelectItem value="Instagram">Instagram</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <SubmitButton />
                </form>

                 {state?.message && !state.success && (
                    <Alert variant="destructive" className="mt-4">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>{state.message}</AlertDescription>
                    </Alert>
                )}

                 {state?.success && state.data?.adCopy && (
                    <div className="space-y-4 pt-4">
                        <h3 className="font-semibold">Generated Ad Copy:</h3>
                        <div className="relative w-full rounded-lg border bg-secondary p-4 whitespace-pre-wrap font-mono text-sm max-h-60 overflow-y-auto">
                            {state.data.adCopy}
                        </div>
                        <Button onClick={handleCopy} variant="outline">
                            <Copy className="mr-2 h-4 w-4" /> Copy Text
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
