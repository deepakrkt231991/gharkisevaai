
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Book, History, User, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';

const navItems = [
  { href: '/', label: 'HOME', icon: Home },
  { href: '/find-a-worker', label: 'BOOK', icon: Book },
  { href: '/dashboard/earnings', label: 'HISTORY', icon: History },
  { href: '/profile', label: 'PROFILE', icon: User },
];

export function BottomNavBar() {
  const pathname = usePathname();

  return (
    <footer className="fixed bottom-0 left-1/2 w-full max-w-md -translate-x-1/2 bg-transparent z-50">
      <div className="relative h-24">
        {/* FAB */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10">
          <Button asChild size="icon" className="h-16 w-16 rounded-full bg-primary shadow-lg shadow-primary/30 border-4 border-background">
            <Link href="/ai-help">
              <Bot className="h-8 w-8" />
            </Link>
          </Button>
        </div>

        {/* Nav bar */}
        <div className="absolute bottom-0 w-full grid h-20 grid-cols-4 items-center justify-around border-t border-border bg-card/80 backdrop-blur-sm">
          {navItems.map((item, index) => {
            const isActive = pathname === item.href;
            // Add margin to items to the left and right of the center
            const marginClass = index === 1 ? 'mr-16' : index === 2 ? 'ml-16' : '';
            
            return (
              <Link
                href={item.href}
                key={item.label}
                className={cn(
                  "flex flex-col items-center gap-1 p-2 text-muted-foreground transition-colors hover:text-primary",
                  isActive && 'text-primary',
                  marginClass
                )}
              >
                <item.icon className="h-6 w-6" />
                <span className="text-[10px] font-bold tracking-wider">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </footer>
  );
}
