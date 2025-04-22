
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import documentTypeService from '@/services/documentTypeService';
import SubTypesList from '@/components/document-types/table/subtypes/SubTypesList';
import SubTypeManagementHeader from '@/components/sub-types/components/SubTypeManagementHeader';
import SubTypeManagementLoading from '@/components/sub-types/components/SubTypeManagementLoading';
import SubTypeManagementError from '@/components/sub-types/components/SubTypeManagementError';
import { toast } from 'sonner';

export default function SubTypeManagementPage() {
  const { id } = useParams<{ id: string }>();
  const [documentType, setDocumentType] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDocumentType = async () => {
      try {
        if (!id) {
          setError("No document type ID provided");
          setIsLoading(false);
          return;
        }
        
        setIsLoading(true);
        setError(null);
        
        console.log("Fetching document type with ID:", id);
        const data = await documentTypeService.getDocumentType(parseInt(id));
        console.log("Document type data received:", data);
        
        setDocumentType(data);
      } catch (error) {
        console.error('Failed to fetch document type:', error);
        setError('Failed to load document type');
        toast.error('Failed to load document type');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocumentType();
  }, [id]);

  if (isLoading) {
    return <SubTypeManagementLoading />;
  }

  if (error || !documentType) {
    return <SubTypeManagementError />;
  }

  return (
    <div className="p-6 space-y-6">
      <SubTypeManagementHeader documentType={documentType} />
      <SubTypesList documentType={documentType} />
    </div>
  );
}
