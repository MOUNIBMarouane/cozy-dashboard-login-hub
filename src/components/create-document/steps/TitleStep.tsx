
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface TitleStepProps {
  title: string;
  onTitleChange: (value: string) => void;
}

export const TitleStep = ({ title, onTitleChange }: TitleStepProps) => {
  return (
    <div className="space-y-3">
      <Label htmlFor="title" className="text-sm font-medium text-gray-200">Document Title*</Label>
      <Input 
        id="title" 
        value={title} 
        onChange={e => onTitleChange(e.target.value)}
        placeholder="Enter document title"
        className="h-12 text-base bg-gray-900 border-gray-800 text-white placeholder:text-gray-500"
      />
    </div>
  );
};
