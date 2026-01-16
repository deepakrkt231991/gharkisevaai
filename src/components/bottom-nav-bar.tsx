"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Bot, IndianRupee, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/ai-help', label: 'AI Design', icon: Bot },
  { href: '/dashboard/earnings', label: 'Earnings', icon: IndianRupee },
  { href: '/profile', label: 'Profile', icon: User },
];

export function BottomNavBar() {
  const pathname = usePathname();

  return (
    <footer className="fixed bottom-0 left-1/2 h-20 w-full max-w-md -translate-x-1/2 border-t border-border bg-card/80 backdrop-blur-sm">
      <div className="grid h-full grid-cols-4 items-center justify-around">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link href={item.href} key={item.label} className={cn("flex flex-col items-center gap-1 p-2 text-muted-foreground transition-colors hover:text-primary", isActive && 'text-primary')}>
              <item.icon className="h-6 w-6" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </footer>
  );
}
