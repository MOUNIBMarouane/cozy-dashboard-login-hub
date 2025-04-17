
import { Circuit } from '@/models/circuit';
import { RefetchOptions } from '@tanstack/react-query';

export interface CircuitListContentProps {
  circuits: Circuit[] | undefined;
  isLoading: boolean;
  isError: boolean;
  isSimpleUser: boolean;
  searchQuery: string;
  selectedCircuit: Circuit | null;
  editDialogOpen: boolean;
  deleteDialogOpen: boolean;
  detailsDialogOpen: boolean;
  onEdit: (circuit: Circuit) => void;
  onDelete: (circuit: Circuit) => void;
  onViewDetails: (circuit: Circuit) => void;
  setEditDialogOpen: (open: boolean) => void;
  setDeleteDialogOpen: (open: boolean) => void;
  setDetailsDialogOpen: (open: boolean) => void;
  confirmDelete: () => void;
  refetch: (options?: RefetchOptions) => Promise<any>;
}
