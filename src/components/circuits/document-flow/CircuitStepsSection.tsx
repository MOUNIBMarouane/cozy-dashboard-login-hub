
import { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CircuitStepCard } from './CircuitStepCard';
import { DocumentCircuitHistory, DocumentWorkflowStatus } from '@/models/documentCircuit';
import { Document } from '@/models/document';
import { DraggableDocumentCard } from './DraggableDocumentCard';
import { toast } from 'sonner';
import circuitService from '@/services/circuitService';
import { CircuitStepsSectionHeader } from './CircuitStepsSectionHeader';

interface CircuitStepsSectionProps {
  circuitDetails: any[];
  circuitHistory: DocumentCircuitHistory[];
  document: Document;
  workflowStatus: DocumentWorkflowStatus;
  isSimpleUser: boolean;
  onMoveClick: () => void;
  onProcessClick: () => void;
  onNextStepClick: () => void;
  onDocumentMoved: () => void;
}

export const CircuitStepsSection = ({
  circuitDetails,
  circuitHistory,
  document,
  workflowStatus,
  isSimpleUser,
  onMoveClick,
  onProcessClick,
  onNextStepClick,
  onDocumentMoved
}: CircuitStepsSectionProps) => {
  const [showHelp, setShowHelp] = useState(false);
  const [draggedOverStepId, setDraggedOverStepId] = useState<number | null>(null);
  const [isMoving, setIsMoving] = useState(false);
  const currentStepId = workflowStatus?.currentStepId;
  
  if (!circuitDetails || circuitDetails.length === 0) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          No steps defined for this circuit. The circuit may be improperly configured.
        </AlertDescription>
      </Alert>
    );
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, stepId: number) => {
    e.preventDefault();
    if (stepId !== currentStepId && !isSimpleUser) {
      setDraggedOverStepId(stepId);
    }
  };

  const handleDragLeave = () => {
    setDraggedOverStepId(null);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>, stepId: number) => {
    e.preventDefault();
    setDraggedOverStepId(null);
    
    // Prevent drops for simple users or if dropping onto current step
    if (isSimpleUser || stepId === currentStepId) {
      return;
    }

    try {
      const data = JSON.parse(e.dataTransfer.getData('application/json'));
      if (data.documentId && document?.id === data.documentId) {
        setIsMoving(true);
        
        // Find available action for moving to this step
        const moveAction = workflowStatus.availableActions.find(action => 
          action.actionKey.includes('MOVE') || action.title.toLowerCase().includes('move')
        );
        
        if (moveAction) {
          await circuitService.performAction({
            documentId: document.id,
            actionId: moveAction.actionId,
            comments: `Moved document to step #${stepId}`,
            isApproved: true
          });
          toast.success(`Document moved to step successfully`);
        } else {
          await circuitService.moveDocumentToStep({
            documentId: document.id,
            circuitDetailId: stepId,
          });
          toast.success(`Document moved to step successfully`);
        }
        
        onDocumentMoved();
      }
    } catch (error) {
      console.error('Error moving document:', error);
      toast.error('Failed to move document to this step');
    } finally {
      setIsMoving(false);
    }
  };
  
  return (
    <div>
      <CircuitStepsSectionHeader 
        showHelp={showHelp}
        setShowHelp={setShowHelp}
        isSimpleUser={isSimpleUser}
        availableActions={workflowStatus.availableActions || []}
        canAdvanceToNextStep={workflowStatus.canAdvanceToNextStep}
        canReturnToPreviousStep={workflowStatus.canReturnToPreviousStep}
        isMoving={isMoving}
        onProcessClick={onProcessClick}
        onNextStepClick={onNextStepClick}
        onMoveClick={onMoveClick}
      />
      
      <div className="overflow-x-auto">
        <div className="flex space-x-4 pb-4 min-w-full">
          {circuitDetails?.map((detail) => {
            const historyForStep = circuitHistory?.filter(h => h.circuitDetailId === detail.id) || [];
            const isOver = draggedOverStepId === detail.id;
            const isCurrentStep = detail.id === currentStepId;
            
            return (
              <div 
                key={detail.id} 
                className={`w-80 flex-shrink-0 ${isOver ? 'scale-105 transform transition-transform' : ''}`}
                onDragOver={(e) => handleDragOver(e, detail.id)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, detail.id)}
              >
                <CircuitStepCard 
                  detail={detail}
                  currentStepId={currentStepId}
                  historyForStep={historyForStep}
                  isSimpleUser={isSimpleUser}
                  onMoveClick={onMoveClick}
                  onProcessClick={onProcessClick}
                  isDraggedOver={isOver}
                >
                  {isCurrentStep && document && (
                    <div className="mt-4 mb-2">
                      <DraggableDocumentCard 
                        document={document} 
                        onDragStart={() => console.log('Dragging document', document.id)} 
                      />
                    </div>
                  )}
                </CircuitStepCard>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
