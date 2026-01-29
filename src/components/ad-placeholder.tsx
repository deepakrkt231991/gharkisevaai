
import { Megaphone } from 'lucide-react';
import { Card } from './ui/card';

export const AdPlaceholder = ({ type = 'banner' }: { type?: 'banner' | 'box' }) => {
  const isBanner = type === 'banner';
  return (
    <Card className={`flex items-center justify-center bg-muted/50 border-dashed w-full ${isBanner ? 'h-24' : 'aspect-square'}`}>
      <div className="text-center text-muted-foreground">
        <Megaphone className="mx-auto h-8 w-8" />
        <p className="text-sm font-semibold mt-2">Advertisement</p>
        <p className="text-xs">Your ad unit here</p>
      </div>
    </Card>
  );
};
