
export interface DocumentStatus {
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

export interface DocumentWorkflowStatus {
  documentId: number;
  documentTitle: string;
  circuitId?: number;
  circuitTitle?: string;
  currentStepId?: number;
  currentStepTitle?: string;
  status: number;
  statusText?: string;
  isCircuitCompleted: boolean;
  statuses?: DocumentStatus[];
  availableActions?: ActionDto[];
  canAdvanceToNextStep: boolean;
  canReturnToPreviousStep: boolean;
}

export interface DocumentHistoryDto {
  id: number;
  stepTitle?: string;
  actionTitle?: string;
  statusTitle?: string;
  processedBy?: string;
  processedAt: string;
  comments: string;
  isApproved: boolean;
}

export interface AssignCircuitDto {
  documentId: number;
  circuitId: number;
}

export interface PerformActionDto {
  documentId: number;
  actionId: number;
  comments?: string;
  isApproved: boolean;
}

export interface CompleteStatusDto {
  documentId: number;
  statusId: number;
  isComplete: boolean;
  comments?: string;
}

export interface MoveNextDto {
  documentId: number;
  currentStepId: number;
  nextStepId: number;
  comments?: string;
}

export interface ReturnToPreviousDto {
  documentId: number;
  comments?: string;
}

export interface PendingDocumentDto {
  documentId: number;
  documentKey: string;
  title: string;
  createdBy: string;
  createdAt: string;
  circuitId: number;
  circuitTitle: string;
  currentStepId: number;
  currentStepTitle: string;
  daysInCurrentStep: number;
}
