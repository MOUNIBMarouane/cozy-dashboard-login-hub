import { Badge } from '@/components/ui/badge';
import { Check, Clock, AlertCircle, Settings } from 'lucide-react';
import { DocumentStatus, DocumentWorkflowStatus } from '@/models/documentCircuit';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import api from '@/services/api/core';
import { Button } from '@/components/ui/button';
import { EditStepStatusDialog } from './EditStepStatusDialog';

interface StatusItem {
  statusId: number;
  statusKey: string;
  title: string;
  isRequired: boolean;
  isComplete: boolean;
  stepId: number;
}

interface StepRequirementsCardProps {
  statuses: DocumentStatus[];
  workflowStatus?: DocumentWorkflowStatus;
}

export function StepRequirementsCard({ statuses, workflowStatus }: StepRequirementsCardProps) {
  const [selectedStatus, setSelectedStatus] = useState<DocumentStatus | null>(null);
  const currentStepId = workflowStatus?.currentStepId;
  
  // Fetch status for the current step directly from API
  const { 
    data: stepStatuses, 
    isLoading, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['step-statuses', currentStepId],
    queryFn: async () => {
      if (!currentStepId) return [];
      const response = await api.get(`/Status/step/${currentStepId}`);
      return response.data;
    },
    enabled: !!currentStepId,
  });

  // Decide which statuses to display - use API data if available, otherwise fallback to passed props
  const displayStatuses = stepStatuses || statuses;

  const handleEditStatus = (status: DocumentStatus) => {
    setSelectedStatus(status);
  };

  return (
    <div className="space-y-2">
      <h3 className="text-lg font-medium">Step Requirements</h3>
      <div className="bg-[#0a1033] border border-blue-900/30 p-4 rounded-md max-h-[300px] overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <Clock className="h-8 w-8 animate-pulse text-blue-400" />
          </div>
        ) : error ? (
          <div className="text-center text-red-400 py-4">
            <AlertCircle className="h-6 w-6 mx-auto mb-2" />
            Failed to load step requirements
          </div>
        ) : displayStatuses && displayStatuses.length > 0 ? (
          <div className="space-y-3">
            {displayStatuses.map(status => (
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

                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full hover:bg-blue-900/20"
                    onClick={() => handleEditStatus(status)}
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-4">No requirements for this step</div>
        )}
      </div>

      {selectedStatus && (
        <EditStepStatusDialog
          open={!!selectedStatus}
          onOpenChange={(open) => !open && setSelectedStatus(null)}
          status={selectedStatus}
          onSuccess={() => {
            setSelectedStatus(null);
            // Refetch the statuses
            refetch();
          }}
        />
      )}
    </div>
  );
}
