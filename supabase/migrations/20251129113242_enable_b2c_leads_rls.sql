-- Enable RLS on b2c_leads table if not already enabled
ALTER TABLE public.b2c_leads ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Allow anonymous email subscriptions" ON public.b2c_leads;
DROP POLICY IF EXISTS "Allow authenticated email subscriptions" ON public.b2c_leads;

-- Allow anonymous users to insert email subscriptions
CREATE POLICY "Allow anonymous email subscriptions"
ON public.b2c_leads
FOR INSERT
TO anon
WITH CHECK (true);

-- Allow authenticated users to insert email subscriptions
CREATE POLICY "Allow authenticated email subscriptions"
ON public.b2c_leads
FOR INSERT
TO authenticated
WITH CHECK (true);

