'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { ShieldCheck, FileText, Upload, Fingerprint, PenSquare, Loader2, CheckCircle, Circle, Bot, FileLock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

const SecurityGuide = () => (
    <Card className="glass-card">
        <CardHeader>
            <CardTitle className="font-headline text-white text-lg flex items-center gap-2">
                <ShieldCheck className="text-primary"/>
                Your Security is Our Priority
            </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
            <div className="flex items-start gap-3">
                <ShieldCheck className="h-5 w-5 text-green-400 mt-1 flex-shrink-0" />
                <div>
                    <h4 className="font-bold text-white">100% Encryption</h4>
                    <p className="text-muted-foreground">Aapke saare documents 'Bank-Grade Encryption' ke saath save hain, jise sirf aap aur aapka verified partner dekh sakte hain.</p>
                </div>
            </div>
            <div className="flex items-start gap-3">
                <Bot className="h-5 w-5 text-green-400 mt-1 flex-shrink-0" />
                <div>
                    <h4 className="font-bold text-white">AI Verification</h4>
                    <p className="text-muted-foreground">Hamara AI turant documents ki asliyat check karta hai taaki koi fake property ya ID use na kar sake.</p>
                </div>
            </div>
             <div className="flex items-start gap-3">
                <FileLock className="h-5 w-5 text-green-400 mt-1 flex-shrink-0" />
                <div>
                    <h4 className="font-bold text-white">Instant Access</h4>
                    <p className="text-muted-foreground">Ek baar agreement sign hone ke baad, ye hamesha ke liye aapke profile mein 'Legal Vault' section mein save ho jayega.</p>
                </div>
            </div>
        </CardContent>
    </Card>
);

export function LegalVault() {
    const { toast } = useToast();
    const [progress, setProgress] = useState(85);
    const [statusText, setStatusText] = useState("Analyzing Title Deed for encumbrances...");
    const [isGenerating, setIsGenerating] = useState(false);
    const [isGenerated, setIsGenerated] = useState(false);

    const handleGenerateAgreement = () => {
        setIsGenerating(true);
        setStatusText("Generating your draft agreement with AI...");
        setProgress(95);
        toast({
            title: "🚀 AI Agreement Generation Started",
            description: "Fetching verified data to create your legal document.",
            className: "bg-primary text-white border-primary"
        });

        setTimeout(() => {
            setIsGenerating(false);
            setIsGenerated(true);
            setProgress(100);
            setStatusText("All documents verified and agreement drafted.");
             toast({
                title: "✅ Agreement Generated!",
                description: "Draft is ready for your review.",
                 className: "bg-green-600 text-white border-green-600"
            });
        }, 3000);
    };

    return (
        <div className="space-y-6">
            <Card className="glass-card">
                <CardContent className="p-4 flex justify-between items-center">
                    <div>
                        <p className="text-xs text-muted-foreground">ACTIVE TRANSACTION</p>
                        <h3 className="text-xl font-bold font-headline text-white">Sunset Villa</h3>
                        <p className="text-xs text-muted-foreground font-mono">ID: #4421-GK</p>
                    </div>
                    <Badge variant="outline" className="text-green-400 border-green-500/50 bg-green-900/30">In Progress</Badge>
                </CardContent>
            </Card>

            <Card className="glass-card bg-black/40 p-5 space-y-3">
                <div className="flex justify-between items-center">
                    <h4 className="font-bold text-white">AI Document Verifier</h4>
                    <p className="font-bold text-white text-xl">{progress}%</p>
                </div>
                <Progress value={progress} className="w-full h-2 [&>div]:bg-primary"/>
                <div className="flex items-center gap-2 text-xs text-primary">
                    {progress < 100 ? <Loader2 className="animate-spin h-4 w-4"/> : <ShieldCheck className="h-4 w-4"/>}
                    <span>{statusText}</span>
                </div>
            </Card>

            

            <div>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold font-headline text-white">Document Vault</h3>
                    <Button variant="ghost" size="sm" className="flex items-center gap-2 text-primary"><Upload size={16}/> Upload</Button>
                </div>
                <div className="space-y-3">
                    <Card className="glass-card">
                        <CardContent className="p-3 flex items-center gap-4">
                            <div className="bg-green-500/10 p-3 rounded-lg"><FileText className="text-green-400"/></div>
                            <div className="flex-1">
                                <h4 className="font-semibold text-white">Identity Proof</h4>
                                <p className="text-xs text-green-400 font-bold">AADHAR & PAN VERIFIED</p>
                            </div>
                            <CheckCircle className="text-green-400"/>
                        </CardContent>
                    </Card>
                     <Card className="glass-card">
                        <CardContent className="p-3 flex items-center gap-4">
                            <div className="bg-yellow-500/10 p-3 rounded-lg"><FileText className="text-yellow-400"/></div>
                            <div className="flex-1">
                                <h4 className="font-semibold text-white">Property Docs</h4>
                                <p className="text-xs text-yellow-400 font-bold flex items-center gap-1.5"><Loader2 className="animate-spin h-3 w-3"/>SCANNING 2023-24 FILINGS</p>
                            </div>
                            <Circle className="text-yellow-400"/>
                        </CardContent>
                    </Card>

                    <Card className="glass-card border-dashed border-primary/50">
                        <CardContent className="p-3 flex items-center gap-4">
                             <div className="bg-primary/10 p-3 rounded-lg"><FileText className="text-primary"/></div>
                             <div className="flex-1">
                                <h4 className="font-semibold text-white">Executed Agreements</h4>
                                <p className={`text-xs font-bold ${isGenerated ? 'text-green-400' : 'text-primary'}`}>
                                    {isGenerated ? 'DRAFT GENERATED' : 'AI GENERATION READY'}
                                </p>
                             </div>
                             {!isGenerated && (
                                <Button onClick={handleGenerateAgreement} disabled={isGenerating}>
                                    {isGenerating ? <Loader2 className="animate-spin"/> : 'Generate'}
                                 </Button>
                             )}
                              {isGenerated && (
                                <CheckCircle className="text-green-400"/>
                             )}
                        </CardContent>
                    </Card>
                </div>
            </div>

             <SecurityGuide />


            <Button asChild size="lg" className="w-full h-14 bg-primary" disabled={!isGenerated}>
                 <Link href="/legal-document">
                    <FileText className="mr-2"/>
                    Review AI Draft Agreement
                 </Link>
            </Button>

        </div>
    );
}
