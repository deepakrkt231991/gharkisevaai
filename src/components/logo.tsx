
import Image from 'next/image';
import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("relative", className)}>
      <Image
        src="/logo.png"
        alt="Ghar Ki Seva AI Logo"
        fill
        sizes="(max-width: 768px) 10vw, 5vw"
        className="object-contain"
        priority
      />
    </div>
  );
}
