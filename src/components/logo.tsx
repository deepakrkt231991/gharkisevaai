
import { cn } from '@/lib/utils';
import { Home } from 'lucide-react';

/**
 * A simplified version of the Ghar Ki Seva logo.
 * It uses a single, reliable icon to ensure it displays correctly.
 * We can add more details once this version is confirmed to be working.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center justify-center", className)}>
      <Home className="h-full w-full text-primary" />
    </div>
  );
}
