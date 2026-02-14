
'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { ArrowLeft, Search, SlidersHorizontal, Wrench, Zap, Paintbrush, AirVent, Tv, Refrigerator, WashingMachine, Thermometer, Droplets, Star, TrendingUp, IndianRupee, Loader2, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ProfessionalCard, ProfessionalCardSkeleton } from '@/components/professional-card';
import { BottomNavBar } from '@/components/bottom-nav-bar';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where, orderBy } from 'firebase/firestore';
import type { Worker } from '@/lib/entities';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger, DrawerFooter, DrawerClose } from '@/components/ui/drawer';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { useGeolocation } from '@/hooks/use-geolocation';
import { calculateDistance } from '@/lib/geo-helpers';


const categories = [
  { name: 'All', icon: Wrench, skill: 'all' },
  { name: 'Plumber', icon: Wrench, skill: 'plumber' },
  { name: 'Electrician', icon: Zap, skill: 'electrician' },
  { name: 'Painter', icon: Paintbrush, skill: 'painter' },
  { name: 'AC Repair', icon: AirVent, skill: 'ac_repair' },
  { name: 'TV Repair', icon: Tv, skill: 'tv_repair' },
  { name: 'Fridge', icon: Refrigerator, skill: 'fridge_repair' },
  { name: 'Washing Machine', icon: WashingMachine, skill: 'washing_machine_repair' },
  { name: 'Geyser', icon: Thermometer, skill: 'geyser' },
  { name: 'RO Purifier', icon: Droplets, skill: 'ro_purifier' },
];

function FindWorkerHeader({ searchTerm, setSearchTerm }: { searchTerm: string; setSearchTerm: (term: string) => void; }) {
    return (
        <div className="sticky top-0 z-10 flex flex-col gap-4 bg-background/80 p-4 backdrop-blur-md">
            <div className="flex items-center justify-between">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/"><ArrowLeft /></Link>
                </Button>
                <h1 className="text-xl font-bold font-headline">Find a Professional</h1>
                <DrawerTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <SlidersHorizontal />
                    </Button>
                </DrawerTrigger>
            </div>
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Search by skill or city..."
                    className="w-full rounded-full bg-input pl-10 h-12"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
        </div>
    );
}

export default function FindWorkerPage() {
    const firestore = useFirestore();
    const [activeCategory, setActiveCategory] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('rating');
    const [filters, setFilters] = useState({
        minRating: false,
        isExperienced: false
    });
    const { latitude: userLat, longitude: userLon } = useGeolocation();

    const workersQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        let q = query(collection(firestore, 'workers'), where('isVerified', '==', true));
        
        const activeSkill = categories.find(c => c.name === activeCategory)?.skill;
        if (activeCategory !== 'All' && activeSkill) {
            q = query(q, where('skills', 'array-contains', activeSkill));
        }

        return q;
    }, [firestore, activeCategory]);
    
    const { data: workers, isLoading } = useCollection<Worker>(workersQuery);

    const filteredAndSortedWorkers = useMemo(() => {
        if (!workers) return [];

        let processedData = workers.map(worker => {
            let distance: number | null = null;
            if (userLat && userLon && worker.location?.latitude && worker.location?.longitude) {
                distance = calculateDistance(userLat, userLon, worker.location.latitude, worker.location.longitude);
            }
            return { worker, distance };
        });

        let filtered = processedData.filter(({ worker }) => {
            const searchMatch = searchTerm === '' || 
                                worker.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                worker.skills?.some(s => s.toLowerCase().includes(searchTerm.toLowerCase())) ||
                                (worker as any).location?.city?.toLowerCase().includes(searchTerm.toLowerCase());

            const ratingMatch = !filters.minRating || (worker.rating || 0) >= 4.0;
            const experienceMatch = !filters.isExperienced || (worker.successfulOrders || 0) >= 50;
            return searchMatch && ratingMatch && experienceMatch;
        });
        
        if (sortBy === 'near_me') {
            filtered.sort((a, b) => {
                if (a.distance === null) return 1;
                if (b.distance === null) return -1;
                return a.distance - b.distance;
            });
        } else if (sortBy === 'price_low_high') {
             filtered.sort((a, b) => ((a.worker as any).startingPrice || 999) - ((b.worker as any).startingPrice || 999));
        } else if (sortBy === 'rating') {
            filtered.sort((a, b) => (b.worker.rating || 0) - (a.worker.rating || 0));
        } else if (sortBy === 'experience') {
            filtered.sort((a, b) => (b.worker.successfulOrders || 0) - (a.worker.successfulOrders || 0));
        }

        return filtered;
    }, [workers, searchTerm, sortBy, filters, userLat, userLon]);

    return (
        <Drawer>
            <div className="dark bg-background text-foreground">
                <div className="relative mx-auto flex min-h-screen w-full max-w-md flex-col">
                    <FindWorkerHeader searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                    
                    <main className="flex-1 space-y-6 overflow-y-auto p-4 pb-32">
                        <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4">
                            {categories.map(({ name, icon: Icon }) => (
                                <Button
                                    key={name}
                                    variant={activeCategory === name ? 'default' : 'secondary'}
                                    onClick={() => setActiveCategory(name)}
                                    className="rounded-full h-10 whitespace-nowrap flex-shrink-0"
                                >
                                    <Icon size={16} className="mr-2"/> {name}
                                </Button>
                            ))}
                        </div>
                        
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold font-headline text-white">{!isLoading ? `${filteredAndSortedWorkers.length} Professionals Found` : 'Finding Professionals...'}</h2>
                            </div>
                            {isLoading ? (
                                <div className="space-y-4">
                                    {[...Array(3)].map((_, i) => <ProfessionalCardSkeleton key={i} />)}
                                </div>
                            ) : filteredAndSortedWorkers.length > 0 ? (
                                <div className="space-y-4">
                                    {filteredAndSortedWorkers.map(({ worker, distance }) => (
                                        <ProfessionalCard key={worker.id} worker={worker} distance={distance} />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-16 text-muted-foreground">
                                    <Wrench className="mx-auto h-12 w-12" />
                                    <h3 className="mt-4 text-lg font-semibold">No workers found in your area yet</h3>
                                    <p className="mt-1 text-sm">We are expanding our network. Please check back soon or try a different location.</p>
                                </div>
                            )}
                        </div>
                    </main>
                    
                    <BottomNavBar />
                </div>
            </div>

            <DrawerContent>
                <div className="mx-auto w-full max-w-sm">
                    <DrawerHeader>
                        <DrawerTitle>Filter & Sort</DrawerTitle>
                    </DrawerHeader>
                    <div className="p-4 space-y-6">
                        <div className="space-y-3">
                            <Label>Sort By</Label>
                            <RadioGroup value={sortBy} onValueChange={setSortBy}>
                                 <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="near_me" id="r-near" disabled={!userLat} />
                                    <Label htmlFor="r-near" className="flex items-center gap-2"><MapPin/> Near Me</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="rating" id="r-rating" />
                                    <Label htmlFor="r-rating" className="flex items-center gap-2"><Star/> Top Rated</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="experience" id="r-exp" />
                                    <Label htmlFor="r-exp" className="flex items-center gap-2"><TrendingUp /> Most Experienced</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="price_low_high" id="r-price" />
                                    <Label htmlFor="r-price" className="flex items-center gap-2"><IndianRupee /> Price: Low to High</Label>
                                </div>
                            </RadioGroup>
                        </div>
                         <div className="space-y-3">
                            <Label>Filter By</Label>
                             <div className="flex items-center space-x-2">
                                <Switch id="f-rating" checked={filters.minRating} onCheckedChange={(checked) => setFilters(p => ({...p, minRating: checked as boolean}))} />
                                <Label htmlFor="f-rating">Rating 4.0+</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Switch id="f-exp" checked={filters.isExperienced} onCheckedChange={(checked) => setFilters(p => ({...p, isExperienced: checked as boolean}))} />
                                <Label htmlFor="f-exp">Experienced (50+ Jobs)</Label>
                            </div>
                        </div>
                    </div>
                    <DrawerFooter>
                        <DrawerClose asChild>
                            <Button>Apply Filters</Button>
                        </DrawerClose>
                         <DrawerClose asChild>
                            <Button variant="outline">Close</Button>
                        </DrawerClose>
                    </DrawerFooter>
                </div>
            </DrawerContent>
        </Drawer>
    );
}
