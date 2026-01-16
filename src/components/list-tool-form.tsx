// src/components/list-tool-form.tsx
"use client";

import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { Loader2, AlertCircle, Wrench, IndianRupee } from 'lucide-react';
import { listToolForRent } from '@/app/list-tool/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} className="w-full h-14 rounded-xl bg-primary text-white">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Listing Tool...
        </>
      ) : (
        <>
            <Wrench className="mr-2"/>
            List My Tool
        </>
      )}
    </Button>
  );
}

export function ListToolForm() {
    const initialState = { message: '', success: false, errors: [] };
    const [state, formAction] = useActionState(listToolForRent, initialState);
    const { toast } = useToast();
    const router = useRouter();

    useEffect(() => {
        if (state.success) {
            toast({
                title: "Tool Listed!",
                description: state.message,
                className: "bg-green-600 border-green-600 text-white",
            });
            router.push('/rent-tools');
        }
    }, [state, toast, router]);

    const getError = (path: string) => state.errors?.find(e => e.path.includes(path))?.message;

    return (
        <form action={formAction} className="space-y-6">
            <div className="glass-card rounded-xl p-5 space-y-4">
                {state.message && !state.success && (
                    <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{state.message}</AlertDescription>
                    </Alert>
                )}

                <div className="space-y-2">
                    <Label htmlFor="name" className="text-muted-foreground">Tool Name</Label>
                    <Input id="name" name="name" placeholder="e.g., Bosch Hammer Drill" required className="bg-input border-border-dark text-white"/>
                    {getError('name') && <p className="text-sm text-destructive">{getError('name')}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="description" className="text-muted-foreground">Description</Label>
                    <Textarea id="description" name="description" placeholder="Describe the tool's condition, features, and any accessories included." className="bg-input border-border-dark text-white"/>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="rental_price_per_day" className="text-muted-foreground">Rental Price (per day)</Label>
                    <div className="relative">
                        <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"/>
                        <Input id="rental_price_per_day" name="rental_price_per_day" type="number" placeholder="e.g., 250" required className="pl-10 bg-input border-border-dark text-white" />
                    </div>
                    {getError('rental_price_per_day') && <p className="text-sm text-destructive">{getError('rental_price_per_day')}</p>}
                </div>
            </div>
            <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md p-4 bg-gradient-to-t from-background to-transparent">
              <SubmitButton />
            </div>
        </form>
    );
}
