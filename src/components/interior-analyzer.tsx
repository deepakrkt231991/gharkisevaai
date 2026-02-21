
"use client";
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, AlertTriangle, FileText, Bot, Wallet, RefreshCcw, Loader2 } from 'lucide-react';

export default function InteriorAnalyzer() {
  const [analyzing, setAnalyzing] = useState(false);
  const [report, setReport] = useState<any>(null);

  const startSmartAnalysis = () => {
    setAnalyzing(true);
    // AI Analysis Simulation
    setTimeout(() => {
      setReport({
        problem: "Wall Dampness & Structural Cracks",
        guide: "Reference: iFixit Home Repair Guide #102",
        howToFix: [
          "1. सीलन वाली जगह को खुरचें (Scrape the damp area).",
          "2. Apply Anti-Damp Primer (3 layers).",
          "3. Use Waterproof Putty for cracks."
        ],
        workerNote: "Note for Raju Painter: Use 400-grit sandpaper for smooth finish.",
        visualPreview: "Modern Grey Wall with Oak Flooring (Suggested)",
        budget: "₹4,500 - ₹6,000"
      });
      setAnalyzing(false);
    }, 2500);
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
                {report.howToFix.map((step: string, i: number) => <li key={i}>{step}</li>)}
                </ul>
            </CardContent>
          </Card>

          <Card className="glass-card bg-primary/10 border-primary/20">
             <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                   <Bot/> Note for Worker
                </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground italic">{report.workerNote}</p>
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

          <Button onClick={() => setReport(null)} variant="outline" className="w-full h-12">
            <RefreshCcw className="mr-2 h-4 w-4"/> Scan Another Defect
          </Button>
        </div>
      )}
    </div>
  );
}
