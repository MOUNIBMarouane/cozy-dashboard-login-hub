
import { Control } from 'react-hook-form';
import { Check } from 'lucide-react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Input } from "@/components/ui/input";

interface TypeNameStepProps {
  control: Control<any>;
  isTypeNameValid: boolean | null;
  isValidating: boolean;
  onTypeNameChange: () => void;
}

export const TypeNameStep = ({ 
  control, 
  isTypeNameValid, 
  isValidating,
  onTypeNameChange 
}: TypeNameStepProps) => {
  return (
    <FormField
      control={control}
      name="typeName"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-base text-blue-100">Type Name*</FormLabel>
          <FormControl>
            <Input 
              {...field} 
              placeholder="Enter document type name" 
              className="h-11 text-base bg-[#0A0E2E] border-blue-900/40 focus:border-blue-500"
              onChange={(e) => {
                field.onChange(e);
                onTypeNameChange();
              }}
            />
          </FormControl>
          <FormDescription className="text-blue-300/70">
            This name must be unique and at least 2 characters long
          </FormDescription>
          {isTypeNameValid === false && (
            <p className="text-sm text-red-500 flex items-center mt-2">
              <span className="inline-block w-5 h-5 rounded-full bg-red-500/20 text-red-400 text-center mr-2 flex items-center justify-center text-xs">!</span>
              This type name already exists
            </p>
          )}
          {isTypeNameValid === true && (
            <p className="text-sm text-green-500 flex items-center mt-2">
              <span className="inline-block w-5 h-5 rounded-full bg-green-500/20 text-green-400 text-center mr-2 flex items-center justify-center text-xs">✓</span>
              Type name is available
            </p>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
