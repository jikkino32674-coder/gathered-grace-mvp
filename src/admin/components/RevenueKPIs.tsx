import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DollarSign, TrendingUp, Wallet, ShoppingCart, CalendarDays, X } from 'lucide-react';
import { useStripeStats } from '../hooks/useStripeStats';

const fmt = (amount: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

export function RevenueKPIs() {
  const [customRange, setCustomRange] = useState<{ start: string; end: string } | undefined>();
  const [startInput, setStartInput] = useState('');
  const [endInput, setEndInput] = useState('');

  const { data, isLoading } = useStripeStats(customRange);

  const handleApplyRange = () => {
    if (startInput && endInput) {
      setCustomRange({ start: startInput, end: endInput });
    }
  };

  const handleClearRange = () => {
    setCustomRange(undefined);
    setStartInput('');
    setEndInput('');
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <CardTitle className="text-base">Revenue & KPIs</CardTitle>
          <div className="flex items-center gap-1.5 rounded-lg border bg-muted/40 px-2 py-1">
            <CalendarDays className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <input
              type="date"
              value={startInput}
              onChange={(e) => setStartInput(e.target.value)}
              className="h-7 w-[120px] rounded border-0 bg-background px-2 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
            />
            <span className="text-xs text-muted-foreground">—</span>
            <input
              type="date"
              value={endInput}
              onChange={(e) => setEndInput(e.target.value)}
              className="h-7 w-[120px] rounded border-0 bg-background px-2 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
            />
            <Button
              size="sm"
              variant="default"
              className="h-7 px-3 text-xs"
              onClick={handleApplyRange}
              disabled={!startInput || !endInput}
            >
              Apply
            </Button>
            {customRange && (
              <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={handleClearRange}>
                <X className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-20 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        ) : data ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Total Revenue */}
              <div className="rounded-lg border p-4">
                <div className="flex items-center gap-2 mb-1">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  <span className="text-xs text-muted-foreground">Total Revenue</span>
                </div>
                <p className="text-xl font-bold text-green-700">{fmt(data.revenueAllTime)}</p>
                <p className="text-xs text-muted-foreground">
                  {data.ordersAllTime} orders all time
                </p>
              </div>

              {/* Revenue Last 30 Days */}
              <div className="rounded-lg border p-4">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                  <span className="text-xs text-muted-foreground">Last 30 Days</span>
                </div>
                <p className="text-xl font-bold text-blue-700">{fmt(data.revenue30d)}</p>
                <p className="text-xs text-muted-foreground">
                  {data.orders30d} orders · {fmt(data.revenue7d)} last 7d
                </p>
              </div>

              {/* AOV */}
              <div className="rounded-lg border p-4">
                <div className="flex items-center gap-2 mb-1">
                  <ShoppingCart className="h-4 w-4 text-purple-600" />
                  <span className="text-xs text-muted-foreground">Avg Order Value</span>
                </div>
                <p className="text-xl font-bold text-purple-700">{fmt(data.aovAllTime)}</p>
                <p className="text-xs text-muted-foreground">All time average</p>
              </div>

              {/* Stripe Balance */}
              <div className="rounded-lg border p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Wallet className="h-4 w-4 text-amber-600" />
                  <span className="text-xs text-muted-foreground">Stripe Balance</span>
                </div>
                <p className="text-xl font-bold text-amber-700">{fmt(data.availableBalance)}</p>
                <p className="text-xs text-muted-foreground">
                  {data.pendingBalance > 0 ? `${fmt(data.pendingBalance)} pending` : 'Available'}
                </p>
              </div>
            </div>

            {/* Custom range result */}
            {data.revenueCustom !== null && customRange && (
              <div className="rounded-lg border border-dashed p-4 bg-muted/30">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs text-muted-foreground">
                      Custom Range: {customRange.start} to {customRange.end}
                    </span>
                    <p className="text-lg font-bold">{fmt(data.revenueCustom)}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Unable to load revenue data</p>
        )}
      </CardContent>
    </Card>
  );
}
