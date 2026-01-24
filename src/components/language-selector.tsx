'use client';
import { useActionState, useEffect, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Globe, Save, Loader2, AlertCircle } from 'lucide-react';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import type { User } from '@/lib/entities';
import { doc } from 'firebase/firestore';
import { updateUserLanguage } from '@/app/language/actions';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from './ui/skeleton';


const languages = [
  { id: 'en', name: 'English' },
  { id: 'hi', name: 'हिन्दी (Hindi)' },
  { id: 'es', name: 'Español (Spanish)' },
  { id: 'fr', name: 'Français (French)' },
  { id: 'ar', name: 'العربية (Arabic)' },
  { id: 'bn', name: 'বাংলা (Bengali)' },
  { id: 'pt', name: 'Português (Portuguese)' },
  { id: 'ru', name: 'Русский (Russian)' },
  { id: 'ja', name: '日本語 (Japanese)' },
  { id: 'de', name: 'Deutsch (German)' },
  { id: 'te', name: 'తెలుగు (Telugu)' },
  { id: 'mr', name: 'मराठी (Marathi)' },
  { id: 'ta', name: 'தமிழ் (Tamil)' },
  { id: 'gu', name: 'ગુજરાતી (Gujarati)' },
];

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} className="w-full h-14 rounded-xl bg-primary text-white">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Saving...
        </>
      ) : (
        <>
          <Save className="mr-2"/>
          Save Language
        </>
      )}
    </Button>
  );
}


export function LanguageSelector() {
    const initialState = { message: '', success: false, errors: [] };
    const [state, formAction] = useActionState(updateUserLanguage, initialState);
    const { toast } = useToast();
    const { user, isUserLoading } = useUser();
    const firestore = useFirestore();

    const userDocRef = useMemoFirebase(() => {
        if (!firestore || !user?.uid) return null;
        return doc(firestore, 'users', user.uid);
    }, [firestore, user?.uid]);

    const { data: userProfile, isLoading: isProfileLoading } = useDoc<User>(userDocRef);
    
    const [selectedLanguage, setSelectedLanguage] = useState(userProfile?.language || 'en');

    useEffect(() => {
        if (userProfile?.language) {
            setSelectedLanguage(userProfile.language);
        }
    }, [userProfile]);

    useEffect(() => {
        if (state.success) {
            toast({
                title: "Language Saved!",
                description: state.message,
                className: "bg-green-600 border-green-600 text-white",
            });
        }
    }, [state, toast]);
    
    if (isUserLoading || isProfileLoading) {
        return (
            <Card className="glass-card">
                <CardHeader>
                    <Skeleton className="h-8 w-48" />
                </CardHeader>
                <CardContent className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex items-center space-x-2 bg-black/20 p-4 rounded-lg border border-border">
                             <Skeleton className="h-5 w-5 rounded-full" />
                             <Skeleton className="h-6 w-32" />
                        </div>
                    ))}
                </CardContent>
            </Card>
        );
    }

  return (
    <form action={formAction}>
        <input type="hidden" name="uid" value={user?.uid || ''} />
        <Card className="glass-card">
        <CardHeader>
            <CardTitle className="font-headline text-white flex items-center gap-2">
            <Globe />
            Change Language
            </CardTitle>
            <CardDescription>Select your preferred language for the app and AI interactions.</CardDescription>
        </CardHeader>
        <CardContent>
             {state.message && !state.success && (
                <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{state.message}</AlertDescription>
                </Alert>
            )}
            <RadioGroup name="language" value={selectedLanguage} onValueChange={setSelectedLanguage}>
            <div className="space-y-4">
                {languages.map(lang => (
                <Label key={lang.id} htmlFor={lang.id} className="flex items-center space-x-4 bg-black/20 p-4 rounded-lg border border-border cursor-pointer has-[:checked]:border-primary has-[:checked]:bg-primary/10 transition-colors">
                    <RadioGroupItem value={lang.id} id={lang.id} />
                    <span className="text-lg text-white font-medium flex-1">{lang.name}</span>
                </Label>
                ))}
            </div>
            </RadioGroup>
        </CardContent>
        </Card>
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 w-full max-w-md p-4 bg-gradient-to-t from-background to-transparent">
          <SubmitButton />
        </div>
    </form>
  );
}
