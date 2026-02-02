
import { WorkerProfilePage } from '@/components/worker-profile-page';

type PageProps = {
  params: { workerId: string };
};

export default function WorkerPublicProfile({ params }: PageProps) {
  return (
    <div className="dark bg-background text-foreground">
      <div className="relative mx-auto flex min-h-screen w-full max-w-md flex-col">
        <WorkerProfilePage workerId={params.workerId} />
      </div>
    </div>
  );
}
