
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Mail, CheckCircle2 } from 'lucide-react';

interface EmailFieldProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  localErrors: Record<string, string>;
  validationErrors: Record<string, string>;
}

const EmailField: React.FC<EmailFieldProps> = ({
  value,
  onChange,
  localErrors,
  validationErrors
}) => {
  const hasError = !!(validationErrors.email);
  const isValid = value && !hasError;
  
  return (
    <div className="space-y-1">
      <Label htmlFor="email">Email</Label>
      <div className="relative">
        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="name@example.com"
          className={`pl-10 pr-10 ${
            hasError ? 'border-red-500' : 
            isValid ? 'bg-green-50 border-green-200 focus:border-green-300' : 'bg-white'
          }`}
          value={value}
          onChange={onChange}
        />
        {isValid && (
          <CheckCircle2 className="absolute right-3 top-3 h-4 w-4 text-green-500" />
        )}
      </div>
      {validationErrors.email && (
        <p className="text-xs text-red-500">{validationErrors.email}</p>
      )}
    </div>
  );
};

export default EmailField;
