import { api } from './api';
import { Document } from '@/models/document';
import { CreateDocumentDto, UpdateDocumentDto } from '@/models/document';

class DocumentService {
  async getAllDocuments(): Promise<Document[]> {
    const response = await api.get('/api/Document');
    return response.data;
  }

  async getDocumentById(id: number): Promise<Document> {
    const response = await api.get(`/api/Document/${id}`);
    return response.data;
  }

  async createDocument(document: CreateDocumentDto): Promise<Document> {
    const response = await api.post('/api/Document', document);
    return response.data;
  }

  async updateDocument(id: number, document: UpdateDocumentDto): Promise<void> {
    await api.put(`/api/Document/${id}`, document);
  }

  async deleteDocument(id: number): Promise<void> {
    await api.delete(`/api/Document/${id}`);
  }
}

export default new DocumentService();

