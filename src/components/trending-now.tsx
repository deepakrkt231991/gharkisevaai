import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { cn } from '@/lib/utils';

const trendingItems = [
    {
        id: 'ac-servicing',
        title: 'Smart AC Servicing',
        subtitle: 'Curated by AI',
        imageUrl: 'https://picsum.photos/seed/ac_unit/400/600',
        imageHint: 'air conditioner',
        badge: 'Smart Check',
        badgeClass: 'bg-blue-500 text-white',
        bgColor: 'bg-sky-900/50'
    },
    {
        id: 'deep-cleaning',
        title: 'Deep Cleaning / सफाई',
        subtitle: 'Top Rated',
        imageUrl: 'https://picsum.photos/seed/cleaning/400/600',
        imageHint: 'cleaning supplies',
        badge: 'Premium',
        badgeClass: 'bg-yellow-400 text-black',
        bgColor: 'bg-yellow-900/50'
    }
]

export function TrendingNow() {
    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold font-headline">Trending Now / ट्रेंडिंग</h3>
                <Link href="#" className="text-sm font-bold text-primary">VIEW ALL</Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
                {trendingItems.map((item) => (
                    <Link href="#" key={item.id}>
                        <Card className={cn("relative h-48 w-full overflow-hidden rounded-xl group", item.bgColor)}>
                             <Image
                                src={item.imageUrl}
                                alt={item.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                data-ai-hint={item.imageHint}
                            />
                             <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent p-3 flex flex-col justify-end">
                                 <Badge className={cn("w-fit mb-2 backdrop-blur-sm", item.badgeClass)}>{item.badge}</Badge>
                                 <h4 className="font-bold text-white">{item.title}</h4>
                                <p className="text-xs text-white/80">{item.subtitle}</p>
                             </div>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    )
}
