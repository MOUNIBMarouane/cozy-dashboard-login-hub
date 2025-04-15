
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DocumentCircuitHistory } from '@/models/documentCircuit';
import { CircuitStepHistory } from './CircuitStepHistory';
import { CircuitStepFooter } from './CircuitStepFooter';

interface CircuitStepCardProps {
  detail: any;
  currentStepId: number | undefined | null;
  historyForStep: DocumentCircuitHistory[];
  isSimpleUser: boolean;
  onMoveClick: () => void;
  onProcessClick: () => void;
  isDraggedOver?: boolean;
  children?: React.ReactNode;
}

export const CircuitStepCard = ({ 
  detail, 
  currentStepId, 
  historyForStep, 
  isSimpleUser,
  onMoveClick,
  onProcessClick,
  isDraggedOver = false,
  children
}: CircuitStepCardProps) => {
  const isCurrentStep = detail.id === currentStepId;
  
  return (
    <Card 
      className={`h-full ${
        isDraggedOver 
          ? 'bg-[#0a1033] border-green-500 shadow-lg shadow-green-500/20 transition-all duration-300' 
          : isCurrentStep 
            ? 'bg-[#0a1033] border-green-500/60 shadow-md shadow-green-500/20' 
            : 'bg-[#0a1033] border-blue-900/30'
      }`}
    >
      <CardHeader className={`pb-3 ${
        isCurrentStep ? 'border-b border-green-500/30 bg-[#060927]' : 'border-b border-blue-900/30'
      }`}>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center">
            <Badge 
              variant={isCurrentStep ? "success" : "outline"} 
              className="mr-2"
            >
              {((detail.orderIndex + 10) / 10 )  }
            </Badge>
            {detail.title}
          </CardTitle>
          {isCurrentStep && (
            <Badge variant="success" className="ml-2">Current</Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        <p className="text-sm text-gray-400 mb-4">
          {detail.descriptif || 'No description provided for this step'}
        </p>

        {/* Document card if this is the current step */}
        {children}

        {/* History items for this step */}
        <CircuitStepHistory historyForStep={historyForStep} />
      </CardContent>
      
      <CircuitStepFooter 
        responsibleRoleId={detail.responsibleRoleId}
        isCurrentStep={isCurrentStep}
        isSimpleUser={isSimpleUser}
        onProcessClick={onProcessClick}
        onMoveClick={onMoveClick}
      />
    </Card>
  );
};
