
import { DocumentType } from '@/models/document';
import { SubType } from '@/models/subType';
import SubTypeCreateDialog from '@/components/sub-types/SubTypeCreateDialog';
import SubTypeEditDialog from '@/components/sub-types/SubTypeEditDialog';
import SubTypeDeleteDialog from '@/components/sub-types/SubTypeDeleteDialog';

interface SubTypeDialogsProps {
  createDialogOpen: boolean;
  setCreateDialogOpen: (open: boolean) => void;
  editDialogOpen: boolean;
  setEditDialogOpen: (open: boolean) => void;
  deleteDialogOpen: boolean;
  setDeleteDialogOpen: (open: boolean) => void;
  selectedSubType: SubType | null;
  documentType: DocumentType;
  onCreateSubmit: (data: any) => void;
  onEditSubmit: (id: number, data: any) => void;
  onDeleteConfirm: (id: number) => void;
}

export default function SubTypeDialogs({
  createDialogOpen,
  setCreateDialogOpen,
  editDialogOpen,
  setEditDialogOpen,
  deleteDialogOpen,
  setDeleteDialogOpen,
  selectedSubType,
  documentType,
  onCreateSubmit,
  onEditSubmit,
  onDeleteConfirm
}: SubTypeDialogsProps) {
  return (
    <>
      <SubTypeCreateDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSubmit={onCreateSubmit}
        documentTypes={[documentType]}
      />

      {selectedSubType && (
        <>
          <SubTypeEditDialog
            open={editDialogOpen}
            onOpenChange={setEditDialogOpen}
            subType={selectedSubType}
            onSubmit={(data) => onEditSubmit(selectedSubType.id, data)}
            documentTypes={[documentType]}
          />

          <SubTypeDeleteDialog
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            subType={selectedSubType}
            onConfirm={() => onDeleteConfirm(selectedSubType.id)}
          />
        </>
      )}
    </>
  );
}
