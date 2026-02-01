
import { WorkerProfilePage } from '@/components/worker-profile-page';

interface PageProps {
    params: { workerId: string };
}

export default function WorkerPublicProfile({ params }: PageProps) {
  const { workerId } = params;
  
  return (
    <div className="dark bg-background text-foreground">
      <div className="relative mx-auto flex min-h-screen w-full max-w-md flex-col">
        <WorkerProfilePage workerId={workerId} />
      </div>
    </div>
  );
}
