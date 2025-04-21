
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from 'react';

interface StepSearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  searchField?: string;
  onFieldChange?: (field: string) => void;
}

export const StepSearchBar = ({
  searchQuery,
  onSearchChange,
  searchField = "all",
  onFieldChange
}: StepSearchBarProps) => {
  return (
    <div className="mb-4 flex gap-2 items-center">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search steps..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 bg-background border-input"
        />
      </div>
      <Select value={searchField} onValueChange={onFieldChange}>
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="All fields" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All fields</SelectItem>
          <SelectItem value="title">Title</SelectItem>
          <SelectItem value="stepKey">Step Key</SelectItem>
          <SelectItem value="descriptif">Description</SelectItem>
          <SelectItem value="circuitId">Circuit</SelectItem>
          <SelectItem value="orderIndex">Order Index</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
