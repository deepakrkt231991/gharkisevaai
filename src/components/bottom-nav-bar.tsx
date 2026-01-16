"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Book, History, User, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/bookings', label: 'Book', icon: Book },
  { href: '/history', label: 'History', icon: History },
  { href: '/profile', label: 'Profile', icon: User },
];

export function BottomNavBar() {
  const pathname = usePathname();

  return (
    <footer className="fixed bottom-0 left-1/2 h-24 w-full max-w-md -translate-x-1/2 border-t border-border bg-card/80 backdrop-blur-sm">
      <div className="relative flex h-full items-center justify-around">
        {navItems.map((item, index) => {
          const isActive = pathname === item.href;
          // Add margin to items to create space for the central FAB
          const marginClass = index === 1 ? 'mr-10' : index === 2 ? 'ml-10' : '';
          return (
            <Link href={item.href} key={item.label} className={cn("flex flex-col items-center gap-1 p-2 text-muted-foreground transition-colors hover:text-primary", marginClass, isActive && 'text-primary')}>
              <item.icon className="h-6 w-6" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
      {/* Central Floating Action Button */}
      <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
        <Link href="/ai-help" className="flex h-16 w-16 items-center justify-center rounded-full bg-primary shadow-lg shadow-primary/30 ring-4 ring-background transition-transform hover:scale-105">
          <Bot className="h-8 w-8 text-primary-foreground" />
        </Link>
      </div>
    </footer>
  );
}
