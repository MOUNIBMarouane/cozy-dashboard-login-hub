
import { api } from './api';
import { 
  Circuit, 
  Step, 
  CreateCircuitDto, 
  CreateStepDto, 
  StepOrderUpdateDto,
  UpdateStepDto 
} from '@/models/circuit';
import { Status } from '@/models/status';
import { 
  DocumentWorkflowStatus, 
  DocumentHistoryDto, 
  AssignCircuitDto, 
  PerformActionDto,
  PendingDocumentDto,
  MoveNextDto,
  ReturnToPreviousDto,
  CompleteStatusDto
} from '@/models/documentCircuit';

class CircuitService {
  async getAllCircuits(): Promise<Circuit[]> {
    const response = await api.get('/api/Circuit');
    return response.data;
  }

  async getCircuit(id: number): Promise<Circuit> {
    const response = await api.get(`/api/Circuit/${id}`);
    return response.data;
  }

  async createCircuit(circuit: CreateCircuitDto): Promise<Circuit> {
    const response = await api.post('/api/Circuit', circuit);
    return response.data;
  }

  async updateCircuit(id: number, circuit: CreateCircuitDto): Promise<void> {
    await api.put(`/api/Circuit/${id}`, circuit);
  }

  async deleteCircuit(id: number): Promise<void> {
    await api.delete(`/api/Circuit/${id}`);
  }

  async addStepToCircuit(circuitId: number, step: CreateStepDto): Promise<Step> {
    const response = await api.post(`/api/Circuit/${circuitId}/steps`, step);
    return response.data;
  }

  async getStep(stepId: number): Promise<Step> {
    const response = await api.get(`/api/Step/${stepId}`);
    return response.data;
  }

  async updateStepOrder(circuitId: number, stepOrders: StepOrderUpdateDto[]): Promise<void> {
    await api.post(`/api/Circuit/${circuitId}/update-step-order`, stepOrders);
  }

  async getStatusesForStep(stepId: number): Promise<Status[]> {
    const response = await api.get(`/api/Status/step/${stepId}`);
    return response.data;
  }

  // Add the missing methods
  async getCircuitDetailsByCircuitId(circuitId: number): Promise<any[]> {
    const response = await api.get(`/api/Circuit/${circuitId}`);
    return response.data.steps || [];
  }

  async getDocumentCircuitHistory(documentId: number): Promise<DocumentHistoryDto[]> {
    const response = await api.get(`/api/Workflow/document/${documentId}/history`);
    return response.data;
  }

  async getDocumentCurrentStatus(documentId: number): Promise<DocumentWorkflowStatus> {
    const response = await api.get(`/api/Workflow/document/${documentId}/current-status`);
    return response.data;
  }

  async assignDocumentToCircuit(request: AssignCircuitDto): Promise<void> {
    await api.post('/api/Workflow/assign-circuit', request);
  }

  async performAction(request: PerformActionDto): Promise<void> {
    await api.post('/api/Workflow/perform-action', request);
  }

  async moveDocumentToNextStep(request: MoveNextDto): Promise<void> {
    await api.post('/api/Workflow/move-next', request);
  }

  async moveDocumentToStep(request: ReturnToPreviousDto): Promise<void> {
    await api.post('/api/Workflow/return-to-previous', request);
  }

  async completeStatus(request: CompleteStatusDto): Promise<void> {
    await api.post('/api/Workflow/complete-status', request);
  }

  async getPendingApprovals(): Promise<PendingDocumentDto[]> {
    const response = await api.get('/api/Workflow/pending-documents');
    return response.data;
  }

  async createCircuitDetail(detail: any): Promise<any> {
    return this.addStepToCircuit(detail.circuitId, {
      title: detail.title,
      descriptif: detail.descriptif || '',
      orderIndex: detail.orderIndex,
      responsibleRoleId: detail.responsibleRoleId,
    });
  }

  async updateCircuitDetail(id: number, detail: any): Promise<void> {
    // Since we don't have a direct endpoint for updating circuit details,
    // we'll use the updateStep endpoint
    await api.put(`/api/Step/${id}`, {
      title: detail.title,
      descriptif: detail.descriptif || '',
      orderIndex: detail.orderIndex,
      responsibleRoleId: detail.responsibleRoleId,
    });
  }

  async deleteCircuitDetail(id: number): Promise<void> {
    // Since a circuit detail is a step, we'll delete the step
    await api.delete(`/api/Step/${id}`);
  }

  async getStepStatuses(documentId: number): Promise<any[]> {
    const response = await api.get(`/api/Workflow/document/${documentId}/step-statuses`);
    return response.data;
  }
}

export default new CircuitService();
