import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import type { AdminStats } from '../types/admin';

interface RecentOrdersChartProps {
  stats: AdminStats | undefined;
  loading: boolean;
}

export function RecentOrdersChart({ stats, loading }: RecentOrdersChartProps) {
  const chartData = stats?.dailyCounts
    ? Object.entries(stats.dailyCounts).map(([date, count]) => ({
        date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        orders: count,
      }))
    : [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Orders (Last 14 Days)</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-[200px] bg-muted animate-pulse rounded" />
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData}>
              <XAxis
                dataKey="date"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                fontSize={12}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <Tooltip />
              <Bar
                dataKey="orders"
                fill="#8B7355"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
