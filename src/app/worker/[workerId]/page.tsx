import { WorkerProfilePage } from '@/components/worker-profile-page';

export default async function WorkerPublicProfile({ params }: { params: { workerId: string } }) {
  const { workerId } = params;
  return (
    <div className="dark bg-background text-foreground">
      <div className="relative mx-auto flex min-h-screen w-full max-w-md flex-col">
        <WorkerProfilePage workerId={workerId} />
      </div>
    </div>
  );
}
