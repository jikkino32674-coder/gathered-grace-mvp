export type OrderStatus = 'new' | 'processing' | 'shipped' | 'delivered';

export type LeadType =
  | 'rest_kit_form'
  | 'reflect_kit_form'
  | 'restore_kit_form'
  | 'custom_care_form'
  | 'build_custom_kit'
  | 'gathered_grace_gift_box_form'
  | 'lavender_eye_pillow_form'
  | 'handmade_balm_form'
  | 'journal_pen_form'
  | 'email_signup'
  | 'discount_popup';

export const ORDER_LEAD_TYPES: LeadType[] = [
  'rest_kit_form',
  'reflect_kit_form',
  'restore_kit_form',
  'custom_care_form',
  'build_custom_kit',
  'gathered_grace_gift_box_form',
  'lavender_eye_pillow_form',
  'handmade_balm_form',
  'journal_pen_form',
];

export const CONTACT_LEAD_TYPES: LeadType[] = [
  'email_signup',
  'discount_popup',
];

export const LEAD_TYPE_LABELS: Record<string, string> = {
  rest_kit_form: 'Rest Kit',
  reflect_kit_form: 'Reflect Kit',
  restore_kit_form: 'Restore Kit',
  custom_care_form: 'Custom Care',
  build_custom_kit: 'Build Custom Kit',
  gathered_grace_gift_box_form: 'Gift Box',
  lavender_eye_pillow_form: 'Eye Pillow',
  handmade_balm_form: 'Balm',
  journal_pen_form: 'Journal & Pen',
  email_signup: 'Email Signup',
  discount_popup: 'Discount Popup',
};

export interface Lead {
  id: string;
  email: string;
  full_name: string | null;
  lead_type: string;
  source_page: string;
  website_type: string;
  metadata: Record<string, any>;
  status: OrderStatus;
  tracking_number: string | null;
  notes: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface LeadsResponse {
  leads: Lead[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface LeadsFilters {
  lead_type?: string;
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
  sort_by?: string;
  sort_dir?: 'asc' | 'desc';
}

export interface AdminStats {
  totalLeads: number;
  totalOrders: number;
  byType: Record<string, number>;
  byStatus: Record<OrderStatus, number>;
  last7Days: number;
  last30Days: number;
  dailyCounts: Record<string, number>;
  recentLeads: Lead[];
}
