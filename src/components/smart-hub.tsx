
import { Card, CardContent } from './ui/card';
import Link from 'next/link';
import { Sofa, Camera, Wrench, ScanSearch } from 'lucide-react';
import { cn } from '@/lib/utils';

export function SmartHub() {
    return (
        <div className="space-y-4">
            <h3 className="text-xl font-bold font-headline">Smart Hub / स्मार्ट हब</h3>
            <div className="space-y-4">
                 <Link href="/analyze" className="block">
                     <Card className={cn("bg-card/70 backdrop-blur-sm border-border hover:border-primary transition-all")}>
                        <CardContent className="p-4 flex items-center justify-between">
                            <div className="space-y-1">
                                <h4 className="font-bold text-lg font-headline">AI Defect Analysis</h4>
                                <p className="text-sm text-muted-foreground">Identify cracks, leaks, or electrical faults.</p>
                                <div className="flex items-center gap-2 font-bold text-primary pt-2">
                                    <span>Launch Scanner / शुरू करें</span>
                                    <Camera className="h-4 w-4"/>
                                </div>
                            </div>
                            <ScanSearch className="h-8 w-8 text-primary" />
                        </CardContent>
                    </Card>
                 </Link>
                 <div className="grid grid-cols-2 gap-4">
                    <Link href="/rent-tools" className="block">
                        <Card className={cn("bg-card/70 backdrop-blur-sm border-border text-center hover:border-primary transition-all")}>
                            <CardContent className="p-4 flex flex-col items-center justify-center gap-2 h-full">
                                <Wrench className="h-8 w-8 text-primary" />
                                <h4 className="font-bold font-headline">Rent Tools</h4>
                                <p className="text-xs text-muted-foreground">टूल किराए पर लें</p>
                            </CardContent>
                        </Card>
                    </Link>
                     <Link href="/interior-analysis" className="block">
                        <Card className={cn("bg-card/70 backdrop-blur-sm border-border text-center hover:border-primary transition-all")}>
                            <CardContent className="p-4 flex flex-col items-center justify-center gap-2 h-full">
                                 <Sofa className="h-8 w-8 text-primary" />
                                <h4 className="font-bold font-headline">AI Interior</h4>
                                <p className="text-xs text-muted-foreground">डिजाइन स्टूडियो</p>
                            </CardContent>
                        </Card>
                    </Link>
                 </div>
            </div>
        </div>
    )
}
