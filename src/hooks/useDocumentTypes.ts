
import { useState, useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import { DocumentType } from '@/models/document';
import documentService from '@/services/documentService';

export const useDocumentTypes = () => {
  const [types, setTypes] = useState<DocumentType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<string | null>('typeName');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTypes, setSelectedTypes] = useState<number[]>([]);
  const itemsPerPage = 10;

  const fetchTypes = async () => {
    try {
      setIsLoading(true);
      const data = await documentService.getAllDocumentTypes();
      setTypes(data);
    } catch (error) {
      console.error('Failed to fetch document types:', error);
      toast.error('Failed to load document types');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTypes();
  }, [currentPage]);

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
      const selectableTypeIds = filteredAndSortedTypes
        .filter(type => type.documentCounter === 0)
        .map(type => type.id!)
        .filter(id => id !== undefined);
      setSelectedTypes(selectableTypeIds);
    } else {
      setSelectedTypes([]);
    }
  };

  const handleSelectType = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedTypes(prev => [...prev, id]);
    } else {
      setSelectedTypes(prev => prev.filter(typeId => typeId !== id));
    }
  };

  const filteredAndSortedTypes = useMemo(() => {
    let filtered = [...types];
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(type => 
        (type.typeKey?.toLowerCase().includes(query) || '') ||
        (type.typeName?.toLowerCase().includes(query) || '') ||
        (type.typeAttr?.toLowerCase().includes(query) || '')
      );
    }
    
    return [...filtered].sort((a, b) => {
      if (!sortField) return 0;
      
      let valueA: any, valueB: any;
      
      switch(sortField) {
        case 'typeKey':
          valueA = a.typeKey || '';
          valueB = b.typeKey || '';
          break;
        case 'typeName':
          valueA = a.typeName || '';
          valueB = b.typeName || '';
          break;
        case 'typeAttr':
          valueA = a.typeAttr || '';
          valueB = b.typeAttr || '';
          break;
        case 'documentCounter':
          valueA = a.documentCounter || 0;
          valueB = b.documentCounter || 0;
          break;
        default:
          return 0;
      }
      
      if (valueA < valueB) return sortDirection === 'asc' ? -1 : 1;
      if (valueA > valueB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [types, sortField, sortDirection, searchQuery]);

  const paginatedTypes = useMemo(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return filteredAndSortedTypes.slice(indexOfFirstItem, indexOfLastItem);
  }, [filteredAndSortedTypes, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredAndSortedTypes.length / itemsPerPage);

  return {
    types: paginatedTypes,
    isLoading,
    searchQuery,
    setSearchQuery,
    sortField,
    sortDirection,
    handleSort,
    currentPage,
    setCurrentPage,
    totalPages,
    selectedTypes,
    handleSelectType,
    handleSelectAll,
    fetchTypes,
    filteredAndSortedTypes
  };
};
