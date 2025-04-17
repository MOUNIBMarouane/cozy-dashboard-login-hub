
import { useStepForm } from './StepFormProvider';
import { StepFormProgress } from './StepFormProgress';
import { StepBasicInfo } from './StepBasicInfo';
import { StepCircuitInfo } from './StepCircuitInfo';
import { StepSettings } from './StepSettings';
import { StepReview } from './StepReview';
import { StepFormActions } from './StepFormActions';

interface MultiStepStepFormProps {
  onCancel: () => void;
}

export const MultiStepStepForm = ({ onCancel }: MultiStepStepFormProps) => {
  const { currentStep, isWithinCircuitContext, totalSteps } = useStepForm();
  
  const renderStepContent = () => {
    if (isWithinCircuitContext) {
      // When in circuit context, skip the circuit selection step
      switch (currentStep) {
        case 1:
          return <StepBasicInfo />;
        case 2:
          return <StepSettings />;
        case 3:
          return <StepReview />;
        default:
          return <StepBasicInfo />;
      }
    } else {
      // Standard flow with circuit selection
      switch (currentStep) {
        case 1:
          return <StepBasicInfo />;
        case 2:
          return <StepCircuitInfo />;
        case 3:
          return <StepSettings />;
        case 4:
          return <StepReview />;
        default:
          return <StepBasicInfo />;
      }
    }
  };
  
  return (
    <div className="w-full max-w-2xl mx-auto">
      <StepFormProgress currentStep={currentStep} totalSteps={totalSteps} />
      
      <div className="py-4">
        {renderStepContent()}
      </div>
      
      <StepFormActions onCancel={onCancel} />
    </div>
  );
};
