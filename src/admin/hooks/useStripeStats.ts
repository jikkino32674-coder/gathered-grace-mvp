import { useQuery } from '@tanstack/react-query';
import { adminFetch } from '../lib/adminApi';

export interface StripeStats {
  revenue7d: number;
  revenue30d: number;
  revenueCustom: number | null;
  orders7d: number;
  orders30d: number;
  aov7d: number;
  aov30d: number;
  availableBalance: number;
  pendingBalance: number;
  totalBalance: number;
  currency: string;
}

export function useStripeStats(dateRange?: { start: string; end: string }) {
  const params = new URLSearchParams();
  if (dateRange?.start) params.set('start', dateRange.start);
  if (dateRange?.end) params.set('end', dateRange.end);
  const qs = params.toString();

  return useQuery<StripeStats>({
    queryKey: ['stripe-stats', dateRange],
    queryFn: () => adminFetch(`/api/admin/stripe-stats${qs ? `?${qs}` : ''}`),
    staleTime: 5 * 60 * 1000,
  });
}
