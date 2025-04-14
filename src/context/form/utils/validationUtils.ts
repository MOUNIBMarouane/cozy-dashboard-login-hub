
import authService from '@/services/authService';
import { toast } from 'sonner';
import { SetStepValidation } from '../types';

export const validateUsername = async (
  username: string, 
  setStepValidation: SetStepValidation
): Promise<boolean> => {
  setStepValidation((prev) => ({ ...prev, isLoading: true, errors: {} }));
  try {
    const isValid = await authService.validateUsername(username);
    
    if (!isValid) {
      setStepValidation((prev) => ({
        ...prev,
        isLoading: false,
        errors: { username: 'Username validation failed. This username may already be taken.' },
      }));
      toast.error('Username validation failed. This username may already be taken.');
      return false;
    }
    
    setStepValidation((prev) => ({ ...prev, isLoading: false }));
    return true;
  } catch (error: any) {
    console.error('Username validation error:', error);
    const errorMessage = error.response?.data?.message || 'Username validation failed.';
    setStepValidation((prev) => ({
      ...prev,
      isLoading: false,
      errors: { username: errorMessage },
    }));
    toast.error(errorMessage);
    return false;
  }
};

export const validateEmail = async (
  email: string,
  setStepValidation: SetStepValidation
): Promise<boolean> => {
  setStepValidation((prev) => ({ ...prev, isLoading: true, errors: {} }));
  try {
    const isValid = await authService.validateEmail(email);
    
    if (!isValid) {
      setStepValidation((prev) => ({
        ...prev,
        isLoading: false,
        errors: { email: 'Email validation failed. This email may already be registered.' },
      }));
      toast.error('Email validation failed. This email may already be registered.');
      return false;
    }
    
    setStepValidation((prev) => ({ ...prev, isLoading: false }));
    return true;
  } catch (error: any) {
    console.error('Email validation error:', error);
    const errorMessage = error.response?.data?.message || 'Email validation failed.';
    setStepValidation((prev) => ({
      ...prev,
      isLoading: false,
      errors: { email: errorMessage },
    }));
    toast.error(errorMessage);
    return false;
  }
};
