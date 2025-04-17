
import { ArrowLeft, ArrowRight, Loader2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useStepForm } from './StepFormProvider';

interface StepFormActionsProps {
  onCancel: () => void;
}

export const StepFormActions = ({ onCancel }: StepFormActionsProps) => {
  const { 
    currentStep, 
    nextStep, 
    prevStep, 
    submitForm, 
    isSubmitting,
    isEditMode,
    totalSteps
  } = useStepForm();

  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps;

  const handleNext = () => {
    nextStep();
  };

  const handlePrev = () => {
    prevStep();
  };

  const handleSubmit = async () => {
    if (isLastStep) {
      await submitForm();
    } else {
      handleNext();
    }
  };

  return (
    <div className="flex justify-between mt-6">
      <Button
        type="button"
        variant="outline"
        onClick={isFirstStep ? onCancel : handlePrev}
      >
        {isFirstStep ? 'Cancel' : (
          <>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </>
        )}
      </Button>

      <Button
        type="button"
        onClick={handleSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {isLastStep ? 'Saving...' : 'Processing...'}
          </>
        ) : isLastStep ? (
          <>
            <Save className="mr-2 h-4 w-4" />
            {isEditMode ? 'Update' : 'Create'}
          </>
        ) : (
          <>
            Next
            <ArrowRight className="ml-2 h-4 w-4" />
          </>
        )}
      </Button>
    </div>
  );
};
