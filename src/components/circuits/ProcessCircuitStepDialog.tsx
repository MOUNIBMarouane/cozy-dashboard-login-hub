
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import circuitService from '@/services/circuitService';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle } from 'lucide-react';
import { ActionDto } from '@/models/documentCircuit';

const formSchema = z.object({
  comments: z.string().min(3, { message: 'Comments must be at least 3 characters' }),
  isApproved: z.boolean(),
  actionId: z.number().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface ProcessCircuitStepDialogProps {
  documentId: number;
  documentTitle: string;
  currentStep: string; // Title of the current step
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export default function ProcessCircuitStepDialog({
  documentId,
  documentTitle,
  currentStep,
  open,
  onOpenChange,
  onSuccess,
}: ProcessCircuitStepDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch available actions
  const { data: workflowStatus } = useQuery({
    queryKey: ['document-workflow-status', documentId],
    queryFn: () => circuitService.getDocumentCurrentStatus(documentId),
    enabled: open && !!documentId,
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      comments: '',
      isApproved: true,
      actionId: undefined,
    },
  });

  // Set default action when available actions are loaded
  useEffect(() => {
    if (workflowStatus?.availableActions?.length > 0) {
      // Default to the first available action or an approval action if found
      const approvalAction = workflowStatus.availableActions.find(
        a => a.actionKey.includes('APPROVE') || a.title.toLowerCase().includes('approve')
      );
      
      const defaultAction = approvalAction || workflowStatus.availableActions[0];
      form.setValue('actionId', defaultAction.actionId);
    }
  }, [workflowStatus, form]);

  const onSubmit = async (values: FormValues) => {
    if (!values.actionId && workflowStatus?.availableActions?.length > 0) {
      values.actionId = workflowStatus.availableActions[0].actionId;
    }
    
    if (!values.actionId) {
      toast.error('No action available to process this step');
      return;
    }
    
    setIsSubmitting(true);
    try {
      await circuitService.performAction({
        documentId,
        actionId: values.actionId,
        comments: values.comments,
        isApproved: values.isApproved,
      });
      
      toast.success(`Document ${values.isApproved ? 'approved' : 'rejected'} successfully`);
      form.reset();
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      toast.error('Failed to process document');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApproveOrReject = (isApproved: boolean) => {
    form.setValue('isApproved', isApproved);
    
    // Set appropriate action based on approval status
    if (workflowStatus?.availableActions?.length > 0) {
      const actionToUse = isApproved
        ? workflowStatus.availableActions.find(a => 
            a.actionKey.includes('APPROVE') || a.title.toLowerCase().includes('approve'))
        : workflowStatus.availableActions.find(a => 
            a.actionKey.includes('REJECT') || a.title.toLowerCase().includes('reject'));
      
      // Default to first action if no specific action found
      form.setValue('actionId', actionToUse?.actionId || workflowStatus.availableActions[0].actionId);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Process Document Step</DialogTitle>
          <DialogDescription>
            Document: {documentTitle}<br/>
            Current Step: {currentStep}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="comments"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comments</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add your comments or feedback"
                      {...field}
                      rows={4}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isApproved"
              render={({ field }) => (
                <FormItem>
                  <div className="flex space-x-2 justify-center pt-4">
                    <Button
                      type="button"
                      className={`${field.value ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'} flex-1`}
                      onClick={() => handleApproveOrReject(true)}
                    >
                      <CheckCircle className="mr-2 h-4 w-4" /> Approve
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      className={`${!field.value ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'} flex-1`}
                      onClick={() => handleApproveOrReject(false)}
                    >
                      <XCircle className="mr-2 h-4 w-4" /> Reject
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Hidden action ID field */}
            <FormField
              control={form.control}
              name="actionId"
              render={() => <></>}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting || !workflowStatus?.availableActions?.length}
                className={form.watch('isApproved') ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
              >
                {isSubmitting ? 'Processing...' : form.watch('isApproved') ? 'Approve & Submit' : 'Reject & Submit'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
