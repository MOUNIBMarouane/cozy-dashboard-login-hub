
import { useState, useEffect } from 'react';
import { useDocumentsFilter } from '../hooks/useDocumentsFilter';
import { Button } from "@/components/ui/button";
import { Filter } from 'lucide-react';
import { SearchBar } from './filters/SearchBar';
import { AdvancedFilters } from './filters/AdvancedFilters';
import { ActiveFilters } from './filters/ActiveFilters';

export default function DocumentsFilterBar() {
  const { 
    searchQuery, 
    setSearchQuery, 
    dateRange, 
    setDateRange,
    applyFilters,
    resetFilters
  } = useDocumentsFilter();

  const [searchField, setSearchField] = useState("all");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState("any");
  const [typeFilter, setTypeFilter] = useState("any");
  const [isDatePickerEnabled, setIsDatePickerEnabled] = useState(false);

  useEffect(() => {
    setIsDatePickerEnabled(searchField === 'docDate');
    if (searchField !== 'docDate' && dateRange) {
      setDateRange(undefined);
    }
  }, [searchField, setDateRange]);

  const handleApplyFilters = () => {
    const filters = {
      searchField,
      statusFilter,
      typeFilter,
      dateRange
    };
    applyFilters(filters);
    setShowAdvancedFilters(false);
  };

  const handleClearFilters = () => {
    setStatusFilter("any");
    setTypeFilter("any");
    setDateRange(undefined);
    resetFilters();
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="text-lg text-white">Document List</div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            searchField={searchField}
            setSearchField={setSearchField}
            dateRange={dateRange}
            setDateRange={setDateRange}
            isDatePickerEnabled={isDatePickerEnabled}
          />
          
          <Button
            variant="outline"
            size="icon"
            className={`${showAdvancedFilters ? 'bg-blue-800/30 text-blue-300' : 'text-blue-300/70'}`}
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          >
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {showAdvancedFilters && (
        <AdvancedFilters
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          typeFilter={typeFilter}
          setTypeFilter={setTypeFilter}
          dateRange={dateRange}
          setDateRange={setDateRange}
          onClose={() => setShowAdvancedFilters(false)}
          onApply={handleApplyFilters}
          onClear={handleClearFilters}
        />
      )}
      
      <ActiveFilters
        dateRange={dateRange}
        setDateRange={setDateRange}
      />
    </div>
  );
}
