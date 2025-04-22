
import api from './api';
import { DocumentType } from '../models/document';

const documentTypeService = {
  getDocumentType: async (id: number): Promise<DocumentType> => {
    try {
      const response = await api.get(`/Documents/Types/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching document type with ID ${id}:`, error);
      throw error;
    }
  }
};

export default documentTypeService;
