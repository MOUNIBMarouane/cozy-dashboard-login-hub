import { createContext, useContext, ReactNode, useState, useCallback } from 'react';
import { Circuit, CreateCircuitDto, Step, CreateStepDto } from '@/models/circuit';
import { toast } from 'sonner';
import circuitService from '@/services/circuitService';

interface CircuitFormContextProps {
  circuit: Circuit | null;
  setCircuit: (circuit: Circuit | null) => void;
  steps: Step[];
  setSteps: (steps: Step[]) => void;
  addStep: (step: CreateStepDto) => void;
  updateStep: (index: number, step: Step) => void;
  deleteStep: (index: number) => void;
  createCircuit: (circuit: CreateCircuitDto) => Promise<number | null>;
  updateCircuit: (circuit: Circuit) => Promise<boolean>;
  createSteps: (circuitId: number) => Promise<boolean>;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
}

const CircuitFormContext = createContext<CircuitFormContextProps | undefined>(undefined);

interface CircuitFormProviderProps {
  children: ReactNode;
}

export const CircuitFormProvider: React.FC<CircuitFormProviderProps> = ({ children }) => {
  const [circuit, setCircuit] = useState<Circuit | null>(null);
  const [steps, setSteps] = useState<Step[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addStep = (step: CreateStepDto) => {
    setSteps(prevSteps => [...prevSteps, { ...step, id: Date.now() }]);
  };

  const updateStep = (index: number, step: Step) => {
    setSteps(prevSteps => {
      const newSteps = [...prevSteps];
      newSteps[index] = step;
      return newSteps;
    });
  };

  const deleteStep = (index: number) => {
    setSteps(prevSteps => prevSteps.filter((_, i) => i !== index));
  };

  const createCircuit = useCallback(async (circuit: CreateCircuitDto) => {
    setIsLoading(true);
    try {
      const newCircuit = await circuitService.createCircuit(circuit);
      toast.success("Circuit created successfully");
      setCircuit(newCircuit);
      return newCircuit.id;
    } catch (error) {
      console.error("Error creating circuit:", error);
      toast.error("Failed to create circuit");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateCircuit = useCallback(async (circuit: Circuit) => {
    setIsLoading(true);
    try {
      await circuitService.updateCircuit(circuit.id, circuit);
      toast.success("Circuit updated successfully");
      setCircuit(circuit);
      return true;
    } catch (error) {
      console.error("Error updating circuit:", error);
      toast.error("Failed to update circuit");
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Update the createSteps method to use the correct function name
  const createSteps = useCallback(async (circuitId: number) => {
    if (!steps.length) return true;
    
    try {
      // Create each step for the circuit
      for (const step of steps) {
        await circuitService.addStepToCircuit(circuitId, {
          ...step,
          orderIndex: step.orderIndex || 0,
        });
      }
      return true;
    } catch (error) {
      console.error("Error creating circuit steps:", error);
      toast.error("Failed to create circuit steps");
      return false;
    }
  }, [steps]);

  const value: CircuitFormContextProps = {
    circuit,
    setCircuit,
    steps,
    setSteps,
    addStep,
    updateStep,
    deleteStep,
    createCircuit,
    updateCircuit,
    createSteps,
    isLoading,
    setIsLoading,
  };

  return (
    <CircuitFormContext.Provider value={value}>
      {children}
    </CircuitFormContext.Provider>
  );
};

export const useCircuitForm = () => {
  const context = useContext(CircuitFormContext);
  if (!context) {
    throw new Error("useCircuitForm must be used within a CircuitFormProvider");
  }
  return context;
};
