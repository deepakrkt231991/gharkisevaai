'use client';

import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import type { AppSettings } from '@/lib/entities';
import { Card, CardContent } from './ui/card';
import { Megaphone } from 'lucide-react';
import { Skeleton } from './ui/skeleton';

export function DynamicBanner() {
    const firestore = useFirestore();
    
    // Fetch the specific banner document.
    const bannerRef = useMemoFirebase(() => {
        if (!firestore) return null;
        return doc(firestore, 'app_settings', 'top_banner');
    }, [firestore]);
    
    const { data: banner, isLoading } = useDoc<AppSettings>(bannerRef);

    if (isLoading) {
        return <Skeleton className="h-20 w-full rounded-xl" />;
    }

    if (!banner || !banner.content) {
        return null; // Don't render anything if no banner content is set
    }

    // Default style if not provided
    const bgColor = banner.backgroundColor || '#FFD700'; // Gold color
    const contentLines = banner.content.split('\\n');

    return (
        <Card className="border-none text-black overflow-hidden rounded-xl shadow-lg" style={{ backgroundColor: bgColor }}>
            <CardContent className="p-3 flex items-center gap-3">
                 <div className="bg-black/10 p-2 rounded-lg">
                    <Megaphone className="h-5 w-5 text-black" />
                </div>
                <div>
                    {contentLines.map((line, index) => (
                         <p key={index} className="font-semibold" style={{ fontWeight: index === 0 ? 'bold' : 'normal', fontSize: index === 0 ? '0.9rem' : '0.8rem' }}>{line}</p>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

    