
import { useState, useEffect } from 'react';
import { DocumentType } from '@/models/document';
import { SubType } from '@/models/subType';
import subTypeService from '@/services/subTypeService';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { SubTypesTable } from './SubTypesTable';
import SubTypeCreateDialog from '@/components/sub-types/SubTypeCreateDialog';
import SubTypeEditDialog from '@/components/sub-types/SubTypeEditDialog';
import SubTypeDeleteDialog from '@/components/sub-types/SubTypeDeleteDialog';
import { toast } from 'sonner';

interface SubTypesListProps {
  documentType: DocumentType;
}

export default function SubTypesList({ documentType }: SubTypesListProps) {
  const [subTypes, setSubTypes] = useState<SubType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedSubType, setSelectedSubType] = useState<SubType | null>(null);

  const fetchSubTypes = async () => {
    try {
      const data = await subTypeService.getSubTypesByDocType(documentType.id!);
      setSubTypes(data);
    } catch (error) {
      console.error('Error fetching subtypes:', error);
      toast.error('Failed to load subtypes');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubTypes();
  }, [documentType.id]);

  const handleCreateSubType = async (newSubType: any) => {
    try {
      await subTypeService.createSubType({
        ...newSubType,
        documentTypeId: documentType.id
      });
      toast.success('Subtype created successfully');
      fetchSubTypes();
      setCreateDialogOpen(false);
    } catch (error) {
      console.error('Error creating subtype:', error);
      toast.error('Failed to create subtype');
    }
  };

  const handleEditSubType = async (id: number, updatedData: any) => {
    try {
      await subTypeService.updateSubType(id, updatedData);
      toast.success('Subtype updated successfully');
      fetchSubTypes();
      setEditDialogOpen(false);
    } catch (error) {
      console.error('Error updating subtype:', error);
      toast.error('Failed to update subtype');
    }
  };

  const handleDeleteSubType = async (id: number) => {
    try {
      await subTypeService.deleteSubType(id);
      toast.success('Subtype deleted successfully');
      fetchSubTypes();
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error('Error deleting subtype:', error);
      toast.error('Failed to delete subtype');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-white">
          Subtypes for {documentType.typeName}
        </h3>
        <Button
          onClick={() => setCreateDialogOpen(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" /> Add Subtype
        </Button>
      </div>

      <SubTypesTable
        subTypes={subTypes}
        isLoading={isLoading}
        onEdit={(subType) => {
          setSelectedSubType(subType);
          setEditDialogOpen(true);
        }}
        onDelete={(subType) => {
          setSelectedSubType(subType);
          setDeleteDialogOpen(true);
        }}
      />

      <SubTypeCreateDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSubmit={handleCreateSubType}
        documentTypes={[documentType]}
      />

      {selectedSubType && (
        <>
          <SubTypeEditDialog
            open={editDialogOpen}
            onOpenChange={setEditDialogOpen}
            subType={selectedSubType}
            onSubmit={(data) => handleEditSubType(selectedSubType.id, data)}
            documentTypes={[documentType]}
          />

          <SubTypeDeleteDialog
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            subType={selectedSubType}
            onConfirm={() => handleDeleteSubType(selectedSubType.id)}
          />
        </>
      )}
    </div>
  );
}
