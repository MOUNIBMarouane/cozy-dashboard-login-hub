
import { CheckCircle, MoveRight } from 'lucide-react';
import { CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface CircuitStepFooterProps {
  responsibleRoleId?: number;
  isCurrentStep: boolean;
  isSimpleUser: boolean;
  onProcessClick: () => void;
  onMoveClick: () => void;
}

export const CircuitStepFooter = ({
  responsibleRoleId,
  isCurrentStep,
  isSimpleUser,
  onProcessClick,
  onMoveClick
}: CircuitStepFooterProps) => {
  return (
    <CardFooter className="p-3 rounded-lg border-t border-blue-900/30 bg-[#060927] flex justify-between">
      {/* {responsibleRoleId ? (
        <Badge variant="outline" className="text-xs">
          Responsible: Role #{responsibleRoleId}
        </Badge>
      ) : (
        <span className="text-xs text-gray-500">No responsible role</span>
      )} */}
      
      {isCurrentStep && !isSimpleUser && (
        <div className="flex space-x-2 w-full justify-between">
          <Button 
            size="sm" 
            variant="outline"
            className="text-xs bg-green-900/10 border-green-900/30 hover:bg-green-900/20"
            onClick={onProcessClick}
          >
            <CheckCircle className="h-3 w-3 mr-1" /> Process
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            className="text-xs"
            onClick={onMoveClick}
          >
            <MoveRight className="h-3 w-3 mr-1" /> Move
          </Button>
        </div>
      )}
    </CardFooter>
  );
};
