'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Bot, ShieldCheck, Handshake } from 'lucide-react';
import Link from 'next/link';

const features = [
    {
        icon: <Bot className="w-8 h-8 text-primary" />,
        title: "AI Defect Analysis",
        description: "Upload a photo to get instant, accurate repair estimates from our AI."
    },
    {
        icon: <ShieldCheck className="w-8 h-8 text-primary" />,
        title: "Verified Professionals",
        description: "Connect with background-checked and AI-verified workers for your safety."
    },
    {
        icon: <Handshake className="w-8 h-8 text-primary" />,
        title: "Secure Escrow",
        description: "Your payment is held securely and only released when you're satisfied."
    }
];

export function WhyChooseUsHome() {
    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold font-headline text-white">Why Choose GrihSeva AI?</h3>
                <Link href="/about" className="text-sm font-bold text-primary">Learn More</Link>
            </div>
            <div className="space-y-3">
                {features.map((feature, index) => (
                    <Card key={index} className="glass-card">
                        <CardContent className="p-4 flex items-center gap-4">
                            <div className="bg-primary/10 p-3 rounded-lg">
                                {feature.icon}
                            </div>
                            <div>
                                <h4 className="font-bold text-white">{feature.title}</h4>
                                <p className="text-sm text-muted-foreground">{feature.description}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
