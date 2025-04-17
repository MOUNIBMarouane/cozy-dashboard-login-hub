
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronUp, FileCog, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CircuitDto } from '@/models/circuit';

interface CircuitListContentProps {
  circuits: CircuitDto[];
  onAddCircuitClick: () => void;
  onViewCircuit: (circuit: CircuitDto) => void;
  onEditCircuit: (circuit: CircuitDto) => void;
  onDeleteCircuit: (circuitId: number) => void;
  canManageCircuits: boolean;
}

export const CircuitListContent = ({
  circuits,
  onAddCircuitClick,
  onViewCircuit,
  onEditCircuit,
  onDeleteCircuit,
  canManageCircuits
}: CircuitListContentProps) => {
  const [expandedCircuits, setExpandedCircuits] = useState<Record<number, boolean>>({});

  const toggleCircuit = (circuitId: number) => {
    setExpandedCircuits(prev => ({
      ...prev,
      [circuitId]: !prev[circuitId]
    }));
  };

  return (
    <div className="space-y-4 p-4">
      {canManageCircuits && (
        <div className="mb-6">
          <Button 
            className="w-full bg-blue-600 hover:bg-blue-700"
            onClick={onAddCircuitClick}
          >
            <Plus className="mr-2 h-4 w-4" /> Add New Circuit
          </Button>
        </div>
      )}

      {circuits.map(circuit => (
        <div key={circuit.id} className="border border-blue-900/30 rounded-lg overflow-hidden bg-[#0f1642] shadow-lg">
          <div 
            className="p-4 flex justify-between items-center bg-[#141c4d] cursor-pointer"
            onClick={() => toggleCircuit(circuit.id)}
          >
            <div>
              <h3 className="text-lg font-medium text-white">{circuit.title}</h3>
              <p className="text-blue-300 text-sm">{circuit.steps?.length || 0} steps</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/30"
                onClick={(e) => {
                  e.stopPropagation();
                  onViewCircuit(circuit);
                }}
              >
                View Details
              </Button>
              {canManageCircuits && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/30"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditCircuit(circuit);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteCircuit(circuit.id);
                    }}
                    disabled={!canManageCircuits}
                  >
                    Delete
                  </Button>
                </>
              )}
              {expandedCircuits[circuit.id] ? (
                <ChevronUp className="h-5 w-5 text-blue-400" />
              ) : (
                <ChevronDown className="h-5 w-5 text-blue-400" />
              )}
            </div>
          </div>

          {expandedCircuits[circuit.id] && (
            <div className="p-4 border-t border-blue-900/30">
              <div className="mb-4">
                <h4 className="text-blue-200 font-medium mb-2">Description</h4>
                <p className="text-white">{circuit.descriptif || 'No description available.'}</p>
              </div>

              <div>
                <h4 className="text-blue-200 font-medium mb-2">Steps</h4>
                {circuit.steps && circuit.steps.length > 0 ? (
                  <div className="space-y-2">
                    {circuit.steps.sort((a, b) => a.orderIndex - b.orderIndex).map(step => (
                      <div key={step.id} className="p-3 bg-blue-900/20 rounded-md flex justify-between items-center">
                        <div>
                          <h5 className="text-white font-medium">{step.title}</h5>
                          <p className="text-blue-300 text-sm">Order: {step.orderIndex}</p>
                        </div>
                        {canManageCircuits && (
                          <Link 
                            to={`/status/${step.id}?name=${encodeURIComponent(step.title)}`} 
                            className="inline-flex items-center text-blue-400 hover:text-blue-300 text-sm"
                          >
                            <FileCog className="h-4 w-4 mr-1" /> Manage Status
                          </Link>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-blue-300">No steps defined for this circuit.</p>
                )}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
