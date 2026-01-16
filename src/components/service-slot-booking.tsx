'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, MoreVertical, Star, Sun, Moon, MapPin, Sparkles, IndianRupee } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Badge } from './ui/badge';

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
        <h1 className="text-lg font-bold font-headline">Book a Service Slot</h1>
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-6 w-6" />
        </Button>
      </header>

      <main className="flex-1 space-y-6 overflow-y-auto p-4 pb-32">
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
                            selectedDate === date ? 'bg-primary text-primary-foreground' : 'bg-card hover:bg-card/60'
                        )}
                    >
                        <p className={cn("text-xs", selectedDate === date ? 'text-primary-foreground/80' : 'text-muted-foreground')}>{dayOfWeek}</p>
                        <p className="text-xl font-bold">{date}</p>
                        <p className={cn("text-[10px] font-bold", selectedDate === date ? 'text-primary-foreground' : 'text-primary')}>{day === '14' || day === '15' || day === '16' ? '' : day}</p>
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
                    <Button key={time} variant={selectedTime === time ? 'default' : 'secondary'} onClick={() => setSelectedTime(time)} className={cn("h-12 text-base", selectedTime === time ? 'bg-primary' : 'bg-card hover:bg-card/70')}>
                        {time}
                    </Button>
                ))}
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-muted-foreground"><Sun size={16}/> <span className="text-sm font-medium">Afternoon</span></div>
            <div className="grid grid-cols-3 gap-3">
                {timeSlots.afternoon.map(time => (
                    <Button key={time} variant={selectedTime === time ? 'default' : 'secondary'} onClick={() => setSelectedTime(time)} className={cn("h-12 text-base", selectedTime === time ? 'bg-primary' : 'bg-card hover:bg-card/70')}>
                        {time}
                    </Button>
                ))}
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-muted-foreground"><Moon size={16}/> <span className="text-sm font-medium">Evening</span></div>
            <div className="grid grid-cols-3 gap-3">
                 {timeSlots.evening.map(time => (
                    <Button key={time} variant={selectedTime === time ? 'default' : 'secondary'} onClick={() => setSelectedTime(time)} className={cn("h-12 text-base", selectedTime === time ? 'bg-primary' : 'bg-card hover:bg-card/70')}>
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
                     <div className="flex justify-between items-center text-sm">
                        <p className="text-muted-foreground">Taxes (GST 18%)</p>
                        <p className="text-white font-medium">₹0.00 <span className="text-xs text-muted-foreground">INCLUDED</span></p>
                    </div>
                    <div className="border-t border-border my-2"></div>
                     <div className="flex justify-between items-center font-bold">
                        <p className="text-white text-lg">Total Amount</p>
                        <p className="text-accent text-xl">₹598.00</p>
                    </div>
                </CardContent>
            </Card>
        </div>
      </main>

      <footer className="sticky bottom-0 left-0 w-full p-4 bg-gradient-to-t from-background to-transparent z-10">
        <Button size="lg" className="w-full h-14 text-lg font-bold bg-primary hover:bg-primary/90">
            Confirm & Pay 
            <IndianRupee className="inline-block h-5 w-5 ml-1" />
            598
        </Button>
      </footer>
    </div>
  );
}
