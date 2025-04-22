
import { useState, createContext, useContext, ReactNode } from 'react';
import { DateRange } from "react-day-picker";

interface FilterOptions {
  searchField?: string;
  statusFilter?: string;
  typeFilter?: string;
  dateRange?: DateRange | undefined;
}

interface DocumentsFilterContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  dateRange: DateRange | undefined;
  setDateRange: (range: DateRange | undefined) => void;
  activeFilters: FilterOptions;
  applyFilters: (filters: FilterOptions) => void;
  resetFilters: () => void;
}

const DocumentsFilterContext = createContext<DocumentsFilterContextType | undefined>(undefined);

export function DocumentsFilterProvider({ children }: { children: ReactNode }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [activeFilters, setActiveFilters] = useState<FilterOptions>({});

  const applyFilters = (filters: FilterOptions) => {
    setActiveFilters(filters);
  };

  const resetFilters = () => {
    setActiveFilters({});
    setDateRange(undefined);
  };

  return (
    <DocumentsFilterContext.Provider value={{ 
      searchQuery, 
      setSearchQuery, 
      dateRange, 
      setDateRange,
      activeFilters,
      applyFilters,
      resetFilters
    }}>
      {children}
    </DocumentsFilterContext.Provider>
  );
}

export function useDocumentsFilter() {
  const context = useContext(DocumentsFilterContext);
  
  // If used outside provider, create a local state
  if (!context) {
    const [searchQuery, setSearchQuery] = useState('');
    const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
    const [activeFilters, setActiveFilters] = useState<FilterOptions>({});
    
    const applyFilters = (filters: FilterOptions) => {
      setActiveFilters(filters);
    };

    const resetFilters = () => {
      setActiveFilters({});
      setDateRange(undefined);
    };
    
    return { 
      searchQuery, 
      setSearchQuery, 
      dateRange, 
      setDateRange,
      activeFilters,
      applyFilters,
      resetFilters
    };
  }
  
  return context;
}
