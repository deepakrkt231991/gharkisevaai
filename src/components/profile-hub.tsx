'use client';

import { useUser, useAuth, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronRight, LogOut, User as UserIcon, Settings, Shield, HelpCircle, FileLock, Handshake, Languages, LayoutDashboard, Building } from 'lucide-react';
import { Skeleton } from './ui/skeleton';
import Link from 'next/link';
import { doc } from 'firebase/firestore';
import type { User as UserEntity } from '@/lib/entities';


function ProfileHeader() {
    return (
         <header className="sticky top-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-md">
            <h1 className="font-headline text-xl font-bold tracking-tight">Profile</h1>
        </header>
    );
}

const ProfileMenuItem = ({ icon: Icon, label, href }: { icon: React.ElementType, label: string, href: string }) => (
    <Link href={href} className="flex items-center justify-between p-4 hover:bg-white/5 rounded-lg">
        <div className="flex items-center gap-4">
            <Icon className="h-5 w-5 text-muted-foreground" />
            <span className="font-semibold text-white">{label}</span>
        </div>
        <ChevronRight className="h-5 w-5 text-muted-foreground" />
    </Link>
);


export function ProfileHub() {
    const { user, isUserLoading } = useUser();
    const auth = useAuth();
    const router = useRouter();
    const firestore = useFirestore();

    const userDocRef = useMemoFirebase(() => {
        if (!firestore || !user?.uid) return null;
        return doc(firestore, 'users', user.uid);
    }, [firestore, user?.uid]);

    const { data: userProfile, isLoading: isProfileLoading } = useDoc<UserEntity>(userDocRef);

    const handleLogout = async () => {
        if (!auth) return;
        await auth.signOut();
        // Redirect to home page after logout
        router.push('/');
    };
    
    if (isUserLoading || isProfileLoading) {
        return (
            <>
                <ProfileHeader />
                <div className="p-4 space-y-8">
                    <div className="flex flex-col items-center gap-4">
                        <Skeleton className="h-24 w-24 rounded-full" />
                        <div className="space-y-2 text-center">
                            <Skeleton className="h-6 w-40" />
                            <Skeleton className="h-4 w-60" />
                        </div>
                    </div>
                     <Card className="glass-card">
                        <CardContent className="p-0 divide-y divide-border">
                           {[...Array(4)].map((_, i) => (
                               <div key={i} className="flex items-center gap-4 p-4">
                                   <Skeleton className="h-6 w-6 rounded-md" />
                                   <Skeleton className="h-5 w-32" />
                               </div>
                           ))}
                        </CardContent>
                    </Card>
                    <Skeleton className="h-12 w-full" />
                </div>
            </>
        )
    }

    if (!user) {
        return (
             <>
                <ProfileHeader />
                <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
                    <UserIcon className="h-16 w-16 text-muted-foreground mb-4"/>
                    <h2 className="text-xl font-bold font-headline mb-2">You are not logged in</h2>
                    <p className="text-muted-foreground mb-6">Log in or sign up to manage your profile and bookings.</p>
                    <Button onClick={() => router.push('/login')}>Login / Sign Up</Button>
                </div>
            </>
        )
    }
    
    const isWorker = userProfile?.userType === 'worker';

    return (
        <>
            <ProfileHeader />
            <main className="flex-1 space-y-8 overflow-y-auto p-4 pb-32">
                <div className="flex flex-col items-center text-center gap-2">
                    <Avatar className="h-24 w-24 border-4 border-primary">
                        <AvatarImage src={user.photoURL || `https://picsum.photos/seed/${'\'\''}${user.uid}/150/150`} />
                        <AvatarFallback>{user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}</AvatarFallback>
                    </Avatar>
                    <h2 className="text-2xl font-bold font-headline mt-2">{user.displayName || 'GrihSeva User'}</h2>
                    <p className="text-muted-foreground">{user.email}</p>
                </div>
                
                <Card className="glass-card">
                    <CardContent className="p-0 divide-y divide-border">
                        {isWorker && <ProfileMenuItem icon={LayoutDashboard} label="Worker Dashboard" href="/dashboard/worker" />}
                        <ProfileMenuItem icon={Building} label="Seller Dashboard" href="/dashboard/seller" />
                        <ProfileMenuItem icon={UserIcon} label="Edit Profile" href="/profile/edit" />
                        <ProfileMenuItem icon={Settings} label="App Settings" href="/settings" />
                        <ProfileMenuItem icon={Shield} label="Privacy & Security" href="/privacy" />
                        <ProfileMenuItem icon={FileLock} label="Legal Vault" href="/legal-vault" />
                        <ProfileMenuItem icon={HelpCircle} label="Help & Support" href="/support" />
                        {!isWorker && <ProfileMenuItem icon={Handshake} label="Become a Worker" href="/worker-signup" />}
                        <ProfileMenuItem icon={Languages} label="Change Language" href="/language" />
                    </CardContent>
                </Card>

                <Button onClick={handleLogout} variant="outline" className="w-full h-12 bg-transparent hover:bg-destructive/20 hover:border-destructive/50 hover:text-destructive">
                    <LogOut className="mr-2" />
                    Logout
                </Button>
            </main>
        </>
    );
}
