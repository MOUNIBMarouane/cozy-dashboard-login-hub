
export interface Circuit {
  id: number;
  circuitKey: string;
  title: string;
  descriptif: string;
  isActive: boolean;
  hasOrderedFlow: boolean;
  allowBacktrack?: boolean;
  steps?: Step[];
  crdCounter: number; // Making crdCounter required
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

// Add necessary workflow types
export interface AssignCircuitDto {
  documentId: number;
  circuitId: number;
}

export interface DocumentHistoryDto {
  id: number;
  stepTitle: string;
  actionTitle?: string;
  statusTitle?: string;
  processedBy: string;
  processedAt: string;
  comments: string;
  isApproved: boolean;
}

export interface DocumentWorkflowStatusDto {
  documentId: number;
  documentTitle: string;
  circuitId?: number;
  circuitTitle?: string;
  currentStepId?: number;
  currentStepTitle?: string;
  status: number;
  statusText: string;
  isCircuitCompleted: boolean;
  statuses?: DocumentStatusDto[];
  availableActions?: ActionDto[];
  canAdvanceToNextStep: boolean;
  canReturnToPreviousStep: boolean;
}

export interface DocumentStatusDto {
  statusId: number;
  title: string;
  isRequired: boolean;
  isComplete: boolean;
  completedBy?: string;
  completedAt?: string;
}

export interface ActionDto {
  actionId: number;
  actionKey?: string;
  title: string;
  description?: string;
}
