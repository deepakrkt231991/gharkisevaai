"use client";

import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { Loader2, AlertCircle, Building, IndianRupee } from 'lucide-react';
import { listProperty } from '@/app/list-property/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} className="w-full h-14 rounded-xl bg-primary text-white">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Listing Property...
        </>
      ) : (
        <>
            <Building className="mr-2"/>
            List My Property
        </>
      )}
    </Button>
  );
}

export function ListPropertyForm() {
    const initialState = { message: '', success: false, errors: [] };
    const [state, formAction] = useActionState(listProperty, initialState);
    const { toast } = useToast();
    const router = useRouter();

    useEffect(() => {
        if (state.success) {
            toast({
                title: "Property Listed!",
                description: state.message,
                className: "bg-green-600 border-green-600 text-white",
            });
            router.push('/explore');
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
                    <Label htmlFor="title" className="text-muted-foreground">Property Title</Label>
                    <Input id="title" name="title" placeholder="e.g., 2 BHK Modern Apartment" required className="bg-input border-border-dark text-white"/>
                    {getError('title') && <p className="text-sm text-destructive">{getError('title')}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="location" className="text-muted-foreground">Location</Label>
                    <Input id="location" name="location" placeholder="e.g., Indiranagar, Bangalore" required className="bg-input border-border-dark text-white"/>
                    {getError('location') && <p className="text-sm text-destructive">{getError('location')}</p>}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="price" className="text-muted-foreground">Price</Label>
                        <Input id="price" name="price" type="number" step="0.01" placeholder="e.g., 1.85" required className="bg-input border-border-dark text-white"/>
                        {getError('price') && <p className="text-sm text-destructive">{getError('price')}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="priceUnit" className="text-muted-foreground">Unit</Label>
                         <Select name="priceUnit" required>
                            <SelectTrigger className="bg-input border-border-dark text-white">
                                <SelectValue placeholder="Select Unit" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Cr">Crore (Cr)</SelectItem>
                                <SelectItem value="L">Lakh (L)</SelectItem>
                            </SelectContent>
                        </Select>
                        {getError('priceUnit') && <p className="text-sm text-destructive">{getError('priceUnit')}</p>}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="sqft" className="text-muted-foreground">Area (sq. ft.)</Label>
                        <Input id="sqft" name="sqft" type="number" placeholder="e.g., 1450" required className="bg-input border-border-dark text-white"/>
                        {getError('sqft') && <p className="text-sm text-destructive">{getError('sqft')}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="parking" className="text-muted-foreground">Parking Spots</Label>
                        <Input id="parking" name="parking" type="number" placeholder="e.g., 1" required className="bg-input border-border-dark text-white"/>
                        {getError('parking') && <p className="text-sm text-destructive">{getError('parking')}</p>}
                    </div>
                </div>
                
                <div className="space-y-2">
                    <Label htmlFor="imageUrl" className="text-muted-foreground">Image URL (Optional)</Label>
                    <Input id="imageUrl" name="imageUrl" placeholder="https://..." className="bg-input border-border-dark text-white"/>
                     {getError('imageUrl') && <p className="text-sm text-destructive">{getError('imageUrl')}</p>}
                </div>
            </div>
            <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md p-4 bg-gradient-to-t from-background to-transparent">
              <SubmitButton />
            </div>
        </form>
    );
}