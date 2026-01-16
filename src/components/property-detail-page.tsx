'use client';

import Image from 'next/image';
import Link from 'next/link';
import { 
    ArrowLeft, 
    Heart, 
    Share2, 
    MapPin, 
    Diamond, 
    Scaling, 
    ParkingCircle, 
    MessageSquare, 
    Sparkles, 
    FileText,
    Waves,
    Dumbbell,
    ShieldCheck,
    BatteryCharging,
    TreePine
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

const StatCard = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: string }) => (
    <div className="glass-card flex flex-col items-center justify-center p-3 rounded-xl h-24 text-center">
        <Icon className="w-6 h-6 text-primary mb-1" />
        <p className="text-xs font-bold text-muted-foreground">{label}</p>
        <p className="text-sm font-extrabold text-white">{value}</p>
    </div>
);

const AmenityIcon = ({ icon: Icon, label }: { icon: React.ElementType, label: string }) => (
    <div className="flex flex-col items-center gap-2">
        <div className="w-12 h-12 rounded-full bg-card flex items-center justify-center">
            <Icon className="w-6 h-6 text-primary" />
        </div>
        <p className="text-xs text-muted-foreground">{label}</p>
    </div>
);

export function PropertyDetailPage() {

    return (
        <div className="flex-1">
            <header className="absolute top-0 left-0 w-full z-10 flex items-center justify-between p-4 bg-gradient-to-b from-black/50 to-transparent">
                <Button variant="ghost" size="icon" onClick={() => window.history.back()} className="bg-black/20 text-white">
                    <ArrowLeft />
                </Button>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="bg-black/20 text-white"><Heart /></Button>
                    <Button variant="ghost" size="icon" className="bg-black/20 text-white"><Share2 /></Button>
                </div>
            </header>

            <main>
                <div className="relative w-full aspect-[4/3]">
                    <Image 
                        src="https://picsum.photos/seed/villa-1/800/600"
                        alt="Serene Vista Villa"
                        fill
                        className="object-cover"
                        data-ai-hint="modern villa exterior"
                    />
                </div>
                
                <div className="bg-background rounded-t-3xl p-4 -mt-8 relative z-10 space-y-6 pb-24">
                    {/* Property Info */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-start">
                            <h1 className="text-3xl font-bold font-headline text-white">Serene Vista Villa</h1>
                            <Badge variant="outline" className="text-yellow-400 border-yellow-500/50 bg-yellow-900/30 font-bold mt-1">VERIFIED</Badge>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <MapPin size={16} />
                            <span>Jubilee Hills, Hyderabad</span>
                        </div>
                        <div className="flex items-baseline gap-2 pt-1">
                             <p className="text-4xl font-extrabold text-white">₹4.5 Cr</p>
                             <p className="text-muted-foreground font-medium">₹14,000 / sq.ft.</p>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-3">
                        <StatCard icon={Scaling} label="AREA" value="3,200 sqft" />
                        <StatCard icon={Diamond} label="VASTU" value="9.2 / 10" />
                        <StatCard icon={ParkingCircle} label="PARKING" value="2 Slots" />
                    </div>

                    {/* Actions */}
                    <div className="grid grid-cols-2 gap-3">
                        <Button variant="secondary" className="h-14 text-base" asChild>
                            <Link href="/chat/deal-123">
                                <MessageSquare className="mr-2"/> Chat Owner
                            </Link>
                        </Button>
                         <Button variant="default" className="h-14 text-base bg-primary" asChild>
                            <Link href="/legal-vault">
                                <Sparkles className="mr-2"/> AI Legal Help
                            </Link>
                        </Button>
                    </div>

                    {/* AI Legal Assistance */}
                    <Card className="glass-card p-4 space-y-3 bg-gradient-to-br from-primary/10 to-transparent border-primary/20">
                        <h3 className="font-bold font-headline text-white">AI Legal Assistance</h3>
                        <p className="text-sm text-muted-foreground">Instantly generate legally binding rent agreements or sale deeds specifically optimized for local Hyderabad jurisdiction.</p>
                        <Button variant="default" asChild className="w-full h-12 bg-white text-black hover:bg-gray-200">
                           <Link href="/legal-vault">
                                <FileText className="mr-2"/> Generate Agreement
                           </Link>
                        </Button>
                    </Card>
                    
                    {/* About Property */}
                    <div className="space-y-2">
                        <h3 className="text-xl font-bold font-headline text-white">About this property</h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            Designed by award-winning architects, this villa offers a seamless blend of indoor and outdoor living. Features include a double-height foyer, automated smart lighting, and a private infinity pool overlooking the valley.
                        </p>
                    </div>

                    {/* Amenities */}
                     <div className="space-y-3">
                        <h3 className="text-xl font-bold font-headline text-white">Amenities</h3>
                        <div className="flex justify-around pt-2">
                           <AmenityIcon icon={Waves} label="Pool"/>
                           <AmenityIcon icon={Dumbbell} label="Gym"/>
                           <AmenityIcon icon={ShieldCheck} label="24/7 Sec"/>
                           <AmenityIcon icon={BatteryCharging} label="EV Charge"/>
                           <AmenityIcon icon={TreePine} label="Garden"/>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}
