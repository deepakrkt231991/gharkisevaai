
import { Card, CardContent } from './ui/card';
import Link from 'next/link';
import { Sofa, Compass, Wrench, ScanSearch } from 'lucide-react';
import { cn } from '@/lib/utils';

export function SmartHub() {
    return (
        <div className="space-y-4">
            <h3 className="text-xl font-bold font-headline">Smart Hub / स्मार्ट हब</h3>
            <div className="grid grid-cols-2 gap-4">
                 <Link href="/analyze" className="block">
                     <Card className={cn("bg-card/70 backdrop-blur-sm border-border text-center hover:border-primary transition-all h-full")}>
                        <CardContent className="p-4 flex flex-col items-center justify-center gap-2">
                            <ScanSearch className="h-8 w-8 text-primary" />
                            <h4 className="font-bold font-headline">AI Defect Analysis</h4>
                            <p className="text-xs text-muted-foreground">फोटो से खराबी जानें</p>
                        </CardContent>
                    </Card>
                 </Link>
                <Link href="/rent-tools" className="block">
                    <Card className={cn("bg-card/70 backdrop-blur-sm border-border text-center hover:border-primary transition-all h-full")}>
                        <CardContent className="p-4 flex flex-col items-center justify-center gap-2">
                            <Wrench className="h-8 w-8 text-primary" />
                            <h4 className="font-bold font-headline">Rent Tools</h4>
                            <p className="text-xs text-muted-foreground">टूल किराए पर लें</p>
                        </CardContent>
                    </Card>
                </Link>
                <Link href="/interior-analysis" className="block">
                    <Card className={cn("bg-card/70 backdrop-blur-sm border-border text-center hover:border-primary transition-all h-full")}>
                        <CardContent className="p-4 flex flex-col items-center justify-center gap-2">
                             <Sofa className="h-8 w-8 text-primary" />
                            <h4 className="font-bold font-headline">AI Room Designer</h4>
                            <p className="text-xs text-muted-foreground">कमरे का डिज़ाइन बदलें</p>
                        </CardContent>
                    </Card>
                </Link>
                <Link href="/interior-analysis" className="block">
                    <Card className={cn("bg-card/70 backdrop-blur-sm border-border text-center hover:border-primary transition-all h-full")}>
                        <CardContent className="p-4 flex flex-col items-center justify-center gap-2">
                             <Compass className="h-8 w-8 text-primary" />
                            <h4 className="font-bold font-headline">AI Home Vastu</h4>
                            <p className="text-xs text-muted-foreground">घर का वास्तु जांचें</p>
                        </CardContent>
                    </Card>
                </Link>
            </div>
        </div>
    )
}
