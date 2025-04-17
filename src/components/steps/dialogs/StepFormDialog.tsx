
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { StepFormProvider } from '../form/StepFormProvider';
import { MultiStepStepForm } from '../form/MultiStepStepForm';

interface StepFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  editStep?: Step;
}

export const StepFormDialog = ({
  open,
  onOpenChange,
  onSuccess,
  editStep,
}: StepFormDialogProps) => {
  const handleSuccess = () => {
    onSuccess();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] bg-background">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {editStep ? 'Edit Step' : 'Create New Step'}
          </DialogTitle>
          <DialogDescription>
            {editStep
              ? 'Update this step's details'
              : 'Create a new step for your workflow circuit'}
          </DialogDescription>
        </DialogHeader>

        <StepFormProvider editStep={editStep} onSuccess={handleSuccess}>
          <MultiStepStepForm onCancel={() => onOpenChange(false)} />
        </StepFormProvider>
      </DialogContent>
    </Dialog>
  );
};
