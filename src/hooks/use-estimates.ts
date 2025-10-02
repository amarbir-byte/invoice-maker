import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { Estimate, Invoice, EstimateStatus } from '@shared/types';
import { toast } from 'sonner';
type EstimateFormData = Omit<Estimate, 'id'>;
async function fetchEstimates(): Promise<Estimate[]> {
  return api<Estimate[]>('/api/estimates');
}
async function fetchEstimate(id: string): Promise<Estimate> {
  return api<Estimate>(`/api/estimates/${id}`);
}
async function createEstimate(newEstimate: EstimateFormData): Promise<Estimate> {
  return api<Estimate>('/api/estimates', {
    method: 'POST',
    body: JSON.stringify(newEstimate),
  });
}
async function updateEstimate({ id, ...estimateData }: Estimate): Promise<Estimate> {
  return api<Estimate>(`/api/estimates/${id}`, {
    method: 'PUT',
    body: JSON.stringify(estimateData),
  });
}
async function deleteEstimate(id: string): Promise<{ id: string; deleted: boolean }> {
  return api<{ id: string; deleted: boolean }>(`/api/estimates/${id}`, {
    method: 'DELETE',
  });
}
async function convertEstimateToInvoice(id: string): Promise<Invoice> {
    return api<Invoice>(`/api/estimates/${id}/convert`, {
        method: 'POST',
    });
}
async function updateEstimateStatus({ id, status }: { id: string; status: EstimateStatus }): Promise<Estimate> {
  return api<Estimate>(`/api/estimates/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  });
}
export function useEstimates() {
  const queryClient = useQueryClient();
  const { data: estimates = [], isLoading, error } = useQuery<Estimate[]>({
    queryKey: ['estimates'],
    queryFn: fetchEstimates,
  });
  const createEstimateMutation = useMutation({
    mutationFn: createEstimate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['estimates'] });
      toast.success('Estimate created successfully!');
    },
    onError: (err) => {
      toast.error(`Failed to create estimate: ${err.message}`);
    },
  });
  const updateEstimateMutation = useMutation({
    mutationFn: updateEstimate,
    onSuccess: (updatedEstimate) => {
      queryClient.invalidateQueries({ queryKey: ['estimates'] });
      queryClient.setQueryData(['estimate', updatedEstimate.id], updatedEstimate);
      toast.success('Estimate updated successfully!');
    },
    onError: (err) => {
      toast.error(`Failed to update estimate: ${err.message}`);
    },
  });
  const deleteEstimateMutation = useMutation({
    mutationFn: deleteEstimate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['estimates'] });
      toast.success('Estimate deleted successfully!');
    },
    onError: (err) => {
      toast.error(`Failed to delete estimate: ${err.message}`);
    },
  });
  const convertEstimateMutation = useMutation({
    mutationFn: convertEstimateToInvoice,
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['estimates'] });
        queryClient.invalidateQueries({ queryKey: ['invoices'] });
        toast.success('Estimate converted to invoice!');
    },
    onError: (err) => {
        toast.error(`Failed to convert estimate: ${err.message}`);
    },
  });
  const updateStatusMutation = useMutation({
    mutationFn: updateEstimateStatus,
    onSuccess: (updatedEstimate) => {
      queryClient.invalidateQueries({ queryKey: ['estimates'] });
      queryClient.setQueryData(['estimate', updatedEstimate.id], updatedEstimate);
      toast.success('Estimate status updated!');
    },
    onError: (err) => {
      toast.error(`Failed to update status: ${err.message}`);
    },
  });
  return {
    estimates,
    isLoading,
    error,
    createEstimate: createEstimateMutation.mutateAsync,
    updateEstimate: updateEstimateMutation.mutateAsync,
    deleteEstimate: deleteEstimateMutation.mutateAsync,
    convertEstimate: convertEstimateMutation.mutateAsync,
    sendEstimate: updateStatusMutation.mutateAsync,
  };
}
export function useEstimate(id?: string) {
    return useQuery<Estimate>({
        queryKey: ['estimate', id],
        queryFn: () => fetchEstimate(id!),
        enabled: !!id,
    });
}