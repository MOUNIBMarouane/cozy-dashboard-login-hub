
import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { ScrollArea } from '@/components/ui/scroll-area';
import { Status } from '@/models/status';
import statusService from '@/services/statusService';
import circuitService from '@/services/circuitService';

// Import components
import StatusTable from '@/components/status/StatusTable';
import StatusGrid from '@/components/status/StatusGrid';
import StatusForm from '@/components/status/StatusForm';
import BottomActionBar from '@/components/status/BottomActionBar';
import EmptyState from '@/components/status/EmptyState';
import DeleteConfirmDialog from '@/components/status/DeleteConfirmDialog';
import LoadingState from '@/components/status/LoadingState';
import StatusHeader from '@/components/status/StatusHeader';
import StatusPagination from '@/components/status/StatusPagination';
import { useStatusManagement } from '@/hooks/useStatusManagement';

type ViewMode = 'table' | 'grid';

const StatusManagement = () => {
  const { stepId } = useParams<{ stepId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const stepName = new URLSearchParams(location.search).get('name') || undefined;
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [statusToDelete, setStatusToDelete] = useState<number | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<Status | null>(null);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('table');

  const stepIdNumber = stepId ? parseInt(stepId, 10) : undefined;

  const {
    statuses,
    isLoading,
    searchQuery,
    setSearchQuery,
    sortField,
    sortDirection,
    handleSort,
    currentPage,
    setCurrentPage,
    totalPages,
    selectedStatuses,
    handleSelectStatus,
    handleSelectAll,
    fetchStatuses,
    filteredAndSortedStatuses
  } = useStatusManagement(stepIdNumber);

  const { data: step } = useQuery({
    queryKey: ['step', stepIdNumber],
    queryFn: () => stepIdNumber ? circuitService.getStep(stepIdNumber) : Promise.resolve(null),
    enabled: !!stepIdNumber,
  });

  useEffect(() => {
    if (!stepIdNumber) {
      toast.error('Step ID is required');
      navigate('/circuits');
    }
  }, [stepIdNumber, navigate]);

  const openDeleteDialog = (id: number) => {
    setStatusToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    try {
      if (statusToDelete) {
        await statusService.deleteStatus(statusToDelete);
        toast.success('Status deleted successfully');
        fetchStatuses();
      }
    } catch (error) {
      console.error('Failed to delete status:', error);
      toast.error('Failed to delete status');
    } finally {
      setDeleteDialogOpen(false);
      setStatusToDelete(null);
    }
  };

  const handleEditStatus = (status: Status) => {
    setCurrentStatus(status);
    setIsEditMode(true);
    setIsDrawerOpen(true);
  };

  const handleBulkDelete = async () => {
    try {
      await statusService.deleteBulkStatuses(selectedStatuses);
      toast.success(`Successfully deleted ${selectedStatuses.length} status${selectedStatuses.length !== 1 ? 'es' : ''}`);
      fetchStatuses();
    } catch (error) {
      console.error('Failed to delete statuses in bulk:', error);
      toast.error('Failed to delete some or all statuses');
    } finally {
      setBulkDeleteDialogOpen(false);
    }
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setCurrentStatus(null);
    setIsEditMode(false);
  };

  const handleViewModeChange = (value: ViewMode) => {
    if (value) setViewMode(value);
  };

  return (
    <div className="h-full flex flex-col bg-[#070b28]">
      <StatusHeader 
        viewMode={viewMode}
        stepName={stepName || step?.title}
        onViewModeChange={handleViewModeChange}
        onNewStatusClick={() => setIsDrawerOpen(true)}
      />

      <div className="flex-1 overflow-hidden px-4 md:px-6 py-4">
        {isLoading ? (
          <LoadingState />
        ) : statuses.length > 0 ? (
          <Card className="bg-[#0f1642] border-blue-900/30 shadow-xl h-full flex flex-col">
            <CardHeader className="pb-0">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <CardTitle className="text-xl text-white">Status Requirements</CardTitle>
                  <CardDescription className="text-blue-300">
                    {filteredAndSortedStatuses.length} {filteredAndSortedStatuses.length === 1 ? 'status' : 'statuses'} {searchQuery ? 'found' : 'available'}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0 mt-4 flex-1 overflow-hidden">
              <ScrollArea className="h-[calc(100vh-260px)]">
                {viewMode === 'table' ? (
                  <StatusTable 
                    statuses={statuses}
                    selectedStatuses={selectedStatuses}
                    onSelectStatus={handleSelectStatus}
                    onSelectAll={handleSelectAll}
                    onDeleteStatus={openDeleteDialog}
                    onEditStatus={handleEditStatus}
                    onSort={handleSort}
                    sortField={sortField}
                    sortDirection={sortDirection}
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                  />
                ) : (
                  <StatusGrid
                    statuses={statuses}
                    onDeleteStatus={openDeleteDialog}
                    onEditStatus={handleEditStatus}
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                  />
                )}
              </ScrollArea>
              
              <StatusPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </CardContent>
          </Card>
        ) : (
          <EmptyState onAddStatus={() => setIsDrawerOpen(true)} />
        )}
      </div>

      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent className="bg-[#111633] p-6 max-w-lg mx-auto">
          <DrawerHeader className="text-center pb-6">
            <DrawerTitle className="text-2xl font-bold text-white">
              {isEditMode ? 'Edit Status' : 'Create Status'}
            </DrawerTitle>
            <DrawerDescription className="mt-2 text-blue-300">
              {isEditMode 
                ? 'Modify an existing status requirement' 
                : 'Create a new status requirement for workflow step'}
            </DrawerDescription>
          </DrawerHeader>
      
          <div className="px-1">
            <StatusForm
              status={currentStatus}
              stepId={stepIdNumber}
              isEditMode={isEditMode}
              onSuccess={() => {
                handleCloseDrawer();
                fetchStatuses();
                toast.success(isEditMode 
                  ? 'Status updated successfully' 
                  : 'Status created successfully');
              }}
              onCancel={handleCloseDrawer}
            />
          </div>
        </DrawerContent>
      </Drawer>

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDelete}
      />

      <DeleteConfirmDialog
        open={bulkDeleteDialogOpen}
        onOpenChange={setBulkDeleteDialogOpen}
        onConfirm={handleBulkDelete}
        isBulk={true}
        count={selectedStatuses.length}
      />

      <BottomActionBar
        selectedCount={selectedStatuses.length}
        onBulkDelete={() => setBulkDeleteDialogOpen(true)}
      />
    </div>
  );
};

export default StatusManagement;
