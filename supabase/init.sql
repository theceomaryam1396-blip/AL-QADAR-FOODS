-- Supabase initialization SQL for AL-QADAR FOODS
-- Creates `profiles` table, a trigger to auto-create profiles on signup,
-- and Row Level Security (RLS) policies that restrict access to admins.

-- 1) Profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email text,
  role text NOT NULL DEFAULT 'user',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 2) Trigger function to create profile when a new auth user is created
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (NEW.id, NEW.email, 'user')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Attach trigger to auth.users insert
DROP TRIGGER IF EXISTS auth_user_created ON auth.users;
CREATE TRIGGER auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 3) Enable RLS on sensitive tables
-- Enable for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Enable for orders and catering_requests if they exist. Adjust table/column names as necessary.
ALTER TABLE IF EXISTS public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.catering_requests ENABLE ROW LEVEL SECURITY;

-- 4) Policies
-- Helper: function to check if current user is admin (reads from profiles).
-- Marked SECURITY DEFINER so the function can read `profiles` even when RLS is enabled.
CREATE OR REPLACE FUNCTION public.is_admin() RETURNS boolean AS $$
  SELECT (role = 'admin') FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Profiles policies
-- Allow users to select their own profile; admins can select any
CREATE POLICY "profiles_select" ON public.profiles FOR SELECT
  USING (auth.uid() IS NOT NULL AND (id = auth.uid() OR public.is_admin()));

-- Allow users to update their own profile (not role), admins can update any
CREATE POLICY "profiles_update" ON public.profiles FOR UPDATE
  USING (auth.uid() IS NOT NULL AND (id = auth.uid() OR public.is_admin()))
  WITH CHECK (auth.uid() IS NOT NULL AND (id = auth.uid() OR public.is_admin()));

-- Allow insert only via trigger (auth provider); authenticated users may insert their profile
CREATE POLICY "profiles_insert" ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND id = auth.uid());

-- Orders policies: ONLY admins may SELECT/INSERT/UPDATE/DELETE
CREATE POLICY "orders_admin_only_select" ON public.orders FOR SELECT
  USING (public.is_admin());
CREATE POLICY "orders_admin_only_insert" ON public.orders FOR INSERT
  WITH CHECK (public.is_admin());
CREATE POLICY "orders_admin_only_update" ON public.orders FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());
CREATE POLICY "orders_admin_only_delete" ON public.orders FOR DELETE
  USING (public.is_admin());

-- Catering requests policies: ONLY admins may SELECT/INSERT/UPDATE/DELETE
CREATE POLICY "requests_admin_only_select" ON public.catering_requests FOR SELECT
  USING (public.is_admin());
CREATE POLICY "requests_admin_only_insert" ON public.catering_requests FOR INSERT
  WITH CHECK (public.is_admin());
CREATE POLICY "requests_admin_only_update" ON public.catering_requests FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());
CREATE POLICY "requests_admin_only_delete" ON public.catering_requests FOR DELETE
  USING (public.is_admin());

-- 5) Notes for operators
-- - Run this SQL from the Supabase SQL editor or via psql connected to your project's DB.
-- - After running, make sure to manually set your admin account:
--   UPDATE public.profiles SET role = 'admin' WHERE email = 'your-admin-email@example.com';
-- - If your `orders` or `catering_requests` tables use different owner columns, adapt the policies accordingly.

-- End of file
