"use client";

import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Linkedin, Facebook } from 'lucide-react';
import Image from "next/image";

const linkedinTemplate = {
    headline: "🚀 Join India’s First AI-Powered Home Service Platform – 0% Commission Forever!",
    content: `Are you a professional worker or service provider? Join 'Ghar Ki Seva' (घर की सेवा) and connect directly with customers.

✅ Zero Platform Fees: We don't charge any commission from you.
✅ Direct Payments: Talk directly to the customer and get the full payment for your hard work.
✅ AI Verification: Get your skills and certificates verified by our AI and earn a 'Trust Badge'.
✅ World-Class Tech: Get the best jobs near your location through AI analysis.

Upload your Live Selfie and Certificates today and become a 'Verified Global Professional'!

👉 Register Now: https://app.gharkiseva.com/worker-signup`,
    image: "https://picsum.photos/seed/linkedin-ad/1200/628",
    imageHint: "professional tools layout"
};

const facebookTemplate = {
    headline: "🏠 घर की सेवा (Ghar Ki Seva) से जुड़ें – बिना किसी कमीशन के काम पाएं! 🛠️",
    content: `Ab kaam dhundne ke liye bhatakna band! 'Ghar Ki Seva' app par aayein aur apne hunar ki poori keemat paayein.

✨ 0% Commission: Hum aapke kaam se ek rupaya bhi nahi kaatte.
✨ Saccha Bharosa: Apni photo aur ID card daalein aur grahakon ka bharosa jeetein.
✨ Aasan Kaam: Aapke ghar ke paas ke orders seedhe aapke phone par.
✨ Muft Registration: Abhi judein aur apni dukaan ya service ko digital banayein.

Mehnat aapki, kamai bhi aapki! Aaj hi judein.

👇 Neeche diye link se app download karein aur apni selfie upload karein!
https://app.gharkiseva.com/worker-signup`,
    image: "https://picsum.photos/seed/facebook-ad/1080/1080",
    imageHint: "happy worker tools"
};

const AdTemplateCard = ({ platform, icon, template }: { platform: string, icon: React.ReactNode, template: typeof linkedinTemplate }) => {
    const { toast } = useToast();

    const handleCopy = (textToCopy: string) => {
        navigator.clipboard.writeText(textToCopy);
        toast({ title: "Copied!", description: `${platform} ad copy has been copied to your clipboard.` });
    };
    
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">{icon} {platform}</CardTitle>
                <CardDescription>Use this template to recruit workers on {platform}.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div className="w-full aspect-video relative rounded-lg overflow-hidden bg-muted">
                    <Image src={template.image} alt={`${platform} ad visual`} fill className="object-cover" data-ai-hint={template.imageHint} />
                </div>

                <div className="relative w-full rounded-lg border bg-secondary p-4 whitespace-pre-wrap font-mono text-sm max-h-60 overflow-y-auto">
                    <h4 className="font-bold mb-2">{template.headline}</h4>
                    {template.content}
                </div>
                <Button onClick={() => handleCopy(`${template.headline}\n\n${template.content}`)} variant="outline" className="w-full">
                    <Copy className="mr-2 h-4 w-4" /> Copy Text
                </Button>
            </CardContent>
        </Card>
    )
}


export function SocialAdGenerator() {
    return (
        <div className="grid md:grid-cols-2 gap-8">
           <AdTemplateCard platform="LinkedIn" icon={<Linkedin className="text-[#0A66C2]"/>} template={linkedinTemplate} />
           <AdTemplateCard platform="Facebook / Instagram" icon={<Facebook className="text-[#1877F2]"/>} template={facebookTemplate} />
        </div>
    );
}
