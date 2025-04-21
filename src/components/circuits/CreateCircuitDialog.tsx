
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
import { Switch } from '@/components/ui/switch';
import { ArrowRight, ArrowLeft, Edit, Check, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const formSchema = z.object({
  title: z.string().min(3, { message: 'Title must be at least 3 characters' }),
  descriptif: z.string().optional(),
  isActive: z.boolean().default(true),
  hasOrderedFlow: z.boolean().default(true),
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
      isActive: true,
      hasOrderedFlow: true,
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
  const handleEdit = (targetStep: Step) => setStep(targetStep);

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
        isActive: values.isActive,
        hasOrderedFlow: values.hasOrderedFlow,
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

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Circuit</DialogTitle>
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
                      <FormLabel>Title *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter circuit title" {...field} autoFocus />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClose}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    onClick={handleNext}
                    disabled={isSubmitting}
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
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter circuit description"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel>Active</FormLabel>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="hasOrderedFlow"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel>Sequential Flow</FormLabel>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex justify-between pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBack}
                    disabled={isSubmitting}
                  >
                    <ArrowLeft className="mr-1 h-4 w-4" /> Back
                  </Button>
                  <Button
                    type="button"
                    onClick={handleNext}
                    disabled={isSubmitting}
                  >
                    Next <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <Card className="mb-2">
                  <CardHeader>
                    <CardTitle>
                      Review Circuit
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-2 text-gray-400 hover:text-blue-500"
                        type="button"
                        onClick={() => handleEdit(1)}
                        disabled={isSubmitting}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit Title
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="flex flex-col gap-4">
                      <div>
                        <span className="font-semibold text-gray-400">Title:</span>
                        <span className="ml-2">{watchAllFields.title}</span>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-400">Description:</span>
                        <span className="ml-2">{watchAllFields.descriptif || <span className="italic text-gray-500">No description</span>}</span>
                      </div>
                      <div className="flex gap-4">
                        <span className="font-semibold text-gray-400">Status:</span>
                        <Badge variant={watchAllFields.isActive ? "default" : "secondary"}>
                          {watchAllFields.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      <div className="flex gap-4">
                        <span className="font-semibold text-gray-400">Flow Type:</span>
                        <Badge variant="outline">
                          {watchAllFields.hasOrderedFlow ? 'Sequential' : 'Parallel'}
                        </Badge>
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
                  >
                    <ArrowLeft className="mr-1 h-4 w-4" /> Back
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleEdit(2)}
                    disabled={isSubmitting}
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit Description/Options
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting || !watchAllFields.title}
                    className="bg-blue-700 text-white"
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
