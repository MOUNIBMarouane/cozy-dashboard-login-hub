
export interface Circuit {
  id: number;
  circuitKey: string;
  title: string;
  descriptif?: string;
  isActive: boolean;
  hasOrderedFlow: boolean;
  allowBacktrack?: boolean;
  steps?: Step[];
  crdCounter?: number; // Add this field to match with circuit.d.ts
}

export interface Step {
  id: number;
  stepKey: string;
  circuitId: number;
  title: string;
  descriptif?: string;
  orderIndex: number;
  responsibleRoleId?: number;
  isFinalStep?: boolean;
}

export interface CreateCircuitDto {
  title: string;
  descriptif?: string;
  hasOrderedFlow: boolean;
  allowBacktrack?: boolean;
  isActive?: boolean;
}

export interface CreateStepDto {
  title: string;
  descriptif?: string;
  orderIndex: number;
  responsibleRoleId?: number;
  circuitId?: number;
}

export interface UpdateStepDto {
  title: string;
  descriptif?: string;
  orderIndex: number;
  responsibleRoleId?: number;
}

export interface StepOrderUpdateDto {
  stepId: number;
  orderIndex: number;
}
