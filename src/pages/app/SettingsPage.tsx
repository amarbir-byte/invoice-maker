import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AppLayout } from '@/components/layout/AppLayout';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { useBusinessProfile } from '@/hooks/use-business-profile';
import { Toaster } from '@/components/ui/sonner';
const profileSchema = z.object({
  name: z.string().min(1, 'Business name is required'),
  address: z.string().optional(),
  taxId: z.string().optional(),
});
type ProfileFormData = z.infer<typeof profileSchema>;
export function SettingsPage() {
  const { profile, isLoading, updateProfile } = useBusinessProfile();
  const { register, handleSubmit, reset, formState: { errors, isSubmitting, isDirty } } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });
  useEffect(() => {
    if (profile) {
      reset(profile);
    }
  }, [profile, reset]);
  const onSubmit = async (data: ProfileFormData) => {
    await updateProfile(data);
    reset(data); // Resets the form's dirty state
  };
  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </AppLayout>
    );
  }
  return (
    <AppLayout>
      <PageHeader
        title="Settings"
        description="Manage your business profile and application settings."
      />
      <div className="mt-8 max-w-3xl">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Card>
            <CardHeader>
              <CardTitle>Business Profile</CardTitle>
              <CardDescription>Update your company's details here.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Business Name</Label>
                <Input id="name" {...register('name')} />
                {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea id="address" {...register('address')} placeholder="123 Main St, Anytown, USA" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="taxId">Tax ID</Label>
                <Input id="taxId" {...register('taxId')} placeholder="e.g., EIN, VAT number" />
              </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button type="submit" disabled={isSubmitting || !isDirty}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
      <Toaster richColors />
    </AppLayout>
  );
}