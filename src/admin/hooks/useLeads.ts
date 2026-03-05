import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminFetch } from '../lib/adminApi';
import type { LeadsResponse, LeadsFilters } from '../types/admin';

export function useLeads(filters: LeadsFilters = {}) {
  const params = new URLSearchParams();
  if (filters.lead_type) params.set('lead_type', filters.lead_type);
  if (filters.status) params.set('status', filters.status);
  if (filters.search) params.set('search', filters.search);
  if (filters.page) params.set('page', String(filters.page));
  if (filters.limit) params.set('limit', String(filters.limit));
  if (filters.sort_by) params.set('sort_by', filters.sort_by);
  if (filters.sort_dir) params.set('sort_dir', filters.sort_dir);

  return useQuery<LeadsResponse>({
    queryKey: ['admin-leads', filters],
    queryFn: () => adminFetch(`/api/admin/leads?${params.toString()}`),
  });
}

export function useUpdateStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      adminFetch('/api/admin/update-status', {
        method: 'PATCH',
        body: JSON.stringify({ id, status }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-leads'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
    },
  });
}

export function useUpdateTracking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, tracking_number }: { id: string; tracking_number: string }) =>
      adminFetch('/api/admin/update-tracking', {
        method: 'PATCH',
        body: JSON.stringify({ id, tracking_number }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-leads'] });
    },
  });
}

export function useUpdateNotes() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, notes }: { id: string; notes: string }) =>
      adminFetch('/api/admin/update-notes', {
        method: 'PATCH',
        body: JSON.stringify({ id, notes }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-leads'] });
    },
  });
}

export function useCreateInvoice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      lead_id,
      line_items,
      send_immediately,
    }: {
      lead_id: string;
      line_items?: Array<{ description: string; amount: number }>;
      send_immediately?: boolean;
    }) =>
      adminFetch('/api/admin/create-invoice', {
        method: 'POST',
        body: JSON.stringify({ lead_id, line_items, send_immediately }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-leads'] });
    },
  });
}
