
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
  const { currentStep } = useStepForm();
  
  return (
    <div className="w-full max-w-2xl mx-auto">
      <StepFormProgress currentStep={currentStep} totalSteps={4} />
      
      <div className="py-4">
        {currentStep === 1 && <StepBasicInfo />}
        {currentStep === 2 && <StepCircuitInfo />}
        {currentStep === 3 && <StepSettings />}
        {currentStep === 4 && <StepReview />}
      </div>
      
      <StepFormActions onCancel={onCancel} />
    </div>
  );
};
