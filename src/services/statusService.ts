
import { api } from './api';
import { Status, CreateStatusDto } from '@/models/status';

class StatusService {
  async getStatusesForStep(stepId: number): Promise<Status[]> {
    const response = await api.get(`/api/Status/step/${stepId}`);
    return response.data;
  }

  async createStatus(stepId: number, createStatusDto: CreateStatusDto): Promise<Status> {
    const response = await api.post(`/api/Status/step/${stepId}`, createStatusDto);
    return response.data;
  }

  async updateStatus(statusId: number, updateStatusDto: CreateStatusDto): Promise<void> {
    await api.put(`/api/Status/${statusId}`, updateStatusDto);
  }

  async deleteStatus(statusId: number): Promise<void> {
    await api.delete(`/api/Status/${statusId}`);
  }

  async deleteBulkStatuses(statusIds: number[]): Promise<void> {
    await Promise.all(statusIds.map(id => this.deleteStatus(id)));
  }

  async completeStatus(documentId: number, statusId: number, isComplete: boolean, comments?: string): Promise<void> {
    await api.post('/api/Workflow/complete-status', {
      documentId,
      statusId,
      isComplete,
      comments
    });
  }
}

export default new StatusService();
