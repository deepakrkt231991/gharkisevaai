import { ProfileHub } from '@/components/profile-hub';
import { BottomNavBar } from '@/components/bottom-nav-bar';

export default function ProfilePage() {
  return (
    <div className="dark bg-background text-foreground">
      <div className="relative mx-auto flex min-h-screen w-full max-w-md flex-col">
        <ProfileHub />
        <BottomNavBar />
      </div>
    </div>
  );
}
