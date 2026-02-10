
"use client";

import { useEffect, useState, ChangeEvent } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import Image from 'next/image';
import { Loader2, AlertCircle, Upload, Sparkles, MapPin, IndianRupee, X, Video } from 'lucide-react';
import { listItem } from '@/app/list-item/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} className="w-full h-14 rounded-xl bg-primary text-white">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Listing Item...
        </>
      ) : (
        'List Now'
      )}
    </Button>
  );
}

export function ListItemForm() {
    const initialState = { message: '', success: false, errors: [] };
    const [state, formAction] = useFormState(listItem, initialState);
    const { toast } = useToast();
    const router = useRouter();

    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [videoPreview, setVideoPreview] = useState<string | null>(null);

    useEffect(() => {
        if (state.success) {
            toast({
                title: "Item Listed!",
                description: state.message,
                className: "bg-green-600 border-green-600 text-white",
            });
            router.push('/marketplace');
        }
    }, [state, toast, router]);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            const currentCount = imagePreviews.length;
            const filesArray = Array.from(files);
            const remainingSlots = 10 - currentCount;

            if (filesArray.length > remainingSlots) {
                toast({
                    title: "Maximum photos reached",
                    description: `You can only add ${remainingSlots} more photos. Only the first ${remainingSlots} will be added.`,
                    variant: "destructive"
                });
            }
            
            const filesToAdd = filesArray.slice(0, remainingSlots);
            const newPreviews: string[] = [];

            filesToAdd.forEach((file) => {
                const reader = new FileReader();
                reader.onload = (event) => {
                    newPreviews.push(event.target?.result as string);
                    if (newPreviews.length === filesToAdd.length) {
                        setImagePreviews(prev => [...prev, ...newPreviews]);
                    }
                };
                reader.readAsDataURL(file);
            });
        }
    };
    
    const removeImage = (index: number) => {
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
    }

    const handleVideoChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setVideoPreview(event.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

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
                    <Label className="text-muted-foreground">Add Photos</Label>
                    <p className="text-xs text-muted-foreground">Upload up to 10 photos of your item.</p>
                     <div className="p-4 border-2 border-dashed rounded-lg bg-input/50 border-border">
                        <div className="grid grid-cols-3 gap-2 mb-4">
                            {imagePreviews.map((src, index) => (
                                <div key={index} className="relative aspect-square">
                                    <Image src={src} alt="Preview" layout="fill" objectFit="cover" className="rounded-md" />
                                     <Button size="icon" variant="destructive" type="button" className="absolute -top-2 -right-2 h-6 w-6 rounded-full" onClick={() => removeImage(index)}>
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                        {imagePreviews.length < 10 && (
                            <label className="w-full">
                                <div className="flex items-center justify-center w-full bg-primary text-primary-foreground h-12 rounded-lg cursor-pointer">
                                    <Upload className="mr-2 h-4 w-4"/>
                                    <span>{imagePreviews.length > 0 ? `Add More (${10 - imagePreviews.length} left)` : 'Add Images'}</span>
                                </div>
                                <input id="images" name="images" type="file" className="sr-only" multiple accept="image/*" onChange={handleFileChange} />
                            </label>
                        )}
                    </div>
                    {/* Hidden inputs for image URLs */}
                    {imagePreviews.map((url, i) => (
                        <input key={i} type="hidden" name="imageUrls[]" value={url} />
                    ))}
                     {getError('imageUrls') && <p className="text-sm text-destructive">{getError('imageUrls')}</p>}
                </div>

                <div className="space-y-2">
                    <Label className="text-muted-foreground">Add Video (Optional)</Label>
                     <label className="relative flex items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-input/50 border-border hover:border-primary">
                        <input id="video" name="video" type="file" className="sr-only" accept="video/*" onChange={handleVideoChange} />
                        {videoPreview ? (
                            <>
                                <video src={videoPreview} controls className="w-full h-full rounded-lg object-contain" />
                                <Button size="icon" variant="destructive" type="button" className="absolute -top-2 -right-2 h-6 w-6 rounded-full z-10" onClick={(e) => { e.preventDefault(); setVideoPreview(null); }}>
                                    <X className="h-4 w-4" />
                                </Button>
                            </>
                        ) : (
                            <div className="text-center text-muted-foreground">
                                <Video className="mx-auto h-8 w-8" />
                                <p className="text-xs mt-1">Upload Video</p>
                            </div>
                        )}
                    </label>
                    {videoPreview && <input type="hidden" name="videoUrl" value={videoPreview} />}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="name" className="text-muted-foreground">Item Name</Label>
                    <Input id="name" name="name" placeholder="e.g. Vintage Wooden Coffee Table" required className="bg-input border-border-dark text-white"/>
                    {getError('name') && <p className="text-sm text-destructive">{getError('name')}</p>}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="category" className="text-muted-foreground">Category</Label>
                        <Select name="category" required>
                            <SelectTrigger className="bg-input border-border-dark text-white">
                                <SelectValue placeholder="Select Category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Furniture">Furniture</SelectItem>
                                <SelectItem value="Electronics">Electronics</SelectItem>
                                <SelectItem value="Appliances">Appliances</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                        {getError('category') && <p className="text-sm text-destructive">{getError('category')}</p>}
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="price" className="text-muted-foreground">Price</Label>
                        <div className="relative">
                            <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"/>
                            <Input id="price" name="price" type="number" step="0.01" placeholder="e.g., 5000" required className="pl-10 bg-input border-border-dark text-white"/>
                        </div>
                        {getError('price') && <p className="text-sm text-destructive">{getError('price')}</p>}
                    </div>
                </div>

                 <div className="space-y-2">
                    <Label htmlFor="description" className="text-muted-foreground">Description</Label>
                    <div className="relative">
                        <Textarea id="description" name="description" placeholder="Details, condition, and age." rows={4} className="bg-input border-border-dark text-white pr-24"/>
                        <Button type="button" variant="ghost" size="sm" className="absolute top-2 right-2 text-primary">
                            <Sparkles className="mr-1 h-4 w-4"/> AI Write
                        </Button>
                    </div>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="location" className="text-muted-foreground">Location</Label>
                     <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"/>
                        <Input id="location" name="location" placeholder="City, State" required className="pl-10 bg-input border-border-dark text-white" />
                    </div>
                    {getError('location') && <p className="text-sm text-destructive">{getError('location')}</p>}
                </div>
                
                 <div className="flex items-center justify-between p-4 rounded-lg bg-input border-border-dark">
                    <div>
                        <Label htmlFor="isReservedEnabled" className="font-semibold text-white">10-day Reserve</Label>
                        <p className="text-xs text-muted-foreground">Allow buyers to reserve item with 20% advance payment.</p>
                    </div>
                    <Switch id="isReservedEnabled" name="isReservedEnabled" />
                </div>
            </div>
            <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md p-4 bg-gradient-to-t from-background to-transparent">
              <SubmitButton />
            </div>
        </form>
    );
}
