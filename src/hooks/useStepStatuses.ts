
import { useQuery } from '@tanstack/react-query';
import circuitService from '@/services/circuitService';
import { DocumentStatus } from '@/models/documentCircuit';

export function useStepStatuses(documentId: number | undefined) {
  const { 
    data: statuses,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ['step-statuses', documentId],
    queryFn: () => circuitService.getStepStatuses(documentId!),
    enabled: !!documentId,
  });

  return {
    statuses,
    isLoading,
    isError,
    error,
    refetch
  };
}
