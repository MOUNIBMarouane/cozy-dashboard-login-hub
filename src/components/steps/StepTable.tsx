
import { Table, TableBody } from '@/components/ui/table';
import { StepTableHeader } from './table/StepTableHeader';
import { StepTableRow } from './table/StepTableRow';
import { StepSearchBar } from './table/StepSearchBar';
import { StepFilterBar } from './table/StepFilterBar';
import { StepPagination } from './table/StepPagination';

interface StepTableProps {
  steps: Step[];
  circuits: Circuit[];
  selectedSteps: number[];
  onSelectStep: (id: number, checked: boolean) => void;
  onSelectAll: (checked: boolean) => void;
  onDeleteStep: (step: Step) => void;
  onEditStep: (step: Step) => void;
  onSort: (field: string) => void;
  sortField: string | null;
  sortDirection: 'asc' | 'desc';
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filterOptions: StepFilterOptions;
  setFilterOptions: (options: StepFilterOptions) => void;
  resetFilters: () => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const StepTable = ({
  steps,
  circuits,
  selectedSteps,
  onSelectStep,
  onSelectAll,
  onDeleteStep,
  onEditStep,
  onSort,
  sortField,
  sortDirection,
  searchQuery,
  onSearchChange,
  filterOptions,
  setFilterOptions,
  resetFilters,
  currentPage,
  totalPages,
  onPageChange
}: StepTableProps) => {
  // Check if all eligible steps are selected
  const areAllEligibleSelected = steps.length > 0 && steps.length === selectedSteps.length;
  const hasEligibleSteps = steps.length > 0;

  // Get circuit names map
  const circuitNamesMap = circuits.reduce((map, circuit) => {
    map[circuit.id] = circuit.title;
    return map;
  }, {} as Record<number, string>);

  return (
    <div className="w-full">
      <StepSearchBar
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
      />

      <StepFilterBar
        circuits={circuits}
        filterOptions={filterOptions}
        setFilterOptions={setFilterOptions}
        resetFilters={resetFilters}
      />

      <div className="border rounded-md border-blue-900/30">
        <Table>
          <StepTableHeader
            onSelectAll={onSelectAll}
            areAllEligibleSelected={areAllEligibleSelected}
            hasEligibleSteps={hasEligibleSteps}
            onSort={onSort}
            sortField={sortField}
            sortDirection={sortDirection}
          />
          <TableBody>
            {steps.length === 0 ? (
              <tr>
                <td colSpan={8} className="h-24 text-center text-muted-foreground">
                  No steps found
                </td>
              </tr>
            ) : (
              steps.map((step) => (
                <StepTableRow
                  key={step.id}
                  step={step}
                  isSelected={selectedSteps.includes(step.id)}
                  onSelectStep={onSelectStep}
                  onDeleteStep={onDeleteStep}
                  onEditStep={onEditStep}
                  circuitName={circuitNamesMap[step.circuitId]}
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <StepPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
};
