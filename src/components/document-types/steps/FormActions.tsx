
import { ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface FormActionsProps {
  step: number;
  isEditMode: boolean;
  onNext: () => void;
  onPrev: () => void;
  onSubmit: () => void;
  onCancel: () => void;
  isNextDisabled?: boolean;
  isValidating?: boolean;
}

export const FormActions = ({
  step,
  isEditMode,
  onNext,
  onPrev,
  onSubmit,
  onCancel,
  isNextDisabled,
  isValidating
}: FormActionsProps) => {
  return (
    <div className="pt-4">
      {step === 1 && !isEditMode ? (
        <Button 
          onClick={onNext}
          disabled={isNextDisabled || isValidating}
          className="w-full h-11 text-base bg-blue-600 hover:bg-blue-700 transition-colors"
        >
          Next <ChevronRight className="ml-2 h-5 w-5" />
        </Button>
      ) : (
        <div className="flex flex-col gap-3">
          <Button 
            onClick={onSubmit}
            className="w-full h-11 text-base bg-green-600 hover:bg-green-700 transition-colors"
          >
            {isEditMode ? 'Update Type' : 'Create Type'}
          </Button>
          {!isEditMode && (
            <Button 
              variant="outline" 
              onClick={onPrev}
              className="w-full h-11 text-base border-blue-800/50 bg-blue-900/10 hover:bg-blue-900/20"
            >
              Back
            </Button>
          )}
        </div>
      )}
      <Button 
        variant="outline" 
        onClick={onCancel}
        className="w-full h-10 text-sm mt-3 border-blue-800/50 bg-blue-900/10 hover:bg-blue-900/20"
      >
        Cancel
      </Button>
    </div>
  );
};
