
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Search, AlertCircle, ArrowLeft } from 'lucide-react';
import { StepFormDialog } from '@/components/steps/dialogs/StepFormDialog';
import { DeleteStepDialog } from '@/components/steps/dialogs/DeleteStepDialog';
import { StepHeader } from '@/components/steps/StepHeader';
import { StepTable } from '@/components/steps/StepTable';
import { StepEmptyState } from '@/components/steps/StepEmptyState';
import { StepLoadingState } from '@/components/steps/StepLoadingState';
import { BulkActionBar } from '@/components/steps/BulkActionBar';
import { StepSearchBar } from '@/components/steps/table/StepSearchBar';
import circuitService from '@/services/circuitService';
import { useAuth } from '@/context/AuthContext';

export default function CircuitStepsPage() {
  const { circuitId } = useParams<{ circuitId: string }>();
  const { user } = useAuth();
  const isSimpleUser = user?.role === 'SimpleUser';
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSteps, setSelectedSteps] = useState<number[]>([]);
  const [apiError, setApiError] = useState('');
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedStep, setSelectedStep] = useState<Step | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  // Fetch circuit details
  const { 
    data: circuit,
    isLoading: isCircuitLoading,
    isError: isCircuitError
  } = useQuery({
    queryKey: ['circuit', circuitId],
    queryFn: () => circuitService.getCircuitById(Number(circuitId)),
    enabled: !!circuitId,
    meta: {
      onSettled: (data, err) => {
        if (err) {
          const errorMessage = err instanceof Error 
            ? err.message 
            : 'Failed to load circuit details';
          setApiError(errorMessage);
        }
      }
    }
  });

  // Fetch circuit steps
  const {
    data: steps = [],
    isLoading: isStepsLoading,
    isError: isStepsError,
    refetch: refetchSteps
  } = useQuery({
    queryKey: ['circuit-steps', circuitId],
    queryFn: () => circuitService.getCircuitDetailsByCircuitId(Number(circuitId)),
    enabled: !!circuitId,
    meta: {
      onSettled: (data, err) => {
        if (err) {
          const errorMessage = err instanceof Error 
            ? err.message 
            : 'Failed to load circuit steps';
          setApiError(errorMessage);
        }
      }
    }
  });

  // Filter steps based on search query
  const filteredSteps = steps.filter(step => 
    step.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    step.circuitDetailKey.toLowerCase().includes(searchQuery.toLowerCase()) ||
    step.descriptif?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleAddStep = () => {
    setSelectedStep(null);
    setFormDialogOpen(true);
  };

  const handleEditStep = (step: CircuitDetail) => {
    // Convert CircuitDetail to Step for the form
    const stepData: Step = {
      id: step.id,
      stepKey: step.circuitDetailKey,
      circuitId: step.circuitId,
      title: step.title,
      descriptif: step.descriptif || '',
      orderIndex: step.orderIndex,
      responsibleRoleId: step.responsibleRoleId,
      isFinalStep: step.isFinalStep || false
    };
    
    setSelectedStep(stepData);
    setFormDialogOpen(true);
  };

  const handleDeleteStep = (step: CircuitDetail) => {
    // Convert CircuitDetail to Step for the dialog
    const stepData: Step = {
      id: step.id,
      stepKey: step.circuitDetailKey,
      circuitId: step.circuitId,
      title: step.title,
      descriptif: step.descriptif || '',
      orderIndex: step.orderIndex,
      responsibleRoleId: step.responsibleRoleId,
      isFinalStep: step.isFinalStep || false
    };
    
    setSelectedStep(stepData);
    setDeleteDialogOpen(true);
  };

  const handleBulkDelete = () => {
    // Implement bulk delete functionality here
    // You would call a service method to delete multiple steps
    setSelectedSteps([]);
  };

  const handleStepSelection = (stepId: number, selected: boolean) => {
    if (selected) {
      setSelectedSteps(prev => [...prev, stepId]);
    } else {
      setSelectedSteps(prev => prev.filter(id => id !== stepId));
    }
  };

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      const allIds = filteredSteps.map(step => step.id);
      setSelectedSteps(allIds);
    } else {
      setSelectedSteps([]);
    }
  };

  const isLoading = isCircuitLoading || isStepsLoading;
  const isError = isCircuitError || isStepsError;

  if (isLoading) {
    return <StepLoadingState />;
  }

  if (isError) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive" className="mb-4 border-red-800 bg-red-950/50 text-red-300">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {apiError || 'Failed to load circuit steps. Please try again later.'}
          </AlertDescription>
        </Alert>
        <Button variant="outline" asChild>
          <Link to="/circuits">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Circuits
          </Link>
        </Button>
      </div>
    );
  }

  // If circuit not found
  if (!circuit) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive" className="mb-4 border-amber-800 bg-amber-950/50 text-amber-300">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Circuit Not Found</AlertTitle>
          <AlertDescription>
            The circuit you're looking for doesn't exist or has been removed.
          </AlertDescription>
        </Alert>
        <Button variant="outline" asChild>
          <Link to="/circuits">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Circuits
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link to="/circuits">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back
              </Link>
            </Button>
            <h1 className="text-3xl font-semibold bg-gradient-to-r from-blue-200 to-purple-200 text-transparent bg-clip-text">
              {circuit.title} - Steps
            </h1>
          </div>
          <p className="text-gray-400 mt-1">
            Circuit Code: <span className="font-mono text-blue-300">{circuit.circuitKey}</span>
          </p>
        </div>
        
        {!isSimpleUser && (
          <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700" onClick={handleAddStep}>
            <Plus className="mr-2 h-4 w-4" /> Add Step
          </Button>
        )}
      </div>
      
      {apiError && (
        <Alert variant="destructive" className="mb-4 border-red-800 bg-red-950/50 text-red-300">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {apiError}
          </AlertDescription>
        </Alert>
      )}
      
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-blue-900/20 p-4 rounded-lg border border-blue-800/30">
        <div className="flex items-center space-x-2 w-full md:w-auto">
          <Search className="h-4 w-4 text-blue-400" />
          <h2 className="text-blue-300 font-medium">Search Steps</h2>
        </div>
        <div className="relative flex-1 max-w-xl w-full">
          <StepSearchBar
            searchQuery={searchQuery}
            onSearchChange={handleSearch}
          />
        </div>
      </div>
      
      <Card className="w-full shadow-md bg-[#111633]/70 border-blue-900/30">
        <CardHeader className="flex flex-row items-center justify-between border-b border-blue-900/30 bg-blue-900/20">
          <CardTitle className="text-xl text-blue-100">Steps in Circuit</CardTitle>
          <StepHeader 
            onAddStep={handleAddStep} 
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />
        </CardHeader>
        <CardContent className="p-0">
          {filteredSteps.length > 0 ? (
            viewMode === 'table' ? (
              <StepTable 
                steps={filteredSteps.map(detail => ({
                  id: detail.id,
                  stepKey: detail.circuitDetailKey,
                  circuitId: detail.circuitId,
                  title: detail.title,
                  descriptif: detail.descriptif || '',
                  orderIndex: detail.orderIndex,
                  responsibleRoleId: detail.responsibleRoleId,
                  isFinalStep: detail.isFinalStep || false
                }))}
                selectedSteps={selectedSteps}
                onSelectStep={handleStepSelection}
                onSelectAll={handleSelectAll}
                onEdit={handleEditStep}
                onDelete={handleDeleteStep}
                onDetails={(step) => window.location.href = `/circuits/${circuitId}/steps/${step.id}/statuses`}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                {filteredSteps.map(step => (
                  <div 
                    key={step.id}
                    className="bg-blue-900/20 border border-blue-800/30 rounded-lg p-4 hover:bg-blue-900/30 transition-colors"
                    onClick={() => window.location.href = `/circuits/${circuitId}/steps/${step.id}/statuses`}
                  >
                    <h3 className="text-lg font-medium text-blue-200">{step.title}</h3>
                    <p className="text-blue-300/70 text-sm mt-1 line-clamp-2">{step.descriptif || 'No description'}</p>
                    <div className="text-xs font-mono text-blue-400 mt-2">{step.circuitDetailKey}</div>
                    <div className="flex justify-between items-center mt-3">
                      <div>Step {step.orderIndex + 1}</div>
                      <div className="flex gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-blue-400 hover:text-blue-600 hover:bg-blue-100/10"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditStep(step);
                          }}
                        >
                          Edit
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            <StepEmptyState 
              onAddStep={handleAddStep}
              showAddButton={!isSimpleUser}
            />
          )}
        </CardContent>
      </Card>
      
      <BulkActionBar
        selectedCount={selectedSteps.length}
        onBulkDelete={handleBulkDelete}
      />
      
      {/* Step Form Dialog */}
      <StepFormDialog
        open={formDialogOpen}
        onOpenChange={setFormDialogOpen}
        onSuccess={refetchSteps}
        editStep={selectedStep ?? undefined}
      />
      
      {/* Delete Step Dialog */}
      <DeleteStepDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        step={selectedStep}
        onSuccess={refetchSteps}
      />
    </div>
  );
}
