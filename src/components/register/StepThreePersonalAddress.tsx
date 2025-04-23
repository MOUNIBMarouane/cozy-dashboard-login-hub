
import React, { useState, useEffect } from 'react';
import { useMultiStepForm } from '@/context/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const StepThreePersonalAddress: React.FC = () => {
  const { formData, setFormData, nextStep, prevStep } = useMultiStepForm();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({
    personalAddress: false,
    city: false,
    country: false,
  });

  useEffect(() => {
    validate();
    // eslint-disable-next-line
  }, [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ [name]: value });
    setTouched({ ...touched, [name]: true });
  };

  const validate = (): boolean => {
    const localErrors: { [key: string]: string } = {};
    if (!formData.personalAddress || !formData.personalAddress.trim()) {
      localErrors.personalAddress = "Address is required";
    }
    if (!formData.city || !formData.city.trim()) {
      localErrors.city = "City is required";
    }
    if (!formData.country || !formData.country.trim()) {
      localErrors.country = "Country is required";
    }
    setErrors(localErrors);
    return Object.keys(localErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) {
      nextStep();
    } else {
      setTouched({
        personalAddress: true,
        city: true,
        country: true,
      });
      toast.error("Please fill all required fields");
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-white mb-1" htmlFor="personalAddress">
          Address <span className="text-red-500">*</span>
        </label>
        <Input
          id="personalAddress"
          name="personalAddress"
          value={formData.personalAddress || ''}
          onChange={handleChange}
          placeholder="Enter your address"
          error={touched.personalAddress && !!errors.personalAddress}
        />
        {touched.personalAddress && errors.personalAddress && (
          <p className="text-xs text-red-500 mt-1">{errors.personalAddress}</p>
        )}
      </div>
      <div>
        <label className="block text-white mb-1" htmlFor="city">
          City <span className="text-red-500">*</span>
        </label>
        <Input
          id="city"
          name="city"
          value={formData.city || ''}
          onChange={handleChange}
          placeholder="Your city"
          error={touched.city && !!errors.city}
        />
        {touched.city && errors.city && (
          <p className="text-xs text-red-500 mt-1">{errors.city}</p>
        )}
      </div>
      <div>
        <label className="block text-white mb-1" htmlFor="country">
          Country <span className="text-red-500">*</span>
        </label>
        <Input
          id="country"
          name="country"
          value={formData.country || ''}
          onChange={handleChange}
          placeholder="Your country"
          error={touched.country && !!errors.country}
        />
        {touched.country && errors.country && (
          <p className="text-xs text-red-500 mt-1">{errors.country}</p>
        )}
      </div>

      <div className="flex gap-4 pt-2">
        <Button type="button" variant="secondary" onClick={prevStep} className="flex-1">
          Back
        </Button>
        <Button type="button" onClick={handleNext} className="flex-1 bg-docuBlue hover:bg-docuBlue-700">
          Next
        </Button>
      </div>
    </div>
  );
};

export default StepThreePersonalAddress;
