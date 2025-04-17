
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface DeleteStatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  status: any | null;
  onSuccess: () => void;
}

export function DeleteStatusDialog({
  open,
  onOpenChange,
  status,
  onSuccess,
}: DeleteStatusDialogProps) {
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!status) return;
    
    setIsDeleting(true);
    
    try {
      await fetch(`/api/Status/${status.statusId}`, {
        method: 'DELETE',
      });
      
      toast({
        title: 'Status deleted',
        description: 'The status has been deleted successfully',
      });
      
      onSuccess();
      onOpenChange(false);
      
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An error occurred while deleting the status',
        variant: 'destructive',
      });
      console.error('Error deleting status:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-background">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            Delete Status
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the status "{status?.title}"? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete Status'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
