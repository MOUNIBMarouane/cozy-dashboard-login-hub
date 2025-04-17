
import { useStepForm } from './StepFormProvider';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const StepReview = () => {
  const { formData, isEditMode } = useStepForm();

  return (
    <div className="space-y-6">
      <Card className="border border-blue-900/30 bg-[#0a1033] shadow-lg overflow-hidden">
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-blue-400 mb-3">Review Step Information</h3>
              
              <div className="rounded-md bg-[#0d1541] p-4 border border-blue-900/30">
                <div className="text-sm font-medium text-blue-300 mb-1">Title</div>
                <div className="text-white text-base mb-4">{formData.title}</div>
                
                <div className="text-sm font-medium text-blue-300 mb-1">Description</div>
                <div className="text-gray-300 text-base whitespace-pre-wrap">
                  {formData.descriptif || 'No description provided'}
                </div>
              </div>
            </div>

            <div className="rounded-md bg-[#0d1541] p-4 border border-blue-900/30">
              <div className="text-sm font-medium text-blue-300 mb-2">Step Type</div>
              <div className="flex items-center">
                {formData.isFinalStep ? (
                  <Badge className="bg-green-600 hover:bg-green-700">Final Step</Badge>
                ) : (
                  <Badge variant="outline" className="text-gray-300 border-gray-600">
                    Regular Step
                  </Badge>
                )}
              </div>
            </div>

            <div className="bg-blue-900/20 rounded-md p-4 border border-blue-500/30">
              <p className="text-sm text-blue-300">
                {isEditMode
                  ? "Review the information above before updating this step."
                  : "Please review the information above before creating this step."}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
