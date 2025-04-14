
import { Badge } from '@/components/ui/badge';
import { DocumentStatus } from '@/models/documentCircuit';

interface StepRequirementsCardProps {
  statuses: DocumentStatus[];
}

export function StepRequirementsCard({ statuses }: StepRequirementsCardProps) {
  return (
    <div className="space-y-2">
      <h3 className="text-lg font-medium">Step Requirements</h3>
      <div className="bg-[#0a1033] border border-blue-900/30 p-4 rounded-md">
        {statuses && statuses.length > 0 ? (
          <div className="space-y-2">
            {statuses.map(status => (
              <div key={status.statusId} className="flex items-center justify-between">
                <span>{status.title}</span>
                <Badge variant={status.isComplete ? "success" : status.isRequired ? "destructive" : "outline"}>
                  {status.isComplete ? "Complete" : status.isRequired ? "Required" : "Optional"}
                </Badge>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-2">No requirements for this step</div>
        )}
      </div>
    </div>
  );
}
