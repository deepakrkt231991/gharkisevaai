'use client';

import Link from 'next/link';
import { ArrowLeft, Phone, Plus, Send, Smile, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

// Mock data to represent the user from the screenshot
const worker = {
    name: 'Rajesh',
    profession: 'Plumber',
    avatar: 'https://images.unsplash.com/photo-1558611848-73f7eb4001a1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxtYWxlJTIwcGx1bWJlciUyMHBvcnRyYWl0fGVufDB8fHx8MTc2ODc0NjAwN3ww&ixlib=rb-4.1.0&q=80&w=1080',
    isOnline: true,
    rating: 5.0,
};

// Mock messages to represent the conversation from the screenshot
const initialMessages = [
    { id: 1, sender: 'worker', text: "Hello! I'm your assigned plumber. Could you please send a photo of the defect so I can bring the right parts?", time: '10:14 AM' },
    { id: 2, sender: 'user', text: "Sure, let me take a quick picture of the kitchen sink leak. It's pooling under the cabinet.", time: '10:15 AM' },
    { id: 3, sender: 'user', image: true, time: '10:15 AM' },
];

const AiSuggestions = () => (
    <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
        <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary flex-shrink-0" />
            <p className="text-sm font-bold text-white flex-shrink-0">AI</p>
        </div>
        <Button variant="secondary" size="sm" className="rounded-full bg-card h-8 whitespace-nowrap">When will you arrive?</Button>
        <Button variant="secondary" size="sm" className="rounded-full bg-card h-8 whitespace-nowrap">Is the price fixed?</Button>
        <Button variant="secondary" size="sm" className="rounded-full bg-card h-8 whitespace-nowrap">I'll send a photo</Button>
    </div>
);

export function ChatInterface({ chatId }: { chatId: string }) {
    // In a real app, you would use `chatId` to fetch conversation data
    // For example:
    // const { data: messages, isLoading } = useCollection(`/jobs/${chatId}/messages`);
    // const { data: job } = useDoc(`/jobs/${chatId}`);
    // const { data: otherUser } = useDoc(job ? `/users/${job.workerId}` : null);
    
    return (
        <div className="flex flex-col h-full bg-background text-white">
            {/* Header */}
            <header className="sticky top-0 z-10 flex items-center justify-between p-4 bg-background/80 backdrop-blur-md border-b border-border">
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" className="-ml-2" asChild>
                        <Link href="/find-a-worker"><ArrowLeft/></Link>
                    </Button>
                    <Avatar>
                        <AvatarImage src={worker.avatar} />
                        <AvatarFallback>{worker.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <h2 className="font-bold text-white">{worker.name} - {worker.profession}</h2>
                        <div className="flex items-center gap-1.5">
                            <Badge variant="outline" className={cn("border-none px-0", worker.isOnline ? "text-green-400" : "text-muted-foreground")}>
                                {worker.isOnline ? 'ONLINE' : 'OFFLINE'}
                            </Badge>
                            <span className="text-muted-foreground text-xs">•</span>
                             <p className="text-xs text-muted-foreground">{worker.rating.toFixed(1)} Rating</p>
                        </div>
                    </div>
                </div>
                <Button variant="ghost" size="icon">
                    <Phone className="w-6 h-6 text-white"/>
                </Button>
            </header>

            {/* Chat Body */}
            <main className="flex-1 overflow-y-auto p-4 space-y-6">
                <div className="text-center text-xs text-muted-foreground font-medium">TODAY</div>
                {initialMessages.map((msg) => (
                    <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                        {msg.sender === 'worker' && <p className="text-sm text-muted-foreground mb-1">{worker.name}</p>}
                        <div className={`max-w-xs lg:max-w-md p-3 rounded-2xl ${msg.sender === 'user' ? 'bg-primary text-white rounded-br-none' : 'bg-card rounded-bl-none'}`}>
                           {msg.image ? (
                               // This is a placeholder for the image sent by the user
                               <div className="h-40 w-40 bg-card/50 rounded-lg border border-border"></div>
                           ) : (
                               <p>{msg.text}</p>
                           )}
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-1 px-1">{msg.time}</p>
                    </div>
                ))}
            </main>

            {/* Footer with Smart Buttons */}
            <footer className="sticky bottom-0 z-10 p-4 bg-background/80 backdrop-blur-md border-t border-border space-y-3">
                 <AiSuggestions />
                 <div className="flex items-center gap-2">
                    <Button size="icon" variant="secondary" className="rounded-full h-12 w-12 bg-card">
                        <Plus className="w-6 h-6"/>
                    </Button>
                    <div className="relative flex-1">
                        <Input placeholder="Type a message..." className="pr-12 bg-card h-12 rounded-full"/>
                        <Button size="icon" variant="ghost" className="absolute right-1 top-1/2 -translate-y-1/2 h-10 w-10">
                            <Smile className="w-6 h-6 text-muted-foreground"/>
                        </Button>
                    </div>
                     <Button size="icon" variant="default" className="rounded-full h-12 w-12 bg-primary">
                        <Send className="w-6 h-6"/>
                    </Button>
                 </div>
            </footer>
        </div>
    );
}
