
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
import { useDocumentFlow } from '@/hooks/useDocumentFlow';

const DocumentFlowPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const {
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
  } = useDocumentFlow(id);

  if (!id) {
    navigate('/documents');
    return null;
  }

  // Check if the document has been loaded and doesn't have a circuit assigned
  const isNoCircuit = !isLoading && document && !document.circuitId;

  // If document is not in a circuit
  if (isNoCircuit) {
    return (
      <div className="p-6 space-y-6">
        <DocumentFlowHeader 
          documentId={id} 
          document={document}
          navigateBack={() => navigate(`/documents/${id}`)}
        />
        
        <NoCircuitAssignedCard 
          documentId={id}
          navigateToDocument={() => navigate(`/documents/${id}`)}
        />
      </div>
    );
  }

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
              onMoveClick={() => openDialog('move')}
              onProcessClick={() => openDialog('process')}
              onNextStepClick={() => openDialog('nextStep')}
              onDocumentMoved={refetchData}
            />
          )}
        </div>
      )}
      
      <DocumentDialogs
        document={document}
        workflowStatus={workflowStatus}
        moveDialogOpen={dialogState.moveOpen}
        processDialogOpen={dialogState.processOpen}
        nextStepDialogOpen={dialogState.nextStepOpen}
        setMoveDialogOpen={(open) => open ? openDialog('move') : closeDialog('move')}
        setProcessDialogOpen={(open) => open ? openDialog('process') : closeDialog('process')}
        setNextStepDialogOpen={(open) => open ? openDialog('nextStep') : closeDialog('nextStep')}
        handleMoveSuccess={() => handleSuccess('move')}
        handleProcessSuccess={() => handleSuccess('process')}
        handleNextStepSuccess={() => handleSuccess('nextStep')}
        currentStepDetail={currentStepDetail}
        availableActions={workflowStatus?.availableActions}
      />
    </div>
  );
};

export default DocumentFlowPage;
