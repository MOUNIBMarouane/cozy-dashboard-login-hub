
import { useState } from 'react';
import { GitBranch, MoveRight, AlertCircle, Check, ArrowRightCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CircuitStepCard } from './CircuitStepCard';
import { DocumentCircuitHistory } from '@/models/documentCircuit';
import { Document } from '@/models/document';
import { DraggableDocumentCard } from './DraggableDocumentCard';
import { toast } from 'sonner';
import circuitService from '@/services/circuitService';

interface CircuitStepsSectionProps {
  circuitDetails: any[];
  circuitHistory: DocumentCircuitHistory[];
  document: Document;
  currentStepId: number | undefined | null;
  isSimpleUser: boolean;
  onMoveClick: () => void;
  onProcessClick: () => void;
  onDocumentMoved: () => void;
}

export const CircuitStepsSection = ({
  circuitDetails,
  circuitHistory,
  document,
  currentStepId,
  isSimpleUser,
  onMoveClick,
  onProcessClick,
  onDocumentMoved
}: CircuitStepsSectionProps) => {
  const [showHelp, setShowHelp] = useState(false);
  const [draggedOverStepId, setDraggedOverStepId] = useState<number | null>(null);
  const [isMoving, setIsMoving] = useState(false);
  
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
        await circuitService.moveDocumentToStep({
          documentId: document.id,
          circuitDetailId: stepId,
        });
        
        toast.success(`Document moved to step successfully`);
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
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-white flex items-center">
          <GitBranch className="mr-2 h-5 w-5" /> Circuit Flow Steps
        </h2>
        
        <div className="flex items-center space-x-2">
          {showHelp && (
            <div className="text-sm text-gray-400 bg-blue-900/20 p-2 rounded border border-blue-900/30">
              {isSimpleUser ? 
                "You can view the document flow, but only admins can move documents between steps." : 
                "Drag the document card to a step or use the buttons to process or move the document."
              }
            </div>
          )}
          
          <Button 
            variant="ghost" 
            size="sm"
            className="text-gray-400 hover:text-white"
            onClick={() => setShowHelp(!showHelp)}
          >
            <AlertCircle className="h-4 w-4" />
          </Button>
          
          {!isSimpleUser && (
            <>
              <Button 
                onClick={onProcessClick}
                variant="outline"
                className="border-green-900/30 text-white hover:bg-green-900/20"
                disabled={isMoving}
              >
                <Check className="mr-2 h-4 w-4" /> Process Current Step
              </Button>
              
              <Button 
                onClick={onMoveClick}
                variant="outline"
                className="border-blue-900/30 text-white hover:bg-blue-900/20"
                disabled={isMoving}
              >
                <MoveRight className="mr-2 h-4 w-4" /> Move Document
              </Button>
            </>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 mb-6">
        {document && (
          <div className="w-full max-w-md">
            <DraggableDocumentCard 
              document={document} 
              onDragStart={() => console.log('Dragging document', document.id)} 
            />
          </div>
        )}
      </div>
      
      <div className="overflow-x-auto">
        <div className="flex space-x-4 pb-4 min-w-full">
          {circuitDetails?.map((detail) => {
            const historyForStep = circuitHistory?.filter(h => h.circuitDetailId === detail.id) || [];
            const isOver = draggedOverStepId === detail.id;
            
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
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
