import { useState, useEffect } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { StatusBadge } from './StatusBadge';
import { useUpdateStatus, useUpdateTracking, useUpdateNotes, useCreateInvoice, useDeleteLead } from '../hooks/useLeads';
import { LEAD_TYPE_LABELS, CONTACT_LEAD_TYPES, type Lead, type OrderStatus } from '../types/admin';
import { toast } from 'sonner';
import { Loader2, FileText, Plus, Trash2 } from 'lucide-react';

interface OrderDetailPanelProps {
  lead: Lead | null;
  open: boolean;
  onClose: () => void;
}

export function OrderDetailPanel({ lead, open, onClose }: OrderDetailPanelProps) {
  const [status, setStatus] = useState<string>('new');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [invoiceItems, setInvoiceItems] = useState<Array<{ description: string; amount: number }>>([]);
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);

  const updateStatus = useUpdateStatus();
  const updateTracking = useUpdateTracking();
  const updateNotes = useUpdateNotes();
  const createInvoice = useCreateInvoice();
  const deleteLead = useDeleteLead();

  useEffect(() => {
    if (lead) {
      setStatus(lead.status || 'new');
      setTrackingNumber(lead.tracking_number || '');
      setNotes(lead.notes || '');
      setInvoiceItems([]);
      setShowInvoiceForm(false);
    }
  }, [lead]);

  if (!lead) return null;

  const meta = lead.metadata || {};

  const handleSaveStatus = async () => {
    try {
      await updateStatus.mutateAsync({ id: lead.id, status });
      toast.success('Status updated');
    } catch (err: any) {
      toast.error(err.message || 'Failed to update status');
    }
  };

  const handleSaveTracking = async () => {
    try {
      await updateTracking.mutateAsync({ id: lead.id, tracking_number: trackingNumber });
      toast.success('Tracking number updated');
    } catch (err: any) {
      toast.error(err.message || 'Failed to update tracking');
    }
  };

  const handleSaveNotes = async () => {
    try {
      await updateNotes.mutateAsync({ id: lead.id, notes });
      toast.success('Notes saved');
    } catch (err: any) {
      toast.error(err.message || 'Failed to save notes');
    }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-3">
            <span>{meta.recipient_name || lead.full_name || lead.email}</span>
            <StatusBadge status={lead.status as OrderStatus} />
          </SheetTitle>
          <p className="text-sm text-muted-foreground">
            {LEAD_TYPE_LABELS[lead.lead_type] || lead.lead_type} &middot; {formatDate(lead.created_at)}
          </p>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Sender Info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Sender Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Name</span>
                <span>{lead.full_name || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Email</span>
                <span>{lead.email}</span>
              </div>
            </CardContent>
          </Card>

          {/* Recipient / Shipping */}
          {meta.recipient_name && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Recipient & Shipping</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Recipient</span>
                  <span>{meta.recipient_name}</span>
                </div>
                {meta.recipient_email && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Email</span>
                    <span>{meta.recipient_email}</span>
                  </div>
                )}
                {meta.address && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Address</span>
                    <span className="text-right">
                      {meta.address}<br />
                      {meta.city}, {meta.state} {meta.zip}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Gift Details */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Gift Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              {meta.kit_type && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Kit</span>
                  <span>{meta.kit_type}</span>
                </div>
              )}
              {meta.occasion && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Occasion</span>
                  <span>{meta.occasion}</span>
                </div>
              )}
              {meta.comforts && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Comforts</span>
                  <span className="text-right max-w-[200px]">{meta.comforts}</span>
                </div>
              )}
              {meta.budget && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Budget</span>
                  <span>{meta.budget}</span>
                </div>
              )}
              {meta.custom_fabric && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Custom Fabric</span>
                  <span>{meta.custom_fabric === 'yes' ? `Yes — ${meta.fabric_theme || ''}` : 'No'}</span>
                </div>
              )}
              {meta.card_message && (
                <div>
                  <span className="text-muted-foreground">Card Message</span>
                  <p className="mt-1 text-sm italic bg-muted p-2 rounded">"{meta.card_message}"</p>
                  {meta.name_on_card && (
                    <p className="text-xs text-muted-foreground mt-1">— {meta.name_on_card}</p>
                  )}
                </div>
              )}
              {meta.special_requests && (
                <div>
                  <span className="text-muted-foreground">Special Requests</span>
                  <p className="mt-1 text-sm bg-muted p-2 rounded">{meta.special_requests}</p>
                </div>
              )}
              {meta.selected_items && (
                <div>
                  <span className="text-muted-foreground">Selected Items</span>
                  <div className="mt-1 text-sm space-y-1">
                    {meta.selected_items.eye_pillow && <p>Lavender Eye Pillow</p>}
                    {meta.selected_items.balm && <p>Handmade Balm</p>}
                    {meta.selected_items.journal && <p>Journal & Pen Set</p>}
                    {meta.selected_items.custom_gift && <p>Custom Gift{meta.custom_gift_budget ? ` (${meta.custom_gift_budget})` : ''}</p>}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Separator />

          {/* Order Management */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Order Management</h3>

            {/* Status */}
            <div className="space-y-2">
              <Label>Status</Label>
              <div className="flex gap-2">
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  onClick={handleSaveStatus}
                  disabled={updateStatus.isPending || status === lead.status}
                  size="sm"
                >
                  {updateStatus.isPending && <Loader2 className="h-3 w-3 animate-spin mr-1" />}
                  Save
                </Button>
              </div>
            </div>

            {/* Tracking Number */}
            <div className="space-y-2">
              <Label>Tracking Number</Label>
              <div className="flex gap-2">
                <Input
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="Enter tracking number"
                  className="font-mono text-sm"
                />
                <Button
                  onClick={handleSaveTracking}
                  disabled={updateTracking.isPending}
                  size="sm"
                >
                  {updateTracking.isPending && <Loader2 className="h-3 w-3 animate-spin mr-1" />}
                  Save
                </Button>
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label>Internal Notes</Label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add notes about this order..."
                rows={3}
              />
              <Button
                onClick={handleSaveNotes}
                disabled={updateNotes.isPending}
                size="sm"
              >
                {updateNotes.isPending && <Loader2 className="h-3 w-3 animate-spin mr-1" />}
                Save Notes
              </Button>
            </div>
          </div>

          {/* Invoice */}
          {!CONTACT_LEAD_TYPES.includes(lead.lead_type as any) && (
            <>
              <Separator />
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Invoice
                  </h3>
                  {!showInvoiceForm && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowInvoiceForm(true)}
                    >
                      Create Invoice
                    </Button>
                  )}
                </div>

                {showInvoiceForm && (
                  <div className="space-y-3">
                    <p className="text-xs text-muted-foreground">
                      Add line items for this invoice. Leave empty to auto-generate from order data.
                      For custom gifts, add a line item with the specific gift description and price.
                    </p>

                    {invoiceItems.map((item, index) => (
                      <div key={index} className="flex gap-2 items-start">
                        <Input
                          placeholder="Description (e.g., Custom candle set)"
                          value={item.description}
                          onChange={(e) => {
                            const updated = [...invoiceItems];
                            updated[index] = { ...updated[index], description: e.target.value };
                            setInvoiceItems(updated);
                          }}
                          className="flex-1 text-sm"
                        />
                        <Input
                          type="number"
                          placeholder="$"
                          value={item.amount || ''}
                          onChange={(e) => {
                            const updated = [...invoiceItems];
                            updated[index] = { ...updated[index], amount: parseFloat(e.target.value) || 0 };
                            setInvoiceItems(updated);
                          }}
                          className="w-20 text-sm"
                          min={0}
                          step={0.01}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setInvoiceItems(items => items.filter((_, i) => i !== index))}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setInvoiceItems([...invoiceItems, { description: '', amount: 0 }])}
                      className="w-full"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add Line Item
                    </Button>

                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        onClick={async () => {
                          try {
                            const result = await createInvoice.mutateAsync({
                              lead_id: lead.id,
                              line_items: invoiceItems.length > 0 ? invoiceItems : undefined,
                              send_immediately: false,
                            });
                            toast.success(result.message || 'Invoice created as draft');
                            setShowInvoiceForm(false);
                          } catch (err: any) {
                            toast.error(err.message || 'Failed to create invoice');
                          }
                        }}
                        disabled={createInvoice.isPending}
                      >
                        {createInvoice.isPending && <Loader2 className="h-3 w-3 animate-spin mr-1" />}
                        Create Draft
                      </Button>
                      <Button
                        size="sm"
                        variant="default"
                        onClick={async () => {
                          try {
                            const result = await createInvoice.mutateAsync({
                              lead_id: lead.id,
                              line_items: invoiceItems.length > 0 ? invoiceItems : undefined,
                              send_immediately: true,
                            });
                            toast.success(result.message || 'Invoice sent to customer');
                            setShowInvoiceForm(false);
                          } catch (err: any) {
                            toast.error(err.message || 'Failed to send invoice');
                          }
                        }}
                        disabled={createInvoice.isPending}
                      >
                        {createInvoice.isPending && <Loader2 className="h-3 w-3 animate-spin mr-1" />}
                        Create & Send
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setShowInvoiceForm(false);
                          setInvoiceItems([]);
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Timestamps */}
          {lead.updated_at && (
            <p className="text-xs text-muted-foreground">
              Last updated: {formatDate(lead.updated_at)}
            </p>
          )}

          <Separator />

          {/* Delete */}
          <Button
            variant="outline"
            size="sm"
            className="w-full text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
            onClick={() => {
              if (window.confirm(`Delete this order from ${lead.email}? This cannot be undone.`)) {
                deleteLead.mutate({ id: lead.id }, {
                  onSuccess: () => {
                    toast.success('Order deleted');
                    onClose();
                  },
                  onError: (err: any) => {
                    toast.error(err.message || 'Failed to delete');
                  },
                });
              }
            }}
            disabled={deleteLead.isPending}
          >
            {deleteLead.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Trash2 className="h-4 w-4 mr-2" />
            )}
            Delete Order
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
