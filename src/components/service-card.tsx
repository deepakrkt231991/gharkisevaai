import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export type Service = {
  icon: LucideIcon;
  label: string;
  color: string;
  bgColor: string;
};

export function ServiceCard({ icon: Icon, label, color, bgColor }: Service) {
  return (
    <div className="flex flex-col items-center text-center gap-3 group">
      <div className={cn("rounded-full p-4 transition-all duration-300 group-hover:scale-110", bgColor)}>
        <Icon className={cn("h-8 w-8", color)} />
      </div>
      <p className="font-semibold text-sm text-foreground">{label}</p>
    </div>
  );
}
