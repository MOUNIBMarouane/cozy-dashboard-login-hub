
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Status, CreateStatusDto } from '@/models/status';
import statusService from '@/services/statusService';

interface StatusFormProps {
  status?: Status;
  stepId?: number;
  isEditMode?: boolean;
  onSuccess: () => void;
  onCancel: () => void;
}

const StatusForm = ({ 
  status, 
  stepId,
  isEditMode = false, 
  onSuccess, 
  onCancel 
}: StatusFormProps) => {
  const [title, setTitle] = useState(status?.title || '');
  const [isRequired, setIsRequired] = useState(status?.isRequired || false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('Title is required');
      return;
    }

    if (!isEditMode && !stepId) {
      toast.error('Step ID is required');
      return;
    }

    const statusData: CreateStatusDto = {
      title: title.trim(),
      isRequired
    };

    try {
      setIsSubmitting(true);
      if (isEditMode && status) {
        await statusService.updateStatus(status.statusId, statusData);
        toast.success('Status updated successfully');
      } else if (stepId) {
        await statusService.createStatus(stepId, statusData);
        toast.success('Status created successfully');
      }
      onSuccess();
    } catch (error) {
      console.error('Error submitting status:', error);
      toast.error(isEditMode ? 'Failed to update status' : 'Failed to create status');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="title" className="text-white">Title</Label>
          <Input
            id="title"
            placeholder="Enter status title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-[#0f1750] border-blue-900/40 text-white"
            required
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="isRequired" className="text-white">Required</Label>
          <Switch
            id="isRequired"
            checked={isRequired}
            onCheckedChange={setIsRequired}
          />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="border-blue-800/40 text-blue-200 hover:bg-blue-800/30"
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : isEditMode ? 'Update Status' : 'Create Status'}
        </Button>
      </div>
    </form>
  );
};

export default StatusForm;
