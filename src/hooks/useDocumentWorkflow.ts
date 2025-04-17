
import { useWorkflowStatus } from './document-workflow/useWorkflowStatus';
import { useWorkflowActions } from './document-workflow/useWorkflowActions';
import { useWorkflowNavigation } from './document-workflow/useWorkflowNavigation';

export function useDocumentWorkflow(documentId: number) {
  // Get document workflow status
  const { 
    workflowStatus, 
    isLoading, 
    isError, 
    error,
    refetch 
  } = useWorkflowStatus(documentId);

  // Get workflow action handlers
  const { isActionLoading, performAction } = useWorkflowActions(documentId, refetch);

  // Get workflow navigation handlers
  const { isNavigating, returnToPreviousStep } = useWorkflowNavigation(documentId, refetch);

  return {
    // Status and data
    workflowStatus,
    isLoading,
    isError,
    error,
    
    // Actions
    isActionLoading: isActionLoading || isNavigating,
    performAction,
    returnToPreviousStep,
    refetch
  };
}
