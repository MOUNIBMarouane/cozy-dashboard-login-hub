export type UserType = 'personal' | 'company';

export interface StepValidation {
  isLoading: boolean;
  errors: {
    username?: string;
    email?: string;
    registration?: string;
  };
}

export interface FormData {
  userType: UserType;
  firstName: string;
  lastName: string;
  cin?: string;
  companyName?: string;
  companyIRC?: string;
  companyPhone?: string;
  companyAddress?: string;
  companyEmail?: string;
  companyWebsite?: string;
  personalPhone?: string;
  personalAddress?: string; 
  city?: string;
  country?: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  adminSecretKey: string;
  validationError?: string; // Added for form validation errors
}

export const initialFormData: FormData = {
  userType: 'personal',
  firstName: '',
  lastName: '',
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  adminSecretKey: '',
  validationError: ''
};
