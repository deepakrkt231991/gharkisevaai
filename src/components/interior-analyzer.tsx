'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkles, AlertTriangle, FileText, Bot, Wallet, RefreshCcw, Phone, Star, ShieldCheck } from 'lucide-react';
import { mumbaiPainters, type WorkerProfile } from '@/lib/worker-database';
import Image from 'next/image';

interface Report {
  problem: string;
  guide: string;
  howToFix: string[];
  workerNote: string;
  visualPreview: string;
  budget: string;
  recommendedWorker: WorkerProfile;
}

export default function InteriorAnalyzer() {
  const [analyzing, setAnalyzing] = useState(false);
  const [report, setReport] = useState<Report | null>(null);
  const [showAfter, setShowAfter] = useState(false);

  const startSmartAnalysis = () => {
    setAnalyzing(true);
    // AI Analysis Simulation
    setTimeout(() => {
      // Randomly select a painter
      const randomWorker = mumbaiPainters[Math.floor(Math.random() * mumbaiPainters.length)];
      
      const newReport: Report = {
        problem: "Wall Dampness & Structural Cracks",
        guide: "Reference: iFixit Home Repair Guide #102",
        howToFix: [
          "1. सीलन वाली जगह को खुरचें (Scrape the damp area).",
          "2. Apply Anti-Damp Primer (3 layers).",
          "3. Use Waterproof Putty for cracks."
        ],
        workerNote: "Note for Worker: Use 400-grit sandpaper for smooth finish.",
        visualPreview: "Premium Royal Blue Finish",
        budget: "₹4,500 - ₹6,000",
        recommendedWorker: randomWorker,
      };

      setReport(newReport);
      setShowAfter(false); // Reset to 'before' view on new analysis
      setAnalyzing(false);
    }, 2500);
  };

  const handleReset = () => {
    setReport(null);
    setAnalyzing(false);
    setShowAfter(false);
  };

  return (
    <div className="p-4 space-y-6">
      {!report ? (
        <Card className="glass-card text-center p-6">
          <CardHeader>
             <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                <Sparkles className="w-10 h-10 text-primary"/>
            </div>
            <CardTitle className="font-headline text-white">AI Fixit Consultant</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-6">Our AI combines internet guides and insights from pro workers to give you the best solution.</p>
            <Button onClick={startSmartAnalysis} disabled={analyzing} className="w-full h-14 text-lg">
              {analyzing ? <><Loader2 className="animate-spin mr-2"/>AI Analyzing...</> : "START SMART SCAN 📸"}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4 animate-in fade-in duration-500">
          
          {/* Image with Style Toggle */}
          <Card className="glass-card p-2">
            <div className="relative aspect-video w-full rounded-xl overflow-hidden">
              <AnimatePresence initial={false}>
                <motion.div
                  key={showAfter ? 'after' : 'before'}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0"
                >
                  <Image
                    src={showAfter ? "https://picsum.photos/seed/royalblue/800/600" : "https://picsum.photos/seed/damagedwall/800/600"}
                    alt={showAfter ? "Premium Royal Blue Finish" : "Damaged Wall"}
                    fill
                    className="object-cover"
                    data-ai-hint={showAfter ? "blue wall" : "damaged wall"}
                  />
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="p-2">
              <Button onClick={() => setShowAfter(!showAfter)} className="w-full">
                {showAfter ? 'Show Before' : 'Toggle Style: Premium Blue'}
              </Button>
            </div>
          </Card>

          <Card className="glass-card border-l-4 border-destructive">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                    <AlertTriangle/> Damage Detected
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="font-bold text-white text-lg">{report.problem}</p>
                 <p className="text-xs text-muted-foreground italic mt-1">{report.guide}</p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                   <FileText/> Detailed Solution
                </CardTitle>
            </CardHeader>
            <CardContent>
                <ul className="text-sm space-y-2 text-muted-foreground">
                {report.howToFix.map((step, i) => <li key={i}>{step}</li>)}
                </ul>
            </CardContent>
          </Card>

          {/* Recommended Worker Card */}
          <Card className="glass-card bg-primary/10 border-primary/20">
             <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                   <Bot/> AI Recommended Worker
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center bg-background/50 p-3 rounded-lg">
                <div>
                  <h4 className="font-bold text-white">{report.recommendedWorker.name}</h4>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="flex items-center gap-1 text-yellow-400"><Star className="h-3 w-3 fill-current"/> {report.recommendedWorker.rating}</span>
                    <span className="text-muted-foreground">({report.recommendedWorker.reviews} reviews)</span>
                  </div>
                </div>
                {report.recommendedWorker.isSeepageExpert && (
                  <span className="bg-destructive/20 text-destructive px-2 py-1 text-xs font-bold rounded">Seepage Expert</span>
                )}
              </div>
              <p className="text-xs text-muted-foreground italic">{report.workerNote}</p>
              <Button asChild className="w-full">
                <a href={`tel:${report.recommendedWorker.phone}`}>
                  <Phone className="mr-2 h-4 w-4" /> Call Now
                </a>
              </Button>
            </CardContent>
          </Card>
          
          <Card className="glass-card">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                   <Wallet/> Estimated Budget
                </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-extrabold text-accent">{report.budget}</p>
              <p className="text-xs text-muted-foreground mt-1">Based on {report.visualPreview}</p>
            </CardContent>
          </Card>

          <Button onClick={handleReset} variant="outline" className="w-full h-12">
            <RefreshCcw className="mr-2 h-4 w-4"/> Scan Another Defect
          </Button>
        </div>
      )}
    </div>
  );
}
