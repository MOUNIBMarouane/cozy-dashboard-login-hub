
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useStepForm } from './StepFormProvider';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';

const formSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters.'),
  descriptif: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export const StepBasicInfo = () => {
  const { formData, setFormData } = useStepForm();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: formData.title,
      descriptif: formData.descriptif,
    },
  });

  const onSubmit = (values: FormValues) => {
    setFormData(values);
    // Do not navigate, this will be handled by the parent's Next button
  };

  // Update the parent form data when form values change
  const handleChange = (field: keyof FormValues, value: string) => {
    form.setValue(field, value);
    setFormData({ [field]: value });
  };

  return (
    <Card className="border border-blue-900/30 bg-[#0a1033] shadow-lg">
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Step Title</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter step title" 
                      {...field} 
                      onChange={(e) => handleChange('title', e.target.value)}
                      className="bg-[#0d1541] border-blue-900/50 focus:border-blue-500 text-white"
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="descriptif"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter step description" 
                      {...field} 
                      rows={4}
                      onChange={(e) => handleChange('descriptif', e.target.value)}
                      className="bg-[#0d1541] border-blue-900/50 focus:border-blue-500 text-white resize-none"
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
