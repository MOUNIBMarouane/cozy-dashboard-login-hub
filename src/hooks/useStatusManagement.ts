
import { useState, useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import { Status } from '@/models/status';
import circuitService from '@/services/circuitService';

export const useStatusManagement = (stepId?: number) => {
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<string | null>('title');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStatuses, setSelectedStatuses] = useState<number[]>([]);
  const itemsPerPage = 10;

  const fetchStatuses = async () => {
    if (!stepId) return;
    
    try {
      setIsLoading(true);
      const data = await circuitService.getStatusesForStep(stepId);
      setStatuses(data);
    } catch (error) {
      console.error('Failed to fetch statuses:', error);
      toast.error('Failed to load statuses');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (stepId) {
      fetchStatuses();
    }
  }, [stepId, currentPage]);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const selectableStatusIds = filteredAndSortedStatuses
        .map(status => status.statusId!)
        .filter(id => id !== undefined);
      setSelectedStatuses(selectableStatusIds);
    } else {
      setSelectedStatuses([]);
    }
  };

  const handleSelectStatus = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedStatuses(prev => [...prev, id]);
    } else {
      setSelectedStatuses(prev => prev.filter(statusId => statusId !== id));
    }
  };

  const filteredAndSortedStatuses = useMemo(() => {
    let filtered = [...statuses];
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(status => 
        (status.title?.toLowerCase().includes(query) || '') ||
        (status.statusKey?.toLowerCase().includes(query) || '')
      );
    }
    
    return [...filtered].sort((a, b) => {
      if (!sortField) return 0;
      
      let valueA: any, valueB: any;
      
      switch(sortField) {
        case 'statusKey':
          valueA = a.statusKey || '';
          valueB = b.statusKey || '';
          break;
        case 'title':
          valueA = a.title || '';
          valueB = b.title || '';
          break;
        case 'isRequired':
          valueA = a.isRequired ? 1 : 0;
          valueB = b.isRequired ? 1 : 0;
          break;
        default:
          return 0;
      }
      
      if (valueA < valueB) return sortDirection === 'asc' ? -1 : 1;
      if (valueA > valueB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [statuses, sortField, sortDirection, searchQuery]);

  const paginatedStatuses = useMemo(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return filteredAndSortedStatuses.slice(indexOfFirstItem, indexOfLastItem);
  }, [filteredAndSortedStatuses, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredAndSortedStatuses.length / itemsPerPage);

  return {
    statuses: paginatedStatuses,
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
  };
};
