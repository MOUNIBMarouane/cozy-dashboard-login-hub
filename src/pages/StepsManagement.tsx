
import { useState } from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useSteps } from '@/hooks/useSteps';
import stepService from '@/services/stepService';
import { StepHeader } from '@/components/steps/StepHeader';
import { StepTable } from '@/components/steps/StepTable';
import { StepGrid } from '@/components/steps/StepGrid';
import { BulkActionBar } from '@/components/steps/BulkActionBar';
import { StepEmptyState } from '@/components/steps/StepEmptyState';
import { StepLoadingState } from '@/components/steps/StepLoadingState';
import { DeleteStepDialog } from '@/components/steps/dialogs/DeleteStepDialog';
import { StepFormDialog } from '@/components/steps/dialogs/StepFormDialog';

const StepsManagement = () => {
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [stepToDelete, setStepToDelete] = useState<Step | null>(null);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<Step | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  const {
    steps,
    allSteps,
    circuits,
    isLoading,
    searchQuery,
    setSearchQuery,
    selectedSteps,
    handleSelectStep,
    handleSelectAll,
    sortField,
    sortDirection,
    handleSort,
    currentPage,
    setCurrentPage,
    totalPages,
    filterOptions,
    setFilterOptions,
    resetFilters,
    refetch
  } = useSteps();

  const openDeleteDialog = (step: Step) => {
    setStepToDelete(step);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    try {
      if (stepToDelete) {
        await stepService.deleteStep(stepToDelete.id);
        toast.success('Step deleted successfully');
        refetch();
      }
    } catch (error) {
      console.error('Failed to delete step:', error);
      toast.error('Failed to delete step');
    } finally {
      setDeleteDialogOpen(false);
      setStepToDelete(null);
    }
  };

  const handleEditStep = (step: Step) => {
    setCurrentStep(step);
    setIsFormDialogOpen(true);
  };

  const handleBulkDelete = async () => {
    try {
      await stepService.deleteMultipleSteps(selectedSteps);
      toast.success(`Successfully deleted ${selectedSteps.length} steps`);
      refetch();
    } catch (error) {
      console.error('Failed to delete steps in bulk:', error);
      toast.error('Failed to delete some or all steps');
    } finally {
      setBulkDeleteDialogOpen(false);
    }
  };

  const handleAddStep = () => {
    setCurrentStep(null);
    setIsFormDialogOpen(true);
  };

  const handleFormSuccess = () => {
    refetch();
  };

  return (
    <div className="h-full flex flex-col bg-[#070b28]">
      <div className="px-4 py-6 md:px-6 md:py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">Steps Management</h1>
            <p className="text-muted-foreground mt-1">
              Create and manage workflow steps for your circuits
            </p>
          </div>
        </div>

        <StepHeader
          onAddStep={handleAddStep}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        <div className="space-y-4">
          {isLoading ? (
            <StepLoadingState />
          ) : allSteps.length > 0 ? (
            <Card className="bg-[#0f1642] border-blue-900/30 shadow-xl">
              <CardHeader className="pb-0">
                <CardTitle className="text-xl text-white">Workflow Steps</CardTitle>
                <CardDescription className="text-blue-300">
                  {steps.length} {steps.length === 1 ? 'step' : 'steps'} {searchQuery ? 'found' : 'available'}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0 mt-4">
                <ScrollArea className="h-[calc(100vh-280px)]">
                  {viewMode === 'table' ? (
                    <StepTable
                      steps={steps}
                      circuits={circuits}
                      selectedSteps={selectedSteps}
                      onSelectStep={handleSelectStep}
                      onSelectAll={handleSelectAll}
                      onDelete={openDeleteDialog}
                      onEdit={handleEditStep}
                      onSort={handleSort}
                      sortField={sortField}
                      sortDirection={sortDirection}
                      searchQuery={searchQuery}
                      onSearchChange={setSearchQuery}
                      filterOptions={filterOptions}
                      setFilterOptions={setFilterOptions}
                      resetFilters={resetFilters}
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                    />
                  ) : (
                    <StepGrid
                      steps={steps}
                      circuits={circuits}
                      onDeleteStep={openDeleteDialog}
                      onEditStep={handleEditStep}
                      searchQuery={searchQuery}
                      onSearchChange={setSearchQuery}
                    />
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          ) : (
            <StepEmptyState onAddStep={handleAddStep} />
          )}
        </div>
      </div>

      <StepFormDialog
        open={isFormDialogOpen}
        onOpenChange={setIsFormDialogOpen}
        onSuccess={handleFormSuccess}
        editStep={currentStep}
      />

      <DeleteStepDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDelete}
        step={stepToDelete}
        onSuccess={refetch}
      />

      <DeleteStepDialog
        open={bulkDeleteDialogOpen}
        onOpenChange={setBulkDeleteDialogOpen}
        onConfirm={handleBulkDelete}
        isBulk={true}
        count={selectedSteps.length}
        onSuccess={refetch}
      />

      <BulkActionBar
        selectedCount={selectedSteps.length}
        onBulkDelete={() => setBulkDeleteDialogOpen(true)}
      />
    </div>
  );
};

export default StepsManagement;
