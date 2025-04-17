
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';

interface StatusTableProps {
  statuses: any[];
  onEdit: (status: any) => void;
  onDelete: (status: any) => void;
  isSimpleUser: boolean;
}

export function StatusTable({
  statuses,
  onEdit,
  onDelete,
  isSimpleUser
}: StatusTableProps) {
  if (statuses.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">No statuses found for this step</p>
        {!isSimpleUser && (
          <p className="text-gray-500 text-sm mt-2">Add a status to get started</p>
        )}
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent border-blue-900/30">
          <TableHead className="text-blue-300">Status ID</TableHead>
          <TableHead className="text-blue-300">Title</TableHead>
          <TableHead className="text-blue-300">Required</TableHead>
          <TableHead className="text-blue-300">Complete</TableHead>
          <TableHead className="text-right text-blue-300">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {statuses.map((status) => (
          <TableRow 
            key={status.statusId} 
            className="border-blue-900/30 hover:bg-blue-900/20 transition-colors"
          >
            <TableCell className="font-medium text-blue-100 font-mono">
              {status.statusKey}
            </TableCell>
            <TableCell className="text-blue-100">{status.title}</TableCell>
            <TableCell>
              <Badge 
                variant={status.isRequired ? "default" : "secondary"}
                className={status.isRequired 
                  ? "bg-amber-900/50 text-amber-300 hover:bg-amber-900/70 border-amber-700/50"
                  : "bg-gray-800/50 text-gray-400 hover:bg-gray-800/70 border-gray-700/50"
                }
              >
                {status.isRequired ? 'Required' : 'Optional'}
              </Badge>
            </TableCell>
            <TableCell>
              <Badge 
                variant={status.isComplete ? "default" : "secondary"}
                className={status.isComplete 
                  ? "bg-green-900/50 text-green-300 hover:bg-green-900/70 border-green-700/50"
                  : "bg-gray-800/50 text-gray-400 hover:bg-gray-800/70 border-gray-700/50"
                }
              >
                {status.isComplete ? 'Complete' : 'Incomplete'}
              </Badge>
            </TableCell>
            <TableCell className="text-right space-x-2">
              {!isSimpleUser && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(status)}
                    className="text-blue-400 hover:text-blue-600 hover:bg-blue-100/10"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(status)}
                    className="text-red-400 hover:text-red-600 hover:bg-red-100/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
