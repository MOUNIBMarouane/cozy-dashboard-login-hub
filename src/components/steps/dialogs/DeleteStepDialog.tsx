
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface DeleteStepDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isBulk?: boolean;
  count?: number;
}

export const DeleteStepDialog = ({
  open,
  onOpenChange,
  onConfirm,
  isBulk = false,
  count = 0,
}: DeleteStepDialogProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-background border-destructive/20">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-destructive">
            {isBulk ? `Delete ${count} Steps` : 'Delete Step'}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {isBulk
              ? `Are you sure you want to delete ${count} selected steps? This action cannot be undone.`
              : 'Are you sure you want to delete this step? This action cannot be undone.'}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="border-blue-900/30">Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-600 hover:bg-red-700 text-white"
            onClick={onConfirm}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
