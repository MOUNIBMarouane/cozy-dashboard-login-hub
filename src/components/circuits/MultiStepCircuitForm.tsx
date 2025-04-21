
import { useCircuitForm } from '@/context/CircuitFormContext';
import StepOneTitle from './steps/StepOneTitle';
import StepTwoDescription from './steps/StepThreeSettings';
import StepThreeSettings from './steps/StepFourCircuitSteps';
import StepFourCircuitSteps from './steps/StepFiveReview';
import StepFiveReview from './steps/StepTwoDescription';

// Step indicator component
const StepIndicator = ({ currentStep }: { currentStep: number }) => {
  return (
    <div className="flex justify-center space-x-2 mb-8">
      {[1, 2, 3, 4, 5].map((step) => (
        <div key={step} className="flex items-center">
          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center font-semibold shadow-md transition-all border
              ${step === currentStep
                ? 'bg-blue-600 text-white border-blue-500 scale-110'
                : step < currentStep
                  ? 'bg-blue-900/40 text-blue-400 border-blue-500'
                  : 'bg-gray-900/50 text-gray-500 border-gray-700'
            }`}
          >
            {step < currentStep ? (
              <span>&#10003;</span>
            ) : (
              <span className="text-base">{step}</span>
            )}
          </div>
          {step < 5 && (
            <div
              className={`h-1 w-10 sm:w-12 md:w-16 rounded-full transition-colors
                ${step < currentStep ? 'bg-blue-600' : 'bg-gray-800'}`}
            ></div>
          )}
        </div>
      ))}
    </div>
  );
};

// Step title component
const StepTitle = ({ currentStep }: { currentStep: number }) => {
  const titles = [
    'Circuit Title',
    'Circuit Description',
    'Circuit Settings',
    'Circuit Steps (Optional)',
    'Review and Create'
  ];
  return (
    <h3 className="text-2xl font-semibold text-center text-white mb-2">{titles[currentStep - 1]}</h3>
  );
};

export default function MultiStepCircuitForm() {
  const { currentStep } = useCircuitForm();

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <StepOneTitle />;
      case 2:
        return <StepTwoDescription />;
      case 3:
        return <StepThreeSettings />;
      case 4:
        return <StepFourCircuitSteps />;
      case 5:
        return <StepFiveReview />;
      default:
        return <StepOneTitle />;
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      <StepIndicator currentStep={currentStep} />
      <StepTitle currentStep={currentStep} />
      <div className="mt-2 w-full max-w-2xl">{renderStep()}</div>
    </div>
  );
}
