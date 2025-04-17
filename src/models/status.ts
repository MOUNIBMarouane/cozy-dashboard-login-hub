
export interface Status {
  statusId: number;
  statusKey?: string;
  title?: string;
  isRequired: boolean;
  isComplete: boolean;
  stepId: number;
}

export interface CreateStatusDto {
  title: string;
  isRequired: boolean;
}

export interface StatusEffectDto {
  statusId: number;
  setsComplete: boolean;
}
