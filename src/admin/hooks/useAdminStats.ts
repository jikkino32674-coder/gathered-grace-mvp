import { useQuery } from '@tanstack/react-query';
import { adminFetch } from '../lib/adminApi';
import type { AdminStats } from '../types/admin';

export function useAdminStats() {
  return useQuery<AdminStats>({
    queryKey: ['admin-stats'],
    queryFn: () => adminFetch('/api/admin/stats'),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
