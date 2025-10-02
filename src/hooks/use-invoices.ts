import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { Invoice, InvoiceStatus } from '@shared/types';
import { toast } from 'sonner';
type InvoiceFormData = Omit<Invoice, 'id'>;
async function fetchInvoices(): Promise<Invoice[]> {
  return api<Invoice[]>('/api/invoices');
}
async function fetchInvoice(id: string): Promise<Invoice> {
  return api<Invoice>(`/api/invoices/${id}`);
}
async function createInvoice(newInvoice: InvoiceFormData): Promise<Invoice> {
  return api<Invoice>('/api/invoices', {
    method: 'POST',
    body: JSON.stringify(newInvoice),
  });
}
async function updateInvoice({ id, ...invoiceData }: Invoice): Promise<Invoice> {
  return api<Invoice>(`/api/invoices/${id}`, {
    method: 'PUT',
    body: JSON.stringify(invoiceData),
  });
}
async function deleteInvoice(id: string): Promise<{ id: string; deleted: boolean }> {
  return api<{ id: string; deleted: boolean }>(`/api/invoices/${id}`, {
    method: 'DELETE',
  });
}
async function updateInvoiceStatus({ id, status }: { id: string; status: InvoiceStatus }): Promise<Invoice> {
  return api<Invoice>(`/api/invoices/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  });
}
export function useInvoices() {
  const queryClient = useQueryClient();
  const { data: invoices = [], isLoading, error } = useQuery<Invoice[]>({
    queryKey: ['invoices'],
    queryFn: fetchInvoices,
  });
  const createInvoiceMutation = useMutation({
    mutationFn: createInvoice,
    onSuccess: (newInvoice) => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      toast.success('Invoice created successfully!');
    },
    onError: (err) => {
      toast.error(`Failed to create invoice: ${err.message}`);
    },
  });
  const updateInvoiceMutation = useMutation({
    mutationFn: updateInvoice,
    onSuccess: (updatedInvoice) => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.setQueryData(['invoice', updatedInvoice.id], updatedInvoice);
      toast.success('Invoice updated successfully!');
    },
    onError: (err) => {
      toast.error(`Failed to update invoice: ${err.message}`);
    },
  });
  const deleteInvoiceMutation = useMutation({
    mutationFn: deleteInvoice,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      toast.success('Invoice deleted successfully!');
    },
    onError: (err) => {
      toast.error(`Failed to delete invoice: ${err.message}`);
    },
  });
  const updateStatusMutation = useMutation({
    mutationFn: updateInvoiceStatus,
    onSuccess: (updatedInvoice) => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.setQueryData(['invoice', updatedInvoice.id], updatedInvoice);
      toast.success('Invoice status updated!');
    },
    onError: (err) => {
      toast.error(`Failed to update status: ${err.message}`);
    },
  });
  return {
    invoices,
    isLoading,
    error,
    createInvoice: createInvoiceMutation.mutateAsync,
    updateInvoice: updateInvoiceMutation.mutateAsync,
    deleteInvoice: deleteInvoiceMutation.mutateAsync,
    sendInvoice: updateStatusMutation.mutateAsync,
  };
}
export function useInvoice(id?: string) {
    return useQuery<Invoice>({
        queryKey: ['invoice', id],
        queryFn: () => fetchInvoice(id!),
        enabled: !!id,
    });
}