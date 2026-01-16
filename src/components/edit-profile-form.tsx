'use client';

import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import type { User as UserEntity } from '@/lib/entities';
import { updateUserProfile } from '@/app/profile/edit/actions';

import { Loader2, AlertCircle, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

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
            Save Changes
        </>
      )}
    </Button>
  );
}

export function EditProfileForm() {
    const initialState = { message: '', success: false, errors: [] };
    const [state, formAction] = useActionState(updateUserProfile, initialState);
    const { toast } = useToast();
    const { user: authUser, isUserLoading: isAuthLoading } = useUser();
    const firestore = useFirestore();

    const userDocRef = useMemoFirebase(() => {
        if (!firestore || !authUser?.uid) return null;
        return doc(firestore, 'users', authUser.uid);
    }, [firestore, authUser?.uid]);

    const { data: userProfile, isLoading: isProfileLoading } = useDoc<UserEntity>(userDocRef);

    useEffect(() => {
        if (state.success) {
            toast({
                title: "Profile Updated!",
                description: state.message,
                className: "bg-green-600 border-green-600 text-white",
            });
        }
    }, [state, toast]);

    const getError = (path: string) => state.errors?.find(e => e.path.includes(path))?.message;

    if (isAuthLoading || (authUser && isProfileLoading)) {
      return (
        <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
                 <div className="space-y-2" key={i}>
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-14 w-full" />
                </div>
            ))}
             <Skeleton className="h-14 w-full" />
        </div>
      );
    }
    
    if (!authUser || !userProfile) {
        return (
            <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>Could not load user profile. Please try again.</AlertDescription>
            </Alert>
        );
    }

    return (
        <form action={formAction} className="space-y-6">
            {state.message && !state.success && (
                <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{state.message}</AlertDescription>
                </Alert>
            )}

            <input type="hidden" name="uid" value={authUser.uid} />

            <div className="space-y-2">
                <Label htmlFor="name" className="text-muted-foreground">Full Name</Label>
                <Input id="name" name="name" defaultValue={userProfile.name || authUser.displayName || ''} required className="bg-input border-border-dark text-white"/>
                {getError('name') && <p className="text-sm text-destructive">{getError('name')}</p>}
            </div>
            
            <div className="space-y-2">
                <Label htmlFor="email" className="text-muted-foreground">Email</Label>
                <Input id="email" name="email" defaultValue={authUser.email || ''} disabled className="bg-input border-border-dark text-muted-foreground"/>
            </div>
            
            <div className="space-y-2">
                <Label htmlFor="phone" className="text-muted-foreground">Phone Number</Label>
                <Input id="phone" name="phone" defaultValue={userProfile.phone || ''} placeholder="Add your phone number" className="bg-input border-border-dark text-white"/>
                 {getError('phone') && <p className="text-sm text-destructive">{getError('phone')}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="address" className="text-muted-foreground">Address</Label>
                <Textarea id="address" name="address" defaultValue={userProfile.address || ''} placeholder="Your home address" className="bg-input border-border-dark text-white"/>
                 {getError('address') && <p className="text-sm text-destructive">{getError('address')}</p>}
            </div>

            <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md p-4 bg-gradient-to-t from-background to-transparent">
              <SubmitButton />
            </div>
        </form>
    );
}
