import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import circuitService from '@/services/circuitService';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowLeft, Edit, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import StepOneTitle from './steps/StepOneTitle';
import StepTwoDescription from './steps/StepTwoDescription';
import StepThreeReview from './steps/StepThreeReview';

const formSchema = z.object({
  title: z.string().min(3, { message: 'Title must be at least 3 characters' }),
  descriptif: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface CreateCircuitDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

type Step = 1 | 2 | 3;

export default function CreateCircuitDialog({
  open,
  onOpenChange,
  onSuccess,
}: CreateCircuitDialogProps) {
  const [step, setStep] = useState<Step>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formValues, setFormValues] = useState<FormValues>({ title: '', descriptif: '' });
  const [errors, setErrors] = useState<{ title?: string }>({});

  // Keep current field refs for autofocus management if needed

  // Step handling
  const handleNext = async () => {
    if (step === 1) {
      // Validate Title
      const res = formSchema.safeParse({ ...formValues });
      if (!res.success) {
        // Only check title error at this step
        setErrors({ title: res.error.flatten().fieldErrors.title?.[0] });
        return;
      } else {
        setErrors({});
        setStep(2);
      }
    } else if (step === 2) {
      setStep(3);
    }
  };

  const handleBack = () => setStep((prev) => ((prev - 1) as Step));
  const handleEdit = (targetStep: Step) => setStep(targetStep);

  const handleClose = () => {
    setStep(1);
    setFormValues({ title: '', descriptif: '' });
    setErrors({});
    onOpenChange(false);
  };

  const handleFieldChange = (key: keyof FormValues, value: string) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const handleSubmit = async () => {
    // Validate required fields, just in case
    const res = formSchema.safeParse(formValues);
    if (!res.success) {
      setErrors({ title: res.error.flatten().fieldErrors.title?.[0] });
      setStep(1);
      return;
    }
    setIsSubmitting(true);
    try {
      await circuitService.createCircuit({
        title: formValues.title,
        descriptif: formValues.descriptif || '',
        isActive: true,           // required by backend but not prompted in UI
        hasOrderedFlow: false,    // required by backend but not prompted in UI
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      toast.success('Circuit created successfully');
      setFormValues({ title: '', descriptif: '' });
      setStep(1);
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      toast.error('Failed to create circuit');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // UI Style helpers remain same
  const dialogPanelClass = "bg-[#101942] border border-blue-900 shadow-2xl rounded-xl";

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className={`sm:max-w-[480px] ${dialogPanelClass}`}>
        <DialogHeader>
          <DialogTitle className="text-xl text-white">Create Circuit</DialogTitle>
          <DialogDescription>
            Create a new circuit for document workflow
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-4" autoComplete="off" onSubmit={e => e.preventDefault()}>
          {step === 1 && (
            <>
              <StepOneTitle
                value={formValues.title}
                onChange={(value) => handleFieldChange('title', value)}
                error={errors.title}
                disabled={isSubmitting}
              />
              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="bg-black border-none text-gray-200 hover:bg-blue-950"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleNext}
                  disabled={isSubmitting}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Next <span className="ml-1">→</span>
                </Button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <StepTwoDescription
                value={formValues.descriptif || ''}
                onChange={(value) => handleFieldChange('descriptif', value)}
                disabled={isSubmitting}
              />
              <div className="flex justify-between pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  disabled={isSubmitting}
                  className="bg-black border-none text-gray-200 hover:bg-blue-950"
                >
                  ← Back
                </Button>
                <Button
                  type="button"
                  onClick={handleNext}
                  disabled={isSubmitting}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Next <span className="ml-1">→</span>
                </Button>
              </div>
            </>
          )}

          {step === 3 && (
            <StepThreeReview
              title={formValues.title}
              descriptif={formValues.descriptif || ''}
              disabled={isSubmitting}
              onEdit={handleEdit}
              onBack={handleBack}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
            />
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}
