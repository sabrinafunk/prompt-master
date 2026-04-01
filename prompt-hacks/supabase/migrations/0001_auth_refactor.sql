-- Create our custom users table (bypassing Supabase Auth to avoid OTP and SMS costs)
CREATE TABLE public.app_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT UNIQUE NOT NULL,
  accepted_terms BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Drop old profiles table
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Re-point favorites to app_users
ALTER TABLE public.favorites DROP CONSTRAINT IF EXISTS favorites_user_id_fkey;

-- We need to clear favorites since they used auth.users UUIDs
TRUNCATE TABLE public.favorites;

ALTER TABLE public.favorites 
  ADD CONSTRAINT favorites_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES public.app_users(id) ON DELETE CASCADE;

-- Update RLS for favorites since we no longer use auth.uid()
-- We will enforce security at the Next.js server level via secure cookies.
DROP POLICY IF EXISTS "Users can view own favorites" ON public.favorites;
DROP POLICY IF EXISTS "Users can insert own favorites" ON public.favorites;
DROP POLICY IF EXISTS "Users can delete own favorites" ON public.favorites;

CREATE POLICY "Favorites are publicly accessible but managed by server" ON public.favorites FOR ALL USING (true);
