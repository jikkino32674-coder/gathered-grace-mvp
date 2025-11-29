-- Disable RLS on b2c_leads table
-- This is a public lead collection table where anyone should be able to submit
-- email signups, discount popups, and custom care forms without authentication.
-- RLS was causing 401 errors for anonymous users trying to insert leads.
ALTER TABLE public.b2c_leads DISABLE ROW LEVEL SECURITY;

-- Drop any existing RLS policies (they're no longer needed)
DROP POLICY IF EXISTS "Allow anonymous email subscriptions" ON public.b2c_leads;
DROP POLICY IF EXISTS "Allow authenticated email subscriptions" ON public.b2c_leads;
DROP POLICY IF EXISTS "Anyone can insert leads" ON public.b2c_leads;
DROP POLICY IF EXISTS "Users can view their own leads" ON public.b2c_leads;
DROP POLICY IF EXISTS "Enable insert for all" ON public.b2c_leads;
DROP POLICY IF EXISTS "Enable select for authenticated" ON public.b2c_leads;

