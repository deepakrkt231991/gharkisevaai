"use client";
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, AlertCircle, Wrench } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const WhatsAppIcon = () => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2"><title>WhatsApp</title><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52s-.67-.816-.923-1.123c-.253-.307-.508-.262-.67.025-.164.288-.67 1.164-.67 1.164s-.67.149-1.645.923c-.976.775-1.045 1.502-1.045 1.502s.508 1.645 1.645 2.52c1.138.875 2.596 1.943 3.846 1.943.347 0 .82-.025 1.123-.307.303-.282.67-1.164.67-1.164s-.05-.099-.124-.198c-.074-.099-.297-.149-.297-.149zM12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18.5c-4.687 0-8.5-3.813-8.5-8.5s3.813-8.5 8.5-8.5 8.5 3.813 8.5 8.5-3.813 8.5-8.5 8.5z" fill="currentColor"/></svg>
);


export default function WorkerRegistration() {
  const [status, setStatus] = useState("");
  const [showWhatsApp, setShowWhatsApp] = useState(false);
  const [whatsAppLink, setWhatsAppLink] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus("Submitting to GharKiSeva...");
    setShowWhatsApp(false); // Reset on new submission

    const formData = new FormData(e.currentTarget);
    formData.append("access_key", "e525df7c-17f3-4153-9d6a-7e09c3463079");

    const name = formData.get('name') as string;
    const phone = formData.get('phone') as string;
    const city = formData.get('city') as string;
    const specialty = formData.get('specialty') as string;

    const message = `New Worker Registration:\n\nName: ${name}\nPhone: ${phone}\nCity: ${city}\nSpecialty: ${specialty}`;
    setWhatsAppLink(`https://wa.me/918291569096?text=${encodeURIComponent(message)}`);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        setStatus("Success! Your profile has been sent to the GrihSeva team.");
        setShowWhatsApp(true); // Show the WhatsApp button
        (e.target as HTMLFormElement).reset();
      } else {
        setStatus("Error: " + data.message);
      }
    } catch (err) {
      setStatus("Network Error. Please check your connection and try again.");
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-md mx-auto my-10 glass-card">
      <CardHeader className="text-center">
        <Wrench className="mx-auto h-12 w-12 text-primary mb-4" />
        <CardTitle className="font-headline text-2xl">WORKER REGISTRATION</CardTitle>
        <CardDescription>Get verified jobs in your city.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" type="text" name="name" required placeholder="e.g., Raju Sharma" />
          </div>

          <div className="space-y-1">
            <Label htmlFor="phone">Mobile Number</Label>
            <Input id="phone" type="tel" name="phone" required placeholder="e.g., 9876543210" />
          </div>

          <div className="space-y-1">
            <Label htmlFor="city">Work City / Area</Label>
            <Input id="city" type="text" name="city" required placeholder="e.g., Andheri, Mumbai" />
          </div>

          <div className="space-y-1">
            <Label htmlFor="specialty">Expertise</Label>
             <Select name="specialty" required>
                <SelectTrigger id="specialty">
                    <SelectValue placeholder="Select your skill" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="Painter">Wall Painter</SelectItem>
                    <SelectItem value="Seepage Expert">Seepage/Waterproofing</SelectItem>
                    <SelectItem value="Flooring">Tiles & Flooring</SelectItem>
                    <SelectItem value="Full Home Decor">Full Home Renovation</SelectItem>
                </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full h-12" disabled={isSubmitting}>
             {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Submit Profile
          </Button>
        </form>

        {status && (
            <Alert className={`mt-6 ${status.includes('Success') ? 'border-green-500/50 text-green-400' : 'border-destructive/50 text-destructive'}`}>
                {status.includes('Success') ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                <AlertTitle className="font-bold">{status.includes('Success') ? 'Success!' : 'Status'}</AlertTitle>
                <AlertDescription className="text-white/80">
                 {status.replace('Success! ', '')}
                </AlertDescription>
            </Alert>
        )}

        {showWhatsApp && (
            <Button asChild className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white h-12">
                <a href={whatsAppLink} target="_blank" rel="noopener noreferrer">
                    <WhatsAppIcon /> Send on WhatsApp
                </a>
            </Button>
        )}
      </CardContent>
    </Card>
  );
}
