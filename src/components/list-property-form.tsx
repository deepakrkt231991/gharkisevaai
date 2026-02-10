

"use client";

import { useEffect, useState, ChangeEvent } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import Image from 'next/image';
import { Loader2, AlertCircle, Building, UploadCloud, Video, Sparkles } from 'lucide-react';
import { listProperty, getPropertyMediaTips } from '@/app/list-property/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel } from '@/components/ui/alert-dialog';


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
    const [state, formAction] = useFormState(listProperty, initialState);
    const { toast } = useToast();
    const router = useRouter();

    const [listingType, setListingType] = useState('sale');
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [videoPreview, setVideoPreview] = useState<string | null>(null);
    const [showAiHelp, setShowAiHelp] = useState(false);
    const [aiTips, setAiTips] = useState<string[]>([]);
    const [isLoadingTips, setIsLoadingTips] = useState(false);

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

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>, fileType: 'image' | 'video') => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const dataUrl = event.target?.result as string;
                if (fileType === 'image') {
                    setImagePreview(dataUrl);
                } else {
                    setVideoPreview(dataUrl);
                }
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleAiHelp = async () => {
        setShowAiHelp(true);
        setIsLoadingTips(true);
        const result = await getPropertyMediaTips();
        setAiTips(result.tips);
        setIsLoadingTips(false);
    };

    const getError = (path: string) => state.errors?.find(e => e.path.includes(path))?.message;

    return (
        <>
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
                        <Label className="text-muted-foreground">Property Photo & Video</Label>
                        <div className="grid grid-cols-2 gap-4">
                            <label className="relative flex items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-input border-border-dark hover:border-primary">
                                <input id="image" name="image" type="file" className="sr-only" accept="image/*" onChange={(e) => handleFileChange(e, 'image')} />
                                {imagePreview ? (
                                    <Image src={imagePreview} alt="Image preview" layout="fill" objectFit="cover" className="rounded-lg" />
                                ) : (
                                    <div className="text-center text-muted-foreground">
                                        <UploadCloud className="mx-auto h-8 w-8" />
                                        <p className="text-xs mt-1">Upload Photo</p>
                                    </div>
                                )}
                            </label>
                             <label className="relative flex items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-input border-border-dark hover:border-primary">
                                <input id="video" name="video" type="file" className="sr-only" accept="video/*" onChange={(e) => handleFileChange(e, 'video')} />
                                {videoPreview ? (
                                    <video src={videoPreview} controls className="w-full h-full rounded-lg object-cover" />
                                ) : (
                                    <div className="text-center text-muted-foreground">
                                        <Video className="mx-auto h-8 w-8" />
                                        <p className="text-xs mt-1">Upload Video</p>
                                    </div>
                                )}
                            </label>
                        </div>
                        {imagePreview && <input type="hidden" name="imageUrl" value={imagePreview} />}
                        {videoPreview && <input type="hidden" name="videoUrl" value={videoPreview} />}
                    </div>

                    <Button type="button" variant="outline" className="w-full h-12" onClick={handleAiHelp}>
                        <Sparkles className="mr-2" /> AI Photo & Video Guide
                    </Button>
                    
                    <div className="space-y-2">
                        <Label htmlFor="location" className="text-muted-foreground">Location</Label>
                        <Input id="location" name="location" placeholder="e.g., Indiranagar, Bangalore" required className="bg-input border-border-dark text-white"/>
                        {getError('location') && <p className="text-sm text-destructive">{getError('location')}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="listingType" className="text-muted-foreground">Listing For</Label>
                        <Select name="listingType" required onValueChange={setListingType} defaultValue={listingType}>
                            <SelectTrigger className="bg-input border-border-dark text-white">
                                <SelectValue placeholder="Select listing type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="sale">Sale</SelectItem>
                                <SelectItem value="rent">Rent</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {listingType === 'sale' ? (
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
                    ) : (
                       <>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="rentAmount" className="text-muted-foreground">Monthly Rent (₹)</Label>
                                <Input id="rentAmount" name="rentAmount" type="number" placeholder="e.g., 25000" required className="bg-input border-border-dark text-white"/>
                                {getError('rentAmount') && <p className="text-sm text-destructive">{getError('rentAmount')}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="depositAmount" className="text-muted-foreground">Deposit (₹)</Label>
                                <Input id="depositAmount" name="depositAmount" type="number" placeholder="e.g., 100000" required className="bg-input border-border-dark text-white"/>
                                {getError('depositAmount') && <p className="text-sm text-destructive">{getError('depositAmount')}</p>}
                            </div>
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="agreementYears" className="text-muted-foreground">Agreement Duration (Years)</Label>
                            <Input id="agreementYears" name="agreementYears" type="number" placeholder="e.g., 1" className="bg-input border-border-dark text-white"/>
                             {getError('agreementYears') && <p className="text-sm text-destructive">{getError('agreementYears')}</p>}
                        </div>
                       </>
                    )}
                    
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

                </div>
                <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md p-4 bg-gradient-to-t from-background to-transparent">
                <SubmitButton />
                </div>
            </form>

            <AlertDialog open={showAiHelp} onOpenChange={setShowAiHelp}>
                <AlertDialogContent className="glass-card">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2">
                            <Sparkles className="text-primary"/> AI Guide for Property Media
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Follow these expert tips to attract more buyers and get the best price for your property.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    {isLoadingTips ? (
                        <div className="flex justify-center items-center h-48">
                            <Loader2 className="animate-spin h-8 w-8 text-primary" />
                        </div>
                    ) : (
                        <div className="max-h-80 overflow-y-auto pr-4 text-sm space-y-4">
                            {aiTips.map((tip, i) => (
                                <p key={i} className={`text-muted-foreground ${tip.endsWith(':') ? 'text-white font-bold mt-4' : 'ml-4'}`}>
                                    {tip.endsWith(':') ? tip : `• ${tip}`}
                                </p>
                            ))}
                        </div>
                    )}
                    <AlertDialogFooter>
                        <AlertDialogCancel>Close</AlertDialogCancel>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}

    
