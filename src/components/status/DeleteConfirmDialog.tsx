
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

interface DeleteConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isBulk?: boolean;
  count?: number;
}

const DeleteConfirmDialog = ({
  open,
  onOpenChange,
  onConfirm,
  isBulk = false,
  count = 0,
}: DeleteConfirmDialogProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-[#111633] border-blue-900/40 text-white">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-white">
            {isBulk ? 'Delete Multiple Statuses' : 'Delete Status'}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-400">
            {isBulk
              ? `Are you sure you want to delete ${count} selected status${count !== 1 ? 'es' : ''}? This action cannot be undone.`
              : 'Are you sure you want to delete this status? This action cannot be undone.'}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-[#111633] text-gray-300 border-blue-900/40 hover:bg-blue-900/30">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-red-600 text-white hover:bg-red-700"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteConfirmDialog;
