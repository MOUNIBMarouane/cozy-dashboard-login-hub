
import { CheckCircle, Circle } from 'lucide-react';
import { useStepForm } from './StepFormProvider';

interface StepFormProgressProps {
  currentStep: number;
  totalSteps: number;
}

export const StepFormProgress = ({ currentStep, totalSteps }: StepFormProgressProps) => {
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);

  return (
    <div className="mb-8">
      {/* Step indicators */}
      <div className="flex justify-center items-center mb-4">
        {steps.map((step) => (
          <div
            key={step}
            className="flex items-center"
          >
            <div
              className={`flex items-center justify-center h-10 w-10 rounded-full 
                ${step <= currentStep
                  ? 'bg-blue-600 text-white ring-4 ring-blue-600/20'
                  : step < currentStep
                  ? 'bg-blue-600/20 text-blue-600 border-2 border-blue-600'
                  : 'bg-gray-800 text-gray-400 border border-gray-700'
                }`}
            >
              {step < currentStep ? (
                <CheckCircle className="h-6 w-6" />
              ) : (
                <span>{step}</span>
              )}
            </div>
            
            {step !== steps.length && (
              <div
                className={`h-[2px] w-12 transition-colors
                  ${step < currentStep ? 'bg-blue-600' : 'bg-gray-700'}`}
              />
            )}
          </div>
        ))}
      </div>
      
      {/* Step title */}
      <p className="text-center text-base font-medium text-gray-300">
        {currentStep === 1 ? "Step Details" : "Review Step"}
      </p>
    </div>
  );
};
