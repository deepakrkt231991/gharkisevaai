
import { Card, CardContent } from './ui/card';
import Link from 'next/link';
import { ArrowRight, Bot, Camera, Wrench } from 'lucide-react';
import { cn } from '@/lib/utils';
// A temporary microscope icon as a placeholder
const MicroscopeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-primary"><path d="M6 18h8"/><path d="M3 22h18"/><path d="M14 22a7 7 0 1 0 0-14h-1"/><path d="M9 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/><path d="M9 6.8A6 6 0 0 1 15 6a6 6 0 0 1 6 6v2"/></svg>
)

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
                            <MicroscopeIcon />
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
                                 <Bot className="h-8 w-8 text-primary" />
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
