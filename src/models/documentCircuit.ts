
export interface DocumentCircuitHistory {
  id: number;
  documentId: number;
  circuitId: number;
  circuitDetailId: number;
  userId?: number;
  userName?: string;
  processedByUserId?: number;
  processedBy?: string;
  comments: string;
  isApproved: boolean;
  processedAt: string;
  circuitDetail?: {
    title: string;
    orderIndex: number;
  };
  // This field is returned by the backend API
  circuitDetailTitle?: string;
}

export interface ProcessCircuitRequest {
  documentId: number;
  actionId: number;
  comments: string;
  isApproved: boolean;
}

export interface MoveDocumentStepRequest {
  documentId: number;
  circuitDetailId: number;
}

export interface MoveToNextStepRequest {
  documentId: number;
  currentStepId: number;
  nextStepId: number;
  comments: string;
}

export interface AssignCircuitRequest {
  documentId: number;
  circuitId: number;
  comments?: string;
}

export interface DocumentStatus {
  statusId: number;
  statusKey?: string;
  title: string;
  isRequired: boolean;
  isComplete: boolean;
  completedBy?: string;
  completedAt?: string;
  stepId?: number;
}

export interface ActionDto {
  actionId: number;
  actionKey: string;
  title: string;
  description: string;
}

export interface DocumentWorkflowStatus {
  documentId: number;
  documentTitle: string;
  circuitId?: number;
  circuitTitle?: string;
  currentStepId?: number;
  currentStepTitle?: string;
  status: number;
  statusText: string;
  isCircuitCompleted: boolean;
  statuses: DocumentStatus[];
  availableActions: ActionDto[];
  canAdvanceToNextStep: boolean;
  canReturnToPreviousStep: boolean;
}
