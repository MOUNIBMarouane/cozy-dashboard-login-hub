
import { Plus, MoreVertical, Eye, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Circuit } from '@/models/circuit';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface CircuitListActionsProps {
  searchQuery?: string;
  circuit?: Circuit;
  isSimpleUser?: boolean;
  onEdit?: (circuit: Circuit) => void;
  onDelete?: (circuit: Circuit) => void;
  onViewDetails?: (circuit: Circuit) => void;
}

export function CircuitListActions({ 
  searchQuery,
  circuit,
  isSimpleUser,
  onEdit,
  onDelete,
  onViewDetails
}: CircuitListActionsProps) {
  // If circuit is not provided, this is for the main list actions (with search query and new button)
  if (!circuit) {
    return (
      <div className="flex items-center justify-between mb-4">
        {searchQuery && (
          <div className="text-sm text-blue-400">
            Showing results for: <span className="font-medium">"{searchQuery}"</span>
          </div>
        )}
        <div className="ml-auto">
          <Link to="/create-circuit">
            <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
              <Plus className="mr-2 h-4 w-4" /> New Circuit
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // For circuit row actions
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem 
          onClick={() => onViewDetails?.(circuit)}
          className="cursor-pointer"
        >
          <Eye className="mr-2 h-4 w-4" />
          View Details
        </DropdownMenuItem>
        
        {!isSimpleUser && (
          <>
            <DropdownMenuItem 
              onClick={() => onEdit?.(circuit)}
              className="cursor-pointer"
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            
            <DropdownMenuItem 
              onClick={() => onDelete?.(circuit)}
              className="cursor-pointer text-red-600 hover:text-red-700 focus:text-red-700"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
