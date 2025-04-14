
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import documentService from '@/services/documentService';
import circuitService from '@/services/circuitService';
import { DocumentFlowHeader } from '@/components/circuits/document-flow/DocumentFlowHeader';
import { NoCircuitAssignedCard } from '@/components/circuits/document-flow/NoCircuitAssignedCard';
import { LoadingState } from '@/components/circuits/document-flow/LoadingState';
import { CircuitStepsSection } from '@/components/circuits/document-flow/CircuitStepsSection';
import { ErrorMessage } from '@/components/document-flow/ErrorMessage';
import { WorkflowStatusSection } from '@/components/document-flow/WorkflowStatusSection';
import { DocumentDialogs } from '@/components/document-flow/DocumentDialogs';

const DocumentFlowPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [document, setDocument] = useState(null);
  const [moveDialogOpen, setMoveDialogOpen] = useState(false);
  const [processDialogOpen, setProcessDialogOpen] = useState(false);
  const [nextStepDialogOpen, setNextStepDialogOpen] = useState(false);
  const [error, setError] = useState(null);

  // Fetch document data
  const { 
    data: documentData, 
    isLoading: isLoadingDocument, 
    refetch: refetchDocument, 
    error: documentError 
  } = useQuery({
    queryKey: ['document', id],
    queryFn: () => documentService.getDocumentById(Number(id)),
  });

  // Fetch workflow status
  const { 
    data: workflowStatus, 
    isLoading: isLoadingWorkflow, 
    refetch: refetchWorkflow, 
    error: workflowError 
  } = useQuery({
    queryKey: ['document-workflow-status', id],
    queryFn: () => circuitService.getDocumentCurrentStatus(Number(id)),
    enabled: !!id,
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
    queryKey: ['document-circuit-history', id],
    queryFn: () => circuitService.getDocumentCircuitHistory(Number(id)),
    enabled: !!id,
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

  if (!id) {
    navigate('/documents');
    return null;
  }

  const handleMoveSuccess = () => {
    refetchDocument();
    refetchHistory();
    refetchWorkflow();
    toast.success("Document moved successfully");
  };

  const handleProcessSuccess = () => {
    refetchDocument();
    refetchHistory();
    refetchWorkflow();
    toast.success("Document step processed successfully");
  };
  
  const handleNextStepSuccess = () => {
    refetchDocument();
    refetchHistory();
    refetchWorkflow();
    toast.success("Document moved to next step successfully");
  };
  
  // Check if the document has been loaded and doesn't have a circuit assigned
  const isNoCircuit = !isLoadingDocument && documentData && !documentData.circuitId;

  // If document is not in a circuit
  if (isNoCircuit) {
    return (
      <div className="p-6 space-y-6">
        <DocumentFlowHeader 
          documentId={id} 
          document={documentData}
          navigateBack={() => navigate(`/documents/${id}`)}
        />
        
        <NoCircuitAssignedCard 
          documentId={id}
          navigateToDocument={() => navigate(`/documents/${id}`)}
        />
      </div>
    );
  }

  const isLoading = isLoadingDocument || isLoadingCircuitDetails || isLoadingHistory || isLoadingWorkflow;
  const isSimpleUser = user?.role === 'SimpleUser';

  // Find current step details for processing
  const currentStepId = workflowStatus?.currentStepId;
  const currentStepDetail = circuitDetails?.find(d => d.id === currentStepId);

  return (
    <div className="p-6 space-y-6">
      <DocumentFlowHeader 
        documentId={id} 
        document={document}
        navigateBack={() => navigate(`/documents/${id}`)}
      />
      
      <ErrorMessage error={error} />
      
      {/* Loading state */}
      {isLoading ? (
        <LoadingState />
      ) : (
        <div className="flex flex-col gap-6">
          <WorkflowStatusSection workflowStatus={workflowStatus} />

          {/* Circuit Steps */}
          {circuitDetails && circuitDetails.length > 0 && document && workflowStatus && (
            <CircuitStepsSection
              document={document}
              circuitDetails={circuitDetails}
              circuitHistory={circuitHistory || []}
              workflowStatus={workflowStatus}
              isSimpleUser={isSimpleUser}
              onMoveClick={() => setMoveDialogOpen(true)}
              onProcessClick={() => setProcessDialogOpen(true)}
              onNextStepClick={() => setNextStepDialogOpen(true)}
              onDocumentMoved={() => {
                refetchDocument();
                refetchHistory();
                refetchWorkflow();
              }}
            />
          )}
        </div>
      )}
      
      <DocumentDialogs
        document={document}
        workflowStatus={workflowStatus}
        moveDialogOpen={moveDialogOpen}
        processDialogOpen={processDialogOpen}
        nextStepDialogOpen={nextStepDialogOpen}
        setMoveDialogOpen={setMoveDialogOpen}
        setProcessDialogOpen={setProcessDialogOpen}
        setNextStepDialogOpen={setNextStepDialogOpen}
        handleMoveSuccess={handleMoveSuccess}
        handleProcessSuccess={handleProcessSuccess}
        handleNextStepSuccess={handleNextStepSuccess}
        currentStepDetail={currentStepDetail}
        availableActions={workflowStatus?.availableActions}
      />
    </div>
  );
};

export default DocumentFlowPage;
