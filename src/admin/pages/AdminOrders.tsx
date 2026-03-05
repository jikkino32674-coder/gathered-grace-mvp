import { useState } from 'react';
import { OrdersTable } from '../components/OrdersTable';
import { OrderDetailPanel } from '../components/OrderDetailPanel';
import type { Lead } from '../types/admin';

export default function AdminOrders() {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Orders</h1>

      <OrdersTable onSelectOrder={setSelectedLead} />

      <OrderDetailPanel
        lead={selectedLead}
        open={!!selectedLead}
        onClose={() => setSelectedLead(null)}
      />
    </div>
  );
}
