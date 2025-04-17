
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Status } from '@/models/status';
import { ArrowUpDown, Edit, Trash } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface StatusTableProps {
  statuses: Status[];
  selectedStatuses: number[];
  onSelectStatus: (id: number, checked: boolean) => void;
  onSelectAll: (checked: boolean) => void;
  onDeleteStatus: (id: number) => void;
  onEditStatus: (status: Status) => void;
  onSort: (field: string) => void;
  sortField: string | null;
  sortDirection: 'asc' | 'desc';
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const StatusTable = ({
  statuses,
  selectedStatuses,
  onSelectStatus,
  onSelectAll,
  onDeleteStatus,
  onEditStatus,
  onSort,
  sortField,
  sortDirection,
  searchQuery,
  onSearchChange
}: StatusTableProps) => {
  const areAllSelected = statuses.length > 0 && selectedStatuses.length === statuses.length;

  return (
    <div className="w-full">
      <div className="p-4">
        <div className="relative">
          <Input
            placeholder="Search statuses..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-blue-900/10 border-blue-800/40 text-white pl-10"
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400">
              <circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path>
            </svg>
          </div>
        </div>
      </div>

      <div className="border-t border-blue-900/20">
        <Table>
          <TableHeader className="bg-blue-900/20">
            <TableRow className="hover:bg-blue-900/30 border-blue-900/50">
              <TableHead className="w-12 text-blue-300">
                <Checkbox 
                  checked={areAllSelected && statuses.length > 0} 
                  onCheckedChange={onSelectAll}
                  className="border-blue-500/50"
                />
              </TableHead>
              <TableHead className="text-blue-300">
                <div 
                  className="flex items-center gap-1 cursor-pointer" 
                  onClick={() => onSort('statusKey')}
                >
                  Key
                  <ArrowUpDown className={`h-4 w-4 ${sortField === 'statusKey' ? 'opacity-100' : 'opacity-50'}`} />
                </div>
              </TableHead>
              <TableHead className="text-blue-300">
                <div 
                  className="flex items-center gap-1 cursor-pointer" 
                  onClick={() => onSort('title')}
                >
                  Title
                  <ArrowUpDown className={`h-4 w-4 ${sortField === 'title' ? 'opacity-100' : 'opacity-50'}`} />
                </div>
              </TableHead>
              <TableHead className="text-blue-300">
                <div 
                  className="flex items-center gap-1 cursor-pointer" 
                  onClick={() => onSort('isRequired')}
                >
                  Required
                  <ArrowUpDown className={`h-4 w-4 ${sortField === 'isRequired' ? 'opacity-100' : 'opacity-50'}`} />
                </div>
              </TableHead>
              <TableHead className="w-24 text-right text-blue-300">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {statuses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-blue-400">
                  No statuses found
                </TableCell>
              </TableRow>
            ) : (
              statuses.map((status) => (
                <TableRow key={status.statusId} className="hover:bg-blue-900/10 border-blue-900/20">
                  <TableCell>
                    <Checkbox 
                      checked={selectedStatuses.includes(status.statusId)}
                      onCheckedChange={(checked) => onSelectStatus(status.statusId, !!checked)}
                      className="border-blue-500/50"
                    />
                  </TableCell>
                  <TableCell className="font-mono text-sm text-blue-300">{status.statusKey || 'N/A'}</TableCell>
                  <TableCell className="font-medium text-white">{status.title || 'Unnamed'}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      status.isRequired 
                        ? 'bg-blue-900/50 text-blue-200' 
                        : 'bg-slate-700/50 text-slate-300'
                    }`}>
                      {status.isRequired ? 'Required' : 'Optional'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-blue-400 hover:text-blue-300 hover:bg-blue-900/30"
                        onClick={() => onEditStatus(status)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-900/20"
                        onClick={() => onDeleteStatus(status.statusId)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default StatusTable;
