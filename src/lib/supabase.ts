import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vyoxzaztjutzsnzajdvr.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ5b3h6YXp0anV0enNuemFqZHZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyNDIxMjMsImV4cCI6MjA3NzgxODEyM30.rilnQ_TN0zZMpJQMpObwpgaFEEgrHvWClk-WLQe-DNY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

