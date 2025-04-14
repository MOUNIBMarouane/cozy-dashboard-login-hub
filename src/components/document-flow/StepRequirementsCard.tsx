
import { Badge } from '@/components/ui/badge';
import { Check, Clock, AlertCircle } from 'lucide-react';
import { DocumentStatus } from '@/models/documentCircuit';

interface StepRequirementsCardProps {
  statuses: DocumentStatus[];
}

export function StepRequirementsCard({ statuses }: StepRequirementsCardProps) {
  return (
    <div className="space-y-2">
      <h3 className="text-lg font-medium">Step Requirements</h3>
      <div className="bg-[#0a1033] border border-blue-900/30 p-4 rounded-md max-h-[300px] overflow-y-auto">
        {statuses && statuses.length > 0 ? (
          <div className="space-y-3">
            {statuses.map(status => (
              <div 
                key={status.statusId} 
                className={`flex items-center justify-between p-2 rounded-md ${
                  status.isComplete 
                    ? 'bg-green-900/20 border border-green-900/30' 
                    : status.isRequired 
                      ? 'bg-red-900/10 border border-red-900/20' 
                      : 'bg-blue-900/20 border border-blue-900/30'
                }`}
              >
                <div className="flex items-center space-x-2">
                  {status.isComplete ? (
                    <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                      <Check className="h-4 w-4 text-green-400" />
                    </div>
                  ) : status.isRequired ? (
                    <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center">
                      <AlertCircle className="h-4 w-4 text-red-400" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <Clock className="h-4 w-4 text-blue-400" />
                    </div>
                  )}
                  <span className="text-sm">{status.title}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge 
                    variant={
                      status.isComplete 
                        ? "success" 
                        : status.isRequired 
                          ? "destructive" 
                          : "outline"
                    }
                    className={
                      status.isComplete 
                        ? "bg-green-500/20 text-green-200 border-green-500/30" 
                        : status.isRequired 
                          ? "bg-red-500/20 text-red-200 border-red-500/30" 
                          : "bg-blue-500/20 text-blue-200 border-blue-500/30"
                    }
                  >
                    {status.isComplete ? "Complete" : status.isRequired ? "Required" : "Optional"}
                  </Badge>
                  
                  {status.isComplete && status.completedBy && (
                    <span className="text-xs text-green-300">by {status.completedBy}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-4">No requirements for this step</div>
        )}
      </div>
    </div>
  );
}
