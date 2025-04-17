
import { Check, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DocumentHistoryDto } from '@/models/documentCircuit';

interface CircuitHistoryItemProps {
  history: DocumentHistoryDto;
}

export const CircuitHistoryItem = ({ history }: CircuitHistoryItemProps) => {
  return (
    <Card key={history.id} className="bg-[#070b28] border border-blue-900/30">
      <CardContent className="p-3">
        <div className="flex justify-between items-start mb-1">
          <span className="font-medium text-sm">
            Processed by: {history.processedBy || 'Unknown'}
          </span>
          <Badge variant={history.isApproved ? "success" : "destructive"}>
            {history.isApproved ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
          </Badge>
        </div>
        <p className="text-xs text-gray-400">
          {new Date(history.processedAt).toLocaleString()}
        </p>
        {history.comments && (
          <div className="mt-2 p-2 bg-[#111633]/40 rounded text-xs border border-blue-900/30">
            "{history.comments}"
          </div>
        )}
      </CardContent>
    </Card>
  );
};
