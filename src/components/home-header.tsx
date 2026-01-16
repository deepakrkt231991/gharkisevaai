import { Button } from '@/components/ui/button';
import { Bell, ChevronDown, MapPin } from 'lucide-react';

export function HomeHeader() {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between bg-background/80 p-4 backdrop-blur-md">
      <div className="flex items-center gap-2">
        <MapPin className="h-6 w-6 text-primary" />
        <div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            Your Home / आपका घर <ChevronDown className="h-3 w-3" />
          </div>
          <p className="font-bold text-foreground">Hauz Khas, New Delhi</p>
        </div>
      </div>
      <Button variant="ghost" size="icon" className="relative">
        <Bell className="h-6 w-6" />
        <span className="absolute right-1 top-1 flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75"></span>
          <span className="relative inline-flex h-2 w-2 rounded-full bg-accent"></span>
        </span>
      </Button>
    </header>
  );
}
