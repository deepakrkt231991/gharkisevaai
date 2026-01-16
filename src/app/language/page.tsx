import { LanguageSelector } from '@/components/language-selector';
import { BottomNavBar } from '@/components/bottom-nav-bar';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

function LanguageHeader() {
    return (
         <header className="sticky top-0 z-50 flex items-center justify-between bg-background/80 p-4 backdrop-blur-md">
            <Button variant="ghost" size="icon" asChild>
                <Link href="/profile">
                    <ArrowLeft className="h-6 w-6" />
                </Link>
            </Button>
            <h1 className="text-xl font-bold font-headline text-center flex-1 pr-10">Select Language</h1>
        </header>
    );
}

export default function LanguagePage() {
  return (
    <div className="dark bg-background text-foreground">
        <div className="relative mx-auto flex min-h-screen w-full max-w-md flex-col">
            <LanguageHeader/>
            <main className="flex-1 p-4 pb-32 overflow-y-auto">
                <LanguageSelector />
            </main>
            <BottomNavBar />
        </div>
    </div>
  );
}
