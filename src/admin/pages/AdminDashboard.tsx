import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAdminStats } from '../hooks/useAdminStats';
import { StatsCards } from '../components/StatsCards';
import { RecentOrdersChart } from '../components/RecentOrdersChart';
import { StatusBadge } from '../components/StatusBadge';
import { LEAD_TYPE_LABELS, type OrderStatus } from '../types/admin';

export default function AdminDashboard() {
  const { data: stats, isLoading } = useAdminStats();
  const navigate = useNavigate();

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <StatsCards stats={stats} loading={isLoading} />

      <RecentOrdersChart stats={stats} loading={isLoading} />

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Recent Orders</CardTitle>
          <Button variant="outline" size="sm" onClick={() => navigate('/admin/orders')}>
            View All
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-10 bg-muted animate-pulse rounded" />
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats?.recentLeads.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                      No recent orders
                    </TableCell>
                  </TableRow>
                ) : (
                  stats?.recentLeads.map((lead) => (
                    <TableRow key={lead.id}>
                      <TableCell className="text-sm">{formatDate(lead.created_at)}</TableCell>
                      <TableCell className="font-medium">
                        {lead.full_name || lead.metadata?.recipient_name || lead.email}
                      </TableCell>
                      <TableCell className="text-sm">
                        {LEAD_TYPE_LABELS[lead.lead_type] || lead.lead_type}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={(lead.status || 'new') as OrderStatus} />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
