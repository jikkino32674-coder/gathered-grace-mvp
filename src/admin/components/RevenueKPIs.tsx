import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DollarSign, TrendingUp, Wallet, ShoppingCart } from 'lucide-react';
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
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Revenue & KPIs</CardTitle>
          <div className="flex items-center gap-2">
            <Input
              type="date"
              value={startInput}
              onChange={(e) => setStartInput(e.target.value)}
              className="h-8 w-[130px] text-xs"
            />
            <span className="text-xs text-muted-foreground">to</span>
            <Input
              type="date"
              value={endInput}
              onChange={(e) => setEndInput(e.target.value)}
              className="h-8 w-[130px] text-xs"
            />
            <Button size="sm" variant="outline" className="h-8 text-xs" onClick={handleApplyRange}>
              Apply
            </Button>
            {customRange && (
              <Button size="sm" variant="ghost" className="h-8 text-xs" onClick={handleClearRange}>
                Clear
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
              {/* Revenue Last 7 Days */}
              <div className="rounded-lg border p-4">
                <div className="flex items-center gap-2 mb-1">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  <span className="text-xs text-muted-foreground">Last 7 Days</span>
                </div>
                <p className="text-xl font-bold text-green-700">{fmt(data.revenue7d)}</p>
                <p className="text-xs text-muted-foreground">{data.orders7d} orders</p>
              </div>

              {/* Revenue Last 30 Days */}
              <div className="rounded-lg border p-4">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                  <span className="text-xs text-muted-foreground">Last 30 Days</span>
                </div>
                <p className="text-xl font-bold text-blue-700">{fmt(data.revenue30d)}</p>
                <p className="text-xs text-muted-foreground">{data.orders30d} orders</p>
              </div>

              {/* AOV */}
              <div className="rounded-lg border p-4">
                <div className="flex items-center gap-2 mb-1">
                  <ShoppingCart className="h-4 w-4 text-purple-600" />
                  <span className="text-xs text-muted-foreground">Avg Order Value</span>
                </div>
                <p className="text-xl font-bold text-purple-700">{fmt(data.aov30d)}</p>
                <p className="text-xs text-muted-foreground">30-day avg</p>
              </div>

              {/* Stripe Balance */}
              <div className="rounded-lg border p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Wallet className="h-4 w-4 text-amber-600" />
                  <span className="text-xs text-muted-foreground">Stripe Balance</span>
                </div>
                <p className="text-xl font-bold text-amber-700">{fmt(data.availableBalance)}</p>
                {data.pendingBalance > 0 && (
                  <p className="text-xs text-muted-foreground">{fmt(data.pendingBalance)} pending</p>
                )}
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
