
import { createContext, useContext, ReactNode, useState, useCallback } from 'react';
import { Circuit, CreateCircuitDto, Step, CreateStepDto } from '@/models/circuit';
import { toast } from 'sonner';
import circuitService from '@/services/circuitService';

// Interface for form data
interface CircuitFormData {
  title: string;
  descriptif?: string;
  isActive: boolean;
  hasOrderedFlow: boolean;
  allowBacktrack?: boolean;
  steps: CreateStepDto[];
}

interface CircuitFormContextProps {
  circuit: Circuit | null;
  setCircuit: (circuit: Circuit | null) => void;
  steps: Step[];
  setSteps: (steps: Step[]) => void;
  addStep: (step: CreateStepDto) => void;
  updateStep: (index: number, step: Step) => void;
  deleteStep: (index: number) => void;
  removeStep: (index: number) => void;
  createCircuit: (circuit: CreateCircuitDto) => Promise<number | null>;
  updateCircuit: (circuit: Circuit) => Promise<boolean>;
  createSteps: (circuitId: number) => Promise<boolean>;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  // Added properties for multi-step form
  currentStep: number;
  nextStep: () => void;
  prevStep: () => void;
  formData: CircuitFormData;
  setCircuitData: (data: Partial<CircuitFormData>) => void;
  submitForm: () => Promise<boolean>;
  isSubmitting: boolean;
}

const CircuitFormContext = createContext<CircuitFormContextProps | undefined>(undefined);

interface CircuitFormProviderProps {
  children: ReactNode;
}

export const CircuitFormProvider: React.FC<CircuitFormProviderProps> = ({ children }) => {
  const [circuit, setCircuit] = useState<Circuit | null>(null);
  const [steps, setSteps] = useState<Step[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  
  const [formData, setFormData] = useState<CircuitFormData>({
    title: '',
    descriptif: '',
    isActive: true,
    hasOrderedFlow: true,
    steps: []
  });

  // Set form data with partial updates
  const setCircuitData = (data: Partial<CircuitFormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  // Step navigation
  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 5));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const addStep = (step: CreateStepDto) => {
    // Add the step to formData
    setFormData(prev => ({
      ...prev,
      steps: [...prev.steps, step]
    }));
    
    // Also update steps array with id for compatibility
    setSteps(prevSteps => [...prevSteps, { ...step, id: Date.now(), stepKey: `STEP-${Date.now()}` } as Step]);
  };

  const removeStep = (index: number) => {
    // Remove from formData
    setFormData(prev => ({
      ...prev,
      steps: prev.steps.filter((_, i) => i !== index)
    }));
    
    // Also remove from steps array
    setSteps(prevSteps => prevSteps.filter((_, i) => i !== index));
  };

  const updateStep = (index: number, step: Step) => {
    setSteps(prevSteps => {
      const newSteps = [...prevSteps];
      newSteps[index] = step;
      return newSteps;
    });
    
    // Also update in formData
    setFormData(prev => {
      const newSteps = [...prev.steps];
      newSteps[index] = {
        title: step.title,
        descriptif: step.descriptif,
        orderIndex: step.orderIndex,
        responsibleRoleId: step.responsibleRoleId
      };
      return { ...prev, steps: newSteps };
    });
  };

  const deleteStep = removeStep; // Alias for compatibility

  const createCircuit = useCallback(async (circuit: CreateCircuitDto): Promise<number | null> => {
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

  const updateCircuit = useCallback(async (circuit: Circuit): Promise<boolean> => {
    setIsLoading(true);
    try {
      await circuitService.updateCircuit(circuit.id, {
        title: circuit.title,
        descriptif: circuit.descriptif,
        hasOrderedFlow: circuit.hasOrderedFlow,
        allowBacktrack: circuit.allowBacktrack,
        isActive: circuit.isActive
      });
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

  const createSteps = useCallback(async (circuitId: number): Promise<boolean> => {
    if (!formData.steps.length) return true;
    
    try {
      // Create each step for the circuit
      for (const step of formData.steps) {
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
  }, [formData.steps]);

  // Submit the form
  const submitForm = async (): Promise<boolean> => {
    setIsSubmitting(true);
    try {
      // First create the circuit
      const circuitId = await createCircuit({
        title: formData.title,
        descriptif: formData.descriptif,
        hasOrderedFlow: formData.hasOrderedFlow,
        allowBacktrack: formData.allowBacktrack,
        isActive: formData.isActive
      });
      
      if (!circuitId) {
        throw new Error("Failed to create circuit");
      }
      
      // Then create steps if any
      if (formData.steps.length > 0) {
        const stepsCreated = await createSteps(circuitId);
        if (!stepsCreated) {
          throw new Error("Failed to create steps");
        }
      }
      
      toast.success("Circuit created successfully");
      return true;
    } catch (error) {
      console.error("Error creating circuit:", error);
      toast.error("Failed to create circuit");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const value: CircuitFormContextProps = {
    circuit,
    setCircuit,
    steps,
    setSteps,
    addStep,
    updateStep,
    deleteStep,
    removeStep,
    createCircuit,
    updateCircuit,
    createSteps,
    isLoading,
    setIsLoading,
    // Multi-step form properties
    currentStep,
    nextStep,
    prevStep,
    formData,
    setCircuitData,
    submitForm,
    isSubmitting
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
