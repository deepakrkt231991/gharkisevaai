
import { WorkerProfilePage } from '@/components/worker-profile-page';

type PageProps = {
  params: { workerId: string };
};

// No need for async/await here as params are passed directly.
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
