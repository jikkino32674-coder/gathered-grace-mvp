import { Badge } from '@/components/ui/badge';
import type { OrderStatus } from '../types/admin';

const statusConfig: Record<OrderStatus, { label: string; className: string }> = {
  new: { label: 'New', className: 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100' },
  processing: { label: 'Processing', className: 'bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-100' },
  shipped: { label: 'Shipped', className: 'bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-100' },
  delivered: { label: 'Delivered', className: 'bg-green-100 text-green-800 border-green-200 hover:bg-green-100' },
};

interface StatusBadgeProps {
  status: OrderStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.new;
  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  );
}
