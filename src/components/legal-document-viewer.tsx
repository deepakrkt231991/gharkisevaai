'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Download, FileText, CheckCircle, ShieldCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function LegalDocumentViewer() {
    const { toast } = useToast();

    const handleDownload = () => {
        toast({
            title: "Download Initiated",
            description: "Your document is being prepared. In a real app, this would download a PDF.",
            className: "bg-primary text-white border-primary"
        });
        // In a real app, you would trigger a PDF generation and download here.
        // For example, window.print();
    };

    const QrCodePlaceholder = () => (
        <div className="w-24 h-24 bg-white p-1 rounded-md">
            <div className="w-full h-full flex items-center justify-center">
                 <svg width="100%" height="100%" viewBox="0 0 100 100" className="text-black">
                    <path fill="currentColor" d="M0 0h30v30H0z M10 10h10v10H10z M40 0h30v30H40z M50 10h10v10H50z M80 0h20v20H80z M0 40h30v30H0z M10 50h10v10H10z M40 40h30v30H40z M50 50h10v10H50z M80 40h20v20H80z M0 80h20v20H0z M40 80h20v20H40z M80 80h20v20H80z M33 33h10v10H33z M73 33h10v10H73z M33 73h10v10H33z M73 73h10v10H73z M35 65h10v5H35z M45 75h5v10H45z M65 35h10v5H65z M75 45h5v10H75z" />
                </svg>
            </div>
        </div>
    );

    return (
        <div className="space-y-4">
            <Card className="glass-card overflow-hidden">
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <FileText className="text-primary h-8 w-8"/>
                        <div>
                            <CardTitle className="font-headline text-white">Digital Legal Agreement</CardTitle>
                            <CardDescription>Deal ID: GSAI-DL-84B20-2024</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Parties Involved */}
                    <div>
                        <h4 className="font-bold text-lg mb-2 text-white">Parties Involved</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <p className="text-xs font-bold uppercase text-muted-foreground">SELLER</p>
                                <div className="flex items-center gap-2">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src="https://i.pravatar.cc/150?u=seller" />
                                        <AvatarFallback>S</AvatarFallback>
                                    </Avatar>
                                    <span className="font-semibold text-white">Ramesh Patel</span>
                                </div>
                            </div>
                             <div className="space-y-2">
                                <p className="text-xs font-bold uppercase text-muted-foreground">BUYER</p>
                                <div className="flex items-center gap-2">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src="https://i.pravatar.cc/150?u=buyer" />
                                        <AvatarFallback>B</AvatarFallback>
                                    </Avatar>
                                    <span className="font-semibold text-white">Priya Singh</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    {/* Item Details */}
                    <div>
                        <h4 className="font-bold text-lg mb-3 text-white">Item Details & Condition</h4>
                        <div className="flex gap-4">
                            <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                                <Image src="https://picsum.photos/seed/used-ac/200" alt="Used AC" fill className="object-cover" />
                            </div>
                            <div className="space-y-1">
                                <h5 className="font-bold text-white">Used Voltas 1.5 Ton AC</h5>
                                <p className="text-sm text-muted-foreground">AI Condition Report:</p>
                                <ul className="text-xs text-muted-foreground list-disc list-inside">
                                    <li>Good working condition.</li>
                                    <li>Minor scratches on the side panel.</li>
                                    <li>Cooling efficiency at 85%.</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <Separator />

                     {/* Terms */}
                    <div>
                        <h4 className="font-bold text-lg mb-2 text-white">Terms of Agreement</h4>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                            <p className="text-muted-foreground">Final Price:</p>
                            <p className="font-bold text-white text-right">₹ 12,500.00</p>
                            <p className="text-muted-foreground">Payment Status:</p>
                            <p className="font-bold text-green-400 text-right">PAID & HELD IN ESCROW</p>
                            <p className="text-muted-foreground">Refund Expiry (Waiting Time):</p>
                            <p className="font-bold text-white text-right">72 Hours from delivery</p>
                        </div>
                    </div>

                </CardContent>
                <CardFooter className="bg-black/20 p-4 flex justify-between items-end">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="text-green-400 h-6 w-6"/>
                            <h5 className="text-lg font-bold text-white">GrihSeva AI Verified</h5>
                        </div>
                        <p className="text-xs text-muted-foreground">This document is digitally signed and verified by AI.</p>
                        <p className="text-xs text-muted-foreground">Date: October 26, 2024</p>
                    </div>
                    <QrCodePlaceholder />
                </CardFooter>
            </Card>

            <Button onClick={handleDownload} className="w-full h-14 bg-primary text-white">
                <Download className="mr-2" />
                Download Agreement
            </Button>
        </div>
    );
}
