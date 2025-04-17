
import { ArrowLeft, Loader2, Save } from 'lucide-react';
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
    <div className="flex justify-between mt-4 gap-2">
      <Button
        type="button"
        variant="outline"
        onClick={isFirstStep ? onCancel : handlePrev}
        className="flex-1 sm:flex-none px-3 text-sm bg-transparent border-blue-800/50 hover:bg-blue-900/30 text-gray-300 shadow-sm"
        size="sm"
      >
        {isFirstStep ? 'Cancel' : (
          <>
            <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
            Back
          </>
        )}
      </Button>

      <Button
        type="button"
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="flex-1 sm:flex-none px-4 text-sm bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white shadow-md"
        size="sm"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
            {isLastStep ? 'Saving...' : 'Processing...'}
          </>
        ) : isLastStep ? (
          <>
            <Save className="mr-1.5 h-3.5 w-3.5" />
            {isEditMode ? 'Update Step' : 'Create Step'}
          </>
        ) : (
          'Continue'
        )}
      </Button>
    </div>
  );
};
