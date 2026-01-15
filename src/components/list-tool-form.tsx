// src/components/list-tool-form.tsx
"use client";

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { Loader2, AlertCircle, Wrench, IndianRupee } from 'lucide-react';
import { listToolForRent } from '@/app/list-tool/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { useEffect } from 'react';

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} className="w-full">
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

    useEffect(() => {
        if (state.success) {
            toast({
                title: "Tool Listed!",
                description: state.message,
                className: "bg-green-100 text-green-900",
            });
        }
    }, [state, toast]);

    const getError = (path: string) => state.errors?.find(e => e.path.includes(path))?.message;

    return (
        <Card className="max-w-xl mx-auto shadow-lg">
            <form action={formAction}>
                 <CardHeader>
                    <CardTitle>Tool Details</CardTitle>
                    <CardDescription>Provide information about the tool you want to rent out.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {state.message && !state.success && (
                        <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{state.message}</AlertDescription>
                        </Alert>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="name">Tool Name</Label>
                        <Input id="name" name="name" placeholder="e.g., Bosch Hammer Drill" required />
                        {getError('name') && <p className="text-sm text-destructive">{getError('name')}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" name="description" placeholder="Describe the tool's condition, features, and any accessories included." />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="rental_price_per_day">Rental Price (per day)</Label>
                        <div className="relative">
                            <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"/>
                            <Input id="rental_price_per_day" name="rental_price_per_day" type="number" placeholder="e.g., 250" required className="pl-10" />
                        </div>
                        {getError('rental_price_per_day') && <p className="text-sm text-destructive">{getError('rental_price_per_day')}</p>}
                    </div>
                </CardContent>
                <CardFooter>
                    <SubmitButton />
                </CardFooter>
            </form>
        </Card>
    );
}
