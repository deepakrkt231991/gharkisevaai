
import { WorkerProfilePage } from '@/components/worker-profile-page';

type PageProps = {
  params: Promise<{ workerId: string }>;
};

export default async function WorkerPublicProfile({ params }: PageProps) {
  const { workerId } = await params;
  return (
    <div className="dark bg-background text-foreground">
      <div className="relative mx-auto flex min-h-screen w-full max-w-md flex-col">
        <WorkerProfilePage workerId={workerId} />
      </div>
    </div>
  );
}
