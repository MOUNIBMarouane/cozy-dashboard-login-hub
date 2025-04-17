
import { api } from './api';
import { Circuit, Step, CreateCircuitDto, CreateStepDto, StepOrderUpdateDto } from '@/models/circuit';
import { Status } from '@/models/status';

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
}

export default new CircuitService();
