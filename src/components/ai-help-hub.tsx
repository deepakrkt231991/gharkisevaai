'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowUpRight, Camera, CheckShield, Copy, Share2, Sofa, Video } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const AiComputeCreditsCard = () => (
    <Card className="glass-card border-l-4 border-primary">
        <CardContent className="p-4">
            <div className="flex justify-between items-center mb-2">
                <p className="text-xs font-bold text-muted-foreground">AI COMPUTE CREDITS</p>
                <ArrowUpRight className="text-accent" />
            </div>
            <div className="flex items-baseline gap-2 mb-2">
                <p className="text-4xl font-bold font-headline text-white">1,240</p>
                <p className="text-accent font-bold">+24%</p>
            </div>
            <Progress value={60} className="h-1 bg-primary/20 [&>div]:bg-primary" />
        </CardContent>
    </Card>
);

const IntelligenceSuite = () => (
    <div className="space-y-4">
        <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold font-headline">Intelligence Suite</h3>
            <Link href="#" className="text-sm font-bold text-primary">VIEW ALL</Link>
        </div>

        <Card className="glass-card p-4 space-y-3 relative overflow-hidden">
            <div className="flex items-center gap-3">
                <div className="bg-primary/20 p-2 rounded-lg"><Sofa className="text-primary"/></div>
                <h4 className="font-bold text-lg font-headline text-white">AI Interior Designer</h4>
            </div>
            <p className="text-sm text-muted-foreground">Instant Vastu-compliant layouts from a single photo.</p>
            <Button className="w-fit">
                <Camera className="mr-2" />
                Upload Room
            </Button>
            <div className="absolute -right-8 -bottom-4 w-32 h-32 opacity-10">
                <Image src="https://picsum.photos/seed/sofa-icon/200" alt="sofa" fill className="object-contain" />
            </div>
        </Card>

        <div className="grid grid-cols-2 gap-4">
            <Card className="glass-card p-4 space-y-4">
                 <div className="bg-primary/20 p-2 rounded-lg w-fit"><CheckShield className="text-primary"/></div>
                 <h4 className="font-bold text-white">Property Verifier</h4>
                 <p className="text-xs text-muted-foreground">AI Legal & Document check.</p>
                 <Button variant="outline" className="w-full bg-transparent">Scan Docs</Button>
            </Card>
            <Card className="glass-card p-4 space-y-4">
                <div className="bg-primary/20 p-2 rounded-lg w-fit"><Video className="text-primary"/></div>
                <h4 className="font-bold text-white">Video Ad Maker</h4>
                <p className="text-xs text-muted-foreground">Convert listings to viral ads.</p>
                <Button variant="outline" className="w-full bg-transparent">Create Ad</Button>
            </Card>
        </div>
    </div>
);

const PromoteAndEarnCard = () => (
     <Card className="glass-card p-4 space-y-4 border-2 border-accent/30 bg-gradient-to-br from-accent/5 to-transparent">
        <div className="flex justify-between items-center">
             <h3 className="text-xl font-bold font-headline">Promote & Earn</h3>
             <div className="bg-accent text-accent-foreground text-xs font-bold px-3 py-1 rounded-full">NEW</div>
        </div>
        <p className="text-sm text-muted-foreground">Generate AI posters & get ₹500 per referral.</p>
        
        <div className="grid grid-cols-2 gap-4 h-32">
            <div className="relative rounded-lg overflow-hidden">
                <Image src="https://picsum.photos/seed/house-promo/400/600" alt="Home repair promo" fill className="object-cover"/>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent p-2 flex flex-col justify-end">
                    <p className="text-white text-xs font-medium">Get your home repaired...</p>
                </div>
            </div>
             <div className="relative rounded-lg overflow-hidden">
                <Image src="https://picsum.photos/seed/plant-promo/400/600" alt="Interior design promo" fill className="object-cover"/>
                 <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent p-2 flex flex-col justify-end">
                    <p className="text-white text-xs font-medium">Dream interiors in 1-click...</p>
                </div>
            </div>
        </div>

        <div className="flex items-center justify-between p-2 rounded-lg bg-black/20 border border-border">
            <p className="text-sm font-mono text-muted-foreground">GRIH-AI-X92L</p>
            <Button variant="ghost" size="icon" className="w-8 h-8"><Copy className="w-4 h-4"/></Button>
        </div>

        <Button asChild size="lg" className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
            <Link href="/promote">
                <Share2 className="mr-2"/>
                Share on WhatsApp
            </Link>
        </Button>

     </Card>
);


export function AiAssistanceHub() {
    return (
        <div className="space-y-8">
            <AiComputeCreditsCard />
            <IntelligenceSuite />
            <PromoteAndEarnCard />
        </div>
    );
}
