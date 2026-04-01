-- MIGRATION: 0002_security_rls_lockdown.sql
-- PURPOSE: Enterprise-grade security for Lead Capture Data
-- AUTHOR: Data Engineer Persona

-- 1. Enable RLS on app_users (The Vault)
ALTER TABLE public.app_users ENABLE ROW LEVEL SECURITY;

-- 2. Revoke ANY accidentall public access to leads data
-- (Attempting to drop generic policy names if they were created)
DROP POLICY IF EXISTS "Allow public read access" ON public.app_users;
DROP POLICY IF EXISTS "Allow public insert access" ON public.app_users;

-- 3. We deliberately create NO policies for 'anon' or 'authenticated' on app_users.
-- This effectively makes the table a "Black Hole". 
-- Nobody on the frontend can read or write. It's 100% controlled by Next.js Server Actions using the Service Role Key.

-- 4. Enable RLS on public catalogs (categories and prompts)
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prompts ENABLE ROW LEVEL SECURITY;

-- 5. Give public read-only access to categories and prompts so the frontend catalogue works perfectly
DO $$ BEGIN
    CREATE POLICY "Allow public read access on categories" ON public.categories FOR SELECT USING (true);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "Allow public read access on prompts" ON public.prompts FOR SELECT USING (true);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
