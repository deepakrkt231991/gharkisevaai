// src/app/list-tool/page.tsx
import { ListToolForm } from '@/components/list-tool-form';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

function ListToolHeader() {
    return (
         <header className="sticky top-0 z-50 flex items-center justify-between bg-background/80 p-4 backdrop-blur-md">
            <Button variant="ghost" size="icon" asChild>
                <Link href="/rent-tools">
                    <ArrowLeft className="h-6 w-6" />
                </Link>
            </Button>
            <h1 className="text-xl font-bold font-headline text-center flex-1 pr-10">List Your Tool</h1>
        </header>
    );
}

export default function ListToolPage() {
  return (
    <div className="dark bg-background text-foreground">
        <div className="relative mx-auto flex min-h-screen w-full max-w-md flex-col">
            <ListToolHeader/>
            <main className="flex-1 p-4">
                <ListToolForm />
            </main>
        </div>
    </div>
  );
}

// Dummy components to avoid breaking the build, will be replaced by actual components
import { Button } from '@/components/ui/button';
