
import { FolderPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  onAddStatus: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onAddStatus }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8">
      <div className="w-16 h-16 bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
        <FolderPlus className="w-8 h-8 text-blue-400" />
      </div>
      <h2 className="text-xl font-bold text-white mb-2">No Statuses Yet</h2>
      <p className="text-blue-300 mb-6 max-w-md">
        You haven't created any statuses for this step. Add status requirements to control workflow progression.
      </p>
      <Button 
        className="bg-blue-600 hover:bg-blue-700" 
        onClick={onAddStatus}
      >
        <FolderPlus className="mr-2 h-4 w-4" /> 
        Add First Status
      </Button>
    </div>
  );
};

export default EmptyState;
