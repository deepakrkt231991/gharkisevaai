'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Video, Shield, Clock, Send, Paperclip, FileText, CheckCircle, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

const partner = {
    name: 'Ramesh Patel',
    avatar: 'https://i.pravatar.cc/150?u=seller',
    isOnline: true,
};

const messages = [
    { id: 1, sender: 'other', text: 'Hello, I have accepted the deal for the AC.' },
    { id: 2, sender: 'me', text: 'Great! Payment has been made. The amount is now in GrihSeva escrow.' },
    { id: 3, sender: 'other', text: 'Perfect. I will deliver it by tomorrow evening.' },
];


export function ChatInterface({ chatId }: { chatId: string }) {
    const { toast } = useToast();
    const [timeLeft, setTimeLeft] = useState(24 * 60 * 60 - 300); // 23:55:00

    useEffect(() => {
        if (timeLeft <= 0) return;

        const timer = setInterval(() => {
            setTimeLeft(prevTime => prevTime - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
        const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${h}:${m}:${s}`;
    };
    
    const handleGenerateAgreement = () => {
        toast({
            title: "🚀 Generating Agreement...",
            description: "AI is fetching verified data and creating the legal document.",
            className: "bg-primary text-white"
        });
        setTimeout(() => {
             toast({
                title: "✅ Agreement Generated!",
                description: "Saved to your Legal Vault and shared in chat.",
                 className: "bg-green-600 text-white border-green-600"
            });
        }, 2500);
    };

    const handleConfirmDelivery = () => {
         toast({
            title: "Confirming Delivery...",
            description: "Releasing payment from escrow and triggering referral split.",
            className: "bg-primary text-white"
        });
    }

    return (
        <div className="flex flex-col h-full bg-card">
            {/* Header with Timer */}
            <header className="sticky top-0 z-10 flex flex-col gap-2 p-4 bg-background/80 backdrop-blur-md border-b border-border">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="icon" className="-ml-2" asChild>
                            <Link href="/"><ArrowLeft/></Link>
                        </Button>
                        <Avatar>
                            <AvatarImage src={partner.avatar} />
                            <AvatarFallback>{partner.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <h2 className="font-bold text-white">{partner.name}</h2>
                            <p className="text-xs text-green-400">{partner.isOnline ? 'Online' : 'Offline'}</p>
                        </div>
                    </div>
                </div>
                 <div className="bg-primary/10 border border-primary/30 p-2 rounded-lg flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <Clock className="text-primary w-5 h-5"/>
                        <div>
                            <p className="text-xs text-primary font-bold">WAITING TIMER</p>
                            <p className="font-mono font-bold text-lg text-white">{formatTime(timeLeft)}</p>
                        </div>
                    </div>
                    {timeLeft <=0 && (
                        <Button variant="destructive" size="sm">
                             <AlertTriangle className="mr-2 h-4 w-4"/>
                            Instant Refund
                        </Button>
                    )}
                 </div>
            </header>

            {/* Chat Body */}
            <main className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs lg:max-w-md p-3 rounded-2xl ${msg.sender === 'me' ? 'bg-primary text-white rounded-br-none' : 'bg-secondary text-white rounded-bl-none'}`}>
                            <p>{msg.text}</p>
                        </div>
                    </div>
                ))}
                 {/* AI Generated Agreement Card */}
                 <div className="flex justify-center">
                    <div className="w-full max-w-sm p-3 rounded-lg bg-black/30 border border-border text-center space-y-2">
                        <Shield className="mx-auto text-green-400" />
                        <h4 className="font-bold text-white">Legal Agreement Generated</h4>
                        <p className="text-xs text-muted-foreground">The deal is now legally binding.</p>
                        <Button variant="link" className="text-primary" asChild>
                            <Link href="/legal-document">View Here</Link>
                        </Button>
                    </div>
                 </div>
            </main>

            {/* Footer with Smart Buttons */}
            <footer className="sticky bottom-0 z-10 p-4 bg-background/80 backdrop-blur-md border-t border-border space-y-3">
                 <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" className="bg-transparent" onClick={handleGenerateAgreement}>
                        <FileText className="mr-2"/> Generate Agreement
                    </Button>
                     <Button variant="outline" className="bg-transparent">
                        <Video className="mr-2"/> Request Live Video
                    </Button>
                 </div>
                 <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                        <Input placeholder="Type your message..." className="pr-12"/>
                        <Button size="icon" variant="ghost" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8">
                            <Paperclip className="w-5 h-5"/>
                        </Button>
                    </div>
                    <Button className="bg-accent text-accent-foreground flex-1" onClick={handleConfirmDelivery}>
                        <CheckCircle className="mr-2"/> Confirm Delivery
                    </Button>
                 </div>
            </footer>
        </div>
    );
}
