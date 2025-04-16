
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import documentService from '@/services/documentService';
import circuitService from '@/services/circuitService';
import { Document } from '@/models/document';
import { DocumentWorkflowStatus, DocumentCircuitHistory } from '@/models/documentCircuit';

type DialogType = 'move' | 'process' | 'nextStep';

interface DialogState {
  moveOpen: boolean;
  processOpen: boolean;
  nextStepOpen: boolean;
}

export function useDocumentFlow(documentId: string | undefined) {
  const [document, setDocument] = useState<Document | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dialogState, setDialogState] = useState<DialogState>({
    moveOpen: false,
    processOpen: false,
    nextStepOpen: false
  });

  // Fetch document data
  const { 
    data: documentData, 
    isLoading: isLoadingDocument, 
    refetch: refetchDocument, 
    error: documentError 
  } = useQuery({
    queryKey: ['document', documentId],
    queryFn: () => documentService.getDocumentById(Number(documentId)),
    enabled: !!documentId,
  });

  // Fetch workflow status
  const { 
    data: workflowStatus, 
    isLoading: isLoadingWorkflow, 
    refetch: refetchWorkflow, 
    error: workflowError 
  } = useQuery({
    queryKey: ['document-workflow-status', documentId],
    queryFn: () => circuitService.getDocumentCurrentStatus(Number(documentId)),
    enabled: !!documentId,
  });

  // Fetch circuit details
  const { 
    data: circuitDetails, 
    isLoading: isLoadingCircuitDetails, 
    error: circuitDetailsError 
  } = useQuery({
    queryKey: ['circuit-details', documentData?.circuitId],
    queryFn: () => circuitService.getCircuitDetailsByCircuitId(documentData?.circuitId || 0),
    enabled: !!documentData?.circuitId,
  });

  // Fetch document circuit history
  const {
    data: circuitHistory,
    isLoading: isLoadingHistory,
    refetch: refetchHistory,
    error: historyError
  } = useQuery({
    queryKey: ['document-circuit-history', documentId],
    queryFn: () => circuitService.getDocumentCircuitHistory(Number(documentId)),
    enabled: !!documentId,
  });

  useEffect(() => {
    if (documentData) {
      console.log('Document data:', documentData);
      setDocument(documentData);
    }
    
    // Collect any errors
    const allErrors = [documentError, circuitDetailsError, historyError, workflowError].filter(Boolean);
    if (allErrors.length > 0) {
      console.error('Errors loading document flow data:', allErrors);
      setError('Error loading document flow data. Please try again.');
    } else {
      setError(null);
    }
  }, [documentData, documentError, circuitDetailsError, historyError, workflowError]);

  const openDialog = (type: DialogType) => {
    setDialogState(prev => ({
      ...prev,
      [`${type}Open`]: true
    }));
  };

  const closeDialog = (type: DialogType) => {
    setDialogState(prev => ({
      ...prev,
      [`${type}Open`]: false
    }));
  };

  const handleSuccess = (type: DialogType) => {
    refetchData();
    
    const messages = {
      move: "Document moved successfully",
      process: "Document step processed successfully",
      nextStep: "Document moved to next step successfully"
    };
    
    toast.success(messages[type]);
    closeDialog(type);
  };

  const refetchData = () => {
    refetchDocument();
    refetchHistory();
    refetchWorkflow();
  };

  const isLoading = isLoadingDocument || isLoadingCircuitDetails || isLoadingHistory || isLoadingWorkflow;

  return {
    document,
    workflowStatus,
    circuitDetails,
    circuitHistory,
    isLoading,
    error,
    dialogState,
    openDialog,
    closeDialog,
    handleSuccess,
    refetchData
  };
}
