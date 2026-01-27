
      <file>src/components/seller-dashboard.tsx</file>
      <content>
        'use client';

        import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
        import { collection, query, where, orderBy } from 'firebase/firestore';
        import type { Property } from '@/lib/entities';
        import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
        import { Button } from '@/components/ui/button';
        import { Card, CardContent } from '@/components/ui/card';
        import { Bell, Download, Share2, Building, ShieldCheck, Loader2 } from 'lucide-react';
        import Link from 'next/link';
        import { Skeleton } from './ui/skeleton';
        import Image from 'next/image';
        import { useToast } from '@/hooks/use-toast';

        function HubHeader() {
            const { user } = useUser();
            return (
                <header className="sticky top-0 z-50 flex items-center justify-between bg-background/80 p-4 backdrop-blur-md">
                    <div className="flex items-center gap-3">
                        <Avatar>
                            <AvatarImage src={user?.photoURL || `https://picsum.photos/seed/${user?.uid}/150/150`} />
                            <AvatarFallback>{user?.displayName?.charAt(0) || 'S'}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="text-xs text-primary font-bold">GRIHSEVA AI</p>
                            <h1 className="font-headline text-xl font-bold tracking-tight">Seller Dashboard</h1>
                        </div>
                    </div>
                     <Button variant="ghost" size="icon" className="relative">
                        <Bell className="h-6 w-6" />
                    </Button>
                </header>
            );
        }

        const VerifiedPropertyCard = ({ property }: { property: Property & {id: string} }) => {
            const { toast } = useToast();
            const shareUrl = `https://wa.me/?text=Check%20out%20my%20verified%20property%20on%20Ghar%20Ki%20Seva!%20${window.location.origin}/property-detail?id=${property.id}`;

            const handleDownload = () => {
                if (!property.certificateUrl) return;
                const link = document.createElement('a');
                link.href = property.certificateUrl;
                link.download = `Ghar-Ki-Seva-Certificate-${property.id.substring(0,6)}.png`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                toast({ title: 'Certificate Downloaded!'});
            }

            return (
                <Card className="glass-card">
                    <CardContent className="p-4 space-y-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-bold text-white text-lg">{property.title}</h3>
                                <p className="text-xs text-muted-foreground">{property.location}</p>
                            </div>
                             <div className="flex items-center gap-2 text-green-400 text-xs font-bold">
                                <ShieldCheck className="h-4 w-4" />
                                VERIFIED
                            </div>
                        </div>
                        
                        {property.certificateUrl ? (
                            <div className="space-y-3">
                                <div className="relative aspect-[16/9] w-full bg-black/20 rounded-lg overflow-hidden border border-border">
                                    <Image src={property.certificateUrl} alt="Trust Certificate" fill className="object-contain p-2" />
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                     <Button onClick={handleDownload} variant="secondary">
                                        <Download className="mr-2" /> Download
                                    </Button>
                                    <Button asChild>
                                        <a href={shareUrl} target="_blank" rel="noopener noreferrer">
                                            <Share2 className="mr-2" /> Share
                                        </a>
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center gap-2 text-center text-muted-foreground py-8">
                                <Loader2 className="animate-spin h-5 w-5"/>
                                <span>Certificate is being generated...</span>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )
        }


        export function SellerDashboard() {
            const { user, isUserLoading } = useUser();
            const firestore = useFirestore();

            const propertiesQuery = useMemoFirebase(() => {
                if (!firestore || !user) return null;
                return query(
                    collection(firestore, 'properties'), 
                    where('ownerId', '==', user.uid),
                    orderBy('createdAt', 'desc')
                );
            }, [firestore, user]);

            const { data: properties, isLoading: isPropertiesLoading } = useCollection<Property>(propertiesQuery);

            const verifiedProperties = properties?.filter(p => p.verificationStatus === 'verified') || [];
            const pendingProperties = properties?.filter(p => p.verificationStatus !== 'verified') || [];

            if (isUserLoading || isPropertiesLoading) {
                return (
                     <div className="p-4 space-y-6">
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-48 w-full" />
                        <Skeleton className="h-24 w-full" />
                     </div>
                )
            }

          return (
            <>
              <HubHeader />
              <main className="flex-1 space-y-8 overflow-y-auto p-4 pb-24">
                {verifiedProperties.length > 0 && (
                     <div className="space-y-4">
                        <h2 className="text-xl font-bold font-headline text-white">My Verified Properties</h2>
                        {verifiedProperties.map(prop => <VerifiedPropertyCard key={prop.id} property={prop} />)}
                    </div>
                )}
                
                 {pendingProperties.length > 0 && (
                     <div className="space-y-4">
                        <h2 className="text-xl font-bold font-headline text-white">Pending Verification</h2>
                        {pendingProperties.map(prop => (
                             <Card key={prop.id} className="glass-card">
                                <CardContent className="p-4 flex justify-between items-center">
                                    <div>
                                        <h3 className="font-semibold text-white">{prop.title}</h3>
                                        <p className="text-xs text-muted-foreground">{prop.location}</p>
                                    </div>
                                    <div className="flex items-center gap-2 text-yellow-400 text-xs font-bold">
                                        <Loader2 className="animate-spin h-4 w-4" />
                                        {prop.verificationStatus.replace('_', ' ').toUpperCase()}
                                    </div>
                                </CardContent>
                             </Card>
                        ))}
                    </div>
                )}

                {properties?.length === 0 && (
                    <div className="text-center py-16 text-muted-foreground space-y-4">
                        <Building className="mx-auto h-16 w-16" />
                        <h3 className="text-lg font-semibold text-white">No Properties Listed Yet</h3>
                        <p className="text-sm">List your property to sell or rent it out on GrihSeva AI.</p>
                        <Button asChild>
                            <Link href="/list-property">List a Property</Link>
                        </Button>
                    </div>
                )}
              </main>
            </>
          );
        }
      </content>
    </content></change>
</changes>