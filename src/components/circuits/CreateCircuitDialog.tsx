
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
  DialogFooter,
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

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      descriptif: '',
    },
  });

  const watchAllFields = form.watch();

  // Step handling
  const handleNext = async () => {
    if (step === 1) {
      const valid = await form.trigger('title');
      if (valid) setStep(2);
    } else if (step === 2) {
      setStep(3);
    }
  };

  const handleBack = () => setStep((prev) => ((prev - 1) as Step));
  const handleEdit = (targetStep: Step) => {
    setStep(targetStep);
  };

  const handleClose = () => {
    setStep(1);
    form.reset();
    onOpenChange(false);
  };

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      await circuitService.createCircuit({
        title: values.title,
        descriptif: values.descriptif || '',
        // Add the missing properties
        isActive: true,
        hasOrderedFlow: false,
        allowBacktrack: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      toast.success('Circuit created successfully');
      form.reset();
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

  // Style helpers
  const dialogPanelClass = "bg-[#101942] border border-blue-900 shadow-2xl rounded-xl";
  const labelClass = "text-blue-200 font-medium";
  const editBtnClass = "ml-2 text-gray-400 hover:text-blue-400 pl-1 pr-1 py-0.5 rounded border border-transparent hover:border-blue-400 transition duration-150";
  const inputClass = "bg-[#0a1033] border-blue-800/80 text-blue-100 placeholder:text-blue-400 focus:border-blue-500 focus:ring-blue-500/80";
  const errorMsgClass = "text-red-400 text-xs";

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className={`sm:max-w-[480px] ${dialogPanelClass}`}>
        <DialogHeader>
          <DialogTitle className="text-xl text-white">Create Circuit</DialogTitle>
          <DialogDescription>
            Create a new circuit for document workflow
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
            autoComplete="off"
          >
            {step === 1 && (
              <>
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={labelClass}>Title *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter circuit title"
                          {...field}
                          autoFocus
                          className={inputClass + " h-11"}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage className={errorMsgClass} />
                    </FormItem>
                  )}
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
                    Next <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <FormField
                  control={form.control}
                  name="descriptif"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={labelClass}>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter circuit description (optional)"
                          {...field}
                          className={inputClass + " min-h-[100px]"}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage className={errorMsgClass} />
                    </FormItem>
                  )}
                />
                <div className="flex justify-between pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBack}
                    disabled={isSubmitting}
                    className="bg-black border-none text-gray-200 hover:bg-blue-950"
                  >
                    <ArrowLeft className="mr-1 h-4 w-4" /> Back
                  </Button>
                  <Button
                    type="button"
                    onClick={handleNext}
                    disabled={isSubmitting}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Next <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <Card className="mb-2 bg-[#141c37] border-blue-900 shadow-md transition-all">
                  <CardHeader>
                    <CardTitle className="text-white text-lg flex items-center gap-2">
                      Review Circuit
                      <Button
                        variant="ghost"
                        size="sm"
                        type="button"
                        className={editBtnClass}
                        onClick={() => handleEdit(1)}
                        disabled={isSubmitting}
                      >
                        <Edit className="w-4 h-4 mr-0.5" />
                        Edit Title
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="flex flex-col gap-5 text-blue-200">
                      <div>
                        <span className="font-semibold">Title:</span>
                        <span className="ml-2 text-blue-100">{watchAllFields.title}</span>
                      </div>
                      <div>
                        <span className="font-semibold">Description:</span>
                        <span className="ml-2 text-blue-300">
                          {watchAllFields.descriptif?.trim()
                            ? watchAllFields.descriptif
                            : <span className="italic text-gray-400">No description</span>}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          type="button"
                          className={editBtnClass + " ml-3"}
                          onClick={() => handleEdit(2)}
                          disabled={isSubmitting}
                        >
                          <Edit className="w-4 h-4 mr-0.5" />
                          Edit Description
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <div className="flex justify-between gap-2 pt-1">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBack}
                    disabled={isSubmitting}
                    className="bg-black border-none text-gray-200 hover:bg-blue-950"
                  >
                    <ArrowLeft className="mr-1 h-4 w-4" /> Back
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting || !watchAllFields.title}
                    className="bg-blue-700 text-white min-w-[130px] flex items-center justify-center"
                  >
                    {isSubmitting ? (
                      <>
                        Creating <Check className="ml-1 h-4 w-4 animate-spin" />
                      </>
                    ) : (
                      <>
                        Create Circuit <Check className="ml-1 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </>
            )}
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
