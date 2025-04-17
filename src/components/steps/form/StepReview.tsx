
import { useQuery } from '@tanstack/react-query';
import { useStepForm } from './StepFormProvider';
import circuitService from '@/services/circuitService';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export const StepReview = () => {
  const { formData, isEditMode, isWithinCircuitContext } = useStepForm();

  // Get circuits for displaying circuit name
  const { data: circuits = [], isLoading: isLoadingCircuits } = useQuery({
    queryKey: ['circuits'],
    queryFn: circuitService.getAllCircuits,
  });

  // Mock API call for roles, replace with actual service
  const { data: roles = [], isLoading: isLoadingRoles } = useQuery({
    queryKey: ['roles'],
    queryFn: () => [
      { id: 1, roleName: 'Admin' },
      { id: 2, roleName: 'Manager' },
      { id: 3, roleName: 'User' },
    ],
  });

  if (isLoadingCircuits || isLoadingRoles) {
    return (
      <div className="flex justify-center items-center h-32">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  const circuitName = circuits.find(c => c.id === formData.circuitId)?.title || 'Unknown';
  const roleName = roles.find(r => r.id === formData.responsibleRoleId)?.roleName || 'None';

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Basic Information</h3>
              <div className="grid grid-cols-1 gap-2">
                <div className="rounded-md bg-muted p-3">
                  <div className="text-sm font-medium">Title</div>
                  <div className="mt-1">{formData.title}</div>
                </div>
                <div className="rounded-md bg-muted p-3">
                  <div className="text-sm font-medium">Description</div>
                  <div className="mt-1">{formData.descriptif || 'No description provided'}</div>
                </div>
              </div>
            </div>

            {!isWithinCircuitContext && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Circuit Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div className="rounded-md bg-muted p-3">
                    <div className="text-sm font-medium">Circuit</div>
                    <div className="mt-1">{circuitName}</div>
                  </div>
                  <div className="rounded-md bg-muted p-3">
                    <div className="text-sm font-medium">Order Index</div>
                    <div className="mt-1">{formData.orderIndex}</div>
                  </div>
                </div>
              </div>
            )}

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Step Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {isWithinCircuitContext && (
                  <div className="rounded-md bg-muted p-3">
                    <div className="text-sm font-medium">Order Index</div>
                    <div className="mt-1">{formData.orderIndex}</div>
                  </div>
                )}
                <div className="rounded-md bg-muted p-3">
                  <div className="text-sm font-medium">Responsible Role</div>
                  <div className="mt-1">{roleName}</div>
                </div>
                <div className="rounded-md bg-muted p-3">
                  <div className="text-sm font-medium">Step Type</div>
                  <div className="mt-1">
                    {formData.isFinalStep ? (
                      <Badge className="bg-green-600">Final Step</Badge>
                    ) : (
                      <Badge variant="outline">Intermediate Step</Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
