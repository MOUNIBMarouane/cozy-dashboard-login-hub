
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import documentService from '@/services/documentService';
import circuitService from '@/services/circuitService';
import { Document } from '@/models/document';
import { DocumentWorkflowStatus } from '@/models/documentCircuit';
import MoveDocumentStepDialog from '@/components/circuits/MoveDocumentStepDialog';
import ProcessCircuitStepDialog from '@/components/circuits/ProcessCircuitStepDialog';
import MoveToNextStepDialog from '@/components/circuits/MoveToNextStepDialog';
import { DocumentFlowHeader } from '@/components/circuits/document-flow/DocumentFlowHeader';
import { DocumentCard } from '@/components/circuits/document-flow/DocumentCard';
import { CircuitStepsSection } from '@/components/circuits/document-flow/CircuitStepsSection';
import { NoCircuitAssignedCard } from '@/components/circuits/document-flow/NoCircuitAssignedCard';
import { LoadingState } from '@/components/circuits/document-flow/LoadingState';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const DocumentFlowPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [document, setDocument] = useState<Document | null>(null);
  const [moveDialogOpen, setMoveDialogOpen] = useState(false);
  const [processDialogOpen, setProcessDialogOpen] = useState(false);
  const [nextStepDialogOpen, setNextStepDialogOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch document data
  const { data: documentData, isLoading: isLoadingDocument, refetch: refetchDocument, error: documentError } = useQuery({
    queryKey: ['document', id],
    queryFn: () => documentService.getDocumentById(Number(id)),
  });

  // Fetch workflow status
  const { data: workflowStatus, isLoading: isLoadingWorkflow, refetch: refetchWorkflow, error: workflowError } = useQuery({
    queryKey: ['document-workflow-status', id],
    queryFn: () => circuitService.getDocumentCurrentStatus(Number(id)),
    enabled: !!id,
  });

  // Fetch circuit details
  const { data: circuitDetails, isLoading: isLoadingCircuitDetails, error: circuitDetailsError } = useQuery({
    queryKey: ['circuit-details', documentData?.circuitId],
    queryFn: () => circuitService.getCircuitDetailsByCircuitId(documentData?.circuitId || 0),
    enabled: !!documentData?.circuitId,
  });

  // Fetch document circuit history
  const { data: circuitHistory, isLoading: isLoadingHistory, refetch: refetchHistory, error: historyError } = useQuery({
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

  console.log('Workflow status:', workflowStatus);
  
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
      
      {/* Error message */}
      {error && (
        <div className="p-4 rounded bg-red-900/20 border border-red-900/30 text-red-400 mb-4">
          {error}
          <Button 
            variant="link" 
            className="text-red-400 underline ml-2 p-0 h-auto" 
            onClick={() => window.location.reload()}
          >
            Reload page
          </Button>
        </div>
      )}
      
      {/* Loading state */}
      {isLoading ? (
        <LoadingState />
      ) : (
        <div className="flex flex-col gap-6">
          {/* Document information and statuses */}
          {workflowStatus && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Step Requirements</h3>
                <div className="bg-[#0a1033] border border-blue-900/30 p-4 rounded-md">
                  {workflowStatus.statuses && workflowStatus.statuses.length > 0 ? (
                    <div className="space-y-2">
                      {workflowStatus.statuses.map(status => (
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
            </div>
          )}

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
      
      {document && workflowStatus && (
        <>
          <MoveDocumentStepDialog
            documentId={Number(id)}
            documentTitle={document.title}
            circuitId={document.circuitId!}
            currentStepId={workflowStatus.currentStepId}
            open={moveDialogOpen}
            onOpenChange={setMoveDialogOpen}
            onSuccess={handleMoveSuccess}
          />
          
          {currentStepDetail && (
            <ProcessCircuitStepDialog
              documentId={Number(id)}
              documentTitle={document.title}
              currentStep={currentStepDetail.title}
              open={processDialogOpen}
              onOpenChange={setProcessDialogOpen}
              onSuccess={handleProcessSuccess}
            />
          )}
          
          {document.circuitId && workflowStatus.currentStepId && (
            <MoveToNextStepDialog
              documentId={Number(id)}
              documentTitle={document.title}
              circuitId={document.circuitId}
              currentStepId={workflowStatus.currentStepId}
              open={nextStepDialogOpen}
              onOpenChange={setNextStepDialogOpen}
              onSuccess={handleNextStepSuccess}
            />
          )}
        </>
      )}
    </div>
  );
};

export default DocumentFlowPage;
