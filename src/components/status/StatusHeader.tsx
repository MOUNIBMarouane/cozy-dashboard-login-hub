
import { Link } from 'react-router-dom';
import { ArrowLeft, LayoutGrid, LayoutList, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface StatusHeaderProps {
  viewMode: 'table' | 'grid';
  stepName?: string;
  onViewModeChange: (value: 'table' | 'grid') => void;
  onNewStatusClick: () => void;
}

const StatusHeader = ({ 
  viewMode, 
  stepName,
  onViewModeChange, 
  onNewStatusClick 
}: StatusHeaderProps) => {
  const handleViewModeChange = (value: string) => {
    if (value === 'table' || value === 'grid') {
      onViewModeChange(value);
    }
  };

  return (
    <div className="bg-[#0f1642] p-4 md:p-6 border-b border-blue-900/30 flex-shrink-0">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link to="/circuits" className="inline-flex items-center text-blue-400 hover:text-blue-300">
            <ArrowLeft className="h-4 w-4 mr-1" />
            <span>Back</span>
          </Link>
          <div className="h-4 w-px bg-blue-800/50"></div>
          <div>
            <h1 className="text-2xl font-bold text-white">Status Management</h1>
            <p className="text-sm text-blue-300 mt-1">
              {stepName ? `Manage status requirements for ${stepName}` : 'Manage status requirements for workflow steps'}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 md:gap-3">
          <ToggleGroup type="single" value={viewMode} onValueChange={handleViewModeChange}>
            <ToggleGroupItem value="table" aria-label="Table view">
              <LayoutList className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="grid" aria-label="Grid view">
              <LayoutGrid className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>

          <Button className="h-9 bg-blue-600 hover:bg-blue-700" onClick={onNewStatusClick}>
            <Plus className="mr-2 h-4 w-4" /> New Status
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StatusHeader;
