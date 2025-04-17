
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import circuitService from '@/services/circuitService';

export function useCircuitSteps(circuitId: string) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSteps, setSelectedSteps] = useState<number[]>([]);
  const [apiError, setApiError] = useState('');
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

  // Convert CircuitDetail to Step
  const convertedSteps: Step[] = filteredSteps.map(detail => ({
    id: detail.id,
    stepKey: detail.circuitDetailKey,
    circuitId: detail.circuitId,
    title: detail.title,
    descriptif: detail.descriptif || '',
    orderIndex: detail.orderIndex,
    responsibleRoleId: detail.responsibleRoleId,
    isFinalStep: detail.isFinalStep || false
  }));

  const handleSearch = (query: string) => {
    setSearchQuery(query);
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
      const allIds = convertedSteps.map(step => step.id);
      setSelectedSteps(allIds);
    } else {
      setSelectedSteps([]);
    }
  };

  const isLoading = isCircuitLoading || isStepsLoading;
  const isError = isCircuitError || isStepsError;

  return {
    circuit,
    steps: convertedSteps,
    searchQuery,
    selectedSteps,
    apiError,
    viewMode,
    isLoading,
    isError,
    setSearchQuery: handleSearch,
    setSelectedSteps,
    handleStepSelection,
    handleSelectAll,
    setApiError,
    setViewMode,
    refetchSteps
  };
}
