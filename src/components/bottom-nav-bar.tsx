"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ShoppingBag, History, User, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export function BottomNavBar() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/book-service', label: 'Book', icon: ShoppingBag },
    { isCentral: true, href: '/ai-help', label: 'AI', icon: Sparkles },
    { href: '/dashboard/earnings', label: 'History', icon: History },
    { href: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <footer className="fixed bottom-0 left-1/2 w-full max-w-md -translate-x-1/2 z-50">
        <div className="grid h-20 grid-cols-5 items-center border-t border-border bg-card/80 backdrop-blur-sm">
            {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                if (item.isCentral) {
                  return (
                    <div key={item.label} className="flex justify-center items-center">
                       <Link
                          href={item.href}
                          className="bg-primary text-white rounded-full size-16 flex items-center justify-center border-4 border-background shadow-lg -translate-y-4"
                        >
                          <Icon className="size-8" />
                        </Link>
                    </div>
                  );
                }

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
                        <span className="text-[10px] font-bold tracking-wider uppercase">{item.label}</span>
                    </Link>
                );
            })}
        </div>
    </footer>
  );
}
