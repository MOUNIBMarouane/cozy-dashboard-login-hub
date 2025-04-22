
import { useState } from 'react';
import { useDocumentsFilter } from '../hooks/useDocumentsFilter';
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Calendar, CalendarDays, Filter, X } from 'lucide-react';
import { format } from "date-fns";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export default function DocumentsFilterBar() {
  const { 
    searchQuery, 
    setSearchQuery, 
    dateRange, 
    setDateRange 
  } = useDocumentsFilter();

  const [searchField, setSearchField] = useState("all");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="text-lg text-white">Document List</div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-300/70" />
            <Input 
              placeholder="Search documents..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-blue-900/20 border-blue-800/30 text-white placeholder:text-blue-300/50 w-full focus:border-blue-500"
            />
          </div>
          
          <Button
            variant="outline"
            size="icon"
            className={`${showAdvancedFilters ? 'bg-blue-800/30 text-blue-300' : 'text-blue-300/70'}`}
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          >
            <Filter className="h-4 w-4" />
          </Button>
          
          <Select value={searchField} onValueChange={setSearchField}>
            <SelectTrigger className="w-[140px] ml-2">
              <SelectValue placeholder="All fields" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All fields</SelectItem>
              <SelectItem value="documentKey">Document Code</SelectItem>
              <SelectItem value="title">Title</SelectItem>
              <SelectItem value="documentType">Type</SelectItem>
              <SelectItem value="docDate">Document Date</SelectItem>
              <SelectItem value="createdBy">Created By</SelectItem>
            </SelectContent>
          </Select>
          
          {searchField === 'docDate' ? (
            <DateRangePicker
              date={dateRange}
              onDateChange={setDateRange}
              className="w-auto"
              align="end"
            >
              <Button 
                variant="outline" 
                size="icon"
                className={`${dateRange ? "text-blue-400 border-blue-500" : "text-gray-400 border-blue-900/30"} hover:text-blue-300`}
              >
                <Calendar className="h-4 w-4" />
              </Button>
            </DateRangePicker>
          ) : (
            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  variant="outline" 
                  size="icon"
                  className="text-gray-400 border-blue-900/30 hover:text-blue-300"
                >
                  <Calendar className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-4" align="end">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Filter by Date</h4>
                  <p className="text-xs text-muted-foreground">
                    Select "Document Date" in the dropdown to enable date filtering
                  </p>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>
      
      {showAdvancedFilters && (
        <div className="bg-[#0a1033] border border-blue-900/30 rounded-md p-4 mt-2">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-medium text-white">Advanced Filters</h3>
            <Button variant="ghost" size="sm" onClick={() => setShowAdvancedFilters(false)} className="h-7 w-7 p-0">
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-blue-300 mb-1 block">Document Status</label>
              <Select defaultValue="">
                <SelectTrigger className="bg-blue-900/20 border-blue-800/30">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Any Status</SelectItem>
                  <SelectItem value="0">Draft</SelectItem>
                  <SelectItem value="1">In Progress</SelectItem>
                  <SelectItem value="2">Completed</SelectItem>
                  <SelectItem value="3">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-xs text-blue-300 mb-1 block">Document Type</label>
              <Select defaultValue="">
                <SelectTrigger className="bg-blue-900/20 border-blue-800/30">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Any Type</SelectItem>
                  <SelectItem value="1">Proposal</SelectItem>
                  <SelectItem value="2">Report</SelectItem>
                  <SelectItem value="3">Minutes</SelectItem>
                  <SelectItem value="4">Specifications</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-xs text-blue-300 mb-1 block">Date Range</label>
              <DateRangePicker
                date={dateRange}
                onDateChange={setDateRange}
                className="w-full"
              />
            </div>
          </div>
          
          <div className="flex justify-end mt-4 space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              className="border-blue-800/50 text-blue-300 hover:bg-blue-900/30"
            >
              Clear
            </Button>
            <Button 
              size="sm"
              className="bg-blue-600 hover:bg-blue-700"
            >
              Apply Filters
            </Button>
          </div>
        </div>
      )}
      
      {dateRange && (
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-blue-900/20 text-blue-300 border-blue-500/30 flex gap-1">
            <CalendarDays className="h-3.5 w-3.5" />
            {dateRange.from ? (
              dateRange.to ? (
                <>
                  {format(dateRange.from, "MMM d, yyyy")} - {format(dateRange.to, "MMM d, yyyy")}
                </>
              ) : (
                format(dateRange.from, "MMM d, yyyy")
              )
            ) : (
              <span>Date Range</span>
            )}
            <button 
              onClick={() => setDateRange(undefined)}
              className="ml-1 hover:text-blue-200"
            >
              ×
            </button>
          </Badge>
        </div>
      )}
    </div>
  );
}
