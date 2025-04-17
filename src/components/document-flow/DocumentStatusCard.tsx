
import { Badge } from '@/components/ui/badge';

interface DocumentStatusCardProps {
  workflowStatus: {
    status: number;
    statusText: string;
    circuitTitle?: string;
    currentStepTitle?: string;
  };
}

export function DocumentStatusCard({ workflowStatus }: DocumentStatusCardProps) {
  return (
    <div className="space-y-2">
      <h3 className="text-lg font-medium">Document Status</h3>
      <div className="bg-[#0a1033] border border-blue-900/30 p-4 rounded-md">
        <div className="flex items-center justify-between mb-3">
          <span className="text-blue-300">Status:</span>
          <Badge variant={workflowStatus.status === 2 ? "success" : "outline"}>
            {workflowStatus.statusText}
          </Badge>
        </div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-blue-300">Circuit:</span>
          <span>{workflowStatus.circuitTitle}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-blue-300">Current Step:</span>
          <span>{workflowStatus.currentStepTitle || 'None'}</span>
        </div>
      </div>
    </div>
  );
}
