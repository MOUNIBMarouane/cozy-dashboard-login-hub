
import { useState, useEffect } from 'react';
import { useDocumentsFilter } from '../hooks/useDocumentsFilter';
import { useAdvancedFilters } from '../hooks/useAdvancedFilters';
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
  const [isDatePickerEnabled, setIsDatePickerEnabled] = useState(false);

  const {
    statusFilter,
    setStatusFilter,
    typeFilter,
    setTypeFilter,
    dateRange: advancedDateRange,
    setDateRange: setAdvancedDateRange,
    resetFilters: resetAdvancedFilters,
    applyFilters: applyAdvancedFilters
  } = useAdvancedFilters((filters) => {
    // When advanced filters are applied, also pass them to the main filter system
    const combinedFilters = {
      searchField,
      statusFilter: filters.statusFilter,
      typeFilter: filters.typeFilter,
      dateRange: filters.dateRange
    };
    applyFilters(combinedFilters);
  });

  useEffect(() => {
    setIsDatePickerEnabled(searchField === 'docDate');
    if (searchField !== 'docDate' && dateRange) {
      setDateRange(undefined);
    }
  }, [searchField, setDateRange]);

  const handleCloseAdvancedFilters = () => {
    setShowAdvancedFilters(false);
  };

  const handleApplyAdvancedFilters = () => {
    applyAdvancedFilters();
    setShowAdvancedFilters(false);
  };

  const handleClearAdvancedFilters = () => {
    resetAdvancedFilters();
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
          dateRange={advancedDateRange}
          setDateRange={setAdvancedDateRange}
          onClose={handleCloseAdvancedFilters}
          onApply={handleApplyAdvancedFilters}
          onClear={handleClearAdvancedFilters}
        />
      )}
      
      <ActiveFilters
        dateRange={dateRange}
        setDateRange={setDateRange}
      />
    </div>
  );
}
