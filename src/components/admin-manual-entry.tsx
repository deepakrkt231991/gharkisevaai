"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { addWorkerManually, addPropertyManually } from "@/app/admin/manage/actions";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, PlusCircle, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";


function SubmitButton({ text }: { text: string }) {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending} className="w-full">
            {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <PlusCircle className="mr-2 h-4 w-4"/>}
            {pending ? 'Saving...' : text}
        </Button>
    )
}

function AddWorkerForm() {
    const initialState = { success: false, message: '' };
    const [state, formAction] = useFormState(addWorkerManually, initialState);
    const { toast } = useToast();
    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        if (state.message) {
            toast({
                title: state.success ? "Success!" : "Error",
                description: state.message,
                variant: state.success ? "default" : "destructive",
                className: state.success ? "bg-green-600 text-white" : "",
            });
            if (state.success) {
                formRef.current?.reset();
            }
        }
    }, [state, toast]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Add New Worker</CardTitle>
                <CardDescription>Manually add a verified worker to the platform.</CardDescription>
            </CardHeader>
            <CardContent>
                <form ref={formRef} action={formAction} className="space-y-4">
                    <div className="space-y-1">
                        <Label htmlFor="worker-name">Name</Label>
                        <Input id="worker-name" name="name" required />
                    </div>
                     <div className="space-y-1">
                        <Label htmlFor="worker-phone">Phone</Label>
                        <Input id="worker-phone" name="phone" type="tel" required />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="worker-skills">Skills (e.g. plumber, electrician)</Label>
                        <Select name="skills" required>
                            <SelectTrigger><SelectValue placeholder="Select Skill" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="plumber">Plumber</SelectItem>
                                <SelectItem value="electrician">Electrician</SelectItem>
                                <SelectItem value="carpenter">Carpenter</SelectItem>
                                <SelectItem value="painter">Painter</SelectItem>
                                <SelectItem value="ac_repair">AC Repair</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                         <div className="space-y-1">
                            <Label htmlFor="worker-rating">Rating</Label>
                            <Input id="worker-rating" name="rating" type="number" step="0.1" defaultValue="4.5" />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="worker-jobs">Jobs Completed</Label>
                            <Input id="worker-jobs" name="successfulOrders" type="number" defaultValue="50" />
                        </div>
                    </div>
                    <SubmitButton text="Add Worker" />
                </form>
            </CardContent>
        </Card>
    )
}

function AddPropertyForm() {
     const initialState = { success: false, message: '' };
    const [state, formAction] = useFormState(addPropertyManually, initialState);
    const { toast } = useToast();
    const formRef = useRef<HTMLFormElement>(null);

     useEffect(() => {
        if (state.message) {
            toast({
                title: state.success ? "Success!" : "Error",
                description: state.message,
                variant: state.success ? "default" : "destructive",
                className: state.success ? "bg-green-600 text-white" : "",
            });
            if (state.success) {
                formRef.current?.reset();
            }
        }
    }, [state, toast]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Add New Property</CardTitle>
                <CardDescription>Manually add a property listing for "Buy/Sell/Rent".</CardDescription>
            </CardHeader>
            <CardContent>
                 <form ref={formRef} action={formAction} className="space-y-4">
                    <div className="space-y-1">
                        <Label htmlFor="prop-ownerId">Owner User ID</Label>
                        <Input id="prop-ownerId" name="ownerId" required placeholder="Firebase User ID"/>
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="prop-title">Title</Label>
                        <Input id="prop-title" name="title" required placeholder="e.g., 3 BHK Luxury Villa"/>
                    </div>
                     <div className="space-y-1">
                        <Label htmlFor="prop-location">Location</Label>
                        <Input id="prop-location" name="location" required placeholder="e.g., Koramangala, Bangalore" />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="prop-imageUrl">Property Photo URL</Label>
                        <Input id="prop-imageUrl" name="imageUrl" required type="url" placeholder="https://picsum.photos/seed/1/800/600" />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="prop-type">Listing Type</Label>
                         <Select name="listingType" required>
                            <SelectTrigger><SelectValue placeholder="Select Type" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="sale">For Sale</SelectItem>
                                <SelectItem value="rent">For Rent</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <Label htmlFor="prop-price">Price (in Lakhs or Crores)</Label>
                            <Input id="prop-price" name="price" type="number" step="0.01" placeholder="4.20" />
                        </div>
                         <div className="space-y-1">
                            <Label htmlFor="prop-priceUnit">Unit</Label>
                             <Select name="priceUnit">
                                <SelectTrigger><SelectValue placeholder="Select Unit" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Cr">Crore (Cr)</SelectItem>
                                    <SelectItem value="L">Lakh (L)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                         <div className="space-y-1">
                            <Label htmlFor="prop-sqft">Area (sqft)</Label>
                            <Input id="prop-sqft" name="sqft" type="number" required placeholder="1800"/>
                        </div>
                         <div className="space-y-1">
                            <Label htmlFor="prop-parking">Parking</Label>
                            <Input id="prop-parking" name="parking" type="number" required defaultValue="1"/>
                        </div>
                    </div>
                    <SubmitButton text="Add Property" />
                </form>
            </CardContent>
        </Card>
    )
}

export function AdminManualEntry() {
    return (
        <div className="grid md:grid-cols-2 gap-8">
            <AddWorkerForm />
            <AddPropertyForm />
        </div>
    )
}
