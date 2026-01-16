"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Wrench, MessageSquare, User, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/find-a-worker', label: 'Services', icon: Wrench },
  { href: '/messages', label: 'Messages', icon: MessageSquare },
  { href: '/profile', label: 'Profile', icon: User },
];

export function BottomNavBar() {
  const pathname = usePathname();

  return (
    <footer className="fixed bottom-0 left-1/2 w-full max-w-md -translate-x-1/2">
      <div className="relative h-24">
        {/* Central Floating Action Button */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20">
          <Button asChild className="h-16 w-16 rounded-full bg-primary shadow-lg shadow-primary/40">
             <Link href="/list-tool" className="flex flex-col items-center">
                <Plus className="h-8 w-8"/>
             </Link>
          </Button>
          <p className="text-center text-xs font-bold text-white mt-1">LIST TOOL</p>
        </div>
        
        {/* Navigation Bar */}
        <div className="absolute bottom-0 grid h-20 w-full grid-cols-4 items-center justify-around border-t border-border bg-card/80 backdrop-blur-sm">
          {navItems.map((item, index) => {
            const isActive = pathname === item.href;
            const isFiller = index === 1 || index === 2; // Create space around the central button
            const itemClass = isFiller ? (index === 1 ? 'mr-12' : 'ml-12') : '';

            return (
              <Link
                href={item.href}
                key={item.label}
                className={cn(
                  "flex flex-col items-center gap-1 p-2 text-muted-foreground transition-colors hover:text-primary",
                  isActive && 'text-primary',
                  itemClass
                )}
              >
                <item.icon className="h-6 w-6" />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </footer>
  );
}
