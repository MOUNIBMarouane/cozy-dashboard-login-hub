
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
  const isFieldValid = (fieldName: string, value?: string) => {
    return value && value.trim().length > 0 && !localErrors[fieldName];
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* First Name */}
      <div className="space-y-1">
        <Label htmlFor="firstName">First Name</Label>
        <div className="relative">
          <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="firstName"
            name="firstName"
            placeholder="First Name"
            className={`pl-10 pr-10 ${
              isFieldValid('firstName', formData.firstName) 
                ? 'bg-green-50 border-green-200 focus:border-green-300' 
                : 'bg-white'
            }`}
            value={formData.firstName}
            onChange={handleChange}
          />
          {isFieldValid('firstName', formData.firstName) && (
            <CheckCircle2 className="absolute right-3 top-3 h-4 w-4 text-green-500" />
          )}
        </div>
        {localErrors.firstName && (
          <p className="text-xs text-gray-500">{localErrors.firstName}</p>
        )}
      </div>
      
      {/* Last Name */}
      <div className="space-y-1">
        <Label htmlFor="lastName">Last Name</Label>
        <div className="relative">
          <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="lastName"
            name="lastName"
            placeholder="Last Name"
            className={`pl-10 pr-10 ${
              isFieldValid('lastName', formData.lastName) 
                ? 'bg-green-50 border-green-200 focus:border-green-300' 
                : 'bg-white'
            }`}
            value={formData.lastName}
            onChange={handleChange}
          />
          {isFieldValid('lastName', formData.lastName) && (
            <CheckCircle2 className="absolute right-3 top-3 h-4 w-4 text-green-500" />
          )}
        </div>
        {localErrors.lastName && (
          <p className="text-xs text-gray-500">{localErrors.lastName}</p>
        )}
      </div>
      
      {/* CIN (Optional) */}
      <div className="space-y-1">
        <Label htmlFor="cin">CIN (ID Number) - Optional</Label>
        <div className="relative">
          <CreditCard className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="cin"
            name="cin"
            placeholder="National ID Number (Optional)"
            className={`pl-10 pr-10 ${
              isFieldValid('cin', formData.cin) 
                ? 'bg-green-50 border-green-200 focus:border-green-300' 
                : 'bg-white'
            }`}
            value={formData.cin || ''}
            onChange={handleChange}
          />
          {isFieldValid('cin', formData.cin) && (
            <CheckCircle2 className="absolute right-3 top-3 h-4 w-4 text-green-500" />
          )}
        </div>
        {localErrors.cin && (
          <p className="text-xs text-gray-500">{localErrors.cin}</p>
        )}
      </div>
      
      {/* Phone Number (Optional) */}
      <div className="space-y-1">
        <Label htmlFor="personalPhone">Phone Number - Optional</Label>
        <div className="relative">
          <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="personalPhone"
            name="personalPhone"
            placeholder="Your Phone Number (Optional)"
            className={`pl-10 pr-10 ${
              isFieldValid('personalPhone', formData.personalPhone) 
                ? 'bg-green-50 border-green-200 focus:border-green-300' 
                : 'bg-white'
            }`}
            value={formData.personalPhone || ''}
            onChange={handleChange}
          />
          {isFieldValid('personalPhone', formData.personalPhone) && (
            <CheckCircle2 className="absolute right-3 top-3 h-4 w-4 text-green-500" />
          )}
        </div>
        {localErrors.personalPhone && (
          <p className="text-xs text-gray-500">{localErrors.personalPhone}</p>
        )}
      </div>
    </div>
  );
};

export default PersonalUserFields;
