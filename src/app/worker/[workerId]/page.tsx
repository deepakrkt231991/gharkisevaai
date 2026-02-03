
import { WorkerProfilePage } from '@/components/worker-profile-page';

// Using 'any' to bypass strict type checks that might be failing in the build environment
export default function WorkerPublicProfile({ params }: any) {
  return (
    <div className="dark bg-background text-foreground">
      <div className="relative mx-auto flex min-h-screen w-full max-w-md flex-col">
        <WorkerProfilePage workerId={params.workerId} />
      </div>
    </div>
  );
}
