import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { Business } from '@shared/types';
import { toast } from 'sonner';
type BusinessProfileFormData = Omit<Business, 'id'>;
async function fetchBusinessProfile(): Promise<Business> {
  return api<Business>('/api/business-profile');
}
async function updateBusinessProfile(profileData: BusinessProfileFormData): Promise<Business> {
  return api<Business>('/api/business-profile', {
    method: 'PUT',
    body: JSON.stringify(profileData),
  });
}
export function useBusinessProfile() {
  const queryClient = useQueryClient();
  const { data: profile, isLoading, error } = useQuery<Business>({
    queryKey: ['business-profile'],
    queryFn: fetchBusinessProfile,
  });
  const updateMutation = useMutation({
    mutationFn: updateBusinessProfile,
    onSuccess: (updatedProfile) => {
      queryClient.setQueryData(['business-profile'], updatedProfile);
      toast.success('Business profile updated successfully!');
    },
    onError: (err) => {
      toast.error(`Failed to update profile: ${err.message}`);
    },
  });
  return {
    profile,
    isLoading,
    error,
    updateProfile: updateMutation.mutateAsync,
  };
}