
import { useEffect } from 'react';
import { DocumentType } from '@/models/document';
import { useSubTypes } from '@/hooks/useSubTypes';
import { SubTypesTable } from './SubTypesTable';
import SubTypeListHeader from './SubTypeListHeader';
import SubTypeDialogs from './SubTypeDialogs';
import { toast } from 'sonner';

interface SubTypesListProps {
  documentType: DocumentType;
}

export default function SubTypesList({ documentType }: SubTypesListProps) {
  const {
    subTypes,
    isLoading,
    createDialogOpen,
    setCreateDialogOpen,
    editDialogOpen,
    setEditDialogOpen,
    deleteDialogOpen,
    setDeleteDialogOpen,
    selectedSubType,
    setSelectedSubType,
    fetchSubTypes,
    handleCreate,
    handleEdit,
    handleDelete
  } = useSubTypes(documentType.id!);

  useEffect(() => {
    fetchSubTypes();
  }, [documentType.id, fetchSubTypes]);

  const handleCreateClick = () => {
    setCreateDialogOpen(true);
  };

  const handleEditClick = (subType: any) => {
    setSelectedSubType(subType);
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (subType: any) => {
    setSelectedSubType(subType);
    setDeleteDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      <SubTypeListHeader 
        documentTypeName={documentType.typeName}
        onCreateClick={handleCreateClick}
      />

      <SubTypesTable
        subTypes={subTypes}
        isLoading={isLoading}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
      />

      <SubTypeDialogs
        createDialogOpen={createDialogOpen}
        setCreateDialogOpen={setCreateDialogOpen}
        editDialogOpen={editDialogOpen}
        setEditDialogOpen={setEditDialogOpen}
        deleteDialogOpen={deleteDialogOpen}
        setDeleteDialogOpen={setDeleteDialogOpen}
        selectedSubType={selectedSubType}
        documentType={documentType}
        onCreateSubmit={handleCreate}
        onEditSubmit={handleEdit}
        onDeleteConfirm={handleDelete}
      />
    </div>
  );
}
