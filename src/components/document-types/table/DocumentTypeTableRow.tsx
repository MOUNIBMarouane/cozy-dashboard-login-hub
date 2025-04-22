
import { useState } from 'react';
import { DocumentType } from '@/models/document';
import { TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit2, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import SubTypesList from './subtypes/SubTypesList';

interface DocumentTypeTableRowProps {
  type: DocumentType;
  isSelected: boolean;
  onSelectType: (id: number, checked: boolean) => void;
  onDeleteType: (id: number) => void;
  onEditType: (type: DocumentType) => void;
}

export function DocumentTypeTableRow({
  type,
  isSelected,
  onSelectType,
  onDeleteType,
  onEditType,
}: DocumentTypeTableRowProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      <TableRow 
        className={`transition-all hover:bg-blue-900/20 ${isExpanded ? 'bg-blue-900/10' : ''}`}
      >
        <TableCell className="w-12">
          <Checkbox
            checked={isSelected}
            onCheckedChange={(checked) => onSelectType(type.id!, checked as boolean)}
            disabled={type.documentCounter !== undefined && type.documentCounter > 0}
          />
        </TableCell>
        <TableCell>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 p-0 hover:bg-blue-900/20"
            onClick={toggleExpand}
          >
            {isExpanded ? (
              <ChevronUp className="h-4 w-4 text-blue-400" />
            ) : (
              <ChevronDown className="h-4 w-4 text-blue-400" />
            )}
          </Button>
        </TableCell>
        <TableCell className="text-blue-100">{type.typeKey}</TableCell>
        <TableCell>{type.typeName}</TableCell>
        <TableCell>{type.typeAttr}</TableCell>
        <TableCell>
          <Badge 
            variant={type.documentCounter === 0 ? 'default' : 'secondary'}
            className="font-mono"
          >
            {type.documentCounter || 0}
          </Badge>
        </TableCell>
        <TableCell className="text-right">
          <div className="flex justify-end gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-blue-400 hover:text-blue-300 hover:bg-blue-900/30"
              onClick={() => onEditType(type)}
            >
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={`h-8 w-8 ${
                type.documentCounter && type.documentCounter > 0
                  ? 'text-gray-500 cursor-not-allowed'
                  : 'text-red-400 hover:text-red-300 hover:bg-red-900/20'
              }`}
              onClick={() => type.documentCounter === 0 && type.id && onDeleteType(type.id)}
              disabled={type.documentCounter !== undefined && type.documentCounter > 0}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </TableCell>
      </TableRow>
      {isExpanded && (
        <TableRow>
          <TableCell colSpan={7} className="p-0 border-0">
            <div className="p-4 bg-blue-950/30 border-t border-b border-blue-900/30">
              <SubTypesList documentType={type} />
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}
