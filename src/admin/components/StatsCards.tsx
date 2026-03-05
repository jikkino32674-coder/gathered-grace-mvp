import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Clock, CalendarDays, Mail } from 'lucide-react';
import type { AdminStats } from '../types/admin';

interface StatsCardsProps {
  stats: AdminStats | undefined;
  loading: boolean;
}

export function StatsCards({ stats, loading }: StatsCardsProps) {
  const cards = [
    {
      title: 'Total Orders',
      value: stats?.totalOrders ?? 0,
      icon: Package,
      description: `${stats?.totalLeads ?? 0} total leads`,
    },
    {
      title: 'New Orders',
      value: stats?.byStatus?.new ?? 0,
      icon: Clock,
      description: 'Awaiting processing',
    },
    {
      title: 'Last 7 Days',
      value: stats?.last7Days ?? 0,
      icon: CalendarDays,
      description: `${stats?.last30Days ?? 0} in last 30 days`,
    },
    {
      title: 'Email Signups',
      value: (stats?.byType?.email_signup ?? 0) + (stats?.byType?.discount_popup ?? 0),
      icon: Mail,
      description: 'Newsletter & discount',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            <card.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-8 w-16 bg-muted animate-pulse rounded" />
            ) : (
              <>
                <div className="text-2xl font-bold">{card.value}</div>
                <p className="text-xs text-muted-foreground">{card.description}</p>
              </>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
