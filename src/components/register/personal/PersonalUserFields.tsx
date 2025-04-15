
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, CreditCard, Phone, CheckCircle2 } from 'lucide-react';

interface PersonalUserFieldsProps {
  formData: {
    firstName: string;
    lastName: string;
    cin?: string;
    personalPhone?: string;
  };
  localErrors: Record<string, string>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PersonalUserFields: React.FC<PersonalUserFieldsProps> = ({
  formData,
  localErrors,
  handleChange
}) => {
  // Helper function to determine if a field is valid
  const isFieldValid = (fieldName: string, value?: string) => {
    return value && value.trim().length > 0 && !localErrors[fieldName];
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* First Name */}
      <div className="space-y-1">
        <Label htmlFor="firstName">First Name</Label>
        <div className="relative group">
          <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="firstName"
            name="firstName"
            placeholder="First Name"
            className={`pl-10 pr-10 transition-all duration-200 focus:ring-2 focus:ring-offset-0 ${
              isFieldValid('firstName', formData.firstName) 
                ? 'bg-green-50/10 border-green-500/20 focus:border-green-500'
                : 'hover:border-gray-400'
            }`}
            value={formData.firstName}
            onChange={handleChange}
          />
          {isFieldValid('firstName', formData.firstName) && (
            <CheckCircle2 className="absolute right-3 top-3 h-4 w-4 text-green-500 animate-fade-in" />
          )}
        </div>
      </div>
      
      {/* Last Name */}
      <div className="space-y-1">
        <Label htmlFor="lastName">Last Name</Label>
        <div className="relative group">
          <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="lastName"
            name="lastName"
            placeholder="Last Name"
            className={`pl-10 pr-10 transition-all duration-200 focus:ring-2 focus:ring-offset-0 ${
              isFieldValid('lastName', formData.lastName)
                ? 'bg-green-50/10 border-green-500/20 focus:border-green-500'
                : 'hover:border-gray-400'
            }`}
            value={formData.lastName}
            onChange={handleChange}
          />
          {isFieldValid('lastName', formData.lastName) && (
            <CheckCircle2 className="absolute right-3 top-3 h-4 w-4 text-green-500 animate-fade-in" />
          )}
        </div>
      </div>
      
      {/* CIN (Optional) */}
      <div className="space-y-1">
        <Label htmlFor="cin" className="flex items-center gap-2">
          CIN (ID Number)
          <span className="text-xs text-gray-500">(Optional)</span>
        </Label>
        <div className="relative group">
          <CreditCard className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="cin"
            name="cin"
            placeholder="National ID Number (Optional)"
            className={`pl-10 pr-10 transition-all duration-200 focus:ring-2 focus:ring-offset-0 ${
              formData.cin ? 'bg-green-50/10 border-green-500/20 focus:border-green-500' : ''
            }`}
            value={formData.cin || ''}
            onChange={handleChange}
          />
          {formData.cin && (
            <CheckCircle2 className="absolute right-3 top-3 h-4 w-4 text-green-500 animate-fade-in" />
          )}
        </div>
      </div>
      
      {/* Phone Number (Optional) */}
      <div className="space-y-1">
        <Label htmlFor="personalPhone" className="flex items-center gap-2">
          Phone Number
          <span className="text-xs text-gray-500">(Optional)</span>
        </Label>
        <div className="relative group">
          <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="personalPhone"
            name="personalPhone"
            placeholder="Your Phone Number (Optional)"
            className={`pl-10 pr-10 transition-all duration-200 focus:ring-2 focus:ring-offset-0 ${
              formData.personalPhone ? 'bg-green-50/10 border-green-500/20 focus:border-green-500' : ''
            }`}
            value={formData.personalPhone || ''}
            onChange={handleChange}
          />
          {formData.personalPhone && (
            <CheckCircle2 className="absolute right-3 top-3 h-4 w-4 text-green-500 animate-fade-in" />
          )}
        </div>
      </div>
    </div>
  );
};

export default PersonalUserFields;
