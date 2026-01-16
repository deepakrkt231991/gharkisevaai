
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, Compass, Scale, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/explore', label: 'Search', icon: Search },
  { href: '/explore', label: 'Explore', icon: Compass },
  { href: '/legal-vault', label: 'Legal AI', icon: Scale },
  { href: '/profile', label: 'Profile', icon: User },
];

export function BottomNavBar() {
  const pathname = usePathname();

  return (
    <footer className="fixed bottom-0 left-1/2 w-full max-w-md -translate-x-1/2 bg-transparent z-10">
      <div className="grid h-20 grid-cols-5 items-center justify-around border-t border-border bg-card/80 backdrop-blur-sm">
        {navItems.map((item) => {
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
              <item.icon className="h-6 w-6" />
              <span className="text-[10px] font-bold tracking-wider">{item.label.toUpperCase()}</span>
            </Link>
          );
        })}
      </div>
    </footer>
  );
}

    