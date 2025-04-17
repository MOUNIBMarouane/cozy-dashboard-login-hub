
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface StatusFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  status?: any;
  stepId: number;
}

export function StatusFormDialog({
  open,
  onOpenChange,
  onSuccess,
  status,
  stepId,
}: StatusFormDialogProps) {
  const { toast } = useToast();
  const [title, setTitle] = useState(status?.title || '');
  const [isRequired, setIsRequired] = useState(status?.isRequired || false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (status) {
        // Update existing status
        await fetch(`/api/Status/${status.statusId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title,
            isRequired,
          }),
        });
        toast({
          title: 'Status updated',
          description: 'The status has been updated successfully',
        });
      } else {
        // Create new status
        await fetch(`/api/Status/step/${stepId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title,
            isRequired,
          }),
        });
        toast({
          title: 'Status created',
          description: 'The status has been created successfully',
        });
      }
      
      onSuccess();
      onOpenChange(false);
      
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An error occurred. Please try again.',
        variant: 'destructive',
      });
      console.error('Error submitting status:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-background">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {status ? 'Edit Status' : 'Create New Status'}
          </DialogTitle>
          <DialogDescription>
            {status
              ? "Update the status details"
              : 'Add a new status to this step'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter status title"
                required
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isRequired"
                checked={isRequired}
                onCheckedChange={(checked) => setIsRequired(!!checked)}
              />
              <Label htmlFor="isRequired" className="cursor-pointer">
                This status is required
              </Label>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : status ? 'Update Status' : 'Create Status'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
