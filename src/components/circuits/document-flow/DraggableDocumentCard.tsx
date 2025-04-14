
import { useState } from 'react';
import { FileText, MoveHorizontal } from 'lucide-react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Document } from '@/models/document';

interface DraggableDocumentCardProps {
  document: Document;
  onDragStart: (e: React.DragEvent<HTMLDivElement>) => void;
}

export const DraggableDocumentCard = ({ document, onDragStart }: DraggableDocumentCardProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    setIsDragging(true);
    // Set data for the drag operation
    e.dataTransfer.setData('application/json', JSON.stringify({
      documentId: document.id,
      documentKey: document.documentKey
    }));
    // Set the drag image (optional)
    const dragImage = new Image();
    dragImage.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><line x1="10" y1="9" x2="8" y2="9"></line></svg>';
    e.dataTransfer.setDragImage(dragImage, 0, 0);
    
    onDragStart(e);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  return (
    <Card 
      className={`cursor-move bg-[#0a1033] border ${isDragging ? 'border-green-500/70 shadow-lg shadow-green-500/20' : 'border-blue-900/30'} transition-all duration-300`}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <CardHeader className="flex flex-row items-center justify-between border-b border-blue-900/30 bg-[#060927]/50 pb-2">
        <CardTitle className="text-md flex items-center gap-2">
          <FileText className="h-4 w-4 text-blue-300" />
          {document?.title || 'Document'}
        </CardTitle>
        <div className="text-gray-400 rotate-90">
          <MoveHorizontal className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent className="p-3">
        <div className="grid grid-cols-1 gap-2 text-sm">
          <div>
            <span className="text-xs text-blue-300">Document Key:</span>
            <p className="font-mono text-xs">{document?.documentKey}</p>
          </div>
          <div>
            <span className="text-xs text-blue-300">Type:</span>
            <p>{document?.documentType?.typeName}</p>
          </div>
          <div>
            <span className="text-xs text-blue-300">Created By:</span>
            <p>{document?.createdBy?.firstName} {document?.createdBy?.lastName}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
