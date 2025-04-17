import React from 'react';
import { Circuit } from '@/models/circuit';
import { CircuitListContentProps } from './CircuitListContent.props';
import CircuitEmptyState from './CircuitEmptyState';
import CircuitLoadingState from './CircuitLoadingState';
import CircuitsTable from './CircuitsTable';
import CircuitListActions from './CircuitListActions';
import EditCircuitDialog from '../EditCircuitDialog';
import { DeleteConfirmDialog } from '@/components/admin/DeleteConfirmDialog';
import CircuitDetailsDialog from '../CircuitDetailsDialog';

const CircuitListContent: React.FC<CircuitListContentProps> = ({
  circuits,
  isLoading,
  isError,
  isSimpleUser,
  searchQuery,
  selectedCircuit,
  editDialogOpen,
  deleteDialogOpen,
  detailsDialogOpen,
  onEdit,
  onDelete,
  onViewDetails,
  setEditDialogOpen,
  setDeleteDialogOpen,
  setDetailsDialogOpen,
  confirmDelete,
  refetch
}) => {
  if (isLoading) {
    return <CircuitLoadingState />;
  }

  if (isError) {
    return (
      <div className="text-red-500">
        Error loading circuits. Please try again.
      </div>
    );
  }

  if (!circuits || circuits.length === 0) {
    return <CircuitEmptyState searchQuery={searchQuery} />;
  }

  return (
    <div>
      <CircuitListActions searchQuery={searchQuery} />
      <CircuitsTable
        circuits={circuits}
        isSimpleUser={isSimpleUser}
        onEdit={onEdit}
        onDelete={onDelete}
        onViewDetails={onViewDetails}
      />

      {selectedCircuit && (
        <>
          <EditCircuitDialog
            circuit={selectedCircuit}
            open={editDialogOpen}
            onOpenChange={setEditDialogOpen}
            onSuccess={refetch}
          />

          <DeleteConfirmDialog
            title="Delete Circuit"
            description={`Are you sure you want to delete "${selectedCircuit.title}"? This action cannot be undone.`}
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            onConfirm={confirmDelete}
          />

          <CircuitDetailsDialog
            circuit={selectedCircuit}
            open={detailsDialogOpen}
            onOpenChange={setDetailsDialogOpen}
          />
        </>
      )}
    </div>
  );
};

export { CircuitListContent };
