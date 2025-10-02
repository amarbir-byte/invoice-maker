import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { Client } from '@shared/types';
import { toast } from 'sonner';
type ClientFormData = Omit<Client, 'id'>;
async function fetchClients(): Promise<Client[]> {
  return api<Client[]>('/api/clients');
}
async function createClient(newClient: ClientFormData): Promise<Client> {
  return api<Client>('/api/clients', {
    method: 'POST',
    body: JSON.stringify(newClient),
  });
}
async function editClient({ id, ...clientData }: Client): Promise<Client> {
  return api<Client>(`/api/clients/${id}`, {
    method: 'PUT',
    body: JSON.stringify(clientData),
  });
}
async function removeClient(id: string): Promise<{ id: string; deleted: boolean }> {
  return api<{ id: string; deleted: boolean }>(`/api/clients/${id}`, {
    method: 'DELETE',
  });
}
export function useClients() {
  const queryClient = useQueryClient();
  const { data: clients = [], isLoading, error } = useQuery<Client[]>({
    queryKey: ['clients'],
    queryFn: fetchClients,
  });
  const addMutation = useMutation({
    mutationFn: createClient,
    onSuccess: (newClient) => {
      queryClient.setQueryData(['clients'], (oldClients: Client[] = []) => [...oldClients, newClient]);
      toast.success('Client added successfully!');
    },
    onError: (err) => {
      toast.error(`Failed to add client: ${err.message}`);
    },
  });
  const updateMutation = useMutation({
    mutationFn: editClient,
    onSuccess: (updatedClient) => {
      queryClient.setQueryData(['clients'], (oldClients: Client[] = []) =>
        oldClients.map((c) => (c.id === updatedClient.id ? updatedClient : c))
      );
      toast.success('Client updated successfully!');
    },
    onError: (err) => {
      toast.error(`Failed to update client: ${err.message}`);
    },
  });
  const deleteMutation = useMutation({
    mutationFn: removeClient,
    onSuccess: (data) => {
      queryClient.setQueryData(['clients'], (oldClients: Client[] = []) =>
        oldClients.filter((c) => c.id !== data.id)
      );
      toast.success('Client deleted successfully!');
    },
    onError: (err) => {
      toast.error(`Failed to delete client: ${err.message}`);
    },
  });
  const addClient = useCallback((data: ClientFormData) => {
    addMutation.mutate(data);
  }, [addMutation]);
  const updateClient = useCallback((data: ClientFormData, id?: string) => {
    if (!id) return;
    updateMutation.mutate({ ...data, id });
  }, [updateMutation]);
  const deleteClient = useCallback((id: string) => {
    deleteMutation.mutate(id);
  }, [deleteMutation]);
  return {
    clients,
    isLoading,
    error,
    addClient,
    updateClient,
    deleteClient,
  };
}