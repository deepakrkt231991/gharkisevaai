'use client';
import { useUser } from '@/firebase';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Bell } from 'lucide-react';
import { AiAssistanceHub } from '@/components/ai-help-hub';
import { BottomNavBar } from '@/components/bottom-nav-bar';

function AiHubHeader() {
    const { user } = useUser();
    return (
        <header className="sticky top-0 z-50 flex items-center justify-between bg-background/80 p-4 backdrop-blur-md">
            <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                    <AvatarImage src={user?.photoURL || "https://i.pravatar.cc/150"} />
                    <AvatarFallback>{user?.displayName?.charAt(0) || 'U'}</AvatarFallback>
                </Avatar>
                <div>
                    <p className="text-xs text-primary font-bold">GRIHSEVA AI</p>
                    <h1 className="font-headline text-xl font-bold tracking-tight text-white">AI Assistance Hub</h1>
                </div>
            </div>
             <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-6 w-6 text-white" />
                <span className="absolute right-1 top-1 flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75"></span>
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-accent"></span>
                </span>
            </Button>
        </header>
    );
}

export default function AiHelpPage() {
  return (
    <div className="dark bg-background text-foreground">
      <div className="relative mx-auto flex min-h-screen w-full max-w-md flex-col">
        <AiHubHeader />
        <main className="flex-1 space-y-8 overflow-y-auto p-4 pb-32">
          <AiAssistanceHub />
        </main>
        <BottomNavBar />
      </div>
    </div>
  );
}
