
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import circuitService from '@/services/circuitService';
import { DocumentWorkflowStatus, ProcessCircuitRequest } from '@/models/documentCircuit';

export function useDocumentWorkflow(documentId: number) {
  const [isActionLoading, setIsActionLoading] = useState(false);

  const { 
    data: workflowStatus, 
    isLoading, 
    isError, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['document-workflow', documentId],
    queryFn: () => circuitService.getDocumentCurrentStatus(documentId),
    enabled: !!documentId,
    meta: {
      onSettled: (data, err) => {
        if (err) {
          const errorMessage = err instanceof Error 
            ? err.message 
            : 'Failed to load document workflow status.';
          console.error('Document workflow error:', err);
          toast.error(errorMessage);
        }
      }
    }
  });

  const performAction = async (actionId: number, comments: string = '', isApproved: boolean = true) => {
    if (!documentId) return;
    
    setIsActionLoading(true);
    try {
      const request: ProcessCircuitRequest = {
        documentId,
        actionId,
        comments,
        isApproved
      };
      
      await circuitService.performAction(request);
      toast.success(`Action ${isApproved ? 'approved' : 'rejected'} successfully`);
      refetch();
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to perform action';
      toast.error(errorMessage);
      console.error(error);
    } finally {
      setIsActionLoading(false);
    }
  };

  const returnToPreviousStep = async (comments: string = '') => {
    if (!documentId) return;
    
    setIsActionLoading(true);
    try {
      await circuitService.moveDocumentToStep({
        documentId,
        comments
      });
      toast.success('Document returned to previous step');
      refetch();
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to return document to previous step';
      toast.error(errorMessage);
      console.error(error);
    } finally {
      setIsActionLoading(false);
    }
  };

  return {
    workflowStatus,
    isLoading,
    isError,
    isActionLoading,
    performAction,
    returnToPreviousStep,
    refetch
  };
}
