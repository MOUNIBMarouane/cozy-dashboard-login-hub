
// Add the DocumentStatus type if it doesn't exist yet
export interface DocumentStatus {
  statusId: number;
  statusKey: string;
  title: string;
  isRequired: boolean;
  isComplete: boolean;
  stepId: number;
  completedBy?: string;
  completedAt?: string;
}

// Status completion/update request
export interface CompleteStatusDto {
  documentId: number;
  statusId: number;
  isComplete: boolean;
  comments: string;
}
