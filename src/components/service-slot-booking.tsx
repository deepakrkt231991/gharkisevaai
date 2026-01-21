'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, MoreVertical, Star, Sun, Moon, MapPin, Sparkles, IndianRupee, Info, ArrowRight, Search, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Badge } from './ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';


const dates = [
  { day: 'TODAY', date: 12, dayOfWeek: 'THU' },
  { day: 'TOMORROW', date: 13, dayOfWeek: 'FRI' },
  { day: '14', date: 14, dayOfWeek: 'SAT' },
  { day: '15', date: 15, dayOfWeek: 'SUN' },
  { day: '16', date: 16, dayOfWeek: 'MON' },
];

const timeSlots = {
  morning: ['09:00 AM', '10:30 AM', '11:30 AM'],
  afternoon: ['01:00 PM', '03:00 PM', '04:30 PM'],
  evening: ['06:00 PM', '07:30 PM'],
};

export function ServiceSlotBooking() {
  const [selectedDate, setSelectedDate] = useState(12);
  const [selectedTime, setSelectedTime] = useState('09:00 AM');

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 flex items-center justify-between bg-background/80 p-4 backdrop-blur-md">
        <Button variant="ghost" size="icon" asChild>
            <Link href="/find-a-worker">
                <ArrowLeft className="h-6 w-6" />
            </Link>
        </Button>
        <h1 className="text-lg font-bold font-headline">Book a Service</h1>
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-6 w-6" />
        </Button>
      </header>

      <main className="flex-1 overflow-y-auto p-4 pb-32">
        <Tabs defaultValue="slot" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="slot">Book a Slot</TabsTrigger>
                <TabsTrigger value="worker">Find a Worker</TabsTrigger>
            </TabsList>
            <TabsContent value="slot" className="space-y-6 mt-6">
                {/* Service Info */}
                <Card className="glass-card overflow-hidden">
                <CardContent className="p-4 flex items-center gap-4">
                    <div className="relative h-16 w-16 rounded-xl overflow-hidden flex-shrink-0">
                        <Image src="https://picsum.photos/seed/tap/200" alt="Tap Repair" fill className="object-cover" />
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-2">
                            <p className="text-xs font-bold uppercase text-primary">Plumbing</p>
                            <div className="flex items-center gap-1 text-yellow-400">
                                <Star className="h-3 w-3 fill-current" />
                                <span className="text-xs font-bold text-white">4.8</span>
                            </div>
                        </div>
                        <h2 className="font-bold text-white font-headline text-lg">Tap Repair</h2>
                        <p className="text-sm text-muted-foreground">Kitchen Leakage & Valve Replacement</p>
                    </div>
                </CardContent>
                </Card>

                {/* Date Selection */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-bold text-white">Select Date</h3>
                        <p className="text-sm font-medium text-muted-foreground">OCTOBER 2023</p>
                    </div>
                    <div className="grid grid-cols-5 gap-2">
                        {dates.map(({ day, date, dayOfWeek }) => (
                            <button 
                                key={date}
                                onClick={() => setSelectedDate(date)}
                                className={cn("p-3 rounded-xl text-center transition-colors", 
                                    selectedDate === date ? 'bg-accent text-accent-foreground' : 'bg-card hover:bg-card/60'
                                )}
                            >
                                <p className={cn("text-xs", selectedDate === date ? 'text-accent-foreground/80' : 'text-muted-foreground')}>{dayOfWeek}</p>
                                <p className="text-xl font-bold">{date}</p>
                                <p className={cn("text-[10px] font-bold", selectedDate === date ? 'text-accent-foreground' : 'text-primary')}>{day === '14' || day === '15' || day === '16' ? '' : day}</p>
                            </button>
                        ))}
                    </div>
                </div>
                
                {/* Time Selection */}
                <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-white">Select Time Slot</h3>
                    <Badge className="bg-primary/20 text-primary border-primary/30 flex items-center gap-1">
                        <Sparkles className="h-3 w-3"/> AI OPTIMIZED
                    </Badge>
                </div>
                
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-muted-foreground"><Sun size={16}/> <span className="text-sm font-medium">Morning</span></div>
                    <div className="grid grid-cols-3 gap-3">
                        {timeSlots.morning.map(time => (
                            <Button 
                            key={time} 
                            variant="secondary"
                            onClick={() => setSelectedTime(time)} 
                            className={cn("h-12 text-base", selectedTime === time ? 'bg-accent text-accent-foreground hover:bg-accent/90' : 'bg-card text-white hover:bg-card/70')}>
                                {time}
                            </Button>
                        ))}
                    </div>
                </div>
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-muted-foreground"><Sun size={16}/> <span className="text-sm font-medium">Afternoon</span></div>
                    <div className="grid grid-cols-3 gap-3">
                        {timeSlots.afternoon.map(time => (
                            <Button 
                            key={time} 
                            variant="secondary"
                            onClick={() => setSelectedTime(time)} 
                            className={cn("h-12 text-base", selectedTime === time ? 'bg-accent text-accent-foreground hover:bg-accent/90' : 'bg-card text-white hover:bg-card/70')}>
                                {time}
                            </Button>
                        ))}
                    </div>
                </div>
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-muted-foreground"><Moon size={16}/> <span className="text-sm font-medium">Evening</span></div>
                    <div className="grid grid-cols-3 gap-3">
                        {timeSlots.evening.map(time => (
                            <Button 
                            key={time} 
                            variant="secondary"
                            onClick={() => setSelectedTime(time)} 
                            className={cn("h-12 text-base", selectedTime === time ? 'bg-accent text-accent-foreground hover:bg-accent/90' : 'bg-card text-white hover:bg-card/70')}>
                                {time}
                            </Button>
                        ))}
                    </div>
                </div>
                </div>

                {/* Service Address */}
                <div className="space-y-3">
                    <h3 className="text-lg font-bold text-white">Service Address</h3>
                    <Card className="glass-card">
                        <CardContent className="p-4 flex justify-between items-start">
                            <div className="flex gap-3">
                                <MapPin className="text-primary mt-1" />
                                <div>
                                    <h4 className="font-bold text-white">Home</h4>
                                    <p className="text-muted-foreground text-sm">42, Green Valley Apartments, Sector 5, HSR Layout, Bangalore - 560102</p>
                                </div>
                            </div>
                            <Button variant="link" className="text-primary p-0 h-auto">Change</Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Billing Summary */}
                <div className="space-y-3">
                    <h3 className="text-lg font-bold text-white">Billing Summary</h3>
                    <Card className="glass-card">
                        <CardContent className="p-4 space-y-3">
                            <div className="flex justify-between items-center text-sm">
                                <p className="text-muted-foreground">Service Fee</p>
                                <p className="text-white font-medium">₹499.00</p>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <p className="text-muted-foreground">Visiting Charges</p>
                                <p className="text-white font-medium">₹99.00</p>
                            </div>
                            <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                <div className="flex justify-between items-center text-sm cursor-pointer">
                                    <p className="text-muted-foreground flex items-center gap-1.5">
                                        Taxes & Fees
                                        <Info className="h-3 w-3" />
                                    </p>
                                    <p className="text-white font-medium">₹0.00 <span className="text-xs text-accent">INCLUDED</span></p>
                                </div>
                                </TooltipTrigger>
                                <TooltipContent className="max-w-xs">
                                <p className="font-bold">0% Platform Fee for Customers.</p>
                                <p>You only pay for the service. A small service fee is charged to the worker from their earnings to maintain platform security and features.</p>
                                </TooltipContent>
                            </Tooltip>
                            </TooltipProvider>
                            <div className="border-t border-border my-2"></div>
                            <div className="flex justify-between items-center font-bold">
                                <p className="text-white text-lg">Total Amount</p>
                                <p className="text-white text-xl">₹598.00</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </TabsContent>
            <TabsContent value="worker" className="space-y-6 mt-6">
                <Card className="glass-card">
                    <CardContent className="p-4 space-y-4">
                        <h3 className="text-lg font-bold text-white">Find Your Preferred Worker</h3>
                        <p className="text-sm text-muted-foreground">
                            Search for a specific professional or browse our list of top-rated experts for this service.
                        </p>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search by name or specialty..."
                                className="w-full rounded-full bg-input pl-10 h-12 text-white border-border"
                            />
                        </div>
                        <Button asChild className="w-full">
                           <Link href="/find-a-worker">
                                <Users className="mr-2 h-4 w-4"/>
                                View All Professionals
                           </Link>
                        </Button>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
      </main>

      <footer className="sticky bottom-0 left-0 w-full p-4 bg-gradient-to-t from-background to-transparent z-10">
        <Button size="lg" className="w-full h-14 text-lg font-bold bg-primary text-primary-foreground hover:bg-primary/90">
            Confirm & Pay
            <ArrowRight className="inline-block h-5 w-5 ml-2" />
        </Button>
      </footer>
    </div>
  );
}
