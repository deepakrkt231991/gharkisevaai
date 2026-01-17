
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ShoppingBag, History, User, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'HOME', icon: Home },
  { href: '/book-service', label: 'BOOK', icon: ShoppingBag },
  // Placeholder for the central button
  { href: '#', label: 'AI', icon: 'AI_PLACEHOLDER' },
  { href: '/dashboard/earnings', label: 'HISTORY', icon: History },
  { href: '/profile', label: 'PROFILE', icon: User },
];

export function BottomNavBar() {
  const pathname = usePathname();

  return (
    <footer className="fixed bottom-0 left-1/2 w-full max-w-md -translate-x-1/2 z-50">
        <div className="relative grid h-20 grid-cols-5 items-center justify-around border-t border-border bg-card/80 backdrop-blur-sm">
            {navItems.map((item) => {
                if (item.label === 'AI') {
                    // Render the central button
                    return (
                         <div key={item.label} className="relative -top-8 flex justify-center">
                            <Link href="/analyze" className="flex h-20 w-20 items-center justify-center rounded-full bg-primary shadow-lg shadow-primary/30 ring-8 ring-background transition-transform active:scale-90">
                               <Bot className="h-10 w-10 text-white" />
                            </Link>
                        </div>
                    );
                }

                const Icon = item.icon as React.ElementType;
                const isActive = pathname === item.href;
                return (
                    <Link
                        href={item.href}
                        key={item.label}
                        className={cn(
                            "flex flex-col items-center gap-1 p-2 text-muted-foreground transition-colors hover:text-primary",
                            isActive && 'text-primary'
                        )}
                    >
                        <Icon className="h-6 w-6" />
                        <span className="text-[10px] font-bold tracking-wider">{item.label}</span>
                    </Link>
                );
            })}
        </div>
    </footer>
  );
}
