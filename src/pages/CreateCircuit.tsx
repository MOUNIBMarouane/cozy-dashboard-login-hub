
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { InfoIcon } from 'lucide-react';
import { CircuitFormProvider } from '@/context/CircuitFormContext';
import MultiStepCircuitForm from '@/components/circuits/MultiStepCircuitForm';

export default function CreateCircuitPage() {
  return (
    <div className="pt-6 flex justify-center w-full min-h-[calc(100vh-60px)] bg-gradient-to-bl from-[#0a1033]/80 to-[#151a3c]/90">
      <Card className="w-full max-w-3xl mx-auto border-blue-900/40 bg-[#0d1117] shadow-2xl animate-fade-in">
        <CardHeader className="pb-3 border-b border-blue-900/25">
          <CardTitle className="text-3xl font-semibold text-white mb-2">Create Circuit</CardTitle>
          <CardDescription className="text-gray-400">
            Create a new document workflow circuit
          </CardDescription>
          <Alert variant="default" className="mb-2 mt-4 border-blue-900/25 bg-blue-900/20">
            <InfoIcon className="h-4 w-4 text-blue-400" />
            <AlertTitle className="text-gray-200">Multi-step Creation</AlertTitle>
            <AlertDescription className="text-gray-400">
              Create your circuit in simple steps. You'll be able to define the title, description, settings, and optionally add workflow steps before finalizing.
            </AlertDescription>
          </Alert>
        </CardHeader>
        <CardContent className="px-2 sm:px-6 py-5">
          <CircuitFormProvider>
            <MultiStepCircuitForm />
          </CircuitFormProvider>
        </CardContent>
      </Card>
    </div>
  );
}
