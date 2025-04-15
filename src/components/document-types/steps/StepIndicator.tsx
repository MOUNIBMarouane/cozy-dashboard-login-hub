
import { Check } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: number;
}

export const StepIndicator = ({ currentStep }: StepIndicatorProps) => {
  return (
    <div className="flex justify-center mb-8">
      <div className="flex items-center space-x-4">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-200
          ${currentStep === 1 ? "bg-blue-600 text-white" : "bg-green-500 text-white"}`}>
          {currentStep === 1 ? "1" : <Check className="h-5 w-4"/>}
        </div>
        <div className={`h-0.5 w-16 transition-colors duration-200 
          ${currentStep > 1 ? "bg-green-500" : "bg-gray-600/30"}`}></div>
        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-200
          ${currentStep === 2 ? "bg-blue-600 text-white" : "bg-gray-800/50 text-gray-400"}`}>
          2
        </div>
      </div>
    </div>
  );
};
