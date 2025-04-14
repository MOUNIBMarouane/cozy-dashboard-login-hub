
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MultiStepFormContext from './MultiStepFormContext';
import { FormData, StepValidation, initialFormData } from './types';
import { validateUsername as validateUsernameUtil, validateEmail as validateEmailUtil } from './utils/validationUtils';
import { registerUser as registerUserUtil, verifyEmail as verifyEmailUtil } from './utils/registerUtils';

export const MultiStepFormProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormDataState] = useState<FormData>(initialFormData);
  const [stepValidation, setStepValidation] = useState<StepValidation>({
    isLoading: false,
    errors: {},
  });
  const navigate = useNavigate();

  const setFormData = (data: Partial<FormData>) => {
    setFormDataState((prev) => ({ ...prev, ...data }));
  };

  const nextStep = () => setCurrentStep((prev) => prev + 1);
  const prevStep = () => setCurrentStep((prev) => Math.max(1, prev - 1));
  const resetForm = () => {
    setCurrentStep(1);
    setFormDataState(initialFormData);
    setStepValidation({ isLoading: false, errors: {} });
  };

  const validateUsername = async (): Promise<boolean> => {
    return validateUsernameUtil(formData.username, setStepValidation);
  };

  const validateEmail = async (): Promise<boolean> => {
    return validateEmailUtil(formData.email, setStepValidation);
  };

  const registerUser = async (): Promise<boolean> => {
    return registerUserUtil(formData, setStepValidation, navigate);
  };

  const verifyEmail = async (code: string): Promise<boolean> => {
    return verifyEmailUtil(formData.email, code, setStepValidation, navigate);
  };

  return (
    <MultiStepFormContext.Provider
      value={{
        currentStep,
        formData,
        stepValidation,
        nextStep,
        prevStep,
        setCurrentStep,
        setFormData,
        validateUsername,
        validateEmail,
        registerUser,
        verifyEmail,
        resetForm,
      }}
    >
      {children}
    </MultiStepFormContext.Provider>
  );
};
