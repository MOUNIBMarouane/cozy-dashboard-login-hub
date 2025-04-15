
import { Button } from "@/components/ui/button";
import { Mail, Shield, Trash } from "lucide-react";

interface BulkActionsBarProps {
  selectedCount: number;
  onChangeRole: () => void;
  onDelete: () => void;
}

export function BulkActionsBar({ 
  selectedCount, 
  onChangeRole, 
  onDelete 
}: BulkActionsBarProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#161b22] border-t border-gray-700 p-4 flex justify-between items-center transition-all duration-300 z-10">
      <div className="text-white">
        <span className="font-medium">{selectedCount}</span> users selected
      </div>
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          className="border-gray-700 text-gray-300 hover:bg-gray-800"
          onClick={onChangeRole}
        >
          <Shield className="h-4 w-4 mr-2" /> Change Role
        </Button>
        <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
          <Mail className="h-4 w-4 mr-2" /> Send Email
        </Button>
        <Button 
          variant="destructive" 
          onClick={onDelete}
          className="bg-red-900/20 text-red-400 hover:bg-red-900/30 hover:text-red-300 border border-red-900/30"
        >
          <Trash className="h-4 w-4 mr-2" /> Delete Selected
        </Button>
      </div>
    </div>
  );
}
