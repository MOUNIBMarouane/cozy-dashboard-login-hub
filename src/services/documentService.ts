
import { api } from './api';
import { Document } from '@/models/document';

// Document types
export interface CreateDocumentDto {
  title: string;
  content?: string;
  documentAlias?: string;
  docDate?: string | Date;
  createdByUserId: number;
  circuitId?: number;
  typeId: number;
  subTypeId?: number;
  status: number;
}

export interface UpdateDocumentDto {
  title?: string;
  content?: string;
  documentAlias?: string;
  docDate?: string | Date;
  typeId?: number;
  subTypeId?: number;
  circuitId?: number;
  status?: number;
}

// Line and SousLigne types
export interface CreateLigneRequest {
  documentId: number;
  title: string;
  article: string;
  prix: number;
}

export interface UpdateLigneRequest {
  title?: string;
  article?: string;
  prix?: number;
}

export interface CreateSousLigneRequest {
  ligneId: number;
  title: string;
  attribute: string;
}

export interface UpdateSousLigneRequest {
  title?: string;
  attribute?: string;
}

// Document type management
export interface DocumentTypeDto {
  typeAlias?: string;
  typeKey?: string;
  typeName: string;
  typeAttr?: string;
}

class DocumentService {
  // Document core operations
  async getAllDocuments(): Promise<Document[]> {
    const response = await api.get('/api/Documents');
    return response.data;
  }

  async getDocumentById(id: number): Promise<Document> {
    const response = await api.get(`/api/Documents/${id}`);
    return response.data;
  }

  async createDocument(document: CreateDocumentDto): Promise<Document> {
    const response = await api.post('/api/Documents', document);
    return response.data;
  }

  async updateDocument(id: number, document: UpdateDocumentDto): Promise<void> {
    await api.put(`/api/Documents/${id}`, document);
  }

  async deleteDocument(id: number): Promise<void> {
    await api.delete(`/api/Documents/${id}`);
  }
  
  async deleteMultipleDocuments(ids: number[]): Promise<void> {
    await Promise.all(ids.map(id => this.deleteDocument(id)));
  }

  async getRecentDocuments(limit: number = 5): Promise<Document[]> {
    const response = await api.get(`/api/Documents/recent?limit=${limit}`);
    return response.data;
  }

  // Document type operations
  async getAllDocumentTypes(): Promise<DocumentTypeDto[]> {
    const response = await api.get('/api/Documents/Types');
    return response.data;
  }

  async createDocumentType(documentType: DocumentTypeDto): Promise<DocumentTypeDto> {
    const response = await api.post('/api/Documents/Types', documentType);
    return response.data;
  }

  async updateDocumentType(id: number, documentType: DocumentTypeDto): Promise<void> {
    await api.put(`/api/Documents/Types/${id}`, documentType);
  }

  async deleteDocumentType(id: number): Promise<void> {
    await api.delete(`/api/Documents/Types/${id}`);
  }
  
  async deleteMultipleDocumentTypes(ids: number[]): Promise<void> {
    await Promise.all(ids.map(id => this.deleteDocumentType(id)));
  }
  
  async validateTypeName(typeName: string): Promise<boolean> {
    const response = await api.post('/api/Documents/valide-type', { typeName });
    return response.data;
  }

  // Ligne operations
  async getLignesByDocumentId(documentId: number): Promise<any[]> {
    const response = await api.get(`/api/Lignes/by-document/${documentId}`);
    return response.data;
  }

  async createLigne(ligne: CreateLigneRequest): Promise<any> {
    const response = await api.post('/api/Lignes', ligne);
    return response.data;
  }

  async updateLigne(id: number, ligne: UpdateLigneRequest): Promise<void> {
    await api.put(`/api/Lignes/${id}`, ligne);
  }

  async deleteLigne(id: number): Promise<void> {
    await api.delete(`/api/Lignes/${id}`);
  }

  // SousLigne operations
  async getSousLignesByLigneId(ligneId: number): Promise<any[]> {
    const response = await api.get(`/api/SousLignes/by_ligne/${ligneId}`);
    return response.data;
  }

  async createSousLigne(sousLigne: CreateSousLigneRequest): Promise<any> {
    const response = await api.post('/api/SousLignes', sousLigne);
    return response.data;
  }

  async updateSousLigne(id: number, sousLigne: UpdateSousLigneRequest): Promise<void> {
    await api.put(`/api/SousLignes/${id}`, sousLigne);
  }

  async deleteSousLigne(id: number): Promise<void> {
    await api.delete(`/api/SousLignes/${id}`);
  }
}

export default new DocumentService();
