
import { AlertCircle, ArrowRightCircle, Check, MoveHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ActionDto } from '@/models/documentCircuit';

interface CircuitStepsSectionHeaderProps {
  showHelp: boolean;
  setShowHelp: (show: boolean) => void;
  isSimpleUser: boolean;
  availableActions: ActionDto[];
  canAdvanceToNextStep: boolean;
  canReturnToPreviousStep: boolean;
  isMoving: boolean;
  onProcessClick: () => void;
  onNextStepClick: () => void;
  onMoveClick: () => void;
}

export const CircuitStepsSectionHeader = ({
  showHelp,
  setShowHelp,
  isSimpleUser,
  availableActions,
  canAdvanceToNextStep,
  canReturnToPreviousStep,
  isMoving,
  onProcessClick,
  onNextStepClick,
  onMoveClick
}: CircuitStepsSectionHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-semibold text-white flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-5 w-5">
          <path d="m7 18 10-12"></path>
          <path d="M17 18V6"></path>
          <path d="M7 6v12"></path>
        </svg> Circuit Flow Steps
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
        
        {!isSimpleUser && availableActions?.length > 0 && (
          <>
            <Button 
              onClick={onProcessClick}
              variant="outline"
              className="border-green-900/30 text-white hover:bg-green-900/20"
              disabled={isMoving}
            >
              <Check className="mr-2 h-4 w-4" /> Process Current Step
            </Button>
            
            {canAdvanceToNextStep && (
              <Button 
                onClick={onNextStepClick}
                variant="default"
                className="bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isMoving}
              >
                <ArrowRightCircle className="mr-2 h-4 w-4" /> Move to Next Step
              </Button>
            )}
            
            {canReturnToPreviousStep && (
              <Button 
                onClick={onMoveClick}
                variant="outline"
                className="border-blue-900/30 text-white hover:bg-blue-900/20"
                disabled={isMoving}
              >
                <MoveHorizontal className="mr-2 h-4 w-4" /> Move Document
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
};
