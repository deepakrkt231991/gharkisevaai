
import { cn } from '@/lib/utils';
import { Home, Wrench, Hammer } from 'lucide-react';

/**
 * Renders the Ghar Ki Seva logo by combining several icons.
 * This approach ensures the logo is always available without needing a separate image file.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("relative h-9 w-9", className)}>
      <Home className="absolute inset-0 h-full w-full text-primary" strokeWidth={1.5}/>
      <div className="absolute inset-0 flex items-center justify-center -mt-3 transform scale-75">
        <Wrench className="h-5 w-5 text-foreground -rotate-45" strokeWidth={2.5} />
        <Hammer className="h-5 w-5 text-foreground rotate-45" strokeWidth={2.5} />
      </div>
    </div>
  );
}
