import { DefectAnalyzer } from '@/components/defect-analyzer';

export default function AnalyzePage() {
  return (
    <div className="dark bg-background text-foreground">
        <div className="relative mx-auto flex min-h-screen w-full max-w-md flex-col bg-background-dark overflow-x-hidden">
             <DefectAnalyzer />
        </div>
    </div>
  );
}
