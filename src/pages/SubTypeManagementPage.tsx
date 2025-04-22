
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import documentService from '@/services/documentService';
import { Layers, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SubTypesList from '@/components/document-types/table/subtypes/SubTypesList';
import { toast } from 'sonner';

export default function SubTypeManagementPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [documentType, setDocumentType] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDocumentType = async () => {
      try {
        if (!id) return;
        setIsLoading(true);
        const data = await documentService.getDocumentType(parseInt(id));
        setDocumentType(data);
      } catch (error) {
        console.error('Failed to fetch document type:', error);
        toast.error('Failed to load document type');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocumentType();
  }, [id]);

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-blue-900/20 rounded w-1/4"></div>
          <div className="h-4 bg-blue-900/20 rounded w-1/3"></div>
        </div>
      </div>
    );
  }

  if (!documentType) {
    return (
      <div className="p-6">
        <div className="text-center">
          <p className="text-blue-300">Document type not found</p>
          <Button 
            variant="outline" 
            onClick={() => navigate('/document-types-management')}
            className="mt-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Document Types
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-white flex items-center gap-2">
            <Layers className="h-6 w-6 text-blue-400" />
            {documentType.typeName} Subtypes
          </h1>
          <p className="text-blue-300 mt-1">
            Manage subtypes for document type {documentType.typeKey}
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => navigate('/document-types-management')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Document Types
        </Button>
      </div>

      <SubTypesList documentType={documentType} />
    </div>
  );
}
