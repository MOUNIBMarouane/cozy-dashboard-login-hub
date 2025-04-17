
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface CircuitListActionsProps {
  searchQuery: string;
}

export function CircuitListActions({ searchQuery }: CircuitListActionsProps) {
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
