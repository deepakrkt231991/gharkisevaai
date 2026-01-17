
'use client';
import { useUser } from '@/firebase';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Bell, Shield } from 'lucide-react';
import Link from 'next/link';

export function MarketplaceHeader() {
    const { user } = useUser();
    return (
        <header className="sticky top-0 z-50 flex items-center justify-between bg-background/80 p-4 backdrop-blur-md">
            <Link href="/" className="flex items-center gap-2 font-bold text-lg font-headline">
                <div className="bg-primary/10 p-2 rounded-full">
                    <Shield className="h-5 w-5 text-primary" />
                </div>
                <span className='text-white'>GrihSeva AI</span>
            </Link>
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-6 w-6 text-white" />
                    <span className="absolute right-1 top-1 flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75"></span>
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-accent"></span>
                    </span>
                </Button>
                <Avatar className="h-9 w-9">
                    <AvatarImage src={user?.photoURL || "https://i.pravatar.cc/150"} />
                    <AvatarFallback>{user?.displayName?.charAt(0) || 'U'}</AvatarFallback>
                </Avatar>
            </div>
        </header>
    );
}

    