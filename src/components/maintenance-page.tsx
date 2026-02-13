'use client';

import { Wrench } from "lucide-react";

export const MaintenancePage = () => (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6 text-center">
      <div className="text-6xl mb-4 text-primary animate-bounce">
        <Wrench className="w-20 h-20" />
      </div>
      <h1 className="text-3xl font-bold font-headline text-white mb-2">Ghar Ki Seva</h1>
      <h2 className="text-xl font-semibold text-muted-foreground">हम ऐप को और बेहतर बना रहे हैं!</h2>
      <p className="text-muted-foreground mt-4 max-w-sm">
        हम कुछ नए फीचर्स जोड़ रहे हैं ताकि आपको बेस्ट वर्कर मिल सकें। बस कुछ ही देर में हम वापस आएंगे।
      </p>
      <div className="mt-8 animate-pulse text-primary font-medium">
        Updating... Please wait ⏳
      </div>
    </div>
);
