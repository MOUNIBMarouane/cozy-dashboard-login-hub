
import { CircleCheck, CircleDashed } from 'lucide-react';

interface StepFormProgressProps {
  currentStep: number;
  totalSteps: number;
}

export const StepFormProgress = ({ currentStep, totalSteps }: StepFormProgressProps) => {
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);

  return (
    <div className="flex flex-wrap justify-center mt-2 mb-6">
      <div className="flex justify-center items-center space-x-2">
        {steps.map((step) => (
          <div
            key={step}
            className={`flex items-center ${
              step !== steps.length ? 'mr-6' : ''
            }`}
          >
            <div
              className={`flex items-center justify-center h-8 w-8 rounded-full border ${
                step <= currentStep
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : 'bg-transparent border-gray-300 text-gray-300'
              }`}
            >
              {step < currentStep ? (
                <CircleCheck className="h-6 w-6" />
              ) : step === currentStep ? (
                <span>{step}</span>
              ) : (
                <CircleDashed className="h-6 w-6" />
              )}
            </div>
            
            {step !== steps.length && (
              <div
                className={`hidden sm:block h-px w-12 ml-2 ${
                  step < currentStep ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              />
            )}
          </div>
        ))}
      </div>
      
      <div className="w-full flex justify-center text-center mt-2">
        <p className="text-sm text-muted-foreground">
          Step {currentStep}: {getStepTitle(currentStep)}
        </p>
      </div>
    </div>
  );
};

function getStepTitle(step: number): string {
  switch (step) {
    case 1:
      return 'Basic Information';
    case 2:
      return 'Circuit Assignment';
    case 3:
      return 'Step Settings';
    case 4:
      return 'Review';
    default:
      return '';
  }
}
