'use client';
import { ArrowLeft, Search,SlidersHorizontal } from 'lucide-react';
import { Input } from './ui/input';

export function ExploreHeader() {
    return (
        <div className="sticky top-0 z-10 flex flex-col gap-4 bg-background/80 p-4 backdrop-blur-md">
            <div className="flex items-center justify-between">
                <button onClick={() => window.history.back()} className="p-2">
                    <ArrowLeft className="h-6 w-6" />
                </button>
                <h1 className="text-xl font-bold font-headline">GrihSeva AI</h1>
                <button className="p-2">
                    <SlidersHorizontal className="h-6 w-6" />
                </button>
            </div>
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Search for Plumber, Electrician..."
                    className="w-full rounded-full bg-input pl-10 h-12"
                />
            </div>
        </div>
    );
}
