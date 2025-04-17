
import { CheckCircle } from 'lucide-react';
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
              className={`flex items-center justify-center h-10 w-10 rounded-full transition-all duration-300
                ${step === currentStep
                  ? 'bg-blue-600 text-white ring-4 ring-blue-600/20 shadow-lg'
                  : step < currentStep
                  ? 'bg-blue-600 text-white border-2 border-blue-500'
                  : 'bg-gray-800/70 text-gray-400 border border-gray-700'
                }`}
            >
              {step < currentStep ? (
                <CheckCircle className="h-5 w-5 text-white" />
              ) : (
                <span className="text-sm font-medium">{step}</span>
              )}
            </div>
            
            {step !== steps.length && (
              <div
                className={`h-[2px] w-8 sm:w-12 md:w-16 transition-all duration-300
                  ${step < currentStep ? 'bg-blue-600' : 'bg-gray-700'}`}
              />
            )}
          </div>
        ))}
      </div>
      
      {/* Step title */}
      <p className="text-center text-lg font-medium text-blue-300 mb-2">
        {currentStep === 1 ? "Step Details" : "Review Step"}
      </p>
      <p className="text-center text-sm text-gray-400">
        {currentStep === 1 
          ? "Enter the basic information for your step" 
          : "Review your step before creating it"}
      </p>
    </div>
  );
};
