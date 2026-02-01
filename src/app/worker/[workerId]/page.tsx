
import { WorkerProfilePage } from '@/components/worker-profile-page';

// Simplified and corrected the props definition to prevent future TypeErrors.
export default function WorkerPublicProfile({ params }: { params: { workerId: string } }) {
  const { workerId } = params;
  
  return (
    <div className="dark bg-background text-foreground">
      <div className="relative mx-auto flex min-h-screen w-full max-w-md flex-col">
        <WorkerProfilePage workerId={workerId} />
      </div>
    </div>
  );
}
