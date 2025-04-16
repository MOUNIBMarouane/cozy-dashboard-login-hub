
import { useState } from 'react';
import { toast } from 'sonner';
import { DocumentType } from '@/models/document';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { ScrollArea } from '@/components/ui/scroll-area';
import documentService from '@/services/documentService';

// Import components
import DocumentTypeTable from '@/components/document-types/DocumentTypeTable';
import DocumentTypeGrid from '@/components/document-types/DocumentTypeGrid';
import DocumentTypeForm from '@/components/document-types/DocumentTypeForm';
import BottomActionBar from '@/components/document-types/BottomActionBar';
import EmptyState from '@/components/document-types/EmptyState';
import DeleteConfirmDialog from '@/components/document-types/DeleteConfirmDialog';
import LoadingState from '@/components/document-types/LoadingState';
import DocumentTypesHeader from '@/components/document-types/DocumentTypesHeader';
import DocumentTypesPagination from '@/components/document-types/DocumentTypesPagination';
import { useDocumentTypes } from '@/hooks/useDocumentTypes';

type ViewMode = 'table' | 'grid';

const DocumentTypesManagement = () => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [typeToDelete, setTypeToDelete] = useState<number | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentType, setCurrentType] = useState<DocumentType | null>(null);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('table');

  const {
    types,
    isLoading,
    searchQuery,
    setSearchQuery,
    sortField,
    sortDirection,
    handleSort,
    currentPage,
    setCurrentPage,
    totalPages,
    selectedTypes,
    handleSelectType,
    handleSelectAll,
    fetchTypes,
    filteredAndSortedTypes
  } = useDocumentTypes();

  const openDeleteDialog = (id: number) => {
    setTypeToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    try {
      if (typeToDelete) {
        await documentService.deleteDocumentType(typeToDelete);
        toast.success('Document type deleted successfully');
        fetchTypes();
      }
    } catch (error) {
      console.error('Failed to delete document type:', error);
      toast.error('Failed to delete document type');
    } finally {
      setDeleteDialogOpen(false);
      setTypeToDelete(null);
    }
  };

  const handleEditType = (type: DocumentType) => {
    setCurrentType(type);
    setIsEditMode(true);
    setIsDrawerOpen(true);
  };

  const handleBulkDelete = async () => {
    try {
      await documentService.deleteMultipleDocumentTypes(selectedTypes);
      toast.success(`Successfully deleted ${selectedTypes.length} document types`);
      fetchTypes();
    } catch (error) {
      console.error('Failed to delete document types in bulk:', error);
      toast.error('Failed to delete some or all document types');
    } finally {
      setBulkDeleteDialogOpen(false);
    }
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setCurrentType(null);
    setIsEditMode(false);
  };

  const handleViewModeChange = (value: ViewMode) => {
    if (value) setViewMode(value);
  };

  return (
    <div className="h-full flex flex-col bg-[#070b28]">
      <DocumentTypesHeader 
        viewMode={viewMode}
        onViewModeChange={handleViewModeChange}
        onNewTypeClick={() => setIsDrawerOpen(true)}
      />

      <div className="flex-1 overflow-hidden px-4 md:px-6 py-4">
        {isLoading ? (
          <LoadingState />
        ) : types.length > 0 ? (
          <Card className="bg-[#0f1642] border-blue-900/30 shadow-xl h-full flex flex-col">
            <CardHeader className="pb-0">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <CardTitle className="text-xl text-white">Document Types</CardTitle>
                  <CardDescription className="text-blue-300">
                    {filteredAndSortedTypes.length} {filteredAndSortedTypes.length === 1 ? 'type' : 'types'} {searchQuery ? 'found' : 'available'}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0 mt-4 flex-1 overflow-hidden">
              <ScrollArea className="h-[calc(100vh-260px)]">
                {viewMode === 'table' ? (
                  <DocumentTypeTable 
                    types={types}
                    selectedTypes={selectedTypes}
                    onSelectType={handleSelectType}
                    onSelectAll={handleSelectAll}
                    onDeleteType={openDeleteDialog}
                    onEditType={handleEditType}
                    onSort={handleSort}
                    sortField={sortField}
                    sortDirection={sortDirection}
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                  />
                ) : (
                  <DocumentTypeGrid
                    types={types}
                    onDeleteType={openDeleteDialog}
                    onEditType={handleEditType}
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                  />
                )}
              </ScrollArea>
              
              <DocumentTypesPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </CardContent>
          </Card>
        ) : (
          <EmptyState onAddType={() => setIsDrawerOpen(true)} />
        )}
      </div>

      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent className="bg-[#111633] p-6 max-w-lg mx-auto">
          <DrawerHeader className="text-center pb-6">
            <DrawerTitle className="text-2xl font-bold text-white">
              {isEditMode ? 'Edit Document Type' : 'Create Document Type'}
            </DrawerTitle>
            <DrawerDescription className="mt-2 text-blue-300">
              {isEditMode 
                ? 'Modify an existing document type' 
                : 'Create a new document type for your organization'}
            </DrawerDescription>
          </DrawerHeader>
      
          <div className="px-1">
            <DocumentTypeForm
              documentType={currentType}
              isEditMode={isEditMode}
              onSuccess={() => {
                handleCloseDrawer();
                fetchTypes();
                toast.success(isEditMode 
                  ? 'Document type updated successfully' 
                  : 'Document type created successfully');
              }}
              onCancel={handleCloseDrawer}
            />
          </div>
        </DrawerContent>
      </Drawer>

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDelete}
      />

      <DeleteConfirmDialog
        open={bulkDeleteDialogOpen}
        onOpenChange={setBulkDeleteDialogOpen}
        onConfirm={handleBulkDelete}
        isBulk={true}
        count={selectedTypes.length}
      />

      <BottomActionBar
        selectedCount={selectedTypes.length}
        onBulkDelete={() => setBulkDeleteDialogOpen(true)}
      />
    </div>
  );
};

export default DocumentTypesManagement;
