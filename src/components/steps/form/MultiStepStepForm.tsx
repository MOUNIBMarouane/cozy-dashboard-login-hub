
import { useStepForm } from './StepFormProvider';
import { StepFormProgress } from './StepFormProgress';
import { StepBasicInfo } from './StepBasicInfo';
import { StepReview } from './StepReview';
import { StepFormActions } from './StepFormActions';

interface MultiStepStepFormProps {
  onCancel: () => void;
}

export const MultiStepStepForm = ({ onCancel }: MultiStepStepFormProps) => {
  const { currentStep, totalSteps } = useStepForm();
  
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <StepBasicInfo />;
      case 2:
        return <StepReview />;
      default:
        return <StepBasicInfo />;
    }
  };
  
  return (
    <div className="w-full max-w-full mx-auto px-3 sm:px-4">
      <StepFormProgress currentStep={currentStep} totalSteps={totalSteps} />
      
      <div className="py-3">
        {renderStepContent()}
      </div>
      
      <StepFormActions onCancel={onCancel} />
    </div>
  );
};
