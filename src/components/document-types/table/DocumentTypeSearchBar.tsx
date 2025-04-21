
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectContent, SelectValue, SelectItem } from "@/components/ui/select";

interface DocumentTypeSearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  searchField?: string;
  onFieldChange?: (field: string) => void;
}

export const DocumentTypeSearchBar = ({
  searchQuery,
  onSearchChange,
  searchField = "all",
  onFieldChange
}: DocumentTypeSearchBarProps) => {
  return (
    <div className="flex items-center justify-between gap-2">
      <div className="relative w-full flex-1">
        <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-blue-400" />
        <Input
          placeholder="Search document types..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-8 py-1 h-9 text-sm bg-blue-900/10 border-blue-800/30 text-white placeholder:text-blue-300/50 w-full rounded-md"
        />
        {searchQuery && (
          <button 
            onClick={() => onSearchChange('')}
            className="absolute right-8 top-1/2 -translate-y-1/2 text-blue-400 hover:text-blue-300"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
      <Select value={searchField} onValueChange={onFieldChange}>
        <SelectTrigger className="w-[130px]">
          <SelectValue placeholder="All fields" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All fields</SelectItem>
          <SelectItem value="typeKey">Type Key</SelectItem>
          <SelectItem value="typeName">Type Name</SelectItem>
          <SelectItem value="typeAttr">Attributes</SelectItem>
          <SelectItem value="documentCounter">Document Count</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
